import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import '../styles/Register.css';

const Register: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepeatPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== repeatPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's profile with their name
      await updateProfile(user, { displayName: name });

      console.log('User registered successfully:', user);
      alert('Registration successful!'); // Replace with navigation if needed
    } catch (err: any) {
      setError(err.message); // Show Firebase error messages
      console.error('Error during registration:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="welcome-section">
          <h2 className="welcome-title">Welcome to Registration</h2>
          <p className="welcome-subtitle">Create your account</p>
        </div>

        <div className="form-section">
          <form onSubmit={handleSubmit} className="register-form">
            <h2 className="register-greeting">Hello!</h2>
            <p className="register-subheading">Join Us Today</p>
            <h3 className="register-title">Sign Up</h3>

            {error && <p className="error-message">{error}</p>}

            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
                required
                className="register-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                required
                className="register-input"
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
                className="register-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="repeatPassword">Repeat Password</label>
              <input
                type="password"
                id="repeatPassword"
                value={repeatPassword}
                onChange={handleRepeatPasswordChange}
                required
                className="register-input"
              />
            </div>

            <button type="submit" className="register-button" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>

            <div className="already-account">
              <a href="/Login">Already have an account? Log In</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
