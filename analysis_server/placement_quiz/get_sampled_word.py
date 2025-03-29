from typing import Annotated

from app import SessionDep, app
from fastapi import HTTPException, Query
from placement_quiz.create_placement_quiz import PlacementQuiz
from placement_quiz.dictionaries import dictionaries
from placement_quiz.vocab_model_crud import VocabModelCRUD
from pydantic import BaseModel, Field
from sqlmodel import select

# An adaptive and idempotent word sampler with no repeats requires that:
# 1. We store the model state after every response
# 2. We use a deterministic random function of the quiz id and question number to sample
#    from the model.
# 3. That we don't actually prevent repeat words.

# Therefore, we'll actually have to move this to a post once we add word de-duplication.


class SampleWordRequest(BaseModel):
    quiz_id: int
    # To sample question N, it's required that either we've sampled question N - 1 or
    # that N = 0. We use 0-indexed question numbers on the backend.
    question_num: int = Field(ge=0, lt=300)


class SampleWordResponse(BaseModel):
    word: str


@app.post("/placement-quiz/sample-word", response_model=SampleWordResponse)
async def sample_word(
    request: Annotated[SampleWordRequest, Query()], session: SessionDep
):
    vocab_model = VocabModelCRUD.load(
        session, request.quiz_id, request.question_num - 2
    )
    sampled_x = vocab_model.sample(request.quiz_id * 72341 + request.question_num)

    statement = select(PlacementQuiz).where(PlacementQuiz.quiz_id == request.quiz_id)
    row = session.exec(statement).first()
    if row is None:
        raise HTTPException(
            status_code=404,
            detail=f"Couldn't find a placement quiz with id: {request.quiz_id}",
        )
    dictionary = dictionaries[row.language.value]

    return {"word": dictionary.get_float_offset(sampled_x)}
