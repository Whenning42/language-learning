from abc import ABC, abstractmethod
from enum import Enum

import numpy as np
import torch
import torch.nn.functional as F
from torch.nn import Module, parameter


class VocabModelClassEnum(int, Enum):
    ThreeParamLogistic = 1


def logistic_3_safe(x, k, a, x_0):
    # Safe version of:
    # return 1 / (1 + torch.exp(k * (x - x_0))) ** a
    v0 = k * (x - x_0)
    v1 = a
    return 1 / (torch.exp(v0 * v1) * (1 + 1 / torch.exp(v0)) ** v1)


class VocabMLModel(ABC):
    @abstractmethod
    def __init__(self, params: dict):
        pass

    @abstractmethod
    def fit(self, x: np.ndarray, y: np.ndarray) -> None:
        pass

    @abstractmethod
    def sample(self, seed: int) -> float:
        pass

    @abstractmethod
    def params(self) -> dict:
        pass

    @abstractmethod
    def model_cls_enum(self) -> VocabModelClassEnum:
        pass


class ThreeParamLogisticModel(Module, VocabMLModel):
    def __init__(self, params: dict | None = None):
        super().__init__()

        if params is None:
            params = {"kl": 1.8, "al": -2.3, "xl_0": -0.35}

        self.kl = parameter.Parameter(torch.tensor([params["kl"]]))
        self.al = parameter.Parameter(torch.tensor([params["al"]]))
        self.xl_0 = parameter.Parameter(torch.tensor([params["xl_0"]]))

    def f(self, x):
        k = torch.exp(self.kl)
        a = torch.exp(self.al)
        x_0 = torch.sinh(self.xl_0)
        # Change of x's range from [0, 1] to [0, 8] since that's the range we picked
        # the initial parameters on.
        x = x * 8

        return logistic_3_safe(x, k, a, x_0)

    def fit(self, x: np.ndarray, y: np.ndarray) -> None:  # pyright: ignore
        x: torch.Tensor = torch.tensor(x)
        y: torch.Tensor = torch.tensor(y).float()

        priors = torch.tensor([[0, 0.99], [0.25, 0.45], [0.5, 0.14], [0.75, 0.04]])
        x = torch.cat([x, priors[:, 0]])
        y = torch.cat([y, priors[:, 1]])

        opt = torch.optim.Adam(self.parameters(), lr=0.01)
        for i in range(300):
            opt.zero_grad()
            model_ys = self.f(x).float()
            eps = 1e-4
            model_ys = torch.clamp(model_ys, eps, 1 - eps)
            loss = F.binary_cross_entropy(model_ys, y) - F.binary_cross_entropy(y, y)
            loss.backward()
            opt.step()

    def sample(self, seed: int) -> float:
        # Pick randomly from the function's pdf on [0, 1]
        with torch.no_grad():
            rand_gen = np.random.default_rng(seed)

            N_buckets = 10
            xs = torch.arange(N_buckets + 1) / N_buckets
            deltas = self.f(xs[1:]) - self.f(xs[:-1])
            deltas /= torch.sum(deltas)
            b = rand_gen.choice(np.arange(N_buckets), p=deltas.numpy())
            x = ((b + torch.rand((1,))) / N_buckets).item()
            return x

    def params(self) -> dict:
        return {"kl": self.kl.item(), "al": self.al.item(), "xl_0": self.xl_0.item()}

    def model_cls_enum(self) -> VocabModelClassEnum:
        return VocabModelClassEnum.ThreeParamLogistic


def get_vocab_model_class(model_cls_enum: VocabModelClassEnum):
    if model_cls_enum == VocabModelClassEnum.ThreeParamLogistic:
        return ThreeParamLogisticModel
    else:
        raise ValueError(
            f"Requested vocab model class for unknown model type enum: {model_cls_enum}"
        )
