// src/Visitors.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  IconButton,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import LogoutIcon from "@mui/icons-material/Logout";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

export default function Visitors() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [flat, setFlat] = useState("");
  const [purpose, setPurpose] = useState("");
  const [visitors, setVisitors] = useState([]); // active visitors only
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, severity: "success", msg: "" });

  // QR dialog
  const [qrOpen, setQrOpen] = useState(false);
  const [qrData, setQrData] = useState(null);

  // Confirmation dialog for Mark Out
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toCheckoutId, setToCheckoutId] = useState(null);

  useEffect(() => {
    fetchVisitors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------
  // FETCH VISITORS (ONLY ACTIVE)
  // -------------------------------
  async function fetchVisitors() {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/visitors`);
      let data = res.data;

      // Normalize to array
      let list = [];
      if (Array.isArray(data)) list = data;
      else if (data && Array.isArray(data.visitors)) list = data.visitors;
      else if (data && Array.isArray(data.data)) list = data.data;
      else if (data && typeof data === "object") {
        const arr = Object.values(data).find((v) => Array.isArray(v));
        list = arr || [];
      }

      // FILTER OUT CHECKED-OUT VISITORS
      const activeVisitors = list.filter((v) => !v.outTime);

      setVisitors(activeVisitors);
    } catch (err) {
      console.error("fetchVisitors error:", err);
      setSnack({ open: true, severity: "error", msg: "Failed to load visitors" });
      setVisitors([]);
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------
  // ADD VISITOR
  // -------------------------------
  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim() || !flat.trim() || !purpose.trim()) {
      setSnack({ open: true, severity: "warning", msg: "Please fill name, flat and purpose" });
      return;
    }

    try {
      const payload = { name: name.trim(), phone: phone.trim(), flatNumber: flat.trim(), purpose: purpose.trim() };
      const res = await axios.post(`${API_BASE}/visitors`, payload);
      console.log("POST /visitors response:", res.data);

      const created = res.data;
      if (created && created._id) {
        setVisitors((prev) => [created, ...prev]); // add to active list
      } else {
        await fetchVisitors();
      }

      setSnack({ open: true, severity: "success", msg: "Visitor added" });
      setName("");
      setPhone("");
      setFlat("");
      setPurpose("");
    } catch (err) {
      console.error("add visitor error:", err);
      setSnack({ open: true, severity: "error", msg: "Failed to add visitor" });
    }
  }

  // -------------------------------
  // MARK OUT VISITOR
  // -------------------------------
  async function handleMarkOut(id) {
    if (!id) {
      console.error("handleMarkOut called with empty id");
      setSnack({ open: true, severity: "error", msg: "Invalid visitor id" });
      return;
    }

    try {
      const putRes = await axios.put(`${API_BASE}/visitors/${id}/checkout`);
      console.log("checkout PUT response:", putRes.data);

      setSnack({ open: true, severity: "success", msg: "Visitor checked out" });

      // Remove from UI
      setVisitors((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      console.error("PUT checkout failed:", err && err.response ? err.response.data : err.message);
      setSnack({ open: true, severity: "error", msg: "Failed to mark out visitor" });
      // try to refresh list so UI matches backend
      await fetchVisitors();
    }
  }

  // -------------------------------
  // QR DIALOG
  // -------------------------------
  function openQr(qr) {
    if (!qr) {
      setSnack({ open: true, severity: "info", msg: "No QR available for this visitor" });
      return;
    }
    setQrData(qr);
    setQrOpen(true);
  }

  // -------------------------------
  // UI STARTS HERE
  // -------------------------------
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Add Visitor
      </Typography>

      <Grid container spacing={3}>
        {/* ADD FORM */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <form onSubmit={handleAdd}>
                <TextField
                  label="Visitor Name"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Phone (optional)"
                  variant="outlined"
                  fullWidth
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Flat Number (e.g. A-101)"
                  variant="outlined"
                  fullWidth
                  value={flat}
                  onChange={(e) => setFlat(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Purpose"
                  variant="outlined"
                  fullWidth
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained" color="primary">
                  Add Visitor
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* VISITORS TABLE */}
        <Grid item xs={12} md={7}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Active Visitors
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Phone</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Flat</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Purpose</strong>
                  </TableCell>
                  <TableCell>
                    <strong>In Time</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center", py: 3 }}>
                        <CircularProgress size={20} />
                        <Typography>Loading visitors...</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : visitors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      No active visitors.
                    </TableCell>
                  </TableRow>
                ) : (
                  visitors.map((v) => {
                    const key = v._id;
                    const timeVal = v.inTime || v.date || v.createdAt;

                    return (
                      <TableRow key={key}>
                        <TableCell>{v.name || "-"}</TableCell>
                        <TableCell>{v.phone || "-"}</TableCell>
                        <TableCell>{v.flatNumber || v.flat || "-"}</TableCell>
                        <TableCell>{v.purpose || "-"}</TableCell>
                        <TableCell>{timeVal ? new Date(timeVal).toLocaleString() : "—"}</TableCell>

                        {/* Actions */}
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            {/* QR */}
                            <IconButton size="small" color="primary" onClick={() => openQr(v.qrCode)} aria-label="view-qr">
                              <VisibilityIcon />
                            </IconButton>

                            {/* MARK OUT */}
                            <Button
                              size="small"
                              color="error"
                              variant="contained"
                              onClick={() => {
                                setToCheckoutId(v._id);
                                setConfirmOpen(true);
                              }}
                              startIcon={<LogoutIcon />}
                            >
                              Mark Out
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* QR dialog */}
      <Dialog open={qrOpen} onClose={() => setQrOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Visitor QR Code</DialogTitle>
        <DialogContent>
          {qrData ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <img alt="QR" src={qrData} style={{ maxWidth: "300px", width: "100%", height: "auto" }} />
            </Box>
          ) : (
            <Typography>No QR available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Check-out</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to mark this visitor as checked-out?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            color="error"
            onClick={async () => {
              setConfirmOpen(false);
              if (toCheckoutId) await handleMarkOut(toCheckoutId);
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
