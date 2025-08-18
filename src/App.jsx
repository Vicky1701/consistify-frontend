// ...existing code...
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreatePath from './pages/CreatePath';
import Checkpoints from './pages/Checkpoints';
import './App.css'
import { AppBar, Toolbar, Typography, Button, Container, Box, Paper } from '@mui/material';

function App() {
  return (
    <BrowserRouter>
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        py: 0,
      }}>
        <AppBar position="static" sx={{ background: 'rgba(30,60,114,0.95)', boxShadow: 3 }}>
          <Toolbar>
            <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 2 }}>
              Consistify
            </Typography>
            <Button color="inherit" href="/dashboard" sx={{ fontWeight: 600, mx: 1 }}>Dashboard</Button>
            <Button color="inherit" href="/create-path" sx={{ fontWeight: 600, mx: 1 }}>Create Path</Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm" sx={{ mt: 6 }}>
          <Paper elevation={6} sx={{ borderRadius: 4, p: 4, background: 'rgba(255,255,255,0.97)', boxShadow: '0 8px 32px 0 rgba(30,60,114,0.2)' }}>
            <Routes>
              <Route path="/" element={<CreatePath />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-path" element={<CreatePath />} />
              <Route path="/paths/:pathId/checkpoints" element={<Checkpoints />} />
            </Routes>
          </Paper>
        </Container>
        <Box sx={{ textAlign: 'center', color: '#fff', mt: 8, opacity: 0.8 }}>
          <Typography variant="body2">&copy; {new Date().getFullYear()} Consistify – DSA Practice Tracker</Typography>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App
