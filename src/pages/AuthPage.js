import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent } from '@mui/material';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

const AuthPage = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupMessage, setSignupMessage] = useState('');
  const [fpUsername, setFpUsername] = useState('');
  const [fpNewPassword, setFpNewPassword] = useState('');
  const [fpMessage, setFpMessage] = useState('');
  const navigate = useNavigate();

  // Login handler with redirect
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Login successful!');
        setTimeout(() => navigate('/dashboard'), 800);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
    setIsLoading(false);
  };

  // Signup handler
  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupMessage('');
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: signupName, email: signupEmail, password: signupPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setSignupMessage('Registration successful!');
        setShowSignup(false);
      } else {
        setSignupMessage(data.error || 'Registration failed');
      }
    } catch (err) {
      setSignupMessage('Network error');
    }
  };

  // Forgot password handler
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setFpMessage('');
    try {
      const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: fpUsername, newPassword: fpNewPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setFpMessage('Password updated successfully');
        setShowForgot(false);
      } else {
        setFpMessage(data.error || 'Password reset failed');
      }
    } catch (err) {
      setFpMessage('Network error');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)' }}>
      <Card sx={{ maxWidth: 420, width: '100%', borderRadius: 4, boxShadow: 8, background: 'rgba(255,255,255,0.98)', p: 4 }}>
        <CardContent>
          {!showForgot && !showSignup ? (
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              isLoading={isLoading}
              error={error}
              success={success}
              onSubmit={handleLogin}
              onForgot={() => setShowForgot(true)}
              onSignup={() => setShowSignup(true)}
            />
          ) : showSignup ? (
            <SignupForm
              signupName={signupName}
              setSignupName={setSignupName}
              signupEmail={signupEmail}
              setSignupEmail={setSignupEmail}
              signupPassword={signupPassword}
              setSignupPassword={setSignupPassword}
              signupMessage={signupMessage}
              onSubmit={handleSignup}
              onBack={() => setShowSignup(false)}
            />
          ) : (
            <ForgotPasswordForm
              fpUsername={fpUsername}
              setFpUsername={setFpUsername}
              fpNewPassword={fpNewPassword}
              setFpNewPassword={setFpNewPassword}
              fpMessage={fpMessage}
              onSubmit={handleForgotPassword}
              onBack={() => setShowForgot(false)}
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
export default AuthPage;
