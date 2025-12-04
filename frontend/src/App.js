// src/App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
  useNavigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";              // Guard Sidebar
import ResidentSidebar from "./components/ResidentSidebar"; // Resident Sidebar

import Visitors from "./Visitors";
import Notices from "./Notices";
import Complaints from "./Complaints";
import Payments from "./Payments";
import SOS from "./SOS";
import Dashboard from "./Dashboard";

import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  TextField,
  Paper,
} from "@mui/material";

import logo from "./assets/zeecurity_logo.png";
import ResidentHome from "./ResidentHome";

// ========== LOGIN PAGE ==========
function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("guard");

  const handleLogin = () => {
    if (role === "guard") navigate("/guard");
    else navigate("/resident");
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: "#f3f4f6" }}>
      <Paper sx={{ p: 4, width: 360, textAlign: "center" }} elevation={6}>
        <img src={logo} alt="Zeecurity Logo" width={110} />
        <Typography variant="h5" sx={{ mt: 2, fontWeight: 700 }}>Login</Typography>

        <TextField fullWidth label="Username" sx={{ mt: 2 }} />
        <TextField fullWidth label="Password" type="password" sx={{ mt: 2 }} />

        <Typography variant="body2" sx={{ mt: 2 }}>Choose Role</Typography>

        <Box sx={{ display: "flex", gap: 1, justifyContent: "center", mt: 1 }}>
          <Button variant={role === "guard" ? "contained" : "outlined"} onClick={() => setRole("guard")}>Guard</Button>
          <Button variant={role === "resident" ? "contained" : "outlined"} onClick={() => setRole("resident")}>Resident</Button>
        </Box>

        <Button fullWidth variant="contained" sx={{ mt: 3 }} onClick={handleLogin}>
          Continue
        </Button>
      </Paper>
    </Box>
  );
}

// ========== GUARD HOME PAGE (your full existing UI) ==========
function Home() {
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

  const [stats, setStats] = useState({
    visitorsInside: "--",
    openComplaints: "--",
    activeSOS: "--",
    totalNotices: "--",
  });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const [vRes, cRes, sRes, nRes] = await Promise.all([
        axios.get(`${API_BASE}/visitors`),
        axios.get(`${API_BASE}/complaints`),
        axios.get(`${API_BASE}/sos`),
        axios.get(`${API_BASE}/notices`),
      ]);

      setStats({
        visitorsInside: vRes.data.filter((v) => !v.outTime).length,
        openComplaints: cRes.data.filter((c) => c.status !== "Resolved").length,
        activeSOS: sRes.data.filter((s) => s.status !== "Resolved").length,
        totalNotices: nRes.data.length,
      });
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Guard Home</Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: "Visitors Inside", value: stats.visitorsInside },
          { label: "Open Complaints", value: stats.openComplaints },
          { label: "Active SOS", value: stats.activeSOS },
          { label: "Total Notices", value: stats.totalNotices },
        ].map((item, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Card>
              <CardContent>
                <Typography variant="caption">{item.label}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{item.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Quick Actions</Typography>
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="contained" component={RouterLink} to="/visitors">Add Visitor</Button>
        <Button variant="outlined" component={RouterLink} to="/complaints">New Complaint</Button>
        <Button variant="outlined" component={RouterLink} to="/notices">Post Notice</Button>
        <Button variant="outlined" color="error" component={RouterLink} to="/sos">View SOS Alerts</Button>
      </Box>
    </Box>
  );
}

// ========== APP ROUTES ==========
export default function App() {
  return (
    <Router>
      <Routes>

        {/* LOGIN FIRST */}
        <Route path="/" element={<Login />} />

        {/* GUARD PANEL */}
        <Route
          path="/guard"
          element={
            <div style={{ display: "flex" }}>
              <Sidebar />
              <div style={{ marginLeft: 220, flex: 1, background: "#fafafa" }}>
                <Home />
              </div>
            </div>
          }
        />

        {/* INTERNAL GUARD MODULES */}
        {["/visitors", "/complaints", "/payments", "/notices", "/sos"].map((path, i) => (
          <Route
            key={i}
            path={path}
            element={
              <div style={{ display: "flex" }}>
                <Sidebar />
                <div style={{ marginLeft: 220, flex: 1, background: "#fafafa" }}>
                  {path === "/visitors" && <Visitors />}
                  {path === "/complaints" && <Complaints />}
                  {path === "/payments" && <Payments />}
                  {path === "/notices" && <Notices />}
                  {path === "/sos" && <SOS />}
                </div>
              </div>
            }
          />
        ))}

        {/* RESIDENT PANEL */}
        <Route
          path="/resident"
          element={
            <div style={{ display: "flex" }}>
              <ResidentSidebar />
              <div style={{ marginLeft: 220, flex: 1, background: "#ffffff" }}>
                <ResidentHome />
              </div>
            </div>
          }
        />

        {/* RESIDENT SUBPAGES */}
        <Route
          path="/resident/notices"
          element={
            <div style={{ display: "flex" }}>
              <ResidentSidebar />
              <div style={{ marginLeft: 220, flex: 1, background: "#ffffff" }}>
                <Notices />
              </div>
            </div>
          }
        />
        <Route
          path="/resident/complaints"
          element={
            <div style={{ display: "flex" }}>
              <ResidentSidebar />
              <div style={{ marginLeft: 220, flex: 1, background: "#ffffff" }}>
                <Complaints />
              </div>
            </div>
          }
        />
        <Route
          path="/resident/payments"
          element={
            <div style={{ display: "flex" }}>
              <ResidentSidebar />
              <div style={{ marginLeft: 220, flex: 1, background: "#ffffff" }}>
                <Payments />
              </div>
            </div>
          }
        />
        <Route
          path="/resident/sos"
          element={
            <div style={{ display: "flex" }}>
              <ResidentSidebar />
              <div style={{ marginLeft: 220, flex: 1, background: "#ffffff" }}>
                <SOS />
              </div>
            </div>
          }
        />

      </Routes>
    </Router>
  );
}
