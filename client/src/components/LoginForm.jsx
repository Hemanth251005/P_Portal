import { useState } from "react";
import PropTypes from "prop-types";
import "./LoginForm.css";
import collegeImage from "../assets/college.jpg";

function LoginForm({ onLogin }) {
  const [userType, setUserType] = useState(""); // Student or Faculty
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [batch, setBatch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ username, password, role: userType, batch });
  };

  return (
    <div
      className="login-page"
      style={{ backgroundImage: `url(${collegeImage})` }}
    >
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          {/* User type selection */}
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            required
          >
            <option value="">Select User Type</option>
            <option value="student">Student Login</option>
            <option value="faculty">Faculty Login</option>
          </select>

          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Batch input for students */}
          {userType === "student" && (
            <input
              type="text"
              placeholder="Batch"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              required
            />
          )}

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginForm;
