import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Typography } from '@mui/material';

const DashboardPage = () => (
  <DashboardLayout>
    <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
      Welcome to your Consistify Dashboard!
    </Typography>
    {/* Add dashboard widgets/components here */}
  </DashboardLayout>
);
export default DashboardPage;
