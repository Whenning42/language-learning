import unittest

from common import Language
from vocab import vocab_list


class VocabTest(unittest.TestCase):
    def test_get_word_from_list_cyclic(self):
        test_list_len = vocab_list.get_word_list_len(Language.test_lang)

        self.assertEqual(
            vocab_list.get_word_from_list_cyclic(Language.test_lang, 0), "test_word_1"
        )
        self.assertEqual(
            vocab_list.get_word_from_list_cyclic(Language.test_lang, 1), "test_word_2"
        )
        self.assertEqual(
            vocab_list.get_word_from_list_cyclic(Language.test_lang, test_list_len),
            "test_word_1",
        )


if __name__ == "__main__":
    unittest.main()
