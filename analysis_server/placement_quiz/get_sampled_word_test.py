import unittest

import placement_quiz.get_sampled_word  # noqa: F401
from app import app
from common import Language
from fastapi.testclient import TestClient
from placement_quiz.get_sampled_word import SampleWordRequest, SampleWordResponse
from testing import ServerTest

client = TestClient(app)


class GetSampledWordTest(ServerTest):
    def test_sample_request(self):
        request = SampleWordRequest(language=Language.test_lang, qid=3)
        self.assertResponse(
            client.get(
                "/placement-quiz/sample-word", params=request.model_dump(mode="json")
            ),
            SampleWordResponse(word="test_lang_word_3"),
        )


if __name__ == "__main__":
    unittest.main()
