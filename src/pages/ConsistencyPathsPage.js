import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Typography, Button, Box, Paper } from '@mui/material';
import ConsistencyPathForm from '../components/dashboard/ConsistencyPathForm';
import CheckpointForm from '../components/dashboard/CheckpointForm';
import CheckpointList from '../components/dashboard/CheckpointList';
import { getConsistencyPaths } from '../services/api';

const ConsistencyPathsPage = () => {
  const [selectedPath, setSelectedPath] = useState(null);
  const [paths, setPaths] = useState([]);
  const [refreshPaths, setRefreshPaths] = useState(false);
  const [refreshCheckpoints, setRefreshCheckpoints] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  React.useEffect(() => {
    getConsistencyPaths().then(res => setPaths(res.data)).catch(() => setPaths([]));
  }, [refreshPaths]);

  const handlePathCreated = () => {
    setRefreshPaths(r => !r);
    setShowCreateForm(false);
  };
  const handleCheckpointAdded = () => setRefreshCheckpoints(r => !r);

  return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" fontWeight={700}>
          Consistency Paths
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowCreateForm(true)}
          sx={{ minWidth: 200 }}
        >
          Create Consistency Path
        </Button>
      </Box>
      {showCreateForm && (
        <Box sx={{ mb: 3 }}>
          <ConsistencyPathForm onCreated={handlePathCreated} />
        </Box>
      )}
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
              <Button variant="contained" color="primary" onClick={() => setSelectedPath(path)}>
                View
              </Button>
            </Paper>
          ))
        )}
      </Box>
      {selectedPath && (
        <Box sx={{ mb: 4 }}>
          <Paper sx={{ p: 3, bgcolor: '#f9fafb' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={700}>{selectedPath.name}</Typography>
              <Button variant="outlined" color="primary" onClick={() => setSelectedPath(null)}>Close</Button>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Duration: {selectedPath.duration} days | Daily Target: {selectedPath.dailyTarget} | Repeat: every {selectedPath.repetitionCycle} days
            </Typography>
            <CheckpointForm pathId={selectedPath.id} onAdded={handleCheckpointAdded} />
            <CheckpointList key={refreshCheckpoints} pathId={selectedPath.id} />
          </Paper>
        </Box>
      )}
    </DashboardLayout>
  );
};
export default ConsistencyPathsPage;
