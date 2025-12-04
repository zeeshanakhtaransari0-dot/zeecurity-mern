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
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ReportIcon from "@mui/icons-material/Report";
import PaymentsIcon from "@mui/icons-material/Payments";
import WarningIcon from "@mui/icons-material/Warning";

// ✅ import your logo file (only once!)
import logo from "../assets/zeecurity_logo.png";

const drawerWidth = 220;

export default function Sidebar({ role }) {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (to) => {
    if (to === "/") return path === "/";
    return path.startsWith(to);
  };

   const guardMenuItems = [
    { label: "Home", to: "/", icon: <HomeIcon /> },
    { label: "Dashboard", to: "/dashboard", icon: <DashboardIcon /> },
    { label: "Visitors", to: "/visitors", icon: <PeopleIcon /> },
    { label: "Notices", to: "/notices", icon: <NotificationsIcon /> },
    { label: "Complaints", to: "/complaints", icon: <ReportIcon /> },
    { label: "Payments", to: "/payments", icon: <PaymentsIcon /> },
    { label: "SOS", to: "/sos", icon: <WarningIcon />, danger: true },
  ];

  const residentMenuItems = [
    { label: "Home", to: "/", icon: <HomeIcon /> },
    { label: "Notices", to: "/notices", icon: <NotificationsIcon /> },
    { label: "Complaints", to: "/complaints", icon: <ReportIcon /> },
    { label: "Payments", to: "/payments", icon: <PaymentsIcon /> },
    { label: "SOS", to: "/sos", icon: <WarningIcon />, danger: true },
  ];

  const menuItems = role === "resident" ? residentMenuItems : guardMenuItems;


  return (
    <Drawer
      variant="permanent"
      anchor="left"
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
      {/* ---------- LOGO AREA ---------- */}
      <Toolbar sx={{ minHeight: 80, px: 2 }}>
        <Box sx={{ textAlign: "center", width: "100%" }}>
          <img
            src={logo}
            alt="Zeecurity logo"
            style={{ width: 120, objectFit: "contain" }}
          />
          <Typography
  variant="caption"
  sx={{
    color: "rgba(148,163,184,0.9)",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontSize: 11,
    mt: 0.5,
    display: "block",
  }}
>
  {role === "resident" ? "Resident Panel" : "Guard Panel"}
</Typography>

        </Box>
      </Toolbar>

      <Divider sx={{ borderColor: "rgba(51,65,85,0.8)" }} />

      {/* ---------- MENU ---------- */}
      <List sx={{ mt: 1 }}>
        {menuItems.map((item) => {
          const active = isActive(item.to);
          const isDanger = item.danger;

          const activeBg = isDanger
            ? "linear-gradient(135deg,#fee2e2,#fecaca)"
            : "linear-gradient(135deg,#e0f2fe,#bae6fd)";
          const inactiveIconColor = isDanger ? "#f97373" : "#7dd3fc";

          return (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={item.to}
                selected={active}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 2,
                  color: active ? "#0f172a" : "#e5e7eb",
                  background: active ? activeBg : "transparent",
                  transition: "all 0.2s ease",
                  "& .MuiListItemIcon-root": {
                    color: active ? "#0f172a" : inactiveIconColor,
                    minWidth: 40,
                  },
                  "&:hover": {
                    background: active
                      ? activeBg
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

      <Box sx={{ flexGrow: 1 }} />

      {/* footer small text */}
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
