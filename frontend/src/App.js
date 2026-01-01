// src/App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
  useNavigate,
} from "react-router-dom";

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
import ResidentsPage from "./ResidentsPage"; // ✅ IMPORTANT

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

  const handleLogin = () => {
    if (!username.trim()) return alert("Enter username");
    if (role === "resident" && !flat.trim()) return alert("Enter flat");

    if (role === "resident") {
      localStorage.setItem("residentName", username);
      localStorage.setItem("residentFlat", flat);
      localStorage.setItem("role", "resident");
      navigate("/resident");
    } else {
      localStorage.setItem("role", "guard");
      navigate("/guard");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Paper sx={{ p: 4, width: 360, textAlign: "center" }}>
        <img src={logo} alt="logo" width={100} />
        <Typography variant="h5" sx={{ mt: 2 }}>Login</Typography>

        <TextField fullWidth label="Username" sx={{ mt: 2 }} value={username}
          onChange={(e) => setUsername(e.target.value)} />

        {role === "resident" && (
          <TextField fullWidth label="Flat Number" sx={{ mt: 2 }}
            value={flat} onChange={(e) => setFlat(e.target.value)} />
        )}

        <Box sx={{ mt: 2, display: "flex", gap: 1, justifyContent: "center" }}>
          <Button variant={role === "guard" ? "contained" : "outlined"} onClick={() => setRole("guard")}>
            Guard
          </Button>
          <Button variant={role === "resident" ? "contained" : "outlined"} onClick={() => setRole("resident")}>
            Resident
          </Button>
        </Box>

        <Button fullWidth sx={{ mt: 3 }} variant="contained" onClick={handleLogin}>
          Continue
        </Button>
      </Paper>
    </Box>
  );
}

/* ================= GUARD HOME ================= */
function GuardHome() {
  const [stats, setStats] = useState({
    visitors: "--",
    complaints: "--",
    sos: "--",
    notices: "--",
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
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
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Guard Dashboard</Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {Object.entries(stats).map(([k, v]) => (
          <Grid item xs={6} md={3} key={k}>
            <Card><CardContent>
              <Typography variant="caption">{k}</Typography>
              <Typography variant="h5">{v}</Typography>
            </CardContent></Card>
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

       {/* ===== GUARD ===== */}

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
  path="/payments"
  element={
    <Layout sidebar={<Sidebar />}>
      <Payments />
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
  path="/sos"
  element={
    <Layout sidebar={<Sidebar />}>
      <SOS />
    </Layout>
  }
/>
        {/* ===== RESIDENT ===== */}
        <Route path="/resident" element={
          <Layout sidebar={<ResidentSidebar />}>
            <ResidentHome />
          </Layout>
        } />

        <Route path="/resident/complaints" element={<Layout sidebar={<ResidentSidebar />}><ResidentComplaints /></Layout>} />
        <Route path="/resident/notices" element={<Layout sidebar={<ResidentSidebar />}><Notices /></Layout>} />
        <Route path="/resident/payments" element={<Layout sidebar={<ResidentSidebar />}><Payments /></Layout>} />
        <Route path="/resident/sos" element={<Layout sidebar={<ResidentSidebar />}><SOS /></Layout>} />
        <Route path="/resident/profile" element={<Layout sidebar={<ResidentSidebar />}><ResidentProfile /></Layout>} />
      </Routes>
    </Router>
  );
}

/* ================= LAYOUT HELPER ================= */
function Layout({ sidebar, children }) {
  return (
    <div style={{ display: "flex" }}>
      {sidebar}
      <div style={{ marginLeft: 220, flex: 1 }}>{children}</div>
    </div>
  );
}