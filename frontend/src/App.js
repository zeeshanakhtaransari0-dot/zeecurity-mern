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
import GuardChat from "./pages/GuardChat";
import ResidentsPage from "./ResidentsPage";
import AdminSidebar from "./components/AdminSidebar";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLogin from "./admin/AdminLogin";
import AdminNotices from "./admin/AdminNotices";
import AdminChat from "./admin/AdminChat";
import PreApprovedVisitor from "./pages/PreApprovedVisitor";
import GuardPreApproved from "./pages/GuardPreApproved";
import ResidentPreApproved from "./pages/ResidentPreApproved";
import PeopleIcon from "@mui/icons-material/People";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import WarningIcon from "@mui/icons-material/Warning";
import CampaignIcon from "@mui/icons-material/Campaign";
import SecurityIcon from "@mui/icons-material/Security";
import ApartmentIcon from "@mui/icons-material/Apartment";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ChatIcon from "@mui/icons-material/Chat";
import AdminVisitors from "./admin/AdminVisitors";
import GuardRoster from "./admin/GuardRoster";
import ResidentsInfo from "./admin/ResidentsInfo";
import LandingPage from "./pages/LandingPage";
import GuardTodo from "./pages/GuardTodo";
import AdminTodo from "./pages/AdminTodo";

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
  const navigate = useNavigate();
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
    <Typography variant="h4" sx={{ mb: 3 }} fontWeight={700}>
      Guard Dashboard
    </Typography>

    {/* 👇 GRID START */}
<Grid container spacing={3}>

  {/* ---------------- WELCOME CARD ---------------- */}
  <Grid item xs={12}>
    <Card
      sx={{
        p: 2,
        borderRadius: 3,
        background: "linear-gradient(135deg,#1e3a8a,#3b82f6)",
        color: "white",
      }}
    >
      <Typography variant="h5" fontWeight={700}>
        Welcome Guard
      </Typography>

      <Typography variant="body2">
        Security monitoring system is active.
      </Typography>
    </Card>
  </Grid>

    {/* NEW TODO CARD */}
  <Grid item xs={12} md={6}>
    <Card
      sx={{
        height: 40,
        p: 3,
        borderRadius: 4,
        cursor: "pointer",
        background: "linear-gradient(135deg,#667eea,#764ba2)",
        color: "#fff"
      }}
      onClick={() => navigate("/guard/todo")}
    >
      <Typography variant="h6">
        Today’s Tasks
      </Typography>

      <Typography variant="body2">
        View & update assigned duties
      </Typography>
    </Card>
  </Grid>

</Grid>


{/* ---------------- ROW 1 : SYSTEM STATS ---------------- */}

<Grid container spacing={3} sx={{ mt: 1 }}>

  {/* Visitors */}
  <Grid item xs={12} md={3}>
    <Card
  sx={{
    p: 2,
    borderRadius: 3,
    background: "linear-gradient(135deg,#2563eb,#3b82f6)",
    color: "white",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
  }}
>
  <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <Box>
      <Typography variant="subtitle2">Visitors</Typography>
      <Typography variant="h4">{stats.visitors}</Typography>
    </Box>
    <PeopleIcon sx={{ fontSize: 40 }} />
  </CardContent>
</Card>
  </Grid>

  {/* Complaints */}
  <Grid item xs={12} md={3}>
   <Card
  sx={{
    p: 2,
    borderRadius: 3,
    background: "linear-gradient(135deg,#f97316,#fb923c)",
    color: "white",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
  }}
>
  <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <Box>
      <Typography variant="subtitle2">Complaints</Typography>
      <Typography variant="h4">{stats.complaints}</Typography>
    </Box>
    <ReportProblemIcon sx={{ fontSize: 40 }} />
  </CardContent>
</Card>
  </Grid>

  {/* SOS */}
  <Grid item xs={12} md={3}>
   <Card
  sx={{
    p: 2,
    borderRadius: 3,
    background: "linear-gradient(135deg,#dc2626,#ef4444)",
    color: "white",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
  }}
>
  <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <Box>
      <Typography variant="subtitle2">SOS</Typography>
      <Typography variant="h4">{stats.sos}</Typography>
    </Box>
    <WarningIcon sx={{ fontSize: 40 }} />
  </CardContent>
</Card>
  </Grid>

  {/* Notices */}
  <Grid item xs={12} md={3}>
   <Card
  sx={{
    p: 2,
    borderRadius: 3,
    background: "linear-gradient(135deg,#7c3aed,#a855f7)",
    color: "white",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
  }}
