import unittest

from media_processing import lemmatize


class LemmatizeTest(unittest.TestCase):
    def test_lemmatization(self):
        string = """I'm running to the store for some tea and biscuits.

They said they had been there before."""

        expected_string = """I be run to the store for some tea and biscuit.

They say they have be there before."""

        actual = lemmatize.lemmatize(string).strip()
        self.assertEqual(actual, expected_string)


if __name__ == "__main__":
    unittest.main()
