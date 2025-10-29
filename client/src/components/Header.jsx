import { useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";
import logo from "../assets/logo.png";
import "./Header.css";

function Header({ variant = "home" }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    alert("You have been logged out.");
    navigate("/"); // redirect
  };

  return (
    <header className="page-header">
      <div className="logo-background">
        <img src={logo} alt="College Logo" className="college-logo" />
      </div>
      <nav className="nav-bar">
        {variant === "home" ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/">Projects</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        )}
      </nav>
    </header>
  );
}

Header.propTypes = {
  variant: PropTypes.string,
};

export default Header;
