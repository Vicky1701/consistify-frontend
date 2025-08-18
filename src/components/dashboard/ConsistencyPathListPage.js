import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { Typography, Button, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getConsistencyPaths } from '../../services/api';
import axios from 'axios';

const ConsistencyPathListPage = () => {
  const [paths, setPaths] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const fetchPaths = () => {
    getConsistencyPaths().then(res => setPaths(res.data)).catch(() => setPaths([]));
  };
  useEffect(() => {
    fetchPaths();
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`http://localhost:8080/api/paths/${id}`);
      fetchPaths();
    } catch (err) {
      // Optionally show error
    }
    setDeletingId(null);
  };

  return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" fontWeight={700}>Consistency Paths</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/consistency-paths/create')}>Create Consistency Path</Button>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Your Consistency Paths</Typography>
        {paths.length === 0 ? (
          <Typography>No paths found.</Typography>
        ) : (
          paths.map(path => (
            <Paper key={path.id} sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography fontWeight={700}>{path.name}</Typography>
                <Typography variant="body2">Duration: {path.duration} days | Daily Target: {path.dailyTarget} | Repeat: every {path.repetitionCycle} days</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" color="primary" onClick={() => navigate(`/consistency-paths/${path.id}`)}>
                  View
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(path.id)}
                  disabled={deletingId === path.id}
                >
                  {deletingId === path.id ? 'Deleting...' : 'Delete'}
                </Button>
              </Box>
            </Paper>
          ))
        )}
      </Box>
    </DashboardLayout>
  );
};
export default ConsistencyPathListPage;
