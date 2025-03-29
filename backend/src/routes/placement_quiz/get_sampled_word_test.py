import asyncio
import unittest

from lib.common import Language
from lib.testing import ServerTest
from routes.placement_quiz.create_placement_quiz import (
    CreatePlacementQuizRequest,
    create_placement_quiz,
)
from routes.placement_quiz.get_sampled_word import SampleWordRequest, SampleWordResponse


class GetSampledWordTest(ServerTest):
    def test_sample_request(self):
        placement_quiz = asyncio.run(
            create_placement_quiz(
                CreatePlacementQuizRequest(user=1, language=Language.test_lang),
                self.session,
            )
        )
        quiz_id = placement_quiz.quiz_id
        assert quiz_id is not None

        request = SampleWordRequest(quiz_id=quiz_id, question_num=0)
        self.assertResponseEqual(
            self.client.post(
                "/placement-quiz/sample-word", params=request.model_dump(mode="json")
            ),
            SampleWordResponse(word="test_word_1"),
        )

        request = SampleWordRequest(quiz_id=quiz_id, question_num=1)
        self.assertResponseEqual(
            self.client.post(
                "/placement-quiz/sample-word", params=request.model_dump(mode="json")
            ),
            SampleWordResponse(word="test_word_1"),
        )


if __name__ == "__main__":
    unittest.main()
