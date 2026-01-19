import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
  Button,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ReportIcon from "@mui/icons-material/Report";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import logo from "../assets/zeecurity_logo.png";

const drawerWidth = 220;

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Drawer
      variant="permanent"
      PaperProps={{
        sx: {
          width: drawerWidth,
          background: "#020617",
          color: "#e5e7eb",
        },
      }}
    >
      <Toolbar sx={{ minHeight: 80 }}>
        <Box sx={{ textAlign: "center", width: "100%" }}>
          <img src={logo} alt="Zeecurity" style={{ width: 120 }} />
          <Typography variant="caption" sx={{ letterSpacing: 1 }}>
            Admin Panel
          </Typography>
        </Box>
      </Toolbar>

      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/admin">
            <ListItemIcon sx={{ color: "#7dd3fc" }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton disabled>
            <ListItemIcon sx={{ color: "#7dd3fc" }}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Residents (View)" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton disabled>
            <ListItemIcon sx={{ color: "#7dd3fc" }}>
              <ReportIcon />
            </ListItemIcon>
            <ListItemText primary="Complaints (View)" />
          </ListItemButton>
        </ListItem>
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ mx: 2 }} />

      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      <Box sx={{ px: 2, pb: 2 }}>
        <Typography variant="caption" sx={{ fontSize: 10 }}>
          Zeecurity • Society Security System
        </Typography>
      </Box>
    </Drawer>
  );
}