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
import Complaints from "./Complaints";
import Payments from "./Payments";
import SOS from "./SOS";
import ResidentHome from "./ResidentHome";
import ResidentProfile from "./ResidentProfile";
import ResidentComplaints from "./pages/ResidentComplaints";
import GuardComplaints from "./pages/GuardComplaints"; 

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


// ================= LOGIN PAGE =================
function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("guard");
  const [username, setUsername] = useState("");
  const [flat, setFlat] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username.trim()) {
      alert("Please enter username");
      return;
    }

    if (role === "resident" && !flat.trim()) {
      alert("Please enter flat number");
      return;
    }

    if (role === "resident") {
      localStorage.setItem("residentName", username.trim());
      localStorage.setItem("residentFlat", flat.trim());
      localStorage.setItem("role", "resident");
      navigate("/resident");
    } else {
      localStorage.setItem("role", "guard");
      navigate("/guard");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: "#f3f4f6",
      }}
    >
      <Paper sx={{ p: 4, width: 360, textAlign: "center" }} elevation={6}>
        <img src={logo} alt="Zeecurity Logo" width={110} />
        <Typography variant="h5" sx={{ mt: 2, fontWeight: 700 }}>
          Login
        </Typography>

        <TextField
          fullWidth
          label="Username"
          sx={{ mt: 2 }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          sx={{ mt: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {role === "resident" && (
          <TextField
            fullWidth
            label="Flat Number (e.g. A-101)"
            sx={{ mt: 2 }}
            value={flat}
            onChange={(e) => setFlat(e.target.value)}
          />
        )}

        <Typography variant="body2" sx={{ mt: 2 }}>
          Choose Role
        </Typography>

        <Box sx={{ display: "flex", gap: 1, justifyContent: "center", mt: 1 }}>
          <Button
            variant={role === "guard" ? "contained" : "outlined"}
            onClick={() => setRole("guard")}
          >
            GUARD
          </Button>
          <Button
            variant={role === "resident" ? "contained" : "outlined"}
            onClick={() => setRole("resident")}
          >
            RESIDENT
          </Button>
        </Box>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          onClick={handleLogin}
        >
          CONTINUE
        </Button>
      </Paper>
    </Box>
  );
}

// ================= GUARD HOME =================
function GuardHome() {
  const [stats, setStats] = useState({
    visitorsInside: "--",
    openComplaints: "--",
    activeSOS: "--",
    totalNotices: "--",
  });

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line
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
      console.error("Dashboard error:", err);
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Guard Dashboard
      </Typography>

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
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Quick Actions
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="contained" component={RouterLink} to="/visitors">
          Add Visitor
        </Button>
        <Button variant="outlined" component={RouterLink} to="/complaints">
          New Complaint
        </Button>
        <Button variant="outlined" component={RouterLink} to="/notices">
          Post Notice
        </Button>
        <Button variant="outlined" color="error" component={RouterLink} to="/sos">
          View SOS
        </Button>
      </Box>
    </Box>
  );
}

// ================= MAIN ROUTES =================
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* GUARD */}
        <Route
          path="/guard"
          element={
            <div style={{ display: "flex" }}>
              <Sidebar />
              <div style={{ marginLeft: 220, flex: 1 }}>
                <GuardHome />
              </div>
            </div>
          }
        />

        {["/visitors", "/complaints", "/payments", "/notices", "/sos"].map(
          (path, i) => (
            <Route
              key={i}
              path={path}
              element={
                <div style={{ display: "flex" }}>
                  <Sidebar />
                  <div style={{ marginLeft: 220, flex: 1 }}>
                    {path === "/visitors" && <Visitors />}
                   {path === "/complaints" && <GuardComplaints />}
                    {path === "/payments" && <Payments />}
                    {path === "/notices" && <Notices />}
                    {path === "/sos" && <SOS />}
                  </div>
                </div>
              }
            />
          )
        )}

        {/* RESIDENT */}
        <Route
          path="/resident"
          element={
            <div style={{ display: "flex" }}>
              <ResidentSidebar />
              <div style={{ marginLeft: 220, flex: 1 }}>
                <ResidentHome />
              </div>
            </div>
          }
        />

        {["notices", "complaints", "payments", "sos", "profile"].map(
          (page) => (
            <Route
              key={page}
              path={`/resident/${page}`}
              element={
                <div style={{ display: "flex" }}>
                  <ResidentSidebar />
                  <div style={{ marginLeft: 220, flex: 1 }}>
                    {page === "notices" && <Notices />}
                  {page === "complaints" && <ResidentComplaints />}
                    {page === "payments" && <Payments />}
                    {page === "sos" && <SOS />}
                    {page === "profile" && <ResidentProfile />}
                  </div>
                </div>
              }
            />
          )
        )}
      </Routes>
    </Router>
  );
}