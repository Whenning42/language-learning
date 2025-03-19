import unittest
from enum import Enum

from fastapi.testclient import TestClient
from main import Language, SampleWordRequest, app
from pydantic import BaseModel

client = TestClient(app)


def pydantic_params(model: BaseModel):
    model_dict = model.model_dump()
    model_dict = {
        k: v.value if isinstance(v, Enum) else v for k, v in model_dict.items()
    }
    return model_dict


class MyTest(unittest.TestCase):
    def test_sample_request(self):
        request = SampleWordRequest(language=Language.test_lang, qid=3)
        response = client.get(
            "/onboarding-quiz/sample-word", params=pydantic_params(request)
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"word": "test_lang_word_3"})


if __name__ == "__main__":
    unittest.main()
