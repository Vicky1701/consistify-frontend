/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Box
} from '@mui/material';
import { CheckCircle, Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';

const LoginPage = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupMessage, setSignupMessage] = useState('');

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
      } else {
        setSignupMessage(data.error || 'Registration failed');
      }
    } catch (err) {
      setSignupMessage('Network error');
    }
  };
  const [showForgot, setShowForgot] = useState(false);
  const [fpUsername, setFpUsername] = useState('');
  const [fpNewPassword, setFpNewPassword] = useState('');
  const [fpMessage, setFpMessage] = useState('');

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
      } else {
        setFpMessage(data.error || 'Password reset failed');
      }
    } catch (err) {
      setFpMessage('Network error');
    }
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
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
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
    setIsLoading(false);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
  background: 'linear-gradient(135deg, #222 0%, #333 100%)',
      fontFamily: 'Roboto, Segoe UI, Arial, sans-serif',
    }}>
      <Card sx={{
        maxWidth: 420,
        width: '100%',
        borderRadius: 4,
        boxShadow: 8,
        background: 'rgba(255,255,255,0.98)',
        p: 4,
      }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <CheckCircle sx={{ fontSize: 56, color: '#333', mb: 1 }} />
            <Typography variant="h4" fontWeight={800} color="#333" gutterBottom>Consistify</Typography>
            <Typography variant="subtitle1" color="#888">Welcome back! Please sign in to continue.</Typography>
          </Box>
          {/* Login, Signup, or Forgot Password Form */}
          {!showForgot && !showSignup ? (
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#333' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#333' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, py: 1.5, fontWeight: 700, fontSize: 18, borderRadius: 2, background: 'linear-gradient(90deg, #222 0%, #333 100%)' }}
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
              {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
              {success && <Typography sx={{ mt: 2, color: '#22c55e' }}>{success}</Typography>}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                <Button variant="text" sx={{ color: '#333', textTransform: 'none' }} onClick={() => setShowForgot(true)}>
                  Forgot your password?
                </Button>
                <Button variant="text" sx={{ color: '#333', textTransform: 'none' }} onClick={() => setShowSignup(true)}>
                  Sign up
                </Button>
              </Box>
            </form>
          ) : showSignup ? (
            <form onSubmit={handleSignup}>
              <Typography variant="h5" fontWeight={700} color="#222" sx={{ mb: 2 }}>Sign Up</Typography>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={signupName}
                onChange={e => setSignupName(e.target.value)}
                required
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={signupEmail}
                onChange={e => setSignupEmail(e.target.value)}
                required
              />
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
                type="password"
                value={signupPassword}
                onChange={e => setSignupPassword(e.target.value)}
                required
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, py: 1.5, fontWeight: 700, fontSize: 18, borderRadius: 2, background: 'linear-gradient(90deg, #222 0%, #333 100%)' }}>
                Sign Up
              </Button>
              {signupMessage && <Typography color="success.main" sx={{ mt: 2 }}>{signupMessage}</Typography>}
              <Button variant="text" sx={{ color: '#333', textTransform: 'none', mt: 2 }} onClick={() => setShowSignup(false)}>
                Back to Login
              </Button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword}>
              <Typography variant="h5" fontWeight={700} color="#222" sx={{ mb: 2 }}>Reset Password</Typography>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={fpUsername}
                onChange={e => setFpUsername(e.target.value)}
                required
              />
              <TextField
                label="New Password"
                variant="outlined"
                fullWidth
                margin="normal"
                type="password"
                value={fpNewPassword}
                onChange={e => setFpNewPassword(e.target.value)}
                required
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, py: 1.5, fontWeight: 700, fontSize: 18, borderRadius: 2, background: 'linear-gradient(90deg, #222 0%, #333 100%)' }}>
                Reset Password
              </Button>
              {fpMessage && <Typography color="success.main" sx={{ mt: 2 }}>{fpMessage}</Typography>}
              <Button variant="text" sx={{ color: '#333', textTransform: 'none', mt: 2 }} onClick={() => setShowForgot(false)}>
                Back to Login
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </Box>
              );
            };
export default LoginPage;