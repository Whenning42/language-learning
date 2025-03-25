# Onboarding test.
#
# Estimate a user's vocabulary size via an auto-adjusting difficulty quiz
# and some probabilistic model of vocabulary with a bootstrapped confidence
# interval.

import csv
import random
from collections import defaultdict

import enchant
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import torch
import torch.nn.functional as F
from tqdm import tqdm

test_lang = "fr_FR"
TOP_WORDS = 30_000

LANGS = ["en_US", "de_DE", "fr_FR"]
word_list_paths = {
    "en_US": "word_lists/en_freq_1_333333.csv",
    "de_DE": "word_lists/de_freq_1_15000.csv",
    "fr_FR": "word_lists/fr_freq_1_50000.csv",
}
words = {
    k: pd.read_csv(v, skipinitialspace=True, nrows=TOP_WORDS)
    for k, v in word_list_paths.items()
}
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
    lang_dict = dicts[l]

    def normalizer(word):
        if not lang_dict.check(word):
            return ""
        return word.lower()

    cleaned_words[l] = normalize_word_count_df(wl, normalizer)


def logistic_3_safe(x, k, a, x_0):
    # Safe version of:
    # return 1 / (1 + torch.exp(k * (x - x_0))) ** a
    v0 = k * (x - x_0)
    v1 = a
    return 1 / (torch.exp(v0 * v1) * (1 + 1 / torch.exp(v0)) ** v1)


class Model(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.kl = torch.nn.parameter.Parameter(torch.tensor([1.8]))
        self.al = torch.nn.parameter.Parameter(torch.tensor([-2.3]))
        self.xl_0 = torch.nn.parameter.Parameter(torch.tensor([-0.35]))

    def f(self, x):
        k = torch.exp(self.kl)
        a = torch.exp(self.al)
        x_0 = torch.sinh(self.xl_0)
        # Change of basis from [0, 1] x range to [0, 8] x range.
        x = x * 8

        return logistic_3_safe(x, k, a, x_0)

    def sample(self):
        # Pick randomly from the function's pdf on [0, 1]
        with torch.no_grad():
            N_buckets = 10
            xs = torch.arange(N_buckets + 1) / N_buckets
            deltas = self.f(xs[1:]) - self.f(xs[:-1])
            deltas /= torch.sum(deltas)
            b = np.random.choice(np.arange(N_buckets), p=deltas.numpy())
            x = ((b + torch.rand((1,))) / N_buckets).item()
            return x

    def fit(self, x, y):
        x = torch.tensor(x)
        y = torch.tensor(y)

        opt = torch.optim.Adam(self.parameters(), lr=0.01)
        for i in range(300):
            opt.zero_grad()
            model_ys = self.f(x)
            loss = F.binary_cross_entropy(model_ys, y) - F.binary_cross_entropy(y, y)
            loss.backward()
            opt.step()

        return self

    def print_params(self):
        print(
            f"Model params: (k, a, x_0): {self.kl.item():.2f}, {self.al.item():.2f}, {self.xl_0.item():.2f}"
        )

    def plot(self, fig, ax):
        with torch.no_grad():
            xs = torch.arange(100) / 100
            ys = self.f(xs)
            ax.plot(xs.numpy(), ys.numpy())


class Dataset:
    def __init__(self, word_counts: pd.DataFrame):
        self.df = word_counts
        self.len = len(self.df)

    def sample(self):
        return random.randint(0, self.len) / self.len

    def get(self, x):
        ind = round(self.len * x)
        word = self.df.iloc[ind]["word"]
        return word


def plot_responses(x: np.ndarray, y: np.ndarray, fig, ax):
    c = y == 1
    n = y == 0
    p = np.logical_and(y > 0, y < 1)

    correct = x[c]
    incorrect = x[n]
    prior = x[p]

    correct_ys = np.random.uniform(size=correct.shape) * 0.2 + 0.8
    incorrect_ys = np.random.uniform(size=incorrect.shape) * 0.2
    prior_ys = y[p]

    ax.scatter(correct, correct_ys, color="green")
    ax.scatter(incorrect, incorrect_ys, color="red")
    ax.scatter(prior, prior_ys, color="black")


def fit_model(dataset: Dataset, model: Model):
    responses = []
    priors = [(0, 0.99, ""), (0.25, 0.45, ""), (0.5, 0.14, ""), (0.75, 0.04, "")]
    fig = plt.figure()
    fig.set_facecolor((0.7, 0.7, 0.7))
    ax = plt.gca()
    ax.set_facecolor((0.8, 0.8, 0.8))

    for j in range(400):
        responses_w_prior = responses + priors

        x, y = np.array(list(zip(*responses_w_prior))[0:2])
        model = model.fit(x, y)

        if j % 5 == 0:
            ax.clear()
            model.plot(fig, ax)
            model.print_params()
            plot_responses(x, y, fig, ax)
            plt.ylim(0, 1)
            fig.show()

        # TODO: Prevent duplicate words
        sampled_x = model.sample()
        word = dataset.get(sampled_x)

        print(j)
        print(word, f"{sampled_x:.2f}")
        res = ""
        ans = None
        while res not in ["y", "n", "s"]:
            res = input("y/n (s)? ").lower()
            print(res, res == "s")
        if res == "y":
            ans = 1
        elif res == "s":
            print("Saving and exiting.")
            with open("test_results.csv", "w") as f:
                c = csv.writer(f)
                c.writerow([("x", "answer", "word")])
                for x, y, w in responses:
                    c.writerow([x, y, w])
                exit()
        else:
            ans = 0

        responses.append((sampled_x, ans, word))


de_ds = Dataset(cleaned_words[test_lang])
model = Model()

# fit_model(stem_ds, model)
fit_model(de_ds, model)
