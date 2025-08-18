import React from 'react';
import { TextField, Button, Typography } from '@mui/material';

const ForgotPasswordForm = ({ fpUsername, setFpUsername, fpNewPassword, setFpNewPassword, fpMessage, onSubmit, onBack }) => (
  <form onSubmit={onSubmit}>
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
    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, py: 1.5, fontWeight: 700, fontSize: 18, borderRadius: 2, background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)' }}>
      Reset Password
    </Button>
    {fpMessage && <Typography sx={{ mt: 2, color: '#22c55e' }}>{fpMessage}</Typography>}
    <Button variant="text" sx={{ color: '#60a5fa', textTransform: 'none', mt: 2 }} onClick={onBack}>
      Back to Login
    </Button>
  </form>
);
export default ForgotPasswordForm;
