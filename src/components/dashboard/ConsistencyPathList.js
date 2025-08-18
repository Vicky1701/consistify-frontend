import React, { useEffect, useState } from 'react';
import { getConsistencyPaths } from '../../services/api';
import { Typography, Box, Paper } from '@mui/material';

const ConsistencyPathList = ({ onSelect }) => {
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    getConsistencyPaths().then(res => setPaths(res.data)).catch(() => setPaths([]));
  }, []);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Your Consistency Paths</Typography>
      {paths.length === 0 ? (
        <Typography>No paths found.</Typography>
      ) : (
        paths.map(path => (
          <Paper key={path.id} sx={{ p: 2, mb: 2, cursor: 'pointer' }} onClick={() => onSelect && onSelect(path)}>
            <Typography fontWeight={700}>{path.name}</Typography>
            <Typography variant="body2">Duration: {path.duration} days | Daily Target: {path.dailyTarget} | Repeat: every {path.repetitionCycle} days</Typography>
          </Paper>
        ))
      )}
    </Box>
  );
};
export default ConsistencyPathList;
