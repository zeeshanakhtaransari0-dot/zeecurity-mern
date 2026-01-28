import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

/* ===============================
   Reusable Circular Infographic
================================ */
const InfoCircle = ({
  total,
  solved,
  label,
  trend,
  colorSolved,
  colorpending,
}) => {
  const pending = total - solved;
  const solvedPercent = Math.round((solved / total) * 100);
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
    color: colorpending,
    position: "absolute",
    left: 0,
    zIndex: 8,
    transform: "rotate(0deg)",
    "& .MuiCircularProgress-circle": {
      strokeLinecap: "round",
    },
    opacity: 0.5,
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

      <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
        {trend}
      </Typography>
    </Box>
  );
};
/* ===============================
   Admin Dashboard
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
export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("role") !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  return (
    <Box sx={{ p: 2, width: "100%" }}>
      <Typography variant="h4" fontWeight={700} mb={1}>
  Admin Control Center
</Typography>

<SystemStatusBadge />
      

      <Grid container spacing={2} sx={{margin:0}}>
        {/* =========================
            TOTAL RESIDENTS (KEEP SAME)
        ========================== */}
        <Grid item xs={12} md={3}>
           {/* ===== CARD 1 – Residents ===== */}
    <Card
  sx={{
    p: 2.5,
    borderRadius: 4,
    backdropFilter: "blur(10px)",
    background: "linear-gradient(135deg, rgb(28, 216, 229), rgba(166, 228, 241, 0.9))",
    color: "#fff",
    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
  }}
>
  <Typography variant="caption" sx={{ opacity: 0.8 }}>
    Total Residents
  </Typography>

  <Typography variant="h3" fontWeight={900}>
    128
  </Typography>

  <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
    Active community members
  </Typography>
</Card>
        </Grid>

        {/* =========================
            BIG INFOGRAPHIC CARD
        ========================== */}
        <Grid item xs={12} md={9}>
          <Card
            sx={{
              height: "100%",
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
    total={6}
    solved={4}
    label="Guards Active"
    colorSolved="#16a34a"   // strong green
    colorPending="#94a3b8"  // soft slate grey
  />
</Grid>

  <Grid item>
  <InfoCircle
    total={34}
    solved={20}
    label="Complaints Resolved"
    colorSolved="#22c55e"   // green
    colorPending="#64748b"  // darker grey (better contrast)
    trend="20 resolved • 14 pending"
  />
</Grid>

  <Grid item>
  <InfoCircle
    total={10}
    solved={4}
    label="SOS Handled"
    colorSolved="#f97316"   // orange (alert)
    colorPending="#4b1705"  // deep brown-red
    trend="4 handled • 6 active"
  />
</Grid>

  <Grid item>
  <InfoCircle
    total={412}
    solved={350}
    label="Payments Completed"
    colorSolved="#6366f1"   // indigo
    colorPending="#000000"  // slate dark
    trend="350 done • 62 pending"
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