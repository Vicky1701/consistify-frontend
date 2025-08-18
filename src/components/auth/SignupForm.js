import React from 'react';
import { TextField, Button, Typography } from '@mui/material';

const SignupForm = ({ signupName, setSignupName, signupEmail, setSignupEmail, signupPassword, setSignupPassword, signupMessage, onSubmit, onBack }) => (
  <form onSubmit={onSubmit}>
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
    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, py: 1.5, fontWeight: 700, fontSize: 18, borderRadius: 2, background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)' }}>
      Sign Up
    </Button>
    {signupMessage && <Typography sx={{ mt: 2, color: '#22c55e' }}>{signupMessage}</Typography>}
    <Button variant="text" sx={{ color: '#60a5fa', textTransform: 'none', mt: 2 }} onClick={onBack}>
      Back to Login
    </Button>
  </form>
);
export default SignupForm;
