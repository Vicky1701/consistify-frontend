import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { createConsistencyPath } from '../../services/api';

const ConsistencyPathForm = ({ onCreated }) => {
  const [form, setForm] = useState({ name: '', duration: '', dailyTarget: '', repetitionCycle: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await createConsistencyPath({
        name: form.name,
        duration: Number(form.duration),
        dailyTarget: Number(form.dailyTarget),
        repetitionCycle: Number(form.repetitionCycle)
      });
      setMessage('Consistency Path created!');
      setForm({ name: '', duration: '', dailyTarget: '', repetitionCycle: '' });
      if (onCreated) onCreated();
    } catch (err) {
      setMessage('Error creating path');
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Create Consistency Path</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Duration (days)" name="duration" value={form.duration} onChange={handleChange} fullWidth margin="normal" required type="number" />
        <TextField label="Daily Target" name="dailyTarget" value={form.dailyTarget} onChange={handleChange} fullWidth margin="normal" required type="number" />
        <TextField label="Repetition Cycle" name="repetitionCycle" value={form.repetitionCycle} onChange={handleChange} fullWidth margin="normal" required type="number" />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Create Path</Button>
        {message && <Typography sx={{ mt: 2, color: message.includes('Error') ? 'red' : 'green' }}>{message}</Typography>}
      </form>
    </Box>
  );
};
export default ConsistencyPathForm;
