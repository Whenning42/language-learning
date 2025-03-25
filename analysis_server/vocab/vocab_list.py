# Provides access to the different language vocabulary lists

import pandas as pd
from common import Language

word_lists = {}


def init():
    """Load the static word frequency lists into memory"""
    de_DE_load = (Language.de_DE, "word_lists/de_freq_1_15000.csv")
    en_US_load = (Language.en_US, "word_lists/en_freq_1_333333.csv")

    for lang, path in [de_DE_load, en_US_load]:
        words_df = pd.read_csv(path, skipinitialspace=True)
        words_df["word"] = words_df["word"].map(str)
        words_df["count"] = words_df["count"].map(int)
        word_lists[lang] = words_df

    test_lang_df = pd.DataFrame.from_dict(
        {"word": ["test_word_1", "test_word_2"], "count": ["2", 1]}
    )
    word_lists[Language.test_lang] = test_lang_df


init()


def get_word_from_list_cyclic(lang: Language, index: int) -> str:
    word_list = word_lists[lang]
    return word_list["word"].iloc[index % len(word_list)]


def get_word_list_len(lang: Language) -> int:
    return len(word_lists[lang])


def _get_word_list(lang: Language) -> pd.DataFrame:
    return word_lists[lang]
