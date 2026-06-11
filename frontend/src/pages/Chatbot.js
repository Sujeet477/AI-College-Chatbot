
import React, {
    useState,
    useEffect,
    useRef
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

function Chatbot() {

    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [currentSession, setCurrentSession] = useState(null);
    const userId = localStorage.getItem(
        "user_id"
    );

    const bottomRef = useRef(null);

    useEffect(() => {
        loadSessions();
    }, []);

    useEffect(() => {

        const savedSession =
            localStorage.getItem("currentSession");

        if (savedSession) {

            setCurrentSession(
                Number(savedSession)
            );

            loadHistory(
                Number(savedSession)
            );
        }

    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            bottomRef.current?.scrollIntoView({
                behavior: "smooth",
            });
        }
    }, [messages]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (currentSession) {
            localStorage.setItem(
                "currentSession",
                currentSession
            );
        }
    }, [currentSession]);



    // Load session history
    const loadHistory = async (sessionId) => {

        console.log("LOADING HISTORY FOR:", sessionId);
        try {


            setCurrentSession(sessionId);

            console.log(
                "CURRENT SESSION AFTER SET:",
                sessionId
            );

            const res = await axios.get(
                `http://127.0.0.1:8000/history/${sessionId}`
            );

            const historyMessages = [];

            res.data.forEach((item) => {
                historyMessages.push({
                    sender: "user",
                    text: item.question,
                });

                historyMessages.push({
                    sender: "bot",
                    text: item.answer,
                });
            });
            console.log("SETTING:", sessionId);
            console.log(historyMessages);
            
            
        } catch (error) {
            console.log(error);
        }
    };
    // Load all sessions
    const loadSessions = async () => {
        try {
            const userId = localStorage.getItem("user_id");

            const res = await axios.get(
                `http://127.0.0.1:8000/sessions/${userId}`
            );

            setSessions(res.data);

        } catch (error) {
            console.log(error);
            console.log("Could not load sessions");
        }
    };

    // Create new session
    const createSession = async () => {

        console.log("New Chat clicked");
        try {
            const title = `Chat ${sessions.length + 1}`;

            const userId = localStorage.getItem("user_id");

            const res = await axios.post(
                "http://127.0.0.1:8000/session",
                {
                    title: title,
                    user_id: Number(userId)
                }
            );

            const newSessionId = res.data.session_id;

            setCurrentSession(newSessionId);

            localStorage.setItem(
                "currentSession",
                newSessionId
            );

            setMessages([]);

            await loadSessions();

        } catch (error) {
            console.log(error);
            console.log("Could not create session");
        }
    };

    // Clear current session
    const clearChat = async () => {
        try {
            await axios.delete(
                `http://127.0.0.1:8000/history/${currentSession}`
            );

            setMessages([]);

        } catch (error) {
            console.log("Could not clear chat");
        }
    };

    const deleteSession = async (sessionId) => {
        try {

            await axios.delete(
                `http://127.0.0.1:8000/session/${sessionId}`
            );

            loadSessions();

            setMessages([]);

        } catch (error) {
            console.log("Could not delete session");
        }
    };

    // Send message
    const sendMessage = async () => {
        if (!message.trim()) return;

        if (!currentSession) {
            alert("Create a chat session first");
            return;
        }

        const userMessage = {
            sender: "user",
            text: message,
        };

        setMessages((prev) => [
            ...prev,
            userMessage,
        ]);

        setLoading(true);

        try {
            const res = await axios.post(
                "http://127.0.0.1:8000/chat",
                {
                    message: message,
                    session_id: currentSession,
                }
            );

            if (messages.length === 0) {

                await axios.put(
                    `http://127.0.0.1:8000/session/${currentSession}`,
                    {
                        title: message.substring(0, 25)
                    }
                );

                await loadSessions();
            }

            const botMessage = {
                sender: "bot",
                text: res.data.response,
            };

            setMessages((prev) => [
                ...prev,
                botMessage,
            ]);

        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: "Error connecting to backend.",
                },
            ]);
        }

        setLoading(false);
        setMessage("");
    };
    console.log("MESSAGES STATE:", messages);


    return (
        <div className="app-layout">

            {/* Sidebar */}
            <div className="sidebar">

                <h3>
                    Welcome, {localStorage.getItem("username")}
                </h3>

                <button
                    className="new-chat-btn"
                    onClick={createSession}
                >
                    + New Chat
                </button>

                <button
                    className="new-chat-btn"
                    onClick={() => {
                        localStorage.clear();
                        navigate("/login");
                    }}
                >
                    Logout
                </button>

                <div className="chat-list">
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className={
                                currentSession === session.id
                                    ? "chat-item active-chat"
                                    : "chat-item"
                            }
                        >
                            <button
                                onClick={() => {
                                    console.log(
                                        "CLICKED:",
                                        session.id
                                    );

                                    loadHistory(session.id);
                                }}
                            >
                                {session.title}
                            </button>

                            <button
                                className="delete-btn"
                                onClick={() =>
                                    deleteSession(session.id)
                                }
                            >
                                🗑
                            </button>

                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat */}
            <div className="main-chat">

                <div className="container">

                    <h1>AI College Chatbot</h1>

                    <textarea
                        rows="4"
                        placeholder="Ask your question..."
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (
                                e.key === "Enter" &&
                                !e.shiftKey
                            ) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                    />

                    <div className="button-group">

                        <button
                            onClick={sendMessage}
                        >
                            Send
                        </button>

                        <button
                            onClick={clearChat}
                        >
                            Clear Chat
                        </button>

                    </div>
                    {console.log(
                        "RENDER CURRENT SESSION:",
                        currentSession
                    )}
                    <h2>Current Session: {currentSession}</h2>

                    <div className="chat-container">

                        {messages.map((msg, index) => (
                            <div
                                key={`${currentSession}-${index}`}
                                className={
                                    msg.sender === "user"
                                        ? "user-message"
                                        : "bot-message"
                                }
                            >
                                {msg.text}
                            </div>
                        ))}

                        {loading && (
                            <div className="bot-message">
                                Bot is typing...
                            </div>
                        )}

                        <div ref={bottomRef}></div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Chatbot;