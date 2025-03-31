import os
import re
import shlex
import subprocess

import pydub
import tqdm
from google import genai
from google.genai import types
from lib import dotenv
from media_processing.document import Document
from pydub import silence

dotenv.load_dotenv(".env")
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])


def get_target_len_silent_segments(
    target_len_ms: int, segments: list[list[int]]
) -> list[tuple[int, int]]:
    grouped_segments = []
    segment_start = 0
    silence_end = 0
    for silence_start, silence_end in segments:
        if silence_end - segment_start > target_len_ms:
            grouped_segments.append((segment_start, silence_end))
            segment_start = silence_end

    if silence_end > segment_start:
        grouped_segments.append((segment_start, silence_end))
    return grouped_segments


def transcribe_vtt(doc: Document) -> str:
    if doc.path is None or not os.path.exists(doc.path):
        raise ValueError("No file at:", doc.path)

    # Get the video's audio.
    command = f"ffmpeg -y -i {doc.path} -ab 160k -ac 2 -ar 44100 -vn audio.mp3"
    subprocess.run(shlex.split(command), check=True)

    # Print the silent sections of the audio:
    full_audio = pydub.AudioSegment.from_mp3("audio.mp3")
    silences = silence.detect_silence(full_audio, min_silence_len=500, seek_step=20)
    segment_idxs = get_target_len_silent_segments(60 * 1_000, silences)

    full_response_text = ""
    for start, end in tqdm.tqdm(segment_idxs):
        audio = full_audio[start:end]
        audio.export("segment.mp3", format="mp3")
        myfile = client.files.upload(file="segment.mp3")

        # TODO: Get VTT formatted timestamps. I've got this commented out, since the
        # VTT formatted seemed like it might be reducing transcription accuracy, and we
        # don't need it yet. Once I've got a quality eval in place, I can experiement
        # with the prompt.
        #     prompt = types.Part.from_text(
        #         text="""Generate a WebVTT transcription of this audio.
        #
        # An example WebVTT transcription is this:
        #
        # 00:11.130 --> 00:13.450
        # We are in New York City
        #
        # 00:13.780 --> 00:16.920
        # We're actually at the Lucern Hotel, just down the street
        #
        # 00:17.100 --> 00:18.320
        # from the American Museum of Natural History.
        #
        # Now please transcribe the following audio."""
        #    )
        prompt = types.Part.from_text(text="Please transcribe this audio.")
        file = types.Part.from_uri(
            file_uri=myfile.uri,
            mime_type=myfile.mime_type,
        )

        # Generate the transcription
        response = client.models.generate_content(
            # Gemini 2.0 flash lite might be less prone to getting stuck in loops than
            # Gemini 2.0 flash regular.
            model="gemini-2.0-flash-lite",
            contents=[types.Content(role="user", parts=[prompt, file]), myfile],
            config=types.GenerateContentConfig(
                temperature=0.1, top_p=0.95, max_output_tokens=64_000
            ),
        )

        if response.text is None:
            raise ValueError("Gemini request didn't return text. Response:", response)
        full_response_text += response.text

    return full_response_text


def vtt_to_plain_text(text: str) -> str:
    """Strip VTT timestamps from some subtitle text and return the plain text."""
    skip_line_pattern = "(-->|webvtt)"
    skip_line_re = re.compile(skip_line_pattern)

    plain_text = ""
    for line in text.split("\n"):
        if skip_line_re.search(line):
            continue
        plain_text += line + "\n"
    return plain_text
