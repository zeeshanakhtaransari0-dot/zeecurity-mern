// frontend/src/Payments.js
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";

// base URL -- uses same base logic as other pages
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

// Payment UI that works with your existing Maintenance model & routes.
export default function Payments() {
  const [form, setForm] = useState({
    name: "",
    flatNumber: "",
    month: "",
    amount: "",
    paymentMode: "Online",
  });

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [snack, setSnack] = useState({ open: false, severity: "success", msg: "" });

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line
  }, []);

  async function fetchPayments() {
    try {
      setLoading(true);
      console.log("GET", `${API_BASE}/maintenance`);
      const res = await axios.get(`${API_BASE}/maintenance`);
      // your backend returns { success: true, payments } per screenshot
      let list = [];
      if (Array.isArray(res.data)) {
        // some endpoints return array directly
        list = res.data;
      } else if (res.data?.success && Array.isArray(res.data.payments)) {
        list = res.data.payments;
      } else if (Array.isArray(res.data.payments)) {
        list = res.data.payments;
      } else {
        // try common alternatives
        list = res.data?.payments || res.data?.data || [];
      }
      // normalize and sort by date desc (model uses `date`)
      list = list.map((p) => ({
        _id: p._id || p.id,
        name: p.name || p.payer || "",
        flatNumber: p.flatNumber || p.flat || p.flatNo || "",
        month: p.month || p.forMonth || "",
        amount: p.amount || p.amt || 0,
        paymentMode: p.paymentMode || p.mode || "Online",
        status: p.status || "",
        date: p.date || p.createdAt || p.timestamp,
        raw: p,
      }));
      list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      setPayments(list);
    } catch (err) {
      console.error("fetchPayments error:", err);
      setSnack({ open: true, severity: "error", msg: "Failed to load payments" });
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // required fields in Maintenance schema: name, flatNumber, month, amount
    if (!form.name.trim() || !form.flatNumber.trim() || !form.month.trim() || !form.amount) {
      setSnack({ open: true, severity: "warning", msg: "Please fill all required fields" });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: form.name.trim(),
        flatNumber: form.flatNumber.trim(),
        month: form.month.trim(),
        amount: Number(form.amount),
        paymentMode: form.paymentMode || "Online",
        // if Maintenance schema has "status" and expects "Paid"/"Unpaid", backend default was "Paid"
        // we won't send status to let backend default control it (or you can set status:"Paid")
      };

      console.log("POST", `${API_BASE}/maintenance`, payload);
      const res = await axios.post(`${API_BASE}/maintenance`, payload);
      console.log("POST /maintenance", res.status, res.data);

      // backend returned { success: true, payment } per screenshot style OR saved doc
      const created = res.data?.payment || res.data || res.data?.saved || null;

      if (res.status === 201 || (res.data && (res.data.success || created))) {
        setSnack({ open: true, severity: "success", msg: "Payment recorded successfully" });
        // reset form
        setForm({
          name: "",
          flatNumber: "",
          month: "",
          amount: "",
          paymentMode: "Online",
        });
        // refresh list (use server-side saved doc if available)
        if (created && (created._id || created.id)) {
          // prepend the created object (normalized)
          const p = {
            _id: created._id || created.id,
            name: created.name || created.payer || "",
            flatNumber: created.flatNumber || created.flat || "",
            month: created.month || created.forMonth || "",
            amount: created.amount || created.amt || 0,
            paymentMode: created.paymentMode || created.mode || "Online",
            status: created.status || "",
            date: created.date || created.createdAt || new Date().toISOString(),
            raw: created,
          };
          setPayments((prev) => [p, ...prev]);
        } else {
          // fallback: refresh list
          fetchPayments();
        }
      } else {
        setSnack({ open: true, severity: "error", msg: "Error saving payment" });
      }
    } catch (err) {
      console.error("add payment error:", err);
      const message = err.response?.data?.message || err.response?.data?.error || err.message || "Server error";
      setSnack({ open: true, severity: "error", msg: "Failed to add payment: " + message });
    } finally {
      setSubmitting(false);
    }
  }

  // optional delete if backend supports it (maintenanceRoutes screenshot did not show delete,
  // but we call it and handle errors gracefully)
  async function handleDelete(id) {
    try {
      if (!window.confirm("Delete this payment record?")) return;
      console.log("DELETE", `${API_BASE}/maintenance/${id}`);
      const res = await axios.delete(`${API_BASE}/maintenance/${id}`);
      console.log("DELETE /maintenance", res.status, res.data);
      if (res.status === 200 || (res.data && res.data.success)) {
        setPayments((prev) => prev.filter((p) => p._id !== id));
        setSnack({ open: true, severity: "success", msg: "Payment deleted" });
      } else {
        setSnack({ open: true, severity: "error", msg: "Failed to delete payment" });
      }
    } catch (err) {
      console.error("delete payment error:", err);
      const message = err.response?.data?.message || err.response?.data?.error || err.message || "Server error";
      setSnack({ open: true, severity: "error", msg: "Delete failed: " + message });
      // refetch to sync
      fetchPayments();
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Record Maintenance Payment
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
          <Card>
            <CardContent>
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />

                <TextField
                  label="Flat Number"
                  name="flatNumber"
                  value={form.flatNumber}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />

                <TextField
                  label="Month (e.g. November 2025)"
                  name="month"
                  value={form.month}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />

                <TextField
                  label="Amount"
                  name="amount"
                  type="number"
                  value={form.amount}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="pmode-label">Payment Mode</InputLabel>
                  <Select
                    labelId="pmode-label"
                    name="paymentMode"
                    value={form.paymentMode}
                    label="Payment Mode"
                    onChange={handleChange}
                  >
                    <MenuItem value="Online">Online</MenuItem>
                    <MenuItem value="UPI">UPI</MenuItem>
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Card">Card</MenuItem>
                  </Select>
                </FormControl>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button type="submit" variant="contained" disabled={submitting}>
                    {submitting ? "Saving..." : "Submit Payment"}
                  </Button>

                  <Button onClick={fetchPayments} variant="outlined" startIcon={<RefreshIcon />}>
                    Refresh
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ width: { xs: "100%", md: "60%" } }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Payment Records
              </Typography>

              {loading ? (
                <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Flat</TableCell>
                        <TableCell>Month</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Mode</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {payments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            No payment records found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        payments.map((p) => (
                          <TableRow key={p._id}>
                            <TableCell>{p.name || "-"}</TableCell>
                            <TableCell>{p.flatNumber || "-"}</TableCell>
                            <TableCell>{p.month || "-"}</TableCell>
                            <TableCell>₹{Number(p.amount || 0).toLocaleString()}</TableCell>
                            <TableCell>{p.paymentMode || "-"}</TableCell>
                            <TableCell>{p.date ? new Date(p.date).toLocaleString() : "-"}</TableCell>
                            <TableCell align="right">
                              <IconButton size="small" color="error" onClick={() => handleDelete(p._id)}>
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.severity}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
