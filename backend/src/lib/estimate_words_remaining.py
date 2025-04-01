import math
from dataclasses import dataclass

from db import connection
from lib.common import Language
from lib.dictionaries import dictionaries
from media_processing.document import Document
from pydantic import BaseModel
from routes.placement_quiz.vocab_model_crud import VocabModelCRUD
from sqlmodel import Session, select


class EstimateTimeToLearnDocRequest(BaseModel):
    user: int
    doc_name: str
    # Required to match the language on the doc
    language: Language


class EstimateTimeToLearnDocResponse(BaseModel):
    words_to_learn: int
    lemmas_to_learn: int

    # In the future, these will be informed by the user's learning rate goals and
    # historical progress, but for now, we'll just hardcode user progress at
    # 20 words/day.
    days_to_learn_words: int
    days_to_learn_lemmas: int


def estimate_time_to_learn_media(
    request: EstimateTimeToLearnDocRequest, session: Session
) -> EstimateTimeToLearnDocResponse:
    # Load the doc
    stmt = select(Document).where(Document.doc_name == request.doc_name)
    doc = session.exec(stmt).first()
    if not doc:
        raise ValueError("Couldn't find doc {request.doc_name} in doc DB.")

    if not doc.processed_doc:
        raise ValueError("Doc {reqest.doc_name} hasn't been processed yet.")

    # Load the user's vocab model
    user_vocab_model = VocabModelCRUD.load_latest(
        session, request.language, request.user
    ).model

    # Plot the user's vocab model
    # with torch.no_grad():
    #     xs = torch.arange(100) / 100
    #     ys = user_vocab_model.f(xs)
    # plt.plot(xs, ys)
    # plt.show()

    # Get the filtered word frequency lists from the doc
    all_word_freq = doc.processed_doc.word_freq
    all_lemmatized_word_freq = doc.processed_doc.lemmatized_word_freq

    dictionary = dictionaries[request.language]
    word_freq = {k: v for k, v in all_word_freq.items() if k in dictionary}
    lemma_freq = {k: v for k, v in all_lemmatized_word_freq.items() if k in dictionary}

    # # Print all filtered lemmas
    # filtered_out_lemmas = []
    # for w in all_lemmatized_word_freq:
    #     if w not in lemma_freq:
    #         filtered_out_lemmas.append(w)
    # print("Filtered out lemmas: ", ", ".join(filtered_out_lemmas))

    # Determine which words the user should learn
    # - TODO: Once we have a learned vocabulary, add all of those words to the front
    #         of this coverage set.
    @dataclass
    class WordFreq:
        word: str
        doc_count: int
        # Ranges from [0, 1] with lower values being more frequent words.
        corpus_rank: float

    lemma_freqs = []
    for lemma, count in lemma_freq.items():
        corpus_rank = dictionary.get_word_float_offset(lemma)
        lemma_freqs.append(
            WordFreq(word=lemma, doc_count=count, corpus_rank=corpus_rank)
        )

    lemma_freqs.sort(key=lambda w: (w.doc_count, -w.corpus_rank), reverse=True)
    total_count = sum(lemma_freq.values())
    covered = 0
    for i, word_freq in enumerate(lemma_freqs):
        covered += word_freq.doc_count
        if covered > 0.95 * total_count:
            break
    lemmas_to_learn: list[WordFreq] = lemma_freqs[:i]

    # Calculate how many words the user likely has to learn to cover the lemma set
    new_lemmas = 0
    for word_freq in lemmas_to_learn:
        p_known = user_vocab_model.f(word_freq.corpus_rank)
        # print(
        #     f"{word_freq.word}, rank: {word_freq.corpus_rank:.2f}, p: {p_known.item():.2f}"
        # )
        new_lemmas += 1 - p_known
    new_lemmas = math.ceil(new_lemmas)

    # print("total_lemmas:", len(all_lemmatized_word_freq))
    # print("filtered_lemmas:", len(lemma_freq))
    # print("selected_lemmas:", len(lemmas_to_learn))
    # print("est_new_lemmas:", new_lemmas)

    new_words = new_lemmas
    days_to_learn_words = math.ceil(new_words / 20)
    days_to_learn_lemmas = math.ceil(new_lemmas / 20)

    return EstimateTimeToLearnDocResponse(
        words_to_learn=new_lemmas,
        lemmas_to_learn=new_lemmas,
        days_to_learn_words=days_to_learn_words,
        days_to_learn_lemmas=days_to_learn_lemmas,
    )


if __name__ == "__main__":
    doc_name = "Spongebob S01E01 de-DE"
    user = 93740370  # Pulled from a request. Corresponds to user "billy" who has
    # a vocab model stored in the db at the time of writing this.
    request = EstimateTimeToLearnDocRequest(
        user=user, doc_name=doc_name, language=Language.de_DE
    )

    engine = connection.get_engine()
    connection.create_db_and_tables(engine)

    with Session(engine) as session:
        response = estimate_time_to_learn_media(request, session)
        print(response.model_dump_json(indent=2))
