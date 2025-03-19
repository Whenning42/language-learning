from enum import Enum
from typing import Annotated

from fastapi import FastAPI, Query
from pydantic import BaseModel

app = FastAPI()


class Language(str, Enum):
    test_lang = "test_lang"
    de_DE = "de_DE"


class SampleWordRequest(BaseModel):
    language: Language
    qid: int


class SampleWordResponse(BaseModel):
    word: str


@app.get("/onboarding-quiz/sample-word/", response_model=SampleWordResponse)
async def sample_word(request: Annotated[SampleWordRequest, Query()]):
    return {"word": f"{request.language.value}_word_{request.qid}"}
