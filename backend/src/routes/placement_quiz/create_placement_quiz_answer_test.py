import unittest

from routes.placement_quiz.create_placement_quiz_answer import (
    Grade,
    PlacementQuizAnswer,
)
from testing import ServerTest


class UpdatePlacementQuizAnswerTest(ServerTest):
    def test_update_placement_quiz_answer_request(self):
        # TODO: Create the placement quiz first

        request = PlacementQuizAnswer(quiz_id=3, word="person", grade=Grade.correct)
        expected = request.model_copy()
        expected.answer_id = 1
        actual = self.assertResponseAndGetModel(
            self.client.post(
                "/placement-quizzes/3/answers", json=request.model_dump(mode="json")
            ),
            PlacementQuizAnswer,
        )

        self.assertRecent(actual.time)
        expected.time = actual.time
        self.assertModelEqual(actual, expected)


if __name__ == "__main__":
    unittest.main()
