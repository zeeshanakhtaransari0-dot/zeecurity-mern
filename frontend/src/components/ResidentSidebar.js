import React from "react";
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
  Button,
} from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ReportIcon from "@mui/icons-material/Report";
import PaymentsIcon from "@mui/icons-material/Payments";
import WarningIcon from "@mui/icons-material/Warning";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

import logo from "../assets/zeecurity_logo.png";

const drawerWidth = 220;

export default function ResidentSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const isActive = (to) => {
    if (to === "/resident") return path === "/resident";
    return path.startsWith(to);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const menu = [
    { label: "Dashboard", to: "/resident", icon: <DashboardIcon /> },
    { label: "Notices", to: "/resident/notices", icon: <NotificationsIcon /> },
    { label: "Complaints", to: "/resident/complaints", icon: <ReportIcon /> },
    { label: "Payments", to: "/resident/payments", icon: <PaymentsIcon /> },
    { label: "SOS", to: "/resident/sos", icon: <WarningIcon />, danger: true },
    { label: "Profile", to: "/resident/profile", icon: <AccountCircleIcon /> },
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
      <Toolbar sx={{ minHeight: 80, px: 2 }}>
        <Box sx={{ textAlign: "center", width: "100%" }}>
          <img src={logo} alt="logo" style={{ width: 120 }} />
          <Typography
            variant="caption"
            sx={{
              color: "rgba(148,163,184,0.9)",
              textTransform: "uppercase",
              letterSpacing: 1.5,
              fontSize: 14,
              mt: 0.5,
              display: "block",
            }}
          >
            Resident Panel
          </Typography>
        </Box>
      </Toolbar>

      {/* MENU */}
      <List sx={{ mt: 1 }}>
        {menu.map((item) => {
          const active = isActive(item.to);
          const isDanger = item.danger;

          return (
            <ListItem disablePadding key={item.label}>
              <ListItemButton
                component={RouterLink}
                to={item.to}
                selected={active}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 2,
                  color: active ? "#0f172a" : "#e5e7eb",
                  background: active
                    ? "linear-gradient(135deg,#e0f2fe,#bae6fd)"
                    : "transparent",
                  transition: "all 0.2s ease",
                  "& .MuiListItemIcon-root": {
                    color: active
                      ? "#0f172a"
                      : isDanger
                      ? "#f97373"
                      : "#7dd3fc",
                    minWidth: 40,
                  },
                  "&:hover": {
                    background: active
                      ? "linear-gradient(135deg,#e0f2fe,#bae6fd)"
                      : "rgba(148,163,184,0.15)",
                    transform: "translateX(3px)",
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    sx: { fontSize: 15, fontWeight: active ? 700 : 500 },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* PUSH BOTTOM */}
      <Box sx={{ flexGrow: 1 }} />

      {/* LOGOUT BUTTON */}
      <Box sx={{ px: 2, pb: 1 }}>
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

      {/* FOOTER TEXT (UNCHANGED) */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Typography
          variant="caption"
          sx={{ color: "rgba(148,163,184,0.7)", fontSize: 10 }}
        >
          Zeecurity • Society Security System
        </Typography>
      </Box>
    </Drawer>
  );
}