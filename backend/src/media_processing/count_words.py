import spacy
import re
import string

vtt_file = "/home/william/Workspaces/language-learning/server/videos/spongebob_s01e01_de_from_transcript.vtt"

skip_line_pattern = "(-->|webvtt)"
skip_line_re = re.compile(skip_line_pattern)
with open(vtt_file, "r") as f:
    text = f.readlines()

    words = set()

    for line in text:
        line = line.strip().lower()
        if skip_line_re.search(line) or not line:
            continue
        punctuation = string.punctuation + "…"
        line = line.translate(str.maketrans(punctuation, " " * len(punctuation)))
        for word in line.split(" "):
            words.add(word)

        print(line)

print("All words:", words)
print("Word count:", len(words))
