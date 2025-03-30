import json

from sqlmodel import SQLModel, create_engine


def custom_serializer(d):
    return json.dumps(d, default=lambda v: v.json())


def get_engine():
    sqlite_file_name = "data/database.db"
    sqlite_url = f"sqlite:///{sqlite_file_name}"

    connect_args = {"check_same_thread": False}
    return create_engine(
        sqlite_url, connect_args=connect_args, json_serializer=custom_serializer
    )


def create_db_and_tables(engine):
    SQLModel.metadata.create_all(engine)
