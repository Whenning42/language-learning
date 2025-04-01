import unittest

from lib.common import Language
from lib.dictionaries import dictionaries


class DictionaryTest(unittest.TestCase):
    def test_get_word_float_offset(self):
        d = dictionaries[Language.test_lang]
        self.assertEqual(d.get_word_float_offset("test_word_1"), 0.0)
        self.assertEqual(d.get_word_float_offset("test_word_2"), 1 / len(d))


if __name__ == "__main__":
    unittest.main()
