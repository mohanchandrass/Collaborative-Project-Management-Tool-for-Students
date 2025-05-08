import React, { useState, useContext, useRef } from 'react';
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from 'react-router-dom';
import "../../styles/AuthForm.css";
import logo from '../../assets/logo.png'; // Import your logo image
import videoBg from '../../styles/background.mp4'; // Import the video file

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email.trim(), password.trim());
      alert('✅ Successfully logged in!');
      navigate('/dashboard'); // Redirect to /dashboard upon successful login
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/home'); // Redirect to /home when the back button is clicked
  };

  return (
    <div className="auth-container">
  

      <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', zIndex: 3, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '5px' }}>
          <h1 className="app-name" style={{ marginRight: '15px', fontSize: '2.5rem' }}>
            ProjectHub
          </h1>
          <img
            src={logo}
            alt="ProjectHub Logo"
            style={{
              height: '70px',
              borderRadius: '50%',
            }}
          />
        </div>
      </div>

      <div className="auth-content" style={{ marginTop: '7.5%' }}> {/* Increased marginTop for the box */}
        <h2>Login</h2>

        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <button onClick={handleGoBack} className="back-button-text">
          Back To Home
        </button>
        {error && <p className="error">{error}</p>}
        <p>
          Don’t have an account?{' '}
          <Link to="/register" style={{ color: 'Gray' }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;