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
      const baseURL = "https://project-backend-khaki.vercel.app"; // ✅ backend deployed URL

      const endpoint =
        credentials.role === "student"
          ? "/student/login"
          : "/faculty/login";

      const response = await axios.post(`${baseURL}${endpoint}`, credentials, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        localStorage.setItem("role", credentials.role);
        localStorage.setItem("username", credentials.username);

        if (credentials.role === "student") {
          localStorage.setItem("batch", credentials.batch);
        }

        setIsLoggedIn(true);
        alert(response.data.message);

        window.location.href = "/projects";
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
