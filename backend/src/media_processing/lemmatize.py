import os

from google import genai
from google.genai import types
from lib import dotenv

dotenv.load_dotenv(".env")
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])


def lemmatize(text: str) -> str:
    """Given a string with natural language text, have the model lemmatize that text"""
    prompt = (
        "Lemmatize the following text, returning a string with the same layout, "
        "but with all words replaced by their lemmas. Here's the text:\n"
        f"{text}\n"
        "Don't include any markdown in your answer. Just answer directly.\n"
    )

    # Generate the transcription
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[prompt],
        config=types.GenerateContentConfig(temperature=0.0),
    )

    if response.text is None:
        raise ValueError("Gemini request didn't return text. Response:", response)

    return response.text
