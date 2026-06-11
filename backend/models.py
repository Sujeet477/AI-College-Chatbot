from sqlalchemy import Column, Integer, String, Text
from database import Base
from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)

    user_id = Column(Integer)


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)

    session_id = Column(Integer)

    question = Column(Text)
    answer = Column(Text)

class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    username = Column(
        String,
        unique=True,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    password = Column(
        String,
        nullable=False
    )