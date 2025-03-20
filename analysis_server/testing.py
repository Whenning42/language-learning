import unittest

import httpx
from app import app
from fastapi.testclient import TestClient
from pydantic import BaseModel


class ServerTest(unittest.TestCase):
    """A child of unittest.TestCase with added helper asserts."""

    def run(self, result=None):
        with TestClient(app) as client:
            self.client = client
            super().run(result)

    def assertResponse(self, response: httpx.Response, expected: BaseModel):
        self.assertEqual(response.status_code, 200)
        expected_model = expected.__class__
        actual = expected_model.model_validate(response.json())
        self.assertEqual(actual.model_dump(), expected.model_dump())
