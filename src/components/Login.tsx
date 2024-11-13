import React, { useState } from 'react';
import '../styles/Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="welcome-section">
          <h2 className="welcome-title">Welcome Page</h2>
          <p className="welcome-subtitle">Sign in to your account</p>
        </div>

        <div className="form-section">
          <form onSubmit={handleSubmit} className="login-form">
            <h2 className="login-greeting">Hello!</h2>
            <p className="login-subheading">Good Morning</p>
            <h3 className="login-title">Log In to Your Account</h3>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                required
                className="login-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                required
                className="login-input"
              />
            </div>

            <div className="form-options">
              <label>
                <input type="checkbox" /> Remember
              </label>
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>

            <button type="submit" className="login-button">Submit</button>

            <div className="create-account">
              <a href="/Register">Create Account</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
