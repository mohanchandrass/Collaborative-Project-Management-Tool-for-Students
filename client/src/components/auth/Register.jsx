import React, { useState, useContext, useRef } from 'react';
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from 'react-router-dom';
import { firestore } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import "../../styles/AuthForm.css";
import videoBg from '../../styles/background.mp4';
import logo from '../../assets/logo.png'; // Import your logo image

const Register = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoBack = () => {
    navigate('/home');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where('username', '==', username.trim()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError('❌ Username already taken. Please choose another one.');
        setLoading(false);
        return;
      }

      await signup(username.trim(), email.trim(), password.trim());
      alert('✅ Account created successfully!');
      navigate('/');
    } catch (err) {
      console.error("Registration Error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please log in.');
      } else {
        setError(err.message || 'Something went wrong during registration.');
      }
    } finally {
      setLoading(false);
    }
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
<br></br>
      <div className="auth-content" style={{ marginTop: '7.5%' }}>
        <h2>Register</h2>
        <form onSubmit={handleRegister} className="auth-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <button onClick={handleGoBack} className="back-button-text">
          Back To Home
        </button>
        {error && <p className="error">{error}</p>}
        <p>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'Gray' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
