from typing import Annotated

from app import app
from common import Language
from fastapi import Query
from pydantic import BaseModel


class SampleWordRequest(BaseModel):
    language: Language
    qid: int


class SampleWordResponse(BaseModel):
    word: str


@app.get("/placement-quiz/sample-word", response_model=SampleWordResponse)
async def sample_word(request: Annotated[SampleWordRequest, Query()]):
    return {"word": f"{request.language.value}_word_{request.qid}"}
