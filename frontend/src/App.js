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
import ResidentsPage from "./ResidentsPage";

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
  const [loading, setLoading] = useState(false);

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

        localStorage.setItem("residentName", data.name);
        localStorage.setItem("residentFlat", data.flatNumber);
        localStorage.setItem("role", "resident");

        navigate("/resident");
      } catch (err) {
        alert("Resident login failed");
      }
      return;
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
      background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* ===== Animated Background Circles ===== */}
    <Box className="bg-circle circle1" />
    <Box className="bg-circle circle2" />
    <Box className="bg-circle circle3" />

    {/* ===== Login Card ===== */}
    <Paper
      elevation={12}
      sx={{
        p: 4,
        width: 380,
        textAlign: "center",
        borderRadius: 4,
        position: "relative",
        zIndex: 2,
        animation: "fadeSlide 0.9s ease",
      }}
    >
      {/* ===== Logo ===== */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 1,
        }}
      >
        <img
          src={logo}
          alt="Zeecurity"
          width={90}
          className="logo-animate"
        />
      </Box>

      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Login
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          mb: 2,
          transition: "0.3s",
        }}
      >
        Smart Security for Modern Societies
      </Typography>

      <Typography
        variant="caption"
        sx={{
          display: "block",
          mb: 2,
          fontWeight: 600,
          color: role === "guard" ? "#1e88e5" : "#43a047",
          animation: "roleFade 0.4s ease",
        }}
      >
        Logging in as <b>{role.toUpperCase()}</b>
      </Typography>

      {/* ===== Inputs ===== */}
      <TextField
        fullWidth
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ mb: 2 }}
      />

      {role === "resident" && (
        <TextField
          fullWidth
          label="Flat Number"
          value={flat}
          onChange={(e) => setFlat(e.target.value)}
          sx={{ mb: 2 }}
        />
      )}

      {/* ===== Role Buttons ===== */}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Button
          fullWidth
          variant={role === "guard" ? "contained" : "outlined"}
          onClick={() => setRole("guard")}
          sx={{
            backgroundColor: role === "guard" ? "#1e88e5" : "transparent",
          }}
        >
          Guard
        </Button>

        <Button
          fullWidth
          variant={role === "resident" ? "contained" : "outlined"}
          onClick={() => setRole("resident")}
          sx={{
            backgroundColor: role === "resident" ? "#43a047" : "transparent",
          }}
        >
          Resident
        </Button>
      </Box>

      {/* ===== Continue Button ===== */}
      <Button
        fullWidth
        size="large"
        variant="contained"
        onClick={handleLogin}
        sx={{
          py: 1.3,
          fontWeight: 600,
          background: "linear-gradient(90deg, #1e88e5, #42a5f5)",
          transition: "0.3s",
          "&:hover": {
            transform: "scale(1.04)",
            background: "linear-gradient(90deg, #1565c0, #1e88e5)",
          },
        }}
      >
        Continue
      </Button>
    </Paper>

    {/* ===== Animations CSS ===== */}
    <style>
      {`
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes roleFade {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .logo-animate {
          animation: logoPulse 2.5s infinite ease-in-out;
          filter: drop-shadow(0 0 10px rgba(0, 200, 255, 0.4));
        }

        @keyframes logoPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }

        .bg-circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.35;
          animation: float 10s infinite alternate ease-in-out;
        }

        .circle1 {
          width: 260px;
          height: 260px;
          background: #42a5f5;
          top: 10%;
          left: 10%;
        }

        .circle2 {
          width: 320px;
          height: 320px;
          background: #26c6da;
          bottom: 10%;
          right: 15%;
        }

        .circle3 {
          width: 200px;
          height: 200px;
          background: #66bb6a;
          top: 50%;
          right: 40%;
        }

        @keyframes float {
          from {
            transform: translateY(0px);
          }
          to {
            transform: translateY(-40px);
          }
        }
      `}
    </style>
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
    Promise.all([
      axios.get(`${API_BASE}/visitors`),
      axios.get(`${API_BASE}/complaints`),
      axios.get(`${API_BASE}/sos`),
      axios.get(`${API_BASE}/notices`),
    ]).then(([v, c, s, n]) =>
      setStats({
        visitors: v.data.length,
        complaints: c.data.length,
        sos: s.data.length,
        notices: n.data.length,
      })
    );
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Guard Dashboard</Typography>
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

/* ================= APP ================= */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

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
          path="/resident"
          element={
            <Layout sidebar={<ResidentSidebar />}>
              <ResidentHome />
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

        <Route
          path="/resident/complaints"
          element={
            <Layout sidebar={<ResidentSidebar />}>
              <ResidentComplaints />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

/* ================= LAYOUT ================= */
function Layout({ sidebar, children }) {
  return (
    <div style={{ display: "flex" }}>
      {sidebar}
      <div style={{ marginLeft: 220, flex: 1 }}>{children}</div>
    </div>
  );
}