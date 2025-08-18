import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import ConsistencyPathForm from '../components/dashboard/ConsistencyPathForm';
import { Box, Typography } from '@mui/material';

const ConsistencyPathsCreatePage = () => (
  <DashboardLayout>
    <Box sx={{ mb: 3 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
        Create Consistency Path
      </Typography>
      <ConsistencyPathForm onCreated={() => {}} />
    </Box>
  </DashboardLayout>
);
export default ConsistencyPathsCreatePage;
