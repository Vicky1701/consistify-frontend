/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Typography, CircularProgress, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function PathList() {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPaths() {
      try {
        const res = await api.get('/paths');
        setPaths(res.data);
      } catch (err) {
        setError('Failed to fetch paths.');
      } finally {
        setLoading(false);
      }
    }
    fetchPaths();
  }, []);

  if (loading) return <Box sx={{ textAlign: 'center', mt: 2 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!paths.length) return <Typography>No Consistency Paths found.</Typography>;

  return (
    <Box>
      <Typography variant="h6" mb={2}>Active Consistency Paths</Typography>
      <List>
        {paths.map((path) => (
          <ListItem key={path.id || path.name} sx={{ borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <ListItemText
              primary={path.name}
              secondary={`Duration: ${path.duration} days | Daily Target: ${path.dailyTarget} | Repetition: every ${path.repetitionCycle} days`}
            />
            <Button variant="outlined" size="small" onClick={() => navigate(`/paths/${path.id || path.name}/checkpoints`)}>
              View Checkpoints
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

