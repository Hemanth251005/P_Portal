import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './LoginHeader.css';

function LoginHeader({ onLogoutClick }) {
  const navigate = useNavigate();

  return (
    <header className="login-header">
      <div className="header-buttons">
        <button onClick={() => navigate('/')}>Home</button>
        <button onClick={onLogoutClick}>Logout</button>
      </div>
    </header>
  );
}

LoginHeader.propTypes = {
  onLogoutClick: PropTypes.func.isRequired,
};

export default LoginHeader;
