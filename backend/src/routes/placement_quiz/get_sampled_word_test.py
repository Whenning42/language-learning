import unittest

from common import Language
from routes.placement_quiz.get_sampled_word import SampleWordRequest, SampleWordResponse
from testing import ServerTest


class GetSampledWordTest(ServerTest):
    def test_sample_request(self):
        request = SampleWordRequest(language=Language.test_lang, qid=3)
        self.assertResponseEqual(
            self.client.get(
                "/placement-quiz/sample-word", params=request.model_dump(mode="json")
            ),
            SampleWordResponse(word="test_lang_word_3"),
        )


if __name__ == "__main__":
    unittest.main()
