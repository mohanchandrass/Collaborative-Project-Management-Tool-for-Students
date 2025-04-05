import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import "../../styles/AuthForm.css";
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    // ✅ Basic username validation
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    try {
      await signup(username, email, password);
      setError('');
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      // ✅ Handle Firebase auth error codes
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email format.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else {
        setError('Something went wrong during registration.');
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister} className="auth-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>
        Already have an account?{' '}
        <a href="/login" style={{ color: 'Gray' }}>
          Login
        </a>
      </p>
    </div>
  );
};

export default Register;
