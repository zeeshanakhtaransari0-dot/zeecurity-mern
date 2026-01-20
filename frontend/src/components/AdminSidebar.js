import React from "react";
import { Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ReportIcon from "@mui/icons-material/Report";
import WarningIcon from "@mui/icons-material/Warning";
import PaymentsIcon from "@mui/icons-material/Payments";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("adminName");
    navigate("/");
  };

  return (
    <Box sx={{ width: 220, height: "100vh", bgcolor: "#0f172a", color: "#fff" }}>
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
          <ListItemText primary="Residents (View)" />
        </ListItem>

        <ListItem button onClick={() => navigate("/admin/complaints")}>
          <ListItemIcon>
            <ReportIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Complaints (View)" />
        </ListItem>

        <ListItem button onClick={() => navigate("/admin/sos")}>
          <ListItemIcon>
            <WarningIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="SOS (View)" />
        </ListItem>

        <ListItem button onClick={() => navigate("/admin/payments")}>
          <ListItemIcon>
            <PaymentsIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Payments (View)" />
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