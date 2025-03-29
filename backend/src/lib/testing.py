import unittest
from datetime import datetime
from typing import TypeVar

import httpx
from app.app import app, get_session
from fastapi.testclient import TestClient
from pydantic import BaseModel
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

M = TypeVar("M", bound=BaseModel)


class ServerTest(unittest.TestCase):
    """A child of unittest.TestCase with added helper asserts."""

    def run(self, result=None):
        engine = create_engine(
            "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
        )
        SQLModel.metadata.create_all(engine)
        with Session(engine) as session:

            def get_session_override():
                return session

            app.dependency_overrides[get_session] = get_session_override

            with TestClient(app) as client:
                self.client = client
                super().run(result)

    def assertModelEqual(self, actual: M, expected: M) -> None:
        self.assertEqual(actual.__class__, expected.__class__)
        self.assertEqual(actual.model_dump(), expected.model_dump())

    def assertResponseAndGetModel(self, response: httpx.Response, model: type[M]) -> M:
        self.assertEqual(response.status_code, 200)
        return model.model_validate(response.json())

    def assertResponseEqual(
        self, response: httpx.Response, expected: BaseModel
    ) -> None:
        self.assertEqual(response.status_code, 200)
        expected_model = expected.__class__
        actual = expected_model.model_validate(response.json())
        self.assertModelEqual(actual, expected)

    def assertRecent(self, time: datetime | None, max_seconds: float = 2) -> None:
        self.assertTrue(time is not None)
        assert time is not None

        seconds_ago = (datetime.now() - time).total_seconds()
        self.assertGreaterEqual(seconds_ago, 0)
        self.assertLessEqual(seconds_ago, max_seconds)
