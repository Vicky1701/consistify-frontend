import React from 'react';
import Sidebar from './Sidebar';
import { Box } from '@mui/material';

const DashboardLayout = ({ children }) => (
  <Box sx={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
    <Sidebar />
    <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
      {children}
    </Box>
  </Box>
);
export default DashboardLayout;
