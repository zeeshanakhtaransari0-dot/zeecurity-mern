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
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

import NotificationsIcon from "@mui/icons-material/Notifications";
import ReportIcon from "@mui/icons-material/Report";
import PaymentsIcon from "@mui/icons-material/Payments";
import WarningIcon from "@mui/icons-material/Warning";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import logo from "../assets/zeecurity_logo.png";

const drawerWidth = 220;

export default function ResidentSidebar() {
  const location = useLocation();
  const path = location.pathname;

  const menu = [
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
          background: "#ffffff",
          borderRight: "1px solid #e5e7eb",
          color: "#111827",
        },
      }}
    >
      <Toolbar sx={{ minHeight: 80, px: 2 }}>
        <Box sx={{ textAlign: "center", width: "100%" }}>
          <img src={logo} alt="logo" style={{ width: 110 }} />
          <Typography variant="caption" sx={{ color: "#6b7280", display: "block", mt: 0.5 }}>
            Resident Panel
          </Typography>
        </Box>
      </Toolbar>

      <List>
        {menu.map((item) => {
          const active = path === item.to;
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
                  background: active ? "#e0f2fe" : "transparent",
                  "& .MuiListItemIcon-root": {
                    color: active ? "#0284c7" : item.danger ? "#dc2626" : "#6b7280",
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    sx: { fontWeight: active ? 700 : 500 },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}
