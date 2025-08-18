import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Chip } from '@mui/material';
import { addCheckpoint } from '../../services/api';

const CheckpointForm = ({ pathId, onAdded }) => {
  const [form, setForm] = useState({ title: '', source: '', tags: '', notes: '', code: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await addCheckpoint(pathId, {
        title: form.title,
        source: form.source,
        tags: form.tags.split(',').map(tag => tag.trim()),
        notes: form.notes,
        code: form.code
      });
      setMessage('Checkpoint added!');
      setForm({ title: '', source: '', tags: '', notes: '', code: '' });
      if (onAdded) onAdded();
    } catch (err) {
      setMessage('Error adding checkpoint');
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Add Checkpoint</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Title" name="title" value={form.title} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Source (LeetCode/GFG/link)" name="source" value={form.source} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Tags (comma separated)" name="tags" value={form.tags} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Notes" name="notes" value={form.notes} onChange={handleChange} fullWidth margin="normal" multiline rows={2} />
        <TextField label="Code (Java)" name="code" value={form.code} onChange={handleChange} fullWidth margin="normal" multiline rows={4} />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Add Checkpoint</Button>
        {message && <Typography sx={{ mt: 2, color: message.includes('Error') ? 'red' : 'green' }}>{message}</Typography>}
      </form>
    </Box>
  );
};
export default CheckpointForm;
