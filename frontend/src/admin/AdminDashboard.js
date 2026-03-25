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
import VisitorGraph from "../components/VisitorGraph";

const API_BASE = "https://zeecurity-backend.onrender.com/api";

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
        <CircularProgress
          variant="determinate"
          value={100}
          size={120}
          thickness={5}
          sx={{ color: "#dfe3e9" }}
        />

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
          }}
        />

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
            opacity: 0.4,
          }}
        />

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
export default function AdminDashboard() {

  const navigate = useNavigate();

  const [stats, setStats] = React.useState({
    residents: 0,
    complaints: 0,
    complaintsResolved: 0,
    sos: 0,
    sosResolved: 0,
    paymentsTotal: 0,
    paymentsPaid: 0,
    visitors: 0,
  });

  const [healthProgress, setHealthProgress] = React.useState(0);

  const calculateHealth = () => {
    const complaintScore = Math.max(100 - stats.complaints * 2, 0);
    const sosScore = Math.max(100 - stats.sos * 5, 0);

    const paymentScore =
      stats.paymentsTotal > 0
        ? (stats.paymentsPaid / stats.paymentsTotal) * 100
        : 100;

    return Math.round(
      (complaintScore + sosScore + paymentScore) / 3
    );
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

      const [r, c, s, m, v] = await Promise.all([
        axios.get(`${API_BASE}/residents`),
        axios.get(`${API_BASE}/complaints`),
        axios.get(`${API_BASE}/sos`),
        axios.get(`${API_BASE}/maintenance`),
        axios.get(`${API_BASE}/preapproved`)
      ]);

      const totalPayments = m.data.payments.length;

      const paidPayments = m.data.payments.filter(
        (pay) => pay.status && pay.status.toLowerCase() === "paid"
      ).length;

     const totalComplaints = c.data.length;
const resolvedComplaints = c.data.filter(
  (item) => item.status?.toLowerCase() === "resolved"
).length;

const totalSOS = s.data.length;
const resolvedSOS = s.data.filter(
  (item) => item.status?.toLowerCase() === "resolved"
).length;

setStats({
  residents: r.data.length,

  complaints: totalComplaints,
  complaintsResolved: resolvedComplaints,

  sos: totalSOS,
  sosResolved: resolvedSOS,

  paymentsTotal: totalPayments,
  paymentsPaid: paidPayments,

  visitors: v.data.length,
});
    } catch (err) {
      console.error("Admin stats error:", err);
    }
  };

  useEffect(() => {
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
    <Box sx={{ p: 3, ml: {
  xs: 0,
  md: "220px"
}}}>

      <Typography variant="h4" fontWeight={700} mb={1}>
        Admin Control Center
      </Typography>
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
  

      <Grid container spacing={3}>

        {/* ROW 1 */}
        <Grid item xs={12} md={3}>

          <Card
            sx={{
              height: 180,
              p: 3,
              borderRadius: 4,
              color: "#fff",
              background:
                "linear-gradient(135deg,#4facfe,#00f2fe)"
            }}
          >
            <Typography variant="caption">
              Total Residents
            </Typography>

            <Typography variant="h3" fontWeight={900}>
              {stats.residents}
            </Typography>

            <Typography variant="caption">
              Active community members
            </Typography>
          </Card>

        </Grid>

        <Grid item xs={12} md={6}>

          <Card
            sx={{
              
              p: 1,
              borderRadius: 6,
              background:
                "linear-gradient(135deg,#0bdce7db,#eef2ff)"
            }}
          >

            <Typography textAlign="center" mb={2}>
              System Overview
            </Typography>

            <Grid container spacing={6} justifyContent="center">

              <Grid item>
                <InfoCircle
                  total={stats.complaints}
                solved={stats.complaintsResolved}
                  label="Complaints"
                  colorSolved="#22c55e"
                  colorPending="#64748b"
                  trend="Live database"
                />
              </Grid>

              <Grid item>
                <InfoCircle
                  total={stats.sos}
                  solved={stats.sosResolved}
                  label="SOS"
                  colorSolved="#f97316"
                  colorPending="#334155"
                  trend="Live database"
                />
              </Grid>

              <Grid item>
                <InfoCircle
                  total={stats.paymentsTotal}
                  solved={stats.paymentsPaid}
                  label="Payments"
                  colorSolved="#6366f1"
                  colorPending="#1e293b"
                  trend="Live database"
                />
              </Grid>

            </Grid>

          </Card>

        </Grid>

        <Grid item xs={12} md={3}>

          <Card
            sx={{
              height: 90,
              p: 2,
              borderRadius: 4,
              cursor: "pointer",
              background:
                "linear-gradient(135deg,#f093fb,#f5576c)",
              color: "#fff"
            }}
            onClick={() => navigate("/admin/chat")}
          >

            <Typography variant="h6">
              Guard Communication
            </Typography>

            <Typography variant="body2">
              Click to open live chat
            </Typography>

          </Card>

        </Grid>

        {/* ROW 2 */}

        <Grid item xs={12} md={3}>

          <Card
            sx={{
              height: 110,
              p: 3,
              borderRadius: 4,
              background:
                "linear-gradient(135deg,#fa709a,#fee140)",
              color: "#fff",
              textAlign: "center"
            }}
          >

            <Typography>
              System Health
            </Typography>

            <Typography variant="h4">
              {healthProgress}%
            </Typography>

          </Card>

        </Grid>

        <Grid item xs={12} md={3}>

          <Card
            sx={{
              height: 110,
              p: 3,
              borderRadius: 4,
              background:
                "linear-gradient(135deg,#43e97b,#38f9d7)",
              color: "#fff",
              cursor: "pointer"
            }}
            onClick={() => navigate("/admin/visitors")}
          >

            <Typography variant="caption">
              Visitors
            </Typography>

            <Typography variant="h3">
              {stats.visitors}
            </Typography>

            <Typography variant="caption">
              Pre-approved visitors
            </Typography>

          </Card>

        </Grid>

        <Grid item xs={12} md={3}>

          <Card
            sx={{
              height: 110,
              p: 3,
              borderRadius: 4,
              cursor: "pointer",
              background:
                "linear-gradient(135deg,#667eea,#764ba2)",
              color: "#fff"
            }}
            onClick={() => navigate("/admin/guards")}
          >

            <Typography variant="h6">
              Guard Duty Roster
            </Typography>

            <Typography variant="body2">
              View guard shifts
            </Typography>

          </Card>

        </Grid>

        <Grid item xs={12} md={3}>

          <Card
            sx={{
              height: 110,
              p: 3,
              borderRadius: 4,
              cursor: "pointer",
              background:
                "linear-gradient(135deg,#30cfd0,#330867)",
              color: "#fff"
            }}
            onClick={() => navigate("/admin/residents-info")}
          >

            <Typography variant="h6">
              Residents Info
            </Typography>

            <Typography variant="body2">
              Click to view residents
            </Typography>

          </Card>

        </Grid>
        <Grid item xs={12} md={3}>
  <Card
    sx={{
      height: 110,
      p: 3,
      borderRadius: 4,
      cursor: "pointer",
      background: "linear-gradient(135deg,#667eea,#764ba2)",
      color: "#fff"
    }}
    onClick={() => navigate("/admin/todo")}
  >
    <Typography variant="h6">
      Task Manager
    </Typography>

    <Typography variant="body2">
      Assign guard duties
    </Typography>
  </Card>
</Grid>
        


      </Grid>
      {/* ROW 3 GRAPH */}

<Grid item xs={12} sx={{ mt: 2 }}>
  <Card
    sx={{
      p: 0.5,
      borderRadius: 3,
      background: "linear-gradient(135deg,#30cfd0,#330867)",
      color: "#fff",
      boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
      width: "100%"
    }}
  >
    <Typography variant="h5" mb={2}>
           Visitor Activity
    </Typography>

    <VisitorGraph />
  </Card>
</Grid>



    </Box>
  );
}