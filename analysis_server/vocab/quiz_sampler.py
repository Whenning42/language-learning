# Implements word sampling for the onboarding quiz.
#
# The two behaviors we want to cover are:
# 1. Distributing sampled words across the frequency distribution in the target lang.
# 2. Not repeating any word in a given onboarding quiz.

import numpy as np


def generate_list(list_length: int, num_samples: int, seed: int = 0):
    np.random.seed(seed)
    rands = np.random.rand(num_samples)
    return (rands * list_length).astype("int")
