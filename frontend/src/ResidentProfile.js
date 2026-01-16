// src/pages/ResidentProfile.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
} from "@mui/material";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://zeecurity-backend.onrender.com/api";

export default function ResidentProfile() {
  /* ================= BASIC INFO ================= */

  const [residentName, setResidentName] = useState("");
  const [residentFlat, setResidentFlat] = useState("");

  useEffect(() => {
    setResidentName(localStorage.getItem("residentName") || "");
    setResidentFlat(localStorage.getItem("residentFlat") || "");
  }, []);

  /* ================= SUMMARY ================= */

  const [summary, setSummary] = useState({
    totalComplaints: 0,
    resolvedComplaints: 0,
    totalSOS: 0,
    lastPayment: null,
  });

  const [loading, setLoading] = useState(true);

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    residentName || "Resident"
  )}&background=0D8ABC&color=fff`;

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    if (!residentFlat) return;
    loadResidentData();
  }, [residentFlat]);

  async function loadResidentData() {
    try {
      setLoading(true);

      const [complaintsRes, paymentsRes, sosRes] = await Promise.all([
        axios.get(`${API_BASE}/complaints`),
        axios.get(`${API_BASE}/maintenance`),
        axios.get(`${API_BASE}/sos`),
      ]);

      const complaints = Array.isArray(complaintsRes.data)
        ? complaintsRes.data
        : [];

      const myComplaints = complaints.filter(
        (c) =>
          (c.flatNumber || "").toLowerCase() ===
          residentFlat.toLowerCase()
      );

      const resolvedComplaints = myComplaints.filter(
        (c) => (c.status || "").toLowerCase() === "resolved"
      ).length;

      const payments = Array.isArray(paymentsRes.data)
        ? paymentsRes.data
        : paymentsRes.data?.payments || [];

      const myPayments = payments
        .filter(
          (p) =>
            (p.flatNumber || "").toLowerCase() ===
            residentFlat.toLowerCase()
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        );

      const sos = Array.isArray(sosRes.data) ? sosRes.data : [];

      const mySos = sos.filter(
        (s) =>
          (s.flatNumber || "").toLowerCase() ===
          residentFlat.toLowerCase()
      );

      setSummary({
        totalComplaints: myComplaints.length,
        resolvedComplaints,
        totalSOS: mySos.length,
        lastPayment: myPayments[0] || null,
      });
    } catch (err) {
      console.error("ResidentProfile error:", err);
    } finally {
      setLoading(false);
    }
  }

  /* ================= UI ================= */

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, maxWidth: 900, mx: "auto" }} elevation={4}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar src={avatarUrl} sx={{ width: 96, height: 96 }} />
          </Grid>

          <Grid item xs>
            <Typography variant="h5" fontWeight={700}>
              {residentName || "Resident"}
            </Typography>
            <Typography color="text.secondary">
              Flat: {residentFlat || "—"}
            </Typography>

            <Box sx={{ mt: 1.5, display: "flex", gap: 1 }}>
              <Chip label="Active Resident" color="success" size="small" />
              {summary.lastPayment ? (
                <Chip
                  label={`Maintenance Paid ₹${summary.lastPayment.amount}`}
                  color="primary"
                  size="small"
                />
              ) : (
                <Chip
                  label="No maintenance record"
                  color="warning"
                  size="small"
                />
              )}
            </Box>
          </Grid>

          <Grid item>
            <Button variant="outlined">Edit Profile</Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography>Total Complaints</Typography>
                <Typography variant="h5">{summary.totalComplaints}</Typography>
                <Typography color="text.secondary">
                  Resolved: {summary.resolvedComplaints}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography>SOS Alerts</Typography>
                <Typography variant="h5">{summary.totalSOS}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography>Last Maintenance</Typography>
                {summary.lastPayment ? (
                  <Typography variant="h6">
                    ₹{summary.lastPayment.amount}
                  </Typography>
                ) : (
                  <Typography color="text.secondary">
                    No record
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {loading && (
          <Typography variant="caption" sx={{ mt: 2 }}>
            Loading resident data…
          </Typography>
        )}
      </Paper>
    </Box>
  );
}