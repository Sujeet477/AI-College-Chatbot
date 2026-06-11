import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Signup() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const signupUser = async () => {

    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/signup",
        {
          username,
          email,
          password
        }
      );

      alert(res.data.message);

      navigate("/login");

    } catch (error) {

      console.log(error);
      alert("Signup failed");

    }
  };

  return (
    <div style={{ padding: "50px" }}>

      <h1>Signup Page</h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) =>
          setUsername(e.target.value)
        }
      />

      <br /><br />

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

      <button onClick={signupUser}>
        Signup
      </button>

      <br /><br />

      <Link to="/login">
        Already have an account?
      </Link>

    </div>
  );
}

export default Signup;