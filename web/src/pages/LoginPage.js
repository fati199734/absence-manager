import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/token/',
        { username, password }
      );
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      setSuccess(true);
    } catch (err) {
      setError("Identifiants invalides. Veuillez réessayer.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-image-section">
        <img src="/login-building.jpg" alt="School building" className="login-image" />
      </div>
      <div className="login-form-section">
        <div className="login-avatar" />
        <h2 className="login-title">ADMIN LOGIN</h2>
        <p className="login-subtitle">
          Login with your <span className="login-subtitle-admin">admin</span> credential.
        </p>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-input-group">
            <span className="login-input-icon">
              <svg width="20" height="20" fill="none" stroke="gray" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            <input
              type="text"
              placeholder="Enter username..."
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="login-input-group">
            <span className="login-input-icon">
              <svg width="20" height="20" fill="none" stroke="gray" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
            <input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="login-btn" type="submit">LOGIN</button>
          {error && <div className="login-error">{error}</div>}
          {success && <div className="login-success">Connexion réussie !</div>}
        </form>
      </div>
    </div>
  );
}

export default LoginPage; 