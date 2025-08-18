import React, { useEffect, useState } from 'react';
import { getCheckpoints } from '../../services/api';
import { Typography, Box, Paper, Chip } from '@mui/material';

const CheckpointList = ({ pathId }) => {
  const [checkpoints, setCheckpoints] = useState([]);

  useEffect(() => {
    if (pathId) {
      getCheckpoints(pathId).then(res => setCheckpoints(res.data)).catch(() => setCheckpoints([]));
    }
  }, [pathId]);

  if (!pathId) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Checkpoints for Path</Typography>
      {checkpoints.length === 0 ? (
        <Typography>No checkpoints found.</Typography>
      ) : (
        checkpoints.map(cp => (
          <Paper key={cp.id} sx={{ p: 2, mb: 2 }}>
            <Typography fontWeight={700}>{cp.title}</Typography>
            <Typography variant="body2">Source: {cp.source}</Typography>
            <Box sx={{ my: 1 }}>
              {cp.tags && cp.tags.map(tag => <Chip key={tag} label={tag} sx={{ mr: 1 }} />)}
            </Box>
            <Typography variant="body2">Notes: {cp.notes}</Typography>
            <Box sx={{ mt: 1, bgcolor: '#f3f4f6', p: 2, borderRadius: 2 }}>
              <Typography variant="body2" fontFamily="monospace">{cp.code}</Typography>
            </Box>
          </Paper>
        ))
      )}
    </Box>
  );
};
export default CheckpointList;
