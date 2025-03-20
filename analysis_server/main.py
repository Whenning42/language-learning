import datetime
from enum import Enum
from typing import Annotated

from fastapi import FastAPI, Path, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
from pydantic import BaseModel

app = FastAPI()

# TODO: Lock down CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Language(str, Enum):
    test_lang = "test_lang"
    de_DE = "de_DE"


class QuizResponse(str, Enum):
    correct = "correct"
    sort_of = "sort of"
    incorrect = "incorrect"


class SampleWordRequest(BaseModel):
    language: Language
    qid: int


class SampleWordResponse(BaseModel):
    word: str


class PlacementQuiz(BaseModel):
    quiz_id: int
    user: int
    language: Language
    start_time: datetime.datetime


class QuizAnswer(BaseModel):
    # model_config = ConfigDict(use_enum_values=True)
    answer_num: int
    word: str
    answer: QuizResponse


class CreatePlacementQuizRequest(BaseModel):
    user: int
    language: Language


class UpdatePlacementQuizAnswerRequest(BaseModel):
    answer: QuizAnswer
    # answer: str


class UpdatePlacementQuizAnswerResponse(BaseModel):
    answer: QuizAnswer


@app.get("/placement-quiz/sample-word", response_model=SampleWordResponse)
async def sample_word(request: Annotated[SampleWordRequest, Query()]):
    return {"word": f"{request.language.value}_word_{request.qid}"}


@app.post("/placement-quizzes", response_model=PlacementQuiz)
async def create_placement_quiz(
    request: Annotated[CreatePlacementQuizRequest, Query()],
):
    # TODO: Mint quiz ID and save this created quiz in the DB
    placement_quiz = PlacementQuiz(
        language=request.language,
        user=request.user,
        quiz_id=0,
        start_time=datetime.datetime.now(),
    )
    return placement_quiz


@app.patch(
    "/placement-quiz/{quiz_id}/answers/{answer_id}",
    response_model=UpdatePlacementQuizAnswerResponse,
)
async def update_placement_quiz_answer(
    quiz_id: Annotated[int, Path()],
    answer_id: Annotated[int, Path()],
    request: UpdatePlacementQuizAnswerRequest,
):
    # TODO: Save response in the DB
    # return UpdatePlacementQuizAnswerResponse(answer=request.answer)
    return UpdatePlacementQuizAnswerResponse(
        answer=QuizAnswer(
            answer_num=answer_id, word=request.answer.word, answer=request.answer.answer
        )
    )


def use_route_names_as_operation_ids(app: FastAPI) -> None:
    """
    Simplify operation IDs so that generated API clients have simpler function
    names.

    Should be called only after all routes have been added.
    """
    for route in app.routes:
        if isinstance(route, APIRoute):
            route.operation_id = route.name


use_route_names_as_operation_ids(app)
