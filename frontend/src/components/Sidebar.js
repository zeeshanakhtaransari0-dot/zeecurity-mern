// src/components/Sidebar.js
import * as React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  ListItemButton,
  Divider,
  Button,
} from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ReportIcon from "@mui/icons-material/Report";
import PaymentsIcon from "@mui/icons-material/Payments";
import WarningIcon from "@mui/icons-material/Warning";
import LogoutIcon from "@mui/icons-material/Logout";

import logo from "../assets/zeecurity_logo.png";

const drawerWidth = 220;

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const isActive = (to) => path.startsWith(to);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const menuItems = [
    { label: "Guard Home", to: "/guard", icon: <HomeIcon /> },
    { label: "Visitors", to: "/guard/visitors", icon: <PeopleIcon /> },
    { label: "Notices", to: "/guard/notices", icon: <NotificationsIcon /> },
    { label: "Complaints", to: "/guard/complaints", icon: <ReportIcon /> },
    { label: "Payments", to: "/guard/payments", icon: <PaymentsIcon /> },
    { label: "SOS", to: "/guard/sos", icon: <WarningIcon />, danger: true },
    { label: "Residents", to: "/guard/residents", icon: <PeopleIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      PaperProps={{
        sx: {
          width: drawerWidth,
          background:
            "radial-gradient(circle at 0 0,#0ea5e9 0,transparent 45%), #020617",
          color: "#e5e7eb",
          borderRight: "1px solid rgba(148,163,184,0.25)",
        },
      }}
    >
      {/* LOGO */}
      <Toolbar sx={{ minHeight: 80 }}>
        <Box sx={{ textAlign: "center", width: "100%" }}>
          <img
            src={logo}
            alt="Zeecurity"
            style={{
              width: 110,
              height: "auto",
              objectFit: "contain",
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: "#94a3b8",
              letterSpacing: 1.2,
              display: "block",
              mt: 0.5,
            }}
          >
            Guard Panel
          </Typography>
        </Box>
      </Toolbar>

      <Divider />

      {/* MENU */}
      <List sx={{ mt: 1 }}>
        {menuItems.map((item) => {
          const active = isActive(item.to);

          return (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={item.to}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 2,
                  background: active
                    ? "linear-gradient(135deg,#e0f2fe,#bae6fd)"
                    : "transparent",
                  color: active ? "#0f172a" : "#e5e7eb",
                  "& .MuiListItemIcon-root": {
                    color: active
                      ? "#0f172a"
                      : item.danger
                      ? "#f87171"
                      : "#7dd3fc",
                    minWidth: 40,
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* PUSH BOTTOM */}
      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ mx: 2, mb: 1 }} />

      {/* LOGOUT */}
      <Box sx={{ px: 2 }}>
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

      {/* FOOTER TEXT (RESTORED) */}
      <Box sx={{ px: 2, py: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: "rgba(148,163,184,0.7)",
            fontSize: 10,
            display: "block",
            textAlign: "center",
          }}
        >
          Zeecurity • Society Security System
        </Typography>
      </Box>
    </Drawer>
  );
}