import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chatbot from "./pages/Chatbot";

function App() {

  const isLoggedIn =
    localStorage.getItem("user_id");

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/chat"
          element={
            isLoggedIn
              ? <Chatbot />
              : <Navigate to="/login" />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;