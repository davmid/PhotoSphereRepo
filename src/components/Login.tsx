import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase function
import { auth } from '../services/firebaseConfig'; // Your Firebase configuration file
import '../styles/Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null); // State for handling errors
  const [loading, setLoading] = useState<boolean>(false); // State for loading indicator

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Reset error state
    setLoading(true); // Show loading state

    try {
      // Sign in the user using Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);
      alert('Login successful!'); // Display success message
    } catch (error: any) {
      // Handle Firebase authentication errors
      setError(error.message);
      console.error('Error during login:', error);
    } finally {
      setLoading(false); // Stop loading state
    }
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

            {error && <p className="error-message">{error}</p>} {/* Display error messages */}
            
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

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Submit'}
            </button>

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
