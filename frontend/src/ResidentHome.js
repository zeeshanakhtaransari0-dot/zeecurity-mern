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

  // when flat changes, load data
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

      // Complaints (filter by flat)
      let complaints = Array.isArray(complaintsRes.data)
        ? complaintsRes.data
        : complaintsRes.data?.complaints || [];
      complaints = complaints.filter(
        (c) =>
          (c.flatNumber || c.flat || "").toLowerCase() ===
          flat.toLowerCase()
      );
      complaints.sort(
        (a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      setMyComplaints(complaints.slice(0, 3));

      // Payments
      let pData = paymentsRes.data;
      let payments = [];
      if (Array.isArray(pData)) payments = pData;
      else if (pData?.success && Array.isArray(pData.payments))
        payments = pData.payments;
      else payments = pData?.payments || [];
      payments = payments.filter(
        (p) =>
          (p.flatNumber || p.flat || p.flatNo || "").toLowerCase() ===
          flat.toLowerCase()
      );
      payments = payments.map((p) => ({
        name: p.name || p.payer || "",
        flatNumber: p.flatNumber || p.flat || p.flatNo || "",
        amount: p.amount || p.amt || 0,
        month: p.month || p.forMonth || "",
        date: p.date || p.createdAt || p.timestamp,
      }));
      payments.sort(
        (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
      );
      setMyPayments(payments.slice(0, 3));

      // SOS
      let sData = sosRes.data;
      let sosList = Array.isArray(sData) ? sData : sData?.sos || [];
      sosList = sosList.filter(
        (s) =>
          (s.flatNumber || s.flat || "").toLowerCase() ===
          flat.toLowerCase()
      );
      sosList.sort(
        (a, b) =>
          new Date(b.createdAt || b.date || 0) -
          new Date(a.createdAt || a.date || 0)
      );
      setMySos(sosList.slice(0, 3));

      // Notices (no filter)
      let nData = noticesRes.data;
      let noticesList = Array.isArray(nData)
        ? nData
        : nData?.notices || [];
      noticesList.sort(
        (a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      setNotices(noticesList.slice(0, 4));
    } catch (err) {
      console.error("ResidentHome load error:", err);
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
      {/* Header */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ letterSpacing: 2 }}>
            Resident Panel
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Welcome to Zeecurity
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            View your notices, complaints, payments and SOS alerts in one
            place.
          </Typography>
        </Box>

        {/* Flat selector */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            minWidth: 260,
          }}
        >
          <TextField
            size="small"
            label="Your Flat (e.g. A-101)"
            value={inputFlat}
            onChange={(e) => setInputFlat(e.target.value)}
          />
          <Button variant="contained" onClick={handleSaveFlat}>
            Save
          </Button>
        </Box>
      </Box>

      {!flat && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="body2">
              Please enter your <strong>Flat Number</strong> above and
              click <strong>Save</strong> to see your personal data.
            </Typography>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      )}

      {/* Cards row */}
      <Grid container spacing={2.5}>
        {/* Notices */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Society Notices
                </Typography>
                <Button
                  component={RouterLink}
                  to="/resident/notices"
                  size="small"
                >
                  View all
                </Button>
              </Box>
              {notices.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No notices yet.
                </Typography>
              ) : (
                <List dense>
                  {notices.map((n) => (
                    <ListItem key={n._id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}
                          >
                            {n.title}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {n.message?.length > 70
                              ? n.message.slice(0, 70) + "..."
                              : n.message}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Complaints */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  My Complaints
                </Typography>
                <Button
                  component={RouterLink}
                  to="/resident/complaints"
                  size="small"
                >
                  View all
                </Button>
              </Box>
              {flat && myComplaints.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No complaints found for flat <strong>{flat}</strong>.
                </Typography>
              ) : (
                <List dense>
                  {myComplaints.map((c) => (
                    <ListItem key={c._id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            {c.details}
                          </Typography>
                        }
                        secondary={
                          <Chip
                            size="small"
                            label={c.status || "Pending"}
                            sx={{ mt: 0.5 }}
                          />
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* SOS */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  My SOS Alerts
                </Typography>
                <Button
                  component={RouterLink}
                  to="/resident/sos"
                  size="small"
                >
                  View all
                </Button>
              </Box>
              {flat && mySos.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No SOS alerts for flat <strong>{flat}</strong>.
                </Typography>
              ) : (
                <List dense>
                  {mySos.map((s) => (
                    <ListItem key={s._id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            {s.type} • {s.details}
                          </Typography>
                        }
                        secondary={
                          <Chip
                            size="small"
                            label={s.status || "Pending"}
                            sx={{ mt: 0.5 }}
                          />
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Payments */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  My Maintenance Payments
                </Typography>
                <Button
                  component={RouterLink}
                  to="/resident/payments"
                  size="small"
                >
                  View all
                </Button>
              </Box>
              {flat && myPayments.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No payment records for flat <strong>{flat}</strong>.
                </Typography>
              ) : (
                <List dense>
                  {myPayments.map((p, i) => (
                    <ListItem key={i} sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            {p.month || "Month"} • ₹
                            {Number(p.amount || 0).toLocaleString()}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {p.date
                              ? new Date(p.date).toLocaleDateString()
                              : ""}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
