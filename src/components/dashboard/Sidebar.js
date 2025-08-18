import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FlagIcon from '@mui/icons-material/Flag';
import AssignmentIcon from '@mui/icons-material/Assignment';
import RepeatIcon from '@mui/icons-material/Repeat';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import NotesIcon from '@mui/icons-material/Notes';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon /> },
  { text: 'Consistency Paths', icon: <FlagIcon /> },
  { text: 'Checkpoints', icon: <AssignmentIcon /> },
  { text: 'Review Board', icon: <RepeatIcon /> },
  { text: 'Motivation', icon: <EmojiEventsIcon /> },
  { text: 'Notes', icon: <NotesIcon /> },
];

const Sidebar = () => (
  <Drawer
    variant="permanent"
    sx={{
      width: 220,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: { width: 220, boxSizing: 'border-box', background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', color: '#fff' },
    }}
  >
    <Toolbar>
      <Typography variant="h6" fontWeight={700} sx={{ color: '#fff', mx: 'auto' }}>Consistify</Typography>
    </Toolbar>
    <List>
      {menuItems.map((item) => (
        <ListItem button key={item.text}>
          <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  </Drawer>
);
export default Sidebar;
