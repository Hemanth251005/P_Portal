import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import LoginHeader from "./components/LoginHeader";
import HomePage from "./components/HomePage";
import LoginForm from "./components/LoginForm";
import ProjectsPage from "./components/ProjectsPage";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) setIsLoggedIn(true);
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const baseURL = "https://project-backend-khaki.vercel.app"; // ✅ correct backend

      const response = await axios.post(
        `${baseURL}/api/login`,
        credentials,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        const { username, role, batch } = response.data.user;

        localStorage.setItem("role", role);
        localStorage.setItem("username", username);

        if (role === "student" && batch) {
          localStorage.setItem("batch", batch);
        }

        setIsLoggedIn(true);
        alert(response.data.message);

        window.location.href = "/projects"; // ✅ redirect after success
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    alert("Successfully logged out!");
    window.location.href = "/";
  };

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header isLoggedIn={isLoggedIn} onLogoutClick={handleLogout} />
                <HomePage />
              </>
            }
          />

          <Route
            path="/login"
            element={
              <>
                <LoginHeader />
                <LoginForm onLogin={handleLogin} />
              </>
            }
          />

          <Route
            path="/projects"
            element={
              <>
                <Header isLoggedIn={isLoggedIn} onLogoutClick={handleLogout} />
                <ProjectsPage onLogout={handleLogout} />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
