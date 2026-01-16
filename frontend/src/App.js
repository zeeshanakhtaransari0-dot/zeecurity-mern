// src/App.js
import React, { useState } from "react";
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

  TextField,
  Paper,
} from "@mui/material";

import logo from "./assets/zeecurity_logo.png";

const API_BASE = "https://zeecurity-backend.onrender.com/api";

/* ================= LOGIN ================= */
function Login() {
  
  const navigate = useNavigate();
  const [role, setRole] = useState("Guard");
  const [username, setUsername] = useState("");
  const [flat, setFlat] = useState("");
  

  const handleLogin = async () => {
    if (!username.trim()) return alert("Enter username");
    if (role === "resident" && !flat.trim())
      return alert("Enter flat number");

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
        console.error(err);
        alert("Resident login failed");
      }
      return;
    }

    // ===== GUARD LOGIN =====
   // ===== GUARD LOGIN =====
localStorage.setItem("role", "guard");
localStorage.setItem("guardName", username.trim()); // ✅ save guard name
navigate("/guard");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      }}
    >
      <Paper
        elevation={12}
        sx={{
          p: 4,
          width: { xs: "90%", sm: 360 },
          textAlign: "center",
          borderRadius: 3,
          animation: "fadeSlide 0.7s ease",
        }}
      >
        <img src={logo} alt="Zeecurity" width={80} />

        <Typography
          variant="h5"
          sx={{ mt: 2, mb: 2, fontWeight: 600 }}
        >
          Login
        </Typography>
        <Typography
  sx={{
    fontSize: "14px",
    color: "#2e7d32", // green
    letterSpacing: "0.6px",
    mb: 0.5,
  }}
>
  Smart Security for Modern Societies
</Typography>

<Typography
  sx={{
    mb: 2,
    fontSize: "14px",
    color: "#546e7a",
    letterSpacing: "0.5px",
  }}
>
  Logging in as{" "}
  <span style={{ fontWeight: 600, color: "#000" }}>
    {role.toUpperCase()}
  </span>
</Typography>

       <TextField
  fullWidth
  label="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  sx={{ mb: 1 }}
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
  onClick={handleLogin}
  sx={{
    py: 1.2,
    fontWeight: 600,
    background: "#ffffff",          // white background
    border: "2px solid #1e88e5",     // ✅ border restored
    "&:hover": {
      transform: "scale(1.03)",
    },
  }}
>
  Continue
</Button>
      </Paper>

      <style>
        {`
          @keyframes fadeSlide {
            from {
              opacity: 0;
              transform: translateY(25px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Box>
  );
}

/* ================= GUARD HOME ================= */
function GuardHome() {
  const [stats, setStats] = React.useState({
    visitors: "--",
    complaints: "--",
    sos: "--",
    notices: "--",
  });

  React.useEffect(() => {
  fetchComplaints();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const guardName = "admin"; // or fetch later
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Box sx={{ p: 3 }}>
  {/* Heading */}
  <Box sx={{ mb: 2 }}>
   <Typography
  variant="h4"
  sx={{
    fontWeight: 500,   // bold heading
    color: "#000000",  // pure black
    mb: 1,
  }}
>
  Guard Dashboard
</Typography>
  </Box>
      {/* ===== INSTRUCTIONS (UNCHANGED) ===== */}
      <Box
        sx={{
          mb: 3,
          p: 2,
          borderRadius: 2,
          background: "#e3f2fd",
          borderLeft: "6px solid #1e88e5",
        }}
      >
        <Typography sx={{ fontWeight: 600, color: "#0d47a1" }}>
          Guard Instructions
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          Please regularly monitor visitor entries, complaints, SOS alerts
          and notices to ensure society safety.
        </Typography>
      </Box>

      {/* ===== STATS CARDS (UNCHANGED STYLE) ===== */}
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="caption">VISITORS</Typography>
              <Typography variant="h4" color="#1e88e5">
                {stats.visitors}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="caption">COMPLAINTS</Typography>
              <Typography variant="h4" color="#fb8c00">
                {stats.complaints}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="caption">SOS</Typography>
              <Typography variant="h4" color="#e53935">
                {stats.sos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="caption">NOTICES</Typography>
              <Typography variant="h4" color="#2e7d32">
                {stats.notices}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ===== GREETING CARD (UNCHANGED) ===== */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 2,
          background: "#e3f2fd",
          borderLeft: "6px solid #1e88e5",
        }}
      >
        <Typography sx={{ fontWeight: 600, color: "#0d47a1" }}>
          Good Morning 👋
        </Typography>
        <Typography variant="body2">
          Hello {guardName}, hope you're having a great shift.
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Current time: {time}
        </Typography>
      </Box>

      {/* ===== BUTTON ===== */}
      <Box sx={{ mt: 3 }}>
        <Button
          component={RouterLink}
          to="/guard/residents"
          variant="contained"
        >
          VIEW RESIDENTS
        </Button>
      </Box>
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
          path="/resident/notices"
          element={
            <Layout sidebar={<ResidentSidebar />}>
              <Notices />
            </Layout>
          }
        />

        <Route
          path="/resident/payments"
          element={
            <Layout sidebar={<ResidentSidebar />}>
              <Payments />
            </Layout>
          }
        />

        <Route
          path="/resident/sos"
          element={
            <Layout sidebar={<ResidentSidebar />}>
              <SOS />
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