>
  <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <Box>
      <Typography variant="subtitle2">Notices</Typography>
      <Typography variant="h4">{stats.notices}</Typography>
    </Box>
    <CampaignIcon sx={{ fontSize: 40 }} />
  </CardContent>
</Card>
  </Grid>

</Grid>


{/* ---------------- ROW 2 : FUNCTIONAL CARDS ---------------- */}

<Grid container spacing={3} sx={{ mt: 1 }}>

  {/* Guard Info */}
  <Grid item xs={12} md={3}>
    <Card
  sx={{
     height: "80%",
    p: 2,
    borderRadius: 3,
    background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
    color: "white"
  }}
>
  <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <Box>
      <Typography variant="subtitle2"><h4>Guard Information</h4></Typography>
      <Typography variant="h6s">
       
      </Typography>
      <Typography variant="body2">
        Status: Active
         <Typography variant="body2"></Typography>
        Name:Admin
        <Typography variant="body2"></Typography>
        Shift:Day
        <Typography variant="body2"></Typography>
        DutyAssigned:Visitor Entry 
      </Typography>
    </Box>
    <SecurityIcon sx={{ fontSize: 50 }} />
  </CardContent>
</Card>
  </Grid>


{/* Residents */}
<Grid item xs={12} md={3}>
  <Card
    sx={{
      height: "80%",
      p: 2,
      borderRadius: 3,
      cursor: "pointer",
      background: "linear-gradient(135deg,#16a34a,#22c55e)",
      color: "white",
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
      transition: "0.2s",
      "&:hover": {
        transform: "translateY(-3px)",
      }
    }}
    onClick={() => navigate("/guard/residents")}
  >
    <CardContent
      sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
    >
      <Box>
        <Typography variant="subtitle2">
          Residents
        </Typography>

        <Typography variant="h5" fontWeight={700}>
          View List
        </Typography>

        <Typography variant="body2">
          Open residents history
        </Typography>
      </Box>

      <ApartmentIcon sx={{ fontSize: 40 }} />
    </CardContent>
  </Card>
</Grid>


{/* Pre Approved Visitors */}
<Grid item xs={12} md={3}>
  <Card
    sx={{
      height: "80%",
      p: 2,
      borderRadius: 3,
      cursor: "pointer",
      background: "linear-gradient(135deg,#0f766e,#14b8a6)",
      color: "white",
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
      transition: "0.2s",
      "&:hover": {
        transform: "translateY(-3px)",
      }
    }}
    onClick={() => navigate("/guard/preapproved")}
  >
    <CardContent
      sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
    >
      <Box>
        <Typography variant="subtitle2">
          Pre-Approved Visitors
        </Typography>

        <Typography variant="h5" fontWeight={700}>
          Open List
        </Typography>

        <Typography variant="body2">
          View approved visitors
        </Typography>
      </Box>

      <VerifiedUserIcon sx={{ fontSize: 40 }} />
    </CardContent>
  </Card>
</Grid>


{/* Chat */}
<Grid item xs={12} md={3}>
  <Card
    sx={{
      height: "80%",
      p: 2,
      borderRadius: 3,
      cursor: "pointer",
      background: "linear-gradient(135deg,#4f46e5,#6366f1)",
      color: "white",
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
      transition: "0.2s",
      "&:hover": {
        transform: "translateY(-3px)",
      }
    }}
    onClick={() => navigate("/guard/chat")}
  >
    <CardContent
      sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
    >
      <Box>
        <Typography variant="subtitle2">
          Chat With Admin
        </Typography>

        <Typography variant="h5" fontWeight={700}>
          Open Chat
        </Typography>

        <Typography variant="body2">
          Contact admin for help
        </Typography>
      </Box>

      <ChatIcon sx={{ fontSize: 40 }} />
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
        <Route path="/" element={<LandingPage />} />
<Route path="/login" element={<Login />} />

        <Route
          path="/guard"
          element={
            <Layout sidebar={<Sidebar />}>
              <GuardHome />
            </Layout>
          }
        />
         <Route path="/guard/chat" element={<GuardChat />} />
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
        <Route path="/guard/todo" element={<GuardTodo />} />
       
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
  path="/admin/visitors"
  element={
    <Layout sidebar={<AdminSidebar />}>
      <AdminVisitors />
    </Layout>
  }
/>
<Route path="/admin/notices" element={<AdminNotices />} />
<Route path="/admin/chat" element={<AdminChat />} />
<Route path="/admin/guards" element={<GuardRoster />} />
<Route path="/admin/todo" element={<AdminTodo />} />
<Route
 path="/admin/residents-info"
 element={
  <Layout sidebar={<AdminSidebar />}>
   <ResidentsInfo />
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

