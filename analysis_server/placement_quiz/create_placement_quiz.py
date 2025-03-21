from datetime import datetime

from app import SessionDep, app
from common import Language
from pydantic import BaseModel
from sqlmodel import Field, SQLModel


class PlacementQuiz(SQLModel, table=True):
    quiz_id: int | None = Field(primary_key=True, default=None)
    user: int
    language: Language
    start_time: datetime


class CreatePlacementQuizRequest(BaseModel):
    user: int
    language: Language


@app.post("/placement-quizzes", response_model=PlacementQuiz)
async def create_placement_quiz(
    request: CreatePlacementQuizRequest, session: SessionDep
) -> PlacementQuiz:
    placement_quiz = PlacementQuiz(
        language=request.language,
        user=request.user,
        start_time=datetime.now(),
    )

    session.add(placement_quiz)
    session.commit()
    session.refresh(placement_quiz)

    return placement_quiz
