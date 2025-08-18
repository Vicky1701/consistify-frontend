import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const ConsistencyPathEditForm = ({ path, onUpdated }) => {
  const [form, setForm] = useState({
    name: path.name ?? '',
    duration: path.durationDays !== undefined && path.durationDays !== null ? String(path.durationDays) : '',
    dailyTarget: path.dailyTarget ?? '',
    repetitionCycle: path.repetitionCycle !== undefined && path.repetitionCycle !== null ? String(path.repetitionCycle) : ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.put(`${BASE_URL}/paths/${path.id}`, form);
      setMessage('Consistency Path updated!');
      if (onUpdated) onUpdated();
    } catch (err) {
      setMessage('Error updating path');
    }
  };


  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Edit Consistency Path</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Duration (days)" name="duration" value={form.duration} onChange={handleChange} fullWidth margin="normal" required type="number" />
        <TextField label="Daily Target" name="dailyTarget" value={form.dailyTarget} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Repetition Cycle (days)" name="repetitionCycle" value={form.repetitionCycle} onChange={handleChange} fullWidth margin="normal" required type="number" />
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button type="submit" variant="contained" color="primary">Save Changes</Button>
        </Box>
        {message && <Typography sx={{ mt: 2, color: message.includes('Error') ? 'red' : 'green' }}>{message}</Typography>}
      </form>
    </Box>
  );
};
export default ConsistencyPathEditForm;
