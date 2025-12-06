// src/ResidentProfile.js
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
  // 🔹 Read from localStorage (fallback to defaults)
  const residentName = localStorage.getItem("residentName") || "Mr. Resident";
  const residentFlat = localStorage.getItem("residentFlat") || "A-101";

  // simple fake email using name (optional)
  const email =
    residentName === "Mr. Resident"
      ? "resident@example.com"
      : `${residentName.toLowerCase().replace(/\s+/g, ".")}@example.com`;

  const phone = "+91-98765 43210";

  const [summary, setSummary] = useState({
    totalComplaints: 0,
    resolvedComplaints: 0,
    totalSOS: 0,
    lastPayment: null,
  });

  const [loading, setLoading] = useState(true);

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    residentName
  )}&background=0D8ABC&color=fff`;

  useEffect(() => {
    loadResidentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadResidentData() {
    try {
      setLoading(true);

      const [complaintsRes, paymentsRes, sosRes] = await Promise.all([
        axios.get(`${API_BASE}/complaints`),
        axios.get(`${API_BASE}/maintenance`),
        axios.get(`${API_BASE}/sos`),
      ]);

      // --- Complaints for this flat ---
      let complaints = Array.isArray(complaintsRes.data)
        ? complaintsRes.data
        : complaintsRes.data?.complaints || [];

      const myComplaints = complaints.filter((c) => {
        const flat = (c.flatNumber || c.flat || "").toString().toLowerCase();
        return flat === residentFlat.toLowerCase();
      });

      const totalComplaints = myComplaints.length;
      const resolvedComplaints = myComplaints.filter(
        (c) => (c.status || "").toLowerCase() === "resolved"
      ).length;

      // --- Payments for this flat ---
      let paymentsData = paymentsRes.data;
      let payments = [];
      if (Array.isArray(paymentsData)) payments = paymentsData;
      else if (paymentsData?.success && Array.isArray(paymentsData.payments))
        payments = paymentsData.payments;
      else if (Array.isArray(paymentsData?.payments))
        payments = paymentsData.payments;
      else payments = paymentsData?.payments || paymentsData?.data || [];

      const myPayments = payments
        .map((p) => ({
          flatNumber: p.flatNumber || p.flat || p.flatNo || "",
          month: p.month || p.forMonth || "",
          amount: p.amount || p.amt || 0,
          date: p.date || p.createdAt || p.timestamp,
        }))
        .filter(
          (p) =>
            p.flatNumber &&
            p.flatNumber.toString().toLowerCase() ===
              residentFlat.toLowerCase()
        )
        .sort(
          (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
        );

      const lastPayment = myPayments[0] || null;

      // --- SOS for this flat ---
      let sos = Array.isArray(sosRes.data) ? sosRes.data : sosRes.data?.sos || [];
      const mySos = sos.filter((s) => {
        const flat = (s.flatNumber || s.flat || "").toString().toLowerCase();
        return flat === residentFlat.toLowerCase();
      });

      setSummary({
        totalComplaints,
        resolvedComplaints,
        totalSOS: mySos.length,
        lastPayment,
      });
    } catch (err) {
      console.error("ResidentProfile load error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, maxWidth: 900, margin: "0 auto" }} elevation={4}>
        <Grid container spacing={3} alignItems="center">
          {/* Avatar */}
          <Grid item>
            <Avatar
              src={avatarUrl}
              sx={{ width: 96, height: 96, fontSize: 32 }}
            />
          </Grid>

          {/* Basic info */}
          <Grid item xs>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {residentName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Flat: {residentFlat}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Member since: 2024
            </Typography>

            <Box sx={{ mt: 1.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip label="Active Resident" color="success" size="small" />
              {summary.lastPayment ? (
                <Chip
                  label={`Maintenance Paid: ₹${Number(
                    summary.lastPayment.amount || 0
                  ).toLocaleString()}`}
                  color="primary"
                  size="small"
                />
              ) : (
                <Chip
                  label="Maintenance: No record yet"
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

        {/* Contact info */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            Contact details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Email: {email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Phone: {phone}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Summary cards */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  Total Complaints
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {summary.totalComplaints}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Resolved: {summary.resolvedComplaints}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  SOS Alerts Raised
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {summary.totalSOS}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  (for flat {residentFlat})
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  Last Maintenance Payment
                </Typography>
                {summary.lastPayment ? (
                  <>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      ₹
                      {Number(
                        summary.lastPayment.amount || 0
                      ).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {summary.lastPayment.month || "—"}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No payment record found.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {loading && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 2 }}
          >
            Loading resident data…
          </Typography>
        )}
      </Paper>
    </Box>
  );
}