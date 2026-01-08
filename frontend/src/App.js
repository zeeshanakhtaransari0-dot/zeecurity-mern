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

  const handleLogin = async () => {
    if (!username.trim()) {
      alert("Enter username");
      return;
    }

    if (role === "resident" && !flat.trim()) {
      alert("Enter flat number");
      return;
    }

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
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0b1d26",
      }}
    >
      {/* ===== Animated Background ===== */}
      <div className="animated-bg" />

      {/* ===== Login Card ===== */}
      <Paper
        elevation={10}
        sx={{
          p: 4,
          width: 360,
          textAlign: "center",
          borderRadius: 3,
          zIndex: 1,
          animation: "fadeSlide 0.8s ease",
        }}
      >
        <img src={logo} alt="logo" width={90} style={{ marginBottom: 12 }} />

        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Login
        </Typography>

        <Typography
          variant="caption"
          sx={{ color: "text.secondary", mb: 2, display: "block" }}
        >
          Smart Security for Modern Societies
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

        <Typography variant="caption" sx={{ mb: 1, display: "block" }}>
          Logging in as <b>{role.toUpperCase()}</b>
        </Typography>

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

        <Button
          fullWidth
          size="large"
          variant="contained"
          onClick={handleLogin}
          sx={{
            py: 1.2,
            fontWeight: 600,
          }}
        >
          Continue
        </Button>
      </Paper>

      {/* ===== Animations ===== */}
      <style>
        {`
        .animated-bg {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: gridMove 22s linear infinite;
          z-index: 0;
        }

        .animated-bg::before,
        .animated-bg::after {
          content: "";
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(0,200,255,0.18), transparent 70%);
          animation: floatGlow 18s ease-in-out infinite;
        }

        .animated-bg::after {
          top: 60%;
          left: 60%;
          animation-delay: 8s;
        }

        @keyframes gridMove {
          from { background-position: 0 0; }
          to { background-position: 120px 120px; }
        }

        @keyframes floatGlow {
          0% { transform: translate(-100px, -100px); }
          50% { transform: translate(100px, 100px); }
          100% { transform: translate(-100px, -100px); }
        }

        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
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
    fetchStats();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Guard Dashboard</Typography>
    </Box>
  );
}

/* ================= APP ROUTES ================= */
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