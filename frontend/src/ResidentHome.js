// src/ResidentHome.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://zeecurity-backend.onrender.com/api";

/* 🎨 CARD COLOR STYLES (ONLY UI) */
const cardBase = {
  height: "100%",
  borderRadius: 3,
  boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
  transition: "all 0.25s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.14)",
  },
};

const cardStyles = {
  notices: {
    borderLeft: "5px solid #2563eb",
    background: "linear-gradient(180deg,#eff6ff,#ffffff)",
  },
  complaints: {
    borderLeft: "5px solid #f97316",
    background: "linear-gradient(180deg,#fff7ed,#ffffff)",
  },
  sos: {
    borderLeft: "5px solid #dc2626",
    background: "linear-gradient(180deg,#fef2f2,#ffffff)",
  },
  payments: {
    borderLeft: "5px solid #16a34a",
    background: "linear-gradient(180deg,#f0fdf4,#ffffff)",
  },
};

export default function ResidentHome() {
  const [flat, setFlat] = useState(
    () => localStorage.getItem("zeec_flat") || ""
  );
  const [inputFlat, setInputFlat] = useState(flat);
  const [loading, setLoading] = useState(false);

  const [myComplaints, setMyComplaints] = useState([]);
  const [myPayments, setMyPayments] = useState([]);
  const [mySos, setMySos] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    if (!flat) return;
    loadResidentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flat]);

  async function loadResidentData() {
    try {
      setLoading(true);

      const [complaintsRes, paymentsRes, sosRes, noticesRes] =
        await Promise.all([
          axios.get(`${API_BASE}/complaints`),
          axios.get(`${API_BASE}/maintenance`),
          axios.get(`${API_BASE}/sos`),
          axios.get(`${API_BASE}/notices`),
        ]);

      let complaints = Array.isArray(complaintsRes.data)
        ? complaintsRes.data
        : complaintsRes.data?.complaints || [];
      complaints = complaints.filter(
        (c) =>
          (c.flatNumber || c.flat || "").toLowerCase() ===
          flat.toLowerCase()
      );
      setMyComplaints(complaints.slice(0, 3));

      let payments = paymentsRes.data?.payments || paymentsRes.data || [];
      payments = payments.filter(
        (p) =>
          (p.flatNumber || p.flat || "").toLowerCase() ===
          flat.toLowerCase()
      );
      setMyPayments(payments.slice(0, 3));

      let sosList = sosRes.data?.sos || sosRes.data || [];
      sosList = sosList.filter(
        (s) =>
          (s.flatNumber || s.flat || "").toLowerCase() ===
          flat.toLowerCase()
      );
      setMySos(sosList.slice(0, 3));

      let noticesList = noticesRes.data?.notices || noticesRes.data || [];
      setNotices(noticesList.slice(0, 4));
    } catch (err) {
      console.error("ResidentHome error:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleSaveFlat() {
    if (!inputFlat.trim()) return;
    setFlat(inputFlat.trim());
    localStorage.setItem("zeec_flat", inputFlat.trim());
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="overline">Resident Panel</Typography>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Welcome to Zeecurity
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View your notices, complaints, payments and SOS alerts in one place.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            size="small"
            label="Your Flat (e.g. A-101)"
            value={inputFlat}
            onChange={(e) => setInputFlat(e.target.value)}
          />
         <Button
  variant="contained"
  onClick={handleSaveFlat}
  sx={{
    height: 40,
    px: 3,
    textTransform: "none",
    fontWeight: 500,
    borderRadius: 2,
  }}
>
  Save
</Button>
        </Box>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <Grid container spacing={2.5}>
        {/* 🟦 NOTICES */}
        <Grid item xs={12} md={6}>
          <Card sx={{ ...cardBase, ...cardStyles.notices }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography fontWeight={700}>Society Notices</Typography>
                <Button component={RouterLink} to="/resident/notices" size="small">
                  View all
                </Button>
              </Box>
              <List dense>
                {notices.map((n) => (
                  <ListItem key={n._id} sx={{ px: 0 }}>
                    <ListItemText
                      primary={n.title}
                      secondary={n.message}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* 🟧 COMPLAINTS */}
        <Grid item xs={12} md={6}>
          <Card sx={{ ...cardBase, ...cardStyles.complaints }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography fontWeight={700}>My Complaints</Typography>
                <Button component={RouterLink} to="/resident/complaints" size="small">
                  View all
                </Button>
              </Box>
              <List dense>
                {myComplaints.map((c) => (
                  <ListItem key={c._id} sx={{ px: 0 }}>
                    <ListItemText
                      primary={c.details}
                      secondary={<Chip size="small" label={c.status} />}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* 🟥 SOS */}
        <Grid item xs={12} md={6}>
          <Card sx={{ ...cardBase, ...cardStyles.sos }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography fontWeight={700}>My SOS Alerts</Typography>
                <Button component={RouterLink} to="/resident/sos" size="small">
                  View all
                </Button>
              </Box>
              <List dense>
                {mySos.map((s) => (
                  <ListItem key={s._id} sx={{ px: 0 }}>
                    <ListItemText
                      primary={s.details}
                      secondary={<Chip size="small" label={s.status} />}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* 🟩 PAYMENTS */}
        <Grid item xs={12} md={6}>
          <Card sx={{ ...cardBase, ...cardStyles.payments }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography fontWeight={700}>My Maintenance Payments</Typography>
                <Button component={RouterLink} to="/resident/payments" size="small">
                  View all
                </Button>
              </Box>
              <List dense>
                {myPayments.map((p, i) => (
                  <ListItem key={i} sx={{ px: 0 }}>
                    <ListItemText
                      primary={`₹${p.amount}`}
                      secondary={p.month}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}