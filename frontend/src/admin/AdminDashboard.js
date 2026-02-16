import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/* ===============================
   Reusable Circular Infographic
================================ */
const InfoCircle = ({
  total,
  solved,
  label,
  trend,
  colorSolved,
  colorPending,
}) => {
  const safeTotal = total === 0 ? 1 : total;
  const solvedPercent = Math.round((solved / safeTotal) * 100);
  const pendingPercent = 100 - solvedPercent;

  const [progressSolved, setProgressSolved] = React.useState(0);
  const [progressPending, setProgressPending] = React.useState(0);

  React.useEffect(() => {
    let s = 0;
    let p = 0;

    const timer = setInterval(() => {
      if (s < solvedPercent) s += 1;
      if (p < pendingPercent) p += 1;

      setProgressSolved(s);
      setProgressPending(p);

      if (s >= solvedPercent && p >= pendingPercent) {
        clearInterval(timer);
      }
    }, 15);

    return () => clearInterval(timer);
  }, [solvedPercent, pendingPercent]);

  return (
    <Box sx={{ textAlign: "center" }}>
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        {/* Background ring */}
        <CircularProgress
          variant="determinate"
          value={100}
          size={120}
          thickness={5}
          sx={{ color: "#dfe3e9" }}
        />

        {/* Solved ring */}
        <CircularProgress
          variant="determinate"
          value={progressSolved}
          size={120}
          thickness={6}
          sx={{
            color: colorSolved,
            position: "absolute",
            left: 0,
            zIndex: 2,
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
            filter: "drop-shadow(0 0 6px rgba(0,0,0,0.25))",
          }}
        />

        {/* Pending ring */}
        <CircularProgress
          variant="determinate"
          value={progressPending}
          size={120}
          thickness={6}
          sx={{
            color: colorPending,
            position: "absolute",
            left: 0,
            zIndex: 1,
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
            opacity: 0.4,
          }}
        />

        {/* Center text */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography fontWeight={800}>
            {solved}/{total}
          </Typography>
          <Typography variant="caption">
            {solvedPercent}%
          </Typography>
        </Box>
      </Box>

      <Typography sx={{ mt: 1, fontSize: 14, fontWeight: 500 }}>
        {label}
      </Typography>

      {trend && (
        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
          {trend}
        </Typography>
      )}
    </Box>
  );
};

/* ===============================
   System Status Badge
================================ */
const SystemStatusBadge = () => {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 0.6,
        borderRadius: 20,
        background: "rgba(234,179,8,0.15)",
        color: "#ca8a04",
        fontSize: 13,
        fontWeight: 600,
        mb: 2,
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "#eab308",
          boxShadow: "0 0 8px #eab308",
        }}
      />
      Monitoring Mode
    </Box>
  );
};

/* ===============================
   Admin Dashboard
================================ */
export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = React.useState({
    residents: 0,
    complaints: 0,
    sos: 0,
    payments: 0,
  });

  const calculateHealth = () => {
  const complaintScore = Math.max(100 - stats.complaints * 2, 0);
  const sosScore = Math.max(100 - stats.sos * 5, 0);

  const paymentScore =
    stats.residents > 0
      ? Math.min((stats.payments / stats.residents) * 100, 100)
      : 0;

  const health = Math.round(
    (complaintScore + sosScore + paymentScore) / 3
  );

  return health;
};

const systemHealth = calculateHealth();

  useEffect(() => {
    if (localStorage.getItem("role") !== "admin") {
      navigate("/");
    }

    fetchStats();
  }, [navigate]);

 const fetchStats = async () => {
  try {
    const [r, c, s, p] = await Promise.all([
      axios.get("https://zeecurity-backend.onrender.com/api/residents"),
      axios.get("https://zeecurity-backend.onrender.com/api/complaints"),
      axios.get("https://zeecurity-backend.onrender.com/api/sos"),
      axios.get("https://zeecurity-backend.onrender.com/api/maintenance"),
    ]);

    setStats({
      residents: Array.isArray(r.data) ? r.data.length : 0,
      complaints: Array.isArray(c.data) ? c.data.length : 0,
      sos: Array.isArray(s.data) ? s.data.length : 0,
      payments: Array.isArray(p.data)
        ? p.data.length
        : p.data.payments?.length || 0,
    });

  } catch (err) {
    console.error("Admin stats error:", err);
  }
};
const [healthProgress, setHealthProgress] = React.useState(0);

