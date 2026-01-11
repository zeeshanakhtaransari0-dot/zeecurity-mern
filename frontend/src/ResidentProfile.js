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
  /* ================= BASIC INFO (FIXED) ================= */

  const [residentName, setResidentName] = useState("");
  const [residentFlat, setResidentFlat] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("residentName");
    const flat = localStorage.getItem("residentFlat");

    if (name) setResidentName(name);
    if (flat) setResidentFlat(flat);
  }, []);

  /* ================= SUMMARY DATA ================= */

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

  const email = residentName
    ? `${residentName.toLowerCase().replace(/\s+/g, ".")}@example.com`
    : "resident@example.com";

  const phone = "+91-98765 43210";

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    loadResidentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [residentFlat]);

  async function loadResidentData() {
    if (!residentFlat) return;

    try {
      setLoading(true);

      const [complaintsRes, paymentsRes, sosRes] = await Promise.all([
        axios.get(`${API_BASE}/complaints`),
        axios.get(`${API_BASE}/maintenance`),
        axios.get(`${API_BASE}/sos`),
      ]);

      /* ----- Complaints ----- */
      const complaints = Array.isArray(complaintsRes.data)
        ? complaintsRes.data
        : complaintsRes.data?.complaints || [];

      const myComplaints = complaints.filter(
        (c) =>
          (c.flatNumber || "").toString().toLowerCase() ===
          residentFlat.toLowerCase()
      );

      const totalComplaints = myComplaints.length;
      const resolvedComplaints = myComplaints.filter(
        (c) => (c.status || "").toLowerCase() === "resolved"
      ).length;

      /* ----- Payments ----- */
      let payments = [];
      const pData = paymentsRes.data;

      if (Array.isArray(pData)) payments = pData;
      else if (pData?.payments) payments = pData.payments;

      const myPayments = payments
        .filter(
          (p) =>
            (p.flatNumber || "").toString().toLowerCase() ===
            residentFlat.toLowerCase()
        )
        .sort(
          (a, b) =>
            new Date(b.date || b.createdAt || 0) -
            new Date(a.date || a.createdAt || 0)
        );

      /* ----- SOS ----- */
      const sos = Array.isArray(sosRes.data)
        ? sosRes.data
        : sosRes.data?.sos || [];

      const mySos = sos.filter(
        (s) =>
          (s.flatNumber || "").toString().toLowerCase() ===
          residentFlat.toLowerCase()
      );

      setSummary({
        totalComplaints,
        resolvedComplaints,
        totalSOS: mySos.length,
        lastPayment: myPayments[0] || null,
      });
    } catch (err) {
      console.error("ResidentProfile load error:", err);
    } finally {
      setLoading(false);
    }
  }

  /* ================= UI ================= */

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, maxWidth: 900, mx: "auto" }} elevation={4}>
        <Grid container spacing={3} alignItems="center">
          {/* Avatar */}
          <Grid item>
            <Avatar
              src={avatarUrl}
              sx={{ width: 96, height: 96, fontSize: 32 }}
            />
          </Grid>

          {/* Basic Info */}
          <Grid item xs>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {residentName || "Resident"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Flat: {residentFlat || "—"}
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

        {/* Contact Info */}
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

        {/* Summary Cards */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="caption">Total Complaints</Typography>
                <Typography variant="h5" fontWeight={700}>
                  {summary.totalComplaints}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Resolved: {summary.resolvedComplaints}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="caption">SOS Alerts</Typography>
                <Typography variant="h5" fontWeight={700}>
                  {summary.totalSOS}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="caption">Last Maintenance</Typography>
                {summary.lastPayment ? (
                  <>
                    <Typography variant="h6" fontWeight={700}>
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
                    No payment record
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