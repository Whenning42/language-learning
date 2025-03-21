from datetime import datetime
from enum import Enum
from typing import Annotated

from app import SessionDep, app
from fastapi import HTTPException, Path
from sqlmodel import Field, SQLModel


class Grade(str, Enum):
    correct = "correct"
    sort_of = "sort of"
    incorrect = "incorrect"


class PlacementQuizAnswer(SQLModel, table=True):
    answer_id: int | None = Field(primary_key=True, default=None)
    quiz_id: int = Field(index=True)
    word: str
    grade: Grade
    time: datetime | None = None


@app.post(
    "/placement-quizzes/{quiz_id}/answers",
    response_model=PlacementQuizAnswer,
)
async def update_placement_quiz_answer(
    quiz_id: Annotated[int, Path()],
    answer: PlacementQuizAnswer,
    session: SessionDep,
):
    if quiz_id != answer.quiz_id:
        raise HTTPException(
            422,
            f"Mismatched quiz id in CreatePlacementQuizAnswer: {quiz_id}, {answer.quiz_id}",  # noqa: E501
        )

    answer.time = datetime.now()

    session.add(answer)
    session.commit()
    session.refresh(answer)

    return answer
