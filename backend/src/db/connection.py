import os

from sqlmodel import SQLModel, create_engine


def get_engine(db_path="data/database.db"):
    sqlite_url = f"sqlite:///{db_path}"

    connect_args = {"check_same_thread": False}
    return create_engine(sqlite_url, connect_args=connect_args)


def get_test_engine():
    test_db_path = "data/tmp/test.db"
    if os.path.exists(test_db_path):
        os.remove(test_db_path)
    return get_engine(db_path="data/tmp/test.db")


def create_db_and_tables(engine):
    SQLModel.metadata.create_all(engine)
