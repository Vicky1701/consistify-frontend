// src/pages/CreatePath.jsx
import { useState } from 'react';
import { TextField, Button, Box, Typography, MenuItem } from '@mui/material';
import api from '../services/api';

const defaultValues = {
  name: '',
  duration: '',
  dailyTarget: '',
  repetitionCycle: '',
};

export default function CreatePath() {
  const [form, setForm] = useState(defaultValues);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simple validation
    if (!form.name || !form.duration || !form.dailyTarget || !form.repetitionCycle) {
      setError('Please fill all fields.');
      return;
    }
    try {
      // Replace with actual backend endpoint
      await api.post('/paths', form);
      setSuccess('Consistency Path created!');
      setForm(defaultValues);
    } catch (err) {
      setError('Failed to create path.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" mb={2}>Create Consistency Path</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Path Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Duration (days)"
          name="duration"
          type="number"
          value={form.duration}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Daily Target (problems)"
          name="dailyTarget"
          type="number"
          value={form.dailyTarget}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Repetition Cycle (days)"
          name="repetitionCycle"
          type="number"
          value={form.repetitionCycle}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        {error && <Typography color="error" mt={1}>{error}</Typography>}
        {success && <Typography color="primary" mt={1}>{success}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Create Path
        </Button>
      </form>
    </Box>
  );
}
