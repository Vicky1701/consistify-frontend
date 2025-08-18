import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Box, Typography, Paper } from '@mui/material';
import ConsistencyPathEditForm from '../components/dashboard/ConsistencyPathEditForm';
import CheckpointList from '../components/dashboard/CheckpointList';
import { getConsistencyPaths } from '../services/api';

const ConsistencyPathsViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [path, setPath] = useState(null);
  const [refreshCheckpoints, setRefreshCheckpoints] = useState(false);

  useEffect(() => {
    getConsistencyPaths().then(res => {
      const found = res.data.find(p => String(p.id) === String(id));
      setPath(found || null);
    });
  }, [id]);

  const handleCheckpointAdded = () => setRefreshCheckpoints(r => !r);

  if (!path) return (
    <DashboardLayout>
      <Typography variant="h6">Consistency Path not found.</Typography>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Paper sx={{ p: 3, bgcolor: '#f9fafb' }}>
          <ConsistencyPathEditForm path={path} onUpdated={() => navigate('/consistency-paths')} />
          <CheckpointList key={refreshCheckpoints} pathId={path.id} />
        </Paper>
      </Box>
    </DashboardLayout>
  );
};
export default ConsistencyPathsViewPage;
