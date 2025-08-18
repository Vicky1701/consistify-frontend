import React from 'react';
import { TextField, Button, IconButton, InputAdornment, Typography, Box } from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';

const LoginForm = ({ email, setEmail, password, setPassword, showPassword, setShowPassword, isLoading, error, success, onSubmit, onForgot, onSignup }) => (
  <form onSubmit={onSubmit}>
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
            <Email sx={{ color: '#3b82f6' }} />
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
            <Lock sx={{ color: '#3b82f6' }} />
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
      sx={{ mt: 2, py: 1.5, fontWeight: 700, fontSize: 18, borderRadius: 2, background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)' }}
      disabled={isLoading}
    >
      {isLoading ? 'Signing In...' : 'Sign In'}
    </Button>
    {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
    {success && <Typography sx={{ mt: 2, color: '#22c55e' }}>{success}</Typography>}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
      <Button variant="text" sx={{ color: '#60a5fa', textTransform: 'none' }} onClick={onForgot}>
        Forgot your password?
      </Button>
      <Button variant="text" sx={{ color: '#60a5fa', textTransform: 'none' }} onClick={onSignup}>
        Sign up
      </Button>
    </Box>
  </form>
); 
export default LoginForm;
