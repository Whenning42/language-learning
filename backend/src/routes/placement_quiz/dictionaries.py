from collections import defaultdict

import enchant
import pandas as pd
from lib.common import Language
from tqdm import tqdm

TOP_WORDS = 30_000

LANGS = ["en_US", "de_DE", "fr_FR"]
word_list_paths = {
    "en_US": "data/en_freq_1_333333.csv",
    "de_DE": "data/de_freq_1_15000.csv",
    "fr_FR": "data/fr_freq_1_50000.csv",
}
words = {
    k: pd.read_csv(v, skipinitialspace=True, nrows=TOP_WORDS)
    for k, v in word_list_paths.items()
}
words[Language.test_lang.value] = pd.DataFrame.from_dict(
    {"word": ["test_word_1", "test_word_2"], "count": [2, 1]}
)
for k, v in words.items():
    v["word"] = v["word"].map(str)
    v["count"] = v["count"].map(int)


def normalize_word_count_df(df, func):
    word_counts = defaultdict(int)

    for i, row in tqdm(df.iterrows(), total=len(df)):
        word = row["word"]
        word = func(word)
        word_counts[word] += row["count"]

    df = pd.DataFrame(
        data=word_counts.items(), columns=["word", "count"]  # pyright: ignore
    )
    df = df.sort_values(by="count", ascending=False)
    return df


dicts = {l: enchant.Dict(l) for l in LANGS}

cleaned_words = {}
for l, wl in words.items():
    lang_dict = None
    if l != Language.test_lang.value:
        lang_dict = dicts[l]

    def normalizer(word):
        if lang_dict and not lang_dict.check(word):
            return ""
        return word.lower()

    cleaned_words[l] = normalize_word_count_df(wl, normalizer)


class Dictionary:
    def __init__(self, word_list: pd.DataFrame):
        self.word_list = word_list

    def get_float_offset(self, x: float) -> str:
        i = int(x * len(self.word_list)) % len(self.word_list)
        return self.word_list["word"].iloc[i]

    def get_word_float_offset(self, word: str) -> float:
        offset_i = (self.word_list["word"] == word).index[0]
        return offset_i / len(self.word_list["word"])


dictionaries = {}
for lang, word_list in cleaned_words.items():
    dictionaries[lang] = Dictionary(word_list)
