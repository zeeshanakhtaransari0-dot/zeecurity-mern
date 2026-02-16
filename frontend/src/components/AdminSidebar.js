import React from "react";
import { Box, List, ListItem, ListItemIcon, ListItemText,Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ReportIcon from "@mui/icons-material/Report";
import WarningIcon from "@mui/icons-material/Warning";
import PaymentsIcon from "@mui/icons-material/Payments";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import logo from "../assets/zeecurity_logo.png";
import CampaignIcon from "@mui/icons-material/Campaign";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("adminName");
    navigate("/");
  };

  return (
    <Box
  sx={{
    width: 220,
    height: "100vh",
    bgcolor: "#0f172a",
    color: "#fff",
    position: "fixed",
    left: 0,
    top: 0,
    overflowY: "auto",
  }}
>
  <Box
  sx={{
    height: 150,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  }}
>
  <img src={logo} alt="Zeecurity" style={{ width: 110 }} />
  <Typography
    variant="caption"
    sx={{ color: "#94a3b8", letterSpacing: 1.7 }}
  >
    Admin Panel
  </Typography>
</Box>
  
      <List>
        <ListItem button onClick={() => navigate("/admin")}>
          <ListItemIcon>
            <DashboardIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem button onClick={() => navigate("/admin/residents")}>
          <ListItemIcon>
            <PeopleIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Residents" />
        </ListItem>

        <ListItem button onClick={() => navigate("/admin/complaints")}>
          <ListItemIcon>
            <ReportIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Complaints" />
        </ListItem>

        <ListItem button onClick={() => navigate("/admin/sos")}>
          <ListItemIcon>
            <WarningIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="SOS" />
        </ListItem>

        <ListItem button onClick={() => navigate("/admin/payments")}>
          <ListItemIcon>
            <PaymentsIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Payments" />
        </ListItem>
        <ListItem button onClick={() => navigate("/admin/notices")}>
  <ListItemIcon>
    <CampaignIcon sx={{ color: "#fff" }} />
  </ListItemIcon>
  <ListItemText primary="Notices" />
</ListItem>

        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon sx={{ color: "#ef4444" }} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );
}