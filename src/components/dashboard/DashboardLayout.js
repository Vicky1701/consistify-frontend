import React from "react";
import Sidebar from "./Sidebar";
import { Box } from "@mui/material";
import ProfileMenu from "../shared/ProfileMenu";

const DashboardLayout = ({ children }) => (
  <Box
    sx={{
      display: "flex",
      minHeight: "100vh",
      background: "#fff",
      position: "relative",
    }}
  >
    <Sidebar />
    <ProfileMenu
      onLogout={() => {
        // Implement logout logic here (e.g., clear tokens, redirect)
        window.location.href = "/";
      }}
      onChangePassword={() => {
        // Implement change password logic here (e.g., open modal or redirect)
        alert("Change Password clicked!");
      }}
    />
    <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
      {children}
    </Box>
  </Box>
);
export default DashboardLayout;
