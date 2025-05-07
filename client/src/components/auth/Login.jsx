import React, { useState, useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from 'react-router-dom';
import "../../styles/AuthForm.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

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
      <h1 className="app-name">ProjectHub</h1>
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>
        Don’t have an account?{' '}
        <Link to="/register" style={{ color: 'Gray' }}>
          Register
        </Link>
      </p>

      <p>
        Back To Home?{' '}
        <Link to="/home" style={{ color: 'Gray' }}>
        ⬅️
        </Link>
      </p>
      
    </div>
    
  );
};

export default Login;
