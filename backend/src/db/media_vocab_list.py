from datetime import datetime

from lib.common import Language
from sqlalchemy.dialects.sqlite import JSON
from sqlmodel import Field, SQLModel


class WordFrequencies(SQLModel):
    raw: dict = Field(sa_type=JSON)
    filtered: dict = Field(sa_type=JSON)
    lemmatized: dict = Field(sa_type=JSON)


class MediaVocabList(SQLModel, table=True):
    media_id: int | None = Field(primary_key=True, default=None)
    media_name: str
    media_language: Language
    word_frequencies: WordFrequencies
    upload_time: datetime
