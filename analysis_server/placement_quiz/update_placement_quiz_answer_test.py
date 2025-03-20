import unittest

from placement_quiz.update_placement_quiz_answer import (
    Grade,
    QuizAnswer,
    UpdatePlacementQuizAnswerRequest,
    UpdatePlacementQuizAnswerResponse,
)
from testing import ServerTest


class UpdatePlacementQuizAnswerTest(ServerTest):
    def test_update_placement_quiz_answer_request(self):
        request = UpdatePlacementQuizAnswerRequest(
            answer=QuizAnswer(answer_num=5, word="person", grade=Grade.correct)
        )
        self.assertResponse(
            # TODO: Implement a friendlier api to call a route given path, body, or
            # query params.
            # e.g.: client.patch("/placement-quiz/10/answers/5", body=request)
            # or: client.patch("/placement-quiz/10/answers/{answer_num}", body=request)
            self.client.patch(
                "/placement-quizzes/10/answers/5", json=request.model_dump(mode="json")
            ),
            UpdatePlacementQuizAnswerResponse(answer=request.answer),
        )


if __name__ == "__main__":
    unittest.main()
