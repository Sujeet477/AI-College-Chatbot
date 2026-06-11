# AI College Chatbot

An AI-powered chatbot designed to help college students get instant answers to academic questions. The application supports user authentication, multiple chat sessions, chat history management, and an interactive chat interface.

## Features

* User Registration & Login
* Secure Authentication
* Create Multiple Chat Sessions
* Save Chat History
* Load Previous Conversations
* Delete Individual Sessions
* Clear Chat History
* Responsive User Interface
* FastAPI Backend
* React Frontend
* SQLite Database Integration

## Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* CSS

### Backend

* FastAPI
* SQLAlchemy
* SQLite
* Uvicorn

## Project Structure

```text
AI-College-Chatbot/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── security.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
│
└── README.md
```

## Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd AI-College-Chatbot
```

---

## Backend Setup

### Navigate to Backend Folder

```bash
cd backend
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Virtual Environment

Windows:

```bash
venv\Scripts\activate
```

Linux/Mac:

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Backend Server

```bash
uvicorn main:app --reload
```

Backend will start on:

```text
http://127.0.0.1:8000
```

---

## Frontend Setup

### Navigate to Frontend Folder

```bash
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Run React Application

```bash
npm start
```

Frontend will start on:

```text
http://localhost:3000
```

---

## API Endpoints

### Authentication

| Method | Endpoint  | Description       |
| ------ | --------- | ----------------- |
| POST   | /register | Register new user |
| POST   | /login    | User login        |

### Chat

| Method | Endpoint              | Description             |
| ------ | --------------------- | ----------------------- |
| POST   | /chat                 | Send message to chatbot |
| GET    | /history/{session_id} | Get session history     |
| DELETE | /history/{session_id} | Clear chat history      |

### Sessions

| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| POST   | /session              | Create session       |
| GET    | /sessions/{user_id}   | Get all sessions     |
| PUT    | /session/{session_id} | Update session title |
| DELETE | /session/{session_id} | Delete session       |

---

## Usage

1. Register a new account.
2. Login with your credentials.
3. Create a new chat session.
4. Ask academic questions.
5. View previous conversations anytime.
6. Switch between chat sessions.
7. Delete unwanted sessions.
8. Clear chat history when needed.

---

## Future Improvements

* OpenAI/Gemini Integration
* PDF Upload & Question Answering
* Voice-Based Chat
* Dark/Light Theme Toggle
* User Profile Management
* Export Chat History
* Real-Time Typing Indicators

---

## Author

**Sujeet**

---

## License

This project is developed for educational and learning purposes.
