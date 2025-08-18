// src/pages/Checkpoints.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button, Chip, Paper } from '@mui/material';
// ...existing code...
// ...existing code...
import JavaCodeEditor from '../components/JavaCodeEditor';
import api from '../services/api';

export default function Checkpoints() {
  const { pathId } = useParams();
  const [form, setForm] = useState({
    title: '',
    source: '',
    tags: '',
    notes: '',
    code: '',
  });
  const [showEditor, setShowEditor] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [checkpoints, setCheckpoints] = useState([]);

  useEffect(() => {
    async function fetchCheckpoints() {
      try {
        const res = await api.get(`/paths/${pathId}/checkpoints`);
        setCheckpoints(res.data);
      } catch {
        setError('Failed to fetch checkpoints.');
      }
    }
    fetchCheckpoints();
  }, [pathId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.source) {
      setError('Title and Source are required.');
      return;
    }
    try {
      await api.post(`/paths/${pathId}/checkpoints`, {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()),
      });
      setSuccess('Checkpoint added!');
      setForm({ title: '', source: '', tags: '', notes: '', code: '' });
      // Refresh list
      const res = await api.get(`/paths/${pathId}/checkpoints`);
      setCheckpoints(res.data);
    } catch {
      setError('Failed to add checkpoint.');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 4, bgcolor: '#f7f9fc', borderRadius: 4, boxShadow: 3 }}>
      {!showEditor ? (
        <>
          <Typography variant="h5" mb={2}>Add Problem / Checkpoint</Typography>
          <form onSubmit={e => { e.preventDefault(); setShowEditor(true); }}>
            <TextField label="Problem Title" name="title" value={form.title} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Source (LeetCode/GFG/link)" name="source" value={form.source} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Tags (comma separated)" name="tags" value={form.tags} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Personal Notes" name="notes" value={form.notes} onChange={handleChange} fullWidth margin="normal" multiline rows={2} />
            {error && <Typography color="error" mt={1}>{error}</Typography>}
            {success && <Typography color="primary" mt={1}>{success}</Typography>}
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Solve</Button>
          </form>
        </>
      ) : (
        <>
          <Typography variant="h6" mb={2}>Solve: {form.title}</Typography>
          <JavaCodeEditor initialCode={form.code} />
        </>
      )}
    </Box>
  );
}
