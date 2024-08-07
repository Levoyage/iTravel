import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css'

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.length < 3 || username.length > 20) {
      setError('Username must be between 3 and 20 characters');
      return;
    }
    if (password.length < 6 || password.length > 40) {
      setError('Password must be between 6 and 40 characters');
      return;
    }
    const response = await fetch('http://localhost:8080/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      console.log('Signup successful');
      navigate('/login');
    } else {
      console.error('Signup failed');
    }
  };// TODO: 设置邮箱验证

  return (
    <div className="signup-container">
      <h2 className="signup-title">Sign Up</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="3-20 characters"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            pattern=".{3,20}"
            title="Username must be between 3 and 20 characters"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Valid Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="6-40 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            pattern=".{6,40}"
            title="Password must be between 6 and 40 characters"
            required
          />
        </div>
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;