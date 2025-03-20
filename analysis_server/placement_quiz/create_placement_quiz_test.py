import unittest
from datetime import datetime

from app import app
from common import Language
from fastapi.testclient import TestClient
from placement_quiz.create_placement_quiz import (
    CreatePlacementQuizRequest,
    PlacementQuiz,
)
from testing import ServerTest

client = TestClient(app)


class CreatePlacementQuizTest(ServerTest):
    def test_create_placement_quiz_request(self):
        request = CreatePlacementQuizRequest(
            user=100,
            language=Language.de_DE,
        )
        response = client.post(
            "/placement-quizzes", json=request.model_dump(mode="json")
        )
        self.assertEqual(response.status_code, 200)
        actual = PlacementQuiz.model_validate(response.json())
        self.assertEqual(actual.user, 100)
        self.assertEqual(actual.language, Language.de_DE)

        seconds_ago = (datetime.now() - actual.start_time).total_seconds()
        self.assertLess(seconds_ago, 5)
        self.assertGreaterEqual(seconds_ago, 0)


if __name__ == "__main__":
    unittest.main()
