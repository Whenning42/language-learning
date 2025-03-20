from enum import Enum
from typing import Annotated

from app import app
from common import Language
from fastapi import Path
from pydantic import BaseModel


class Grade(str, Enum):
    correct = "correct"
    sort_of = "sort of"
    incorrect = "incorrect"


class QuizAnswer(BaseModel):
    answer_num: int
    word: str
    grade: Grade


class CreatePlacementQuizRequest(BaseModel):
    user: int
    language: Language


class UpdatePlacementQuizAnswerRequest(BaseModel):
    answer: QuizAnswer


class UpdatePlacementQuizAnswerResponse(BaseModel):
    answer: QuizAnswer


@app.patch(
    "/placement-quizzes/{quiz_id}/answers/{answer_id}",
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
            answer_num=answer_id, word=request.answer.word, grade=request.answer.grade
        )
    )