React.useEffect(() => {
  let value = 0;

  const timer = setInterval(() => {
    if (value < systemHealth) {
      value += 1;
      setHealthProgress(value);
    } else {
      clearInterval(timer);
    }
  }, 15);

  return () => clearInterval(timer);
}, [systemHealth]);
 return (
  <Box sx={{ p: 2, ml: "220px" }}>
    <Typography variant="h4" fontWeight={700} mb={1}>
      Admin Control Center
    </Typography>

    <SystemStatusBadge />

    <Grid container spacing={2} sx={{ margin: 0 }}>

  {/* LEFT COLUMN (Residents + Health stacked) */}
  <Grid item xs={12} md={3}>
    <Grid container spacing={2} direction="column">

      {/* Residents Card */}
      <Grid item>
        <Card
          sx={{
            p: 2.5,
            borderRadius: 4,
            background:
              "linear-gradient(135deg, rgb(28,216,229), rgba(166,228,241,0.9))",
            color: "#fff",
            boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
          }}
        >
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Total Residents
          </Typography>

          <Typography variant="h3" fontWeight={900}>
            {stats.residents}
          </Typography>

          <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
            Active community members
          </Typography>
        </Card>
      </Grid>

      {/* System Health Card BELOW Residents */}
      <Grid item xs={12} md={3}>
  <Card
    sx={{
      p: 2.5,
      borderRadius: 5,
      background: "#0f172a",
      color: "#fff",
      boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
      textAlign: "center",

      height: 160,          // fixed height
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {/* Title */}
    <Typography
      variant="subtitle1"
      fontWeight={700}
      sx={{ mb: 1 }}
    >
      System Health
    </Typography>

    {/* Circle */}
    <Box sx={{ position: "relative", display: "inline-flex", my: 1 }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={85}
        thickness={6}
        sx={{ color: "#1e293b" }}
      />

      <CircularProgress
        variant="determinate"
        value={healthProgress}
        size={85}
        thickness={6}
        sx={{
          position: "absolute",
          left: 0,
          color:
            healthProgress > 75
              ? "#22c55e"
              : healthProgress > 50
              ? "#facc15"
              : "#ef4444",
          "& .MuiCircularProgress-circle": {
            strokeLinecap: "round",
          },
        }}
      />
    </Box>

    {/* Percentage */}
    <Typography variant="h6" fontWeight={800}>
      {healthProgress}%
    </Typography>

    <Typography
      variant="caption"
      sx={{
        fontWeight: 600,
        color:
          healthProgress > 75
            ? "#22c55e"
            : healthProgress > 50
            ? "#facc15"
            : "#ef4444",
      }}
    >
      {healthProgress > 75
        ? "Healthy"
        : healthProgress > 50
        ? "Warning"
        : "Critical"}
    </Typography>
  </Card>
</Grid>
    </Grid>
  </Grid>

  {/* RIGHT SIDE - BIG SYSTEM OVERVIEW */}
  <Grid item xs={12} md={9}>
    <Card
      sx={{
        borderRadius: 3,
        p: 2,
        background:
          "linear-gradient(135deg, #0bdce7db, #eef2ff)",
      }}
    >
      <Typography
        fontWeight={600}
        fontSize={16}
        mb={2}
        textAlign="center"
      >
        System Overview
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item>
          <InfoCircle
            total={stats.complaints}
            solved={Math.floor(stats.complaints * 0.6)}
            label="Complaints"
            colorSolved="#22c55e"
            colorPending="#64748b"
            trend="Live database"
          />
        </Grid>

        <Grid item>
          <InfoCircle
            total={stats.sos}
            solved={Math.floor(stats.sos * 0.4)}
            label="SOS"
            colorSolved="#f97316"
            colorPending="#334155"
            trend="Live database"
          />
        </Grid>

        <Grid item>
          <InfoCircle
            total={stats.payments}
            solved={Math.floor(stats.payments * 0.85)}
            label="Payments"
            colorSolved="#6366f1"
            colorPending="#1e293b"
            trend="Live database"
          />
        </Grid>
      </Grid>

      <Typography
        variant="caption"
        sx={{
          display: "block",
          textAlign: "center",
          mt: 3,
          color: "text.secondary",
        }}
      >
        Residents • Guards • Admin connected via centralized control system
      </Typography>
    </Card>
  </Grid>

</Grid>
  </Box>
);
}