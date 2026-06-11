from fastapi import FastAPI
from security import (
    hash_password,
    verify_password
)
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from chatbot import get_response
from database import engine, SessionLocal
from models import ChatHistory, ChatSession

app = FastAPI()

# Create database tables
from models import Base

Base.metadata.create_all(bind=engine)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class ChatRequest(BaseModel):
    message: str
    session_id: int
class SessionRequest(BaseModel):
    title: str
    user_id: int

# Home route
@app.get("/")
def home():
    return {
        "message": "College Chatbot Backend Running"
    }

@app.post("/session")
def create_session(request: SessionRequest):

    db = SessionLocal()

    new_session = ChatSession(
    title=request.title,
    user_id=request.user_id
)

    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    db.close()

    return {
        "session_id": new_session.id,
        "title": new_session.title
    }

# Chat route
@app.post("/chat")
def chat(request: ChatRequest):

    # Get Gemini response
    reply = get_response(request.message)

    # Save chat in database
    db = SessionLocal()

    chat_data = ChatHistory(
    session_id=request.session_id,
    question=request.message,
    answer=reply
    )

    db.add(chat_data)
    db.commit()
    db.close()

    return {
        "response": reply
    }

@app.get("/sessions")
def get_sessions():

    db = SessionLocal()

    sessions = db.query(ChatSession).all()

    data = []

    for session in sessions:
        data.append({
            "id": session.id,
            "title": session.title
        })

    db.close()

    return data

@app.get("/sessions/{user_id}")
def get_user_sessions(user_id: int):

    db = SessionLocal()

    sessions = (
        db.query(ChatSession)
        .filter(
            ChatSession.user_id == user_id
        )
        .all()
    )

    data = []

    for session in sessions:
        data.append({
            "id": session.id,
            "title": session.title
        })

    db.close()

    return data

@app.get("/history")
def get_history():

    db = SessionLocal()

    chats = db.query(ChatHistory).all()

    history = []

    for chat in chats:
        history.append({
            "id": chat.id,
            "question": chat.question,
            "answer": chat.answer
        })

    db.close()

    return history

@app.get("/history/{session_id}")
def get_session_history(session_id: int):

    db = SessionLocal()

    chats = (
        db.query(ChatHistory)
        .filter(
            ChatHistory.session_id == session_id
        )
        .all()
    )

    history = []

    for chat in chats:
        history.append({
            "id": chat.id,
            "question": chat.question,
            "answer": chat.answer
        })

    db.close()

    return history

@app.delete("/history/{session_id}")
def clear_session(session_id: int):

    db = SessionLocal()

    db.query(ChatHistory).filter(
        ChatHistory.session_id == session_id
    ).delete()

    db.commit()
    db.close()

    return {
        "message": "Chat cleared successfully"
    }

@app.put("/session/{session_id}")
def update_session_title(
    session_id: int,
    request: dict
):

    db = SessionLocal()

    session = db.query(ChatSession).filter(
        ChatSession.id == session_id
    ).first()

    if session:
        session.title = request["title"]
        db.commit()

    db.close()

    return {
        "message": "Title updated"
    }
@app.delete("/session/{session_id}")
def delete_session(session_id: int):

    db = SessionLocal()

    # Delete chat history of session
    db.query(ChatHistory).filter(
        ChatHistory.session_id == session_id
    ).delete()

    # Delete session
    db.query(ChatSession).filter(
        ChatSession.id == session_id
    ).delete()

    db.commit()
    db.close()

    return {
        "message": "Session deleted"
    }

class SignupRequest(BaseModel):
    username: str
    email: str
    password: str

from models import User
from security import hash_password

@app.post("/signup")
def signup(request: SignupRequest):

    db = SessionLocal()

    existing_user = (
        db.query(User)
        .filter(User.email == request.email)
        .first()
    )

    if existing_user:
        db.close()

        return {
            "message": "Email already exists"
        }

    new_user = User(
        username=request.username,
        email=request.email,
        password=hash_password(
            request.password
        )
    )

    db.add(new_user)
    db.commit()

    db.close()

    return {
        "message": "User created successfully"
    }

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/login")
def login(request: LoginRequest):

    db = SessionLocal()

    user = (
        db.query(User)
        .filter(
            User.email == request.email
        )
        .first()
    )

    if not user:
        db.close()

        return {
            "message": "User not found"
        }

    if not verify_password(
        request.password,
        user.password
    ):
        db.close()

        return {
            "message": "Invalid password"
        }

    db.close()

    return {
        "message": "Login successful",
        "user_id": user.id,
        "username": user.username
    }

@app.get("/users")
def get_users():

    db = SessionLocal()

    users = db.query(User).all()

    data = []

    for user in users:
        data.append({
            "id": user.id,
            "username": user.username,
            "email": user.email
        })

    db.close()

    return data


