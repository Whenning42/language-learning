from enum import Enum

import sqlalchemy.types as types
from lib.common import Language
from sqlmodel import Column, Field, SQLModel


class DocType(int, Enum):
    video = 0
    # TODO: Add ebook support?


class Transcription(SQLModel):
    # plain_text is stored on the parent object.
    vtt_text: str | None = Field(default=None)


class ProcessedDoc(SQLModel):
    class DB(types.TypeDecorator):
        impl = types.JSON

        def process_bind_param(self, value, dialect):
            return value.model_dump_json()

        def process_result_value(self, value, dialect):
            return ProcessedDoc.model_validate_json(value)

    transcription: Transcription | None = Field(default=None)

    plain_text: str | None = Field(default=None)
    lemmatized_text: str | None = Field(default=None)

    # Note: word frequency lists haven't had dictionary/proper noun filtering applied
    # yet. Callers can apply that filtering themselves.
    word_freq: dict | None = Field(default=None)
    lemmatized_word_freq: dict | None = Field(default=None)


class Document(SQLModel, table=True):
    doc_name: str | None = Field(primary_key=True, default=None)

    doc_type: DocType
    path: str | None = Field(default=None)
    language: Language | None = Field(default=None)

    processed_doc: ProcessedDoc | None = Field(
        default=None, sa_column=Column(ProcessedDoc.DB)
    )
