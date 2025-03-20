import unittest

from fastapi.testclient import TestClient
from main import (
    Language,
    QuizAnswer,
    QuizResponse,
    SampleWordRequest,
    UpdatePlacementQuizAnswerRequest,
    UpdatePlacementQuizAnswerResponse,
    app,
)

client = TestClient(app)


class MyTest(unittest.TestCase):
    def test_sample_request(self):
        request = SampleWordRequest(language=Language.test_lang, qid=3)
        response = client.get(
            "/placement-quiz/sample-word", params=request.model_dump(mode="json")
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"word": "test_lang_word_3"})

    def test_update_placement_quiz_answer_request(self):
        request = UpdatePlacementQuizAnswerRequest(
            answer=QuizAnswer(answer_num=5, word="person", answer=QuizResponse.correct)
        )
        print("Requesting:", request.model_dump(mode="json"))
        response = client.patch(
            "/placement-quiz/10/answers/5", json=request.model_dump(mode="json")
        )
        expected = UpdatePlacementQuizAnswerResponse(answer=request.answer)
        self.assertEqual(
            UpdatePlacementQuizAnswerResponse.model_validate(
                response.json()
            ).model_dump(),
            expected.model_dump(),
        )


if __name__ == "__main__":
    unittest.main()
