// src/App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
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
import AdminSidebar from "./components/AdminSidebar";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLogin from "./admin/AdminLogin";
import AdminResidents from "./admin/AdminResidents";
import AdminComplaints from "./admin/AdminComplaints";
import AdminNotices from "./admin/AdminNotices";
import PreApprovedVisitor from "./pages/PreApprovedVisitor";
import GuardPreApproved from "./pages/GuardPreApproved";
import ResidentPreApproved from "./pages/ResidentPreApproved";


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

  const [role, setRole] = useState("guard");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // ✅ REQUIRED
  const [flat, setFlat] = useState("");

const handleLogin = async () => {
  try {
    if (!username.trim()) {
      alert("Enter username");
      return;
    }

   // ================= RESIDENT LOGIN =================
if (role === "resident") {

  if (!flat.trim()) {
    alert("Enter flat number");
    return;
  }

  const res = await axios.post(`${API_BASE}/auth/login/resident`, {
    username,
    flatNumber: flat,
  });
  console.log("LOGIN RESPONSE:", res.data);

  localStorage.setItem("residentId", res.data.user._id); // ⭐ IMPORTANT
  localStorage.setItem("residentName", res.data.user.name);
  localStorage.setItem("residentFlat", res.data.user.flatNumber);

  navigate("/resident");
}

    // ================= GUARD LOGIN =================
    else if (role === "guard") {

      if (!password) {
        alert("Enter password");
        return;
      }

      const res = await axios.post(`${API_BASE}/auth/login/guard`, {
        username,
        password,
      });

      localStorage.setItem("guardName", res.data.user.name);

      navigate("/guard");
    }

  } catch (err) {
    console.error(err);
    alert("Login failed");
  

}
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
        }}
      >
        <img src={logo} alt="Zeecurity" width={80} />

        <Typography variant="h5" sx={{ mt: 2, mb: 2, fontWeight: 600 }}>
          Login
        </Typography>

        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 1 }}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
            background: "#ffffff",
            border: "2px solid #1e88e5",
          }}
        >
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

  const fetchStats = async () => {
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
      console.error(err);
    }
  };
  

  return (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" sx={{ mb: 2 }}>
      Guard Dashboard
    </Typography>

    {/* 👇 THIS WAS MISSING */}
    <Grid container spacing={2}>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2">Visitors</Typography>
            <Typography variant="h4">{stats.visitors}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2">Complaints</Typography>
            <Typography variant="h4">{stats.complaints}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2">SOS</Typography>
            <Typography variant="h4">{stats.sos}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2">Notices</Typography>
            <Typography variant="h4">{stats.notices}</Typography>
          </CardContent>
        </Card>
      </Grid>

    </Grid>
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
  path="/guard/complaints"
  element={
    <Layout sidebar={<Sidebar />}>
      <GuardComplaints />
    </Layout>
  }
/>
<Route
  path="/guard/visitors"
  element={
    <Layout sidebar={<Sidebar />}>
      <Visitors />
    </Layout>
  }
/>
<Route
  path="/guard/notices"
  element={
    <Layout sidebar={<Sidebar />}>
      <Notices />
    </Layout>
  }
/>

<Route
  path="/guard/payments"
  element={
    <Layout sidebar={<Sidebar />}>
      <Payments />
    </Layout>
  }
/>

<Route
  path="/guard/sos"
  element={
    <Layout sidebar={<Sidebar />}>
      <SOS />
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
        <Route path="/guard/preapproved" element={<GuardPreApproved />} />
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
        <Route
  path="/resident/preapproved"
  element={
    <Layout sidebar={<ResidentSidebar />}>
      <PreApprovedVisitor />
    </Layout>
  }
/>
<Route
  path="/resident/visitors"
  element={<ResidentPreApproved />}
/>
        <Route
  path="/admin"
  element={
    <Box sx={{ display: "flex" }}>
      <AdminSidebar />
      <Box sx={{ flex: 1, minHeight: "100vh", bgcolor: "#f8fafc" }}>
        <AdminDashboard />
      </Box>
    </Box>
  }
/>
<Route path="/admin-login" element={<AdminLogin />} />
<Route
  path="/admin/residents"
  element={
    <Layout sidebar={<AdminSidebar />}>
      <ResidentsPage />
    </Layout>
  }
/>

<Route
  path="/admin/complaints"
  element={
    <Layout sidebar={<AdminSidebar />}>
      <GuardComplaints />
    </Layout>
  }
/>

<Route
  path="/admin/sos"
  element={
    <Layout sidebar={<AdminSidebar />}>
      <SOS />
    </Layout>
  }
/>

<Route
  path="/admin/payments"
  element={
    <Layout sidebar={<AdminSidebar />}>
      <Payments />
    </Layout>
  }
/>
<Route
  path="/admin/residents"
  element={
    <Layout sidebar={<AdminSidebar />}>
      <AdminResidents />
    </Layout>
  }
/>
<Route
  path="/admin/complaints"
  element={
    <Layout sidebar={<AdminSidebar />}>
      <AdminComplaints />
    </Layout>
  }
/>
<Route path="/admin/notices" element={<AdminNotices />} />
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

