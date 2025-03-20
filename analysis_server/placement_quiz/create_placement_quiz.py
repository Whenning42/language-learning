from datetime import datetime

from app import app
from common import Language
from pydantic import BaseModel


class PlacementQuiz(BaseModel):
    quiz_id: int
    user: int
    language: Language
    start_time: datetime


class CreatePlacementQuizRequest(BaseModel):
    user: int
    language: Language


@app.post("/placement-quizzes", response_model=PlacementQuiz)
async def create_placement_quiz(
    request: CreatePlacementQuizRequest,
):
    # TODO: Mint quiz ID and save this created quiz in the DB
    placement_quiz = PlacementQuiz(
        language=request.language,
        user=request.user,
        quiz_id=0,
        start_time=datetime.now(),
    )
    return placement_quiz
