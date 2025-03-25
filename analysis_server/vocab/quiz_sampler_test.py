import sys
import time
import unittest

from vocab import quiz_sampler


class QuizSampler(unittest.TestCase):
    def test_generate_list(self):
        start = time.perf_counter()
        for i in range(1000):
            l = quiz_sampler.generate_list(15000, 250)
        elapsed = time.perf_counter() - start
        print(f"Run took {elapsed:.4f} seconds")

    def test_list_size(self):
        l = quiz_sampler.generate_list(15000, 250)
        print(f"List size: {sys.getsizeof(l)}")


if __name__ == "__main__":
    unittest.main()
