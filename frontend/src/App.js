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
    if (!username.trim()) return alert("Enter username");
    if (role === "resident" && !flat.trim())
      return alert("Enter flat number");

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

        const data = await res.json();
        if (!res.ok) throw new Error("Resident save failed");

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
    <Box sx={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* ===== RADAR BACKGROUND ===== */}
      <div className="radar-bg">
        <div className="radar-circle"></div>
        <div className="radar-sweep"></div>
      </div>

      {/* ===== LOGIN CARD ===== */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={10}
          sx={{
            p: 4,
            width: 360,
            textAlign: "center",
            borderRadius: 3,
            animation: "fadeSlide 0.8s ease",
          }}
        >
          <img src={logo} alt="Zeecurity" width={90} />

          <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
            Login
          </Typography>

          <Typography
            variant="body2"
            sx={{ mb: 2, color: "gray", fontSize: 13 }}
          >
            Smart Security for Modern Societies
            <br />
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

          <Button
            fullWidth
            size="large"
            variant="contained"
            onClick={handleLogin}
          >
            Continue
          </Button>
        </Paper>
      </Box>

      {/* ===== CSS ===== */}
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .radar-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, #0f2027, #000);
          overflow: hidden;
        }

        .radar-circle {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          border: 1px solid rgba(0,255,200,0.2);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .radar-sweep {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: conic-gradient(
            from 0deg,
            rgba(0,255,200,0.35),
            transparent 60%
          );
          animation: radarRotate 4s linear infinite;
        }

        @keyframes radarRotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </Box>
  );
}

/* ================= GUARD HOME ================= */
function GuardHome() {
  return <Typography sx={{ p: 3 }}>Guard Dashboard</Typography>;
}

/* ================= APP ROUTES ================= */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/guard" element={<Layout sidebar={<Sidebar />}><GuardHome /></Layout>} />
        <Route path="/guard/residents" element={<Layout sidebar={<Sidebar />}><ResidentsPage /></Layout>} />
        <Route path="/visitors" element={<Layout sidebar={<Sidebar />}><Visitors /></Layout>} />
        <Route path="/complaints" element={<Layout sidebar={<Sidebar />}><GuardComplaints /></Layout>} />
        <Route path="/payments" element={<Layout sidebar={<Sidebar />}><Payments /></Layout>} />
        <Route path="/notices" element={<Layout sidebar={<Sidebar />}><Notices /></Layout>} />
        <Route path="/sos" element={<Layout sidebar={<Sidebar />}><SOS /></Layout>} />
        <Route path="/resident" element={<Layout sidebar={<ResidentSidebar />}><ResidentHome /></Layout>} />
        <Route path="/resident/complaints" element={<Layout sidebar={<ResidentSidebar />}><ResidentComplaints /></Layout>} />
        <Route path="/resident/notices" element={<Layout sidebar={<ResidentSidebar />}><Notices /></Layout>} />
        <Route path="/resident/payments" element={<Layout sidebar={<ResidentSidebar />}><Payments /></Layout>} />
        <Route path="/resident/sos" element={<Layout sidebar={<ResidentSidebar />}><SOS /></Layout>} />
        <Route path="/resident/profile" element={<Layout sidebar={<ResidentSidebar />}><ResidentProfile /></Layout>} />
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