// src/App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link as RouterLink,
} from "react-router-dom";

import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  TextField,
  Paper,
} from "@mui/material";

import Sidebar from "./components/Sidebar";
import ResidentSidebar from "./components/ResidentSidebar";

import Visitors from "./Visitors";
import Notices from "./Notices";
import Payments from "./Payments";
import SOS from "./SOS";

import ResidentHome from "./ResidentHome";
import ResidentProfile from "./ResidentProfile";
import ResidentComplaints from "./pages/ResidentComplaints";
import GuardComplaints from "./pages/GuardComplaints";
import ResidentsPage from "./ResidentsPage";
import Payments from "./resident/Payments";
import SOS from "./resident/SOS";
import Notices from "./resident/Notices";

import logo from "./assets/zeecurity_logo.png";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://zeecurity-backend.onrender.com/api";

/* ================= LOGIN ================= */
function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("guard");
  const [username, setUsername] = useState("");
  const [flat, setFlat] = useState("");

  const handleLogin = async () => {
    if (!username.trim()) {
      alert("Enter username");
      return;
    }

    if (role === "resident" && !flat.trim()) {
      alert("Enter flat number");
      return;
    }

    // ===== RESIDENT LOGIN =====
    if (role === "resident") {
      try {
        const res = await fetch(`${API_BASE}/residents`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: username.trim(),
            flatNumber: flat.trim(),
          }),
        });

        if (!res.ok) throw new Error("Resident save failed");

        const data = await res.json();

        // 🔥 CRITICAL FIX
        localStorage.setItem("residentId", data._id);
        localStorage.setItem("residentName", data.name);
        localStorage.setItem("residentFlat", data.flatNumber);
        localStorage.setItem("role", "resident");

        navigate("/resident");
        return;
      } catch (err) {
        console.error("Resident login error:", err);
        alert("Resident login failed");
        return;
      }
    }

    // ===== GUARD LOGIN =====
    localStorage.setItem("role", "guard");
    navigate("/guard");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0b1d26",
      }}
    >
      <Paper sx={{ p: 4, width: 360, textAlign: "center" }} elevation={6}>
        <img src={logo} alt="Zeecurity" width={90} />

        <Typography variant="h5" sx={{ mt: 2, fontWeight: 700 }}>
          Login
        </Typography>

        <Typography variant="caption" sx={{ display: "block", mb: 2 }}>
          Logging in as <b>{role.toUpperCase()}</b>
        </Typography>

        <TextField
          fullWidth
          label="Username"
          sx={{ mb: 2 }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {role === "resident" && (
          <TextField
            fullWidth
            label="Flat Number"
            sx={{ mb: 2 }}
            value={flat}
            onChange={(e) => setFlat(e.target.value)}
          />
        )}

        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Button
            fullWidth
            variant={role === "guard" ? "contained" : "outlined"}
            onClick={() => setRole("guard")}
          >
            Guard
          </Button>
          <Button
            fullWidth
            variant={role === "resident" ? "contained" : "outlined"}
            onClick={() => setRole("resident")}
          >
            Resident
          </Button>
        </Box>

        <Button fullWidth variant="contained" onClick={handleLogin}>
          Continue
        </Button>
      </Paper>
    </Box>
  );
}

/* ================= GUARD HOME ================= */
function GuardHome() {
  const [stats, setStats] = useState({
    visitors: 0,
    complaints: 0,
    sos: 0,
    notices: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const [v, c, s, n] = await Promise.all([
        axios.get(`${API_BASE}/visitors`),
        axios.get(`${API_BASE}/complaints`),
        axios.get(`${API_BASE}/sos`),
        axios.get(`${API_BASE}/notices`),
      ]);

      setStats({
        visitors: v.data.length,
        complaints: c.data.length,
        sos: s.data.length,
        notices: n.data.length,
      });
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Guard Dashboard
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {Object.entries(stats).map(([k, v]) => (
          <Grid item xs={6} md={3} key={k}>
            <Card>
              <CardContent>
                <Typography variant="caption">{k}</Typography>
                <Typography variant="h5">{v}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Button component={RouterLink} to="/guard/residents" variant="contained">
        View Residents
      </Button>
    </Box>
  );
}

/* ================= APP ROUTES ================= */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* GUARD */}
        <Route
          path="/guard"
          element={
            <Layout sidebar={<Sidebar />}>
              <GuardHome />
            </Layout>
          }
        />

        <Route
          path="/guard/residents"
          element={
            <Layout sidebar={<Sidebar />}>
              <ResidentsPage />
            </Layout>
          }
        />

        <Route
          path="/visitors"
          element={
            <Layout sidebar={<Sidebar />}>
              <Visitors />
            </Layout>
          }
        />

        <Route
          path="/complaints"
          element={
            <Layout sidebar={<Sidebar />}>
              <GuardComplaints />
            </Layout>
          }
        />

        <Route
          path="/notices"
          element={
            <Layout sidebar={<Sidebar />}>
              <Notices />
            </Layout>
          }
        />

        <Route
          path="/payments"
          element={
            <Layout sidebar={<Sidebar />}>
              <Payments />
            </Layout>
          }
        />

        <Route
          path="/sos"
          element={
            <Layout sidebar={<Sidebar />}>
              <SOS />
            </Layout>
          }
        />

        {/* RESIDENT */}
        <Route
          path="/resident"
          element={
            <Layout sidebar={<ResidentSidebar />}>
              <ResidentHome />
            </Layout>
          }
        />

        <Route
          path="/resident/complaints"
          element={
            <Layout sidebar={<ResidentSidebar />}>
              <ResidentComplaints />
            </Layout>
          }
        />

        <Route
          path="/resident/profile"
          element={
            <Layout sidebar={<ResidentSidebar />}>
              <ResidentProfile />
            </Layout>
          }
        />
        <Route path="/resident/payments" element={<Payments />} />
<Route path="/resident/sos" element={<SOS />} />
<Route path="/resident/notices" element={<Notices />} />
      </Routes>
    </Router>
  );
}

/* ================= LAYOUT ================= */
function Layout({ sidebar, children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {sidebar}
      <div style={{ flex: 1, padding: 24 }}>{children}</div>
    </div>
  );
}