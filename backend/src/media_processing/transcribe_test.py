import unittest

from media_processing import transcribe
from media_processing.document import DocType, Document


class TranscriptionTest(unittest.TestCase):

    def test_vtt_transcription(self):
        doc = Document(doc_type=DocType.video, path="data/test/test.mp4")

        vtt_text = transcribe.transcribe_vtt(doc)
        expected_str_0 = "-->"
        expected_str_1 = "You mistake me, my dear"
        expected_str_2 = "They're my old friends"
        self.assertTrue(expected_str_0 in vtt_text, vtt_text)
        self.assertTrue(expected_str_1 in vtt_text, vtt_text)
        self.assertTrue(expected_str_2 in vtt_text, vtt_text)

    def test_vtt_to_plain_text(self):
        transcript = (
            "00:00:04,240 --> 00:00:07,150\n"
            "Welcome to zombocom.\n"
            "\n"
            "00:00:08,240 --> 00:00:14,150\n"
            "Anything is possible with zombocom.\n"
        )
        plain_text = transcribe.vtt_to_plain_text(transcript)
        self.assertEqual(
            plain_text,
            "Welcome to zombocom.\n\nAnything is possible with zombocom.\n\n",
        )


if __name__ == "__main__":
    unittest.main()
