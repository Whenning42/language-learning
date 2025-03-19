import unittest

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


class MyTest(unittest.TestCase):
    def test_root(self):
        response = client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"message": "Hello World"})


if __name__ == "__main__":
    unittest.main()
