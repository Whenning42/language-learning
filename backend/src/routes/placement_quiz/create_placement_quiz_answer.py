from datetime import datetime
from enum import Enum
from typing import Annotated, Sequence

import numpy as np
from app.app import SessionDep, app
from fastapi import HTTPException, Path
from routes.placement_quiz.create_placement_quiz import PlacementQuiz
from routes.placement_quiz.dictionaries import Dictionary, dictionaries
from routes.placement_quiz.vocab_model_crud import VocabModelCRUD
from sqlmodel import Field, SQLModel, select


class Grade(str, Enum):
    correct = "correct"
    incorrect = "incorrect"


class PlacementQuizAnswer(SQLModel, table=True):
    answer_id: int | None = Field(primary_key=True, default=None)
    quiz_id: int = Field(index=True)
    question_num: int
    word: str
    grade: Grade
    time: datetime | None = None


def get_xys(
    responses: Sequence[PlacementQuizAnswer], dictionary: Dictionary
) -> tuple[np.ndarray, np.ndarray]:
    xs, ys = [], []
    for r in responses:
        x = dictionary.get_word_float_offset(r.word)
        y = 1 if r.grade == Grade.correct else 0
        xs.append(x)
        ys.append(y)

    return np.array(xs), np.array(ys)


@app.post(
    "/placement-quizzes/{quiz_id}/answers/{question_num}",
    response_model=PlacementQuizAnswer,
)
async def create_placement_quiz_answer(
    quiz_id: Annotated[int, Path()],
    question_num: Annotated[int, Path()],
    answer: PlacementQuizAnswer,
    session: SessionDep,
):
    if quiz_id != answer.quiz_id:
        raise HTTPException(
            422,
            f"Mismatched quiz id in CreatePlacementQuizAnswer: {quiz_id}, {answer.quiz_id}",  # noqa: E501
        )

    answer.time = datetime.now()

    vocab_model = VocabModelCRUD.load(session, answer.quiz_id, answer.question_num - 1)

    statement = select(PlacementQuizAnswer).where(
        PlacementQuizAnswer.quiz_id == answer.quiz_id
    )
    responses = session.exec(statement).all()

    statement = select(PlacementQuiz).where(PlacementQuiz.quiz_id == answer.quiz_id)
    row = session.exec(statement).first()
    if row is None:
        raise ValueError("Couldn't find a placement quiz with id:", answer.quiz_id)
    dictionary = dictionaries[row.language.value]

    x, y = get_xys(responses, dictionary)
    vocab_model.update(x, y)
    vocab_model.store(answer.quiz_id, answer.question_num)

    session.add(answer)
    session.commit()
    session.refresh(answer)
    return answer
