from datetime import datetime

import numpy as np
from fastapi import HTTPException
from lib.common import Language
from routes.placement_quiz.vocab_models import (
    ThreeParamLogisticModel,
    VocabMLModel,
    VocabModelClassEnum,
    get_vocab_model_class,
)
from sqlalchemy.dialects.sqlite import JSON
from sqlmodel import Field, Session, SQLModel, select


class VocabModel(SQLModel, table=True):
    key: str = Field(primary_key=True, default="")
    params: dict = Field(sa_type=JSON)
    model_cls_enum: VocabModelClassEnum


def _make_question_key(quiz_id: int, question_num: int) -> str:
    return f"pq_{quiz_id}_{question_num}"


def _make_latest_user_model_key(language: Language, user: int) -> str:
    return f"user_{user}_latest_{language.value}"


def get_vocab_model(session, key):
    statement = select(VocabModel).where(VocabModel.key == key)
    return session.exec(statement).first()


# Crud API
class VocabModelCRUD:
    def __init__(self, model: VocabMLModel, session: Session):
        self.model = model
        self.session = session

    @staticmethod
    def _load(session: Session, key: str) -> "VocabModelCRUD":
        statement = select(VocabModel).where(VocabModel.key == key)
        row = session.exec(statement).first()
        if row is None:
            raise HTTPException(
                status_code=404,
                detail=f"Couldn't find a vocab model for key: {key}",
            )

        model_cls = get_vocab_model_class(row.model_cls_enum)
        model = model_cls(row.params)
        return VocabModelCRUD(model=model, session=session)

    def _store(self, key: str) -> None:
        existing_model = get_vocab_model(self.session, key)
        if existing_model:
            print("Requested overwrite of vocab model:", key)
            print("Ignoring request.")
            return

        obj = VocabModel(
            key=key,
            params=self.model.params(),
            model_cls_enum=self.model.model_cls_enum(),
        )

        self.session.add(obj)
        self.session.commit()

    # TODO: Consider adding .load() fallback to previous questions if the current
    # question's model is unavailable.

    @staticmethod
    def load(session: Session, quiz_id: int, question_num: int) -> "VocabModelCRUD":
        if question_num == -1 or question_num == -2:
            model = ThreeParamLogisticModel()
            return VocabModelCRUD(model=model, session=session)

        return VocabModelCRUD._load(session, _make_question_key(quiz_id, question_num))

    @staticmethod
    def load_latest(
        session: Session, language: Language, user: int
    ) -> "VocabModelCRUD":
        return VocabModelCRUD._load(
            session, _make_latest_user_model_key(language, user)
        )

    def store(self, quiz_id: int, question_num: int) -> None:
        self._store(_make_question_key(quiz_id, question_num))

    def store_latest(self, language: Language, user: int) -> None:
        self._store(_make_latest_user_model_key(language, user))

    def update(self, xs: np.ndarray, ys: np.ndarray):
        self.model.fit(xs, ys)

    def sample(self, seed: int) -> float:
        return self.model.sample(seed)
