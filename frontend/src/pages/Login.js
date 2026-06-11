import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const loginUser = async () => {

    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/login",
        {
          email,
          password
        }
      );

      console.log("Response:", res.data);
      localStorage.setItem(
        "user_id",
        res.data.user_id
      );

      localStorage.setItem(
        "username",
        res.data.username
      );

      navigate("/chat");

    } catch (error) {

      alert("Invalid credentials");

    }
  };

  return (
    <div style={{ padding: "50px" }}>

      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <br /><br />

      <button onClick={loginUser}>
        Login
      </button>

      <br /><br />

      <Link to="/signup">
        Create Account
      </Link>

    </div>
  );
}

export default Login;