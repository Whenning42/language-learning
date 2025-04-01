import unittest

from db import connection
from lib import testing
from media_processing.document import DocType, Document, ProcessedDoc
from sqlmodel import Session, select


class DocumentDBTest(unittest.TestCase):
    def test_document_read_write(self):
        engine = connection.get_test_engine()
        connection.create_db_and_tables(engine)
        with Session(engine) as session:
            doc = Document(
                doc_name="test doc",
                doc_type=DocType.video,
                processed_doc=ProcessedDoc(plain_text="doc text"),
            )

            original = doc.model_copy()
            session.add(doc)
            session.commit()
            doc = original

            read = session.exec(
                select(Document).where(Document.doc_name == doc.doc_name)
            ).first()
            testing.assertModelEqual(self, read, doc)


if __name__ == "__main__":
    unittest.main()
