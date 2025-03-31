import string
from collections import defaultdict

from db import connection
from media_processing import lemmatize, transcribe
from media_processing.document import DocType, Document, ProcessedDoc, Transcription
from sqlmodel import Session, select


def count_words(text: str) -> dict[str, int]:
    punctuation = string.punctuation + "…" + "\n"
    text = text.translate(str.maketrans(punctuation, " " * len(punctuation)))

    word_counts = defaultdict(int)
    for word in text.split(" "):
        word.strip()
        if word != "":
            word_counts[word] += 1
    return word_counts


def process_doc(doc: Document) -> Document:
    doc.processed_doc = ProcessedDoc()

    vtt_text = transcribe.transcribe_vtt(doc)
    plain_text = transcribe.vtt_to_plain_text(vtt_text)
    lemmatized_text = lemmatize.lemmatize(plain_text)

    doc.processed_doc.transcription = Transcription(vtt_text=vtt_text)
    doc.processed_doc.plain_text = plain_text
    doc.processed_doc.lemmatized_text = lemmatized_text

    doc.processed_doc.word_freq = count_words(plain_text.lower())
    doc.processed_doc.lemmatized_word_freq = count_words(lemmatized_text.lower())
    return doc


if __name__ == "__main__":
    doc = Document(
        doc_type=DocType.video, path="data/test/test.mp4", doc_name="test doc 1"
    )
    # doc = Document(
    #     doc_type=DocType.video,
    #     path="data/videos/spongebob_s01e01_de.mp4",
    #     doc_name="Spongebob S01E01 de-DE",
    # )
    doc = process_doc(doc)

    engine = connection.get_engine()
    connection.create_db_and_tables(engine)
    with Session(engine) as session:
        session.merge(doc)
        session.commit()

    # Example code for looking up docs:
    # with Session(engine) as session:
    #     statement = select(Document)
    #     docs = session.exec(statement).all()

    #     print(f"Found {len(docs)} docs")

    #     for doc in docs:
    #         doc.processed_doc = None
    #         print(doc.model_dump_json(indent=2))
