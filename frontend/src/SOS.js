// src/SOS.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Typography, Grid, Card, CardContent, CardActions,
  TextField, Button, Select, MenuItem, FormControl,
  InputLabel, Chip, CircularProgress, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";

const API_BASE = process.env.REACT_APP_API_BASE || "https://zeecurity-backend.onrender.com/api";


const TYPES = ["Medical", "Fire", "Security", "Other"];
const STATUS_COLORS = { Pending: "warning", Acknowledged: "info", Resolved: "success" };

export default function SOS() {
  const [name, setName] = useState("");
  const [flat, setFlat] = useState("");
  const [type, setType] = useState("");
  const [details, setDetails] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, severity: "success", msg: "" });
  const [preview, setPreview] = useState(null);

  useEffect(() => { fetchAlerts(); }, []);

  async function fetchAlerts() {
    try {
      setLoading(true);
      console.log("GET", `${API_BASE}/sos`);
      const res = await axios.get(`${API_BASE}/sos`);

      let list = res.data;
      // tolerate both an array or { success: true, sos: [...] }
      if (!Array.isArray(list) && list?.sos) list = list.sos;
      if (!Array.isArray(list)) list = [];

      list.sort((a, b) => new Date(b.createdAt || b.date || b.inTime) - new Date(a.createdAt || a.date || a.inTime));
      setAlerts(list);
    } catch (err) {
      console.error("fetchAlerts error:", err);
      setSnack({ open: true, severity: "error", msg: "Failed to load alerts" });
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }

  function getErrText(err) {
    if (!err) return "Unknown";
    if (err.response) return `${err.response.status} - ${JSON.stringify(err.response.data)}`;
    if (err.request) return "No response from server";
    return err.message;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !flat.trim() || !type || !details.trim()) {
      setSnack({ open: true, severity: "warning", msg: "Please fill all fields" });
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        flatNumber: flat.trim(),
        type,
        details: details.trim(),
        status: "Pending",
        priority: type === "Medical" ? "High" : "Normal",
      };

      console.log("POST", `${API_BASE}/sos`, payload);
      const res = await axios.post(`${API_BASE}/sos`, payload);
      console.log("POST /sos", res.status, res.data);

      if (res.status === 201 && (res.data && (res.data._id || res.data.id))) {
        setAlerts(prev => [res.data, ...prev]);
      } else {
        await fetchAlerts();
      }

      setSnack({ open: true, severity: "success", msg: "SOS sent" });
      setName(""); setFlat(""); setType(""); setDetails("");
    } catch (err) {
      console.error("submit sos error:", err);
      setSnack({ open: true, severity: "error", msg: "Failed to send: " + getErrText(err) });
    }
  }

  // ---------- robust updateStatus ----------
  async function updateStatus(id, newStatus) {
    try {
      const realId = id && (id._id || id.id) ? (id._id || id.id) : id;
      console.log("updateStatus ->", { id: realId, newStatus });
      const url = `${API_BASE}/sos/${realId}/status`;

      // try PUT first
      try {
        const res = await axios.put(url, { status: newStatus });
        console.log("PUT status response:", res.status, res.data);
        if (res.status === 200) {
          setAlerts(prev => prev.map(a => (a._id === realId ? { ...a, status: newStatus } : a)));
          setSnack({ open: true, severity: "success", msg: "Status updated" });
          return;
        }
      } catch (putErr) {
        console.warn("PUT failed:", putErr && (putErr.response ? putErr.response.status : putErr.message));
        // fallback for 404/405 or no response
        if (!putErr.response || putErr.response.status === 404 || putErr.response.status === 405) {
          try {
            const res2 = await axios.post(`${API_BASE}/sos/${realId}/status`, { status: newStatus });
            console.log("POST fallback status response:", res2.status, res2.data);
            if (res2.status === 200 || res2.status === 201) {
              setAlerts(prev => prev.map(a => (a._id === realId ? { ...a, status: newStatus } : a)));
              setSnack({ open: true, severity: "success", msg: "Status updated (fallback)" });
              return;
            }
          } catch (postErr) {
            console.error("POST fallback also failed:", postErr);
            throw postErr;
          }
        } else {
          throw putErr;
        }
      }

      // last resort: re-fetch
      await fetchAlerts();
      setSnack({ open: true, severity: "info", msg: "Status update attempted. Refreshed list." });
    } catch (err) {
      console.error("updateStatus error final:", err);
      const msg = err && err.response ? `${err.response.status} ${JSON.stringify(err.response.data)}` : (err.message || String(err));
      setSnack({ open: true, severity: "error", msg: "Failed to update status: " + msg });
    }
  }

  // ---------- robust delete ----------
  async function handleDelete(id) {
    try {
      const realId = id && (id._id || id.id) ? (id._id || id.id) : id;
      if (!realId) {
        setSnack({ open: true, severity: "error", msg: "Invalid id for delete" });
        return;
      }
      if (!window.confirm("Delete this alert?")) return;

      const url = `${API_BASE}/sos/${realId}`;
      console.log("handleDelete -> DELETE", url);

      const res = await axios.delete(url);
      console.log("DELETE response:", res.status, res.data);

      if (res.status === 200 || (res.data && res.data.success)) {
        setAlerts(prev => prev.filter(a => (a._id || a.id) !== realId));
        setSnack({ open: true, severity: "success", msg: "Alert deleted" });
      } else {
        await fetchAlerts();
        setSnack({ open: true, severity: "info", msg: "Delete attempted. Refreshed list." });
      }
    } catch (err) {
      console.error("handleDelete error:", err);
      const msg = err && err.response ? `${err.response.status} ${JSON.stringify(err.response.data)}` : (err.message || String(err));
      setSnack({ open: true, severity: "error", msg: "Failed to delete: " + msg });
    }
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>SOS Emergency Alert</Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid sx={{ width: "100%" }}>
            <TextField label="Your Name" fullWidth value={name} onChange={e => setName(e.target.value)} />
          </Grid>

          <Grid sx={{ width: "100%" }}>
            <TextField label="Flat Number" fullWidth value={flat} onChange={e => setFlat(e.target.value)} />
          </Grid>

          <Grid sx={{ width: "100%" }}>
            <FormControl fullWidth>
              <InputLabel>Emergency Type</InputLabel>
              <Select value={type} label="Emergency Type" onChange={e => setType(e.target.value)}>
                <MenuItem value="">Select Emergency Type</MenuItem>
                {TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid sx={{ width: "100%" }}>
            <TextField label="Emergency Details" multiline minRows={3} fullWidth value={details} onChange={e => setDetails(e.target.value)} />
          </Grid>

          <Grid sx={{ width: "100%" }}>
            <Button type="submit" variant="contained" color="error">Send SOS</Button>
          </Grid>
        </Grid>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>All SOS Alerts</Typography>

      {loading ? (
        <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}><CircularProgress /></Box>
      ) : alerts.length === 0 ? (
        <Typography>No SOS alerts found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {alerts.map(a => {
            const id = a._id || a.id;
            const time = a.createdAt || a.date || a.inTime;

            return (
              <Grid
                key={id}
                sx={{
                  width: { xs: "100%", md: "50%" },
                  boxSizing: "border-box",
                }}
              >
                <Card elevation={3} sx={{ borderLeft: a.priority === "High" ? "6px solid #d32f2f" : "6px solid transparent" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {a.name} — Flat {a.flatNumber}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ mt: 1 }}>
                          {a.type} • {a.details}
                        </Typography>
                      </Box>

                      <Box sx={{ textAlign: "right" }}>
                        <Chip label={a.status || "Pending"} color={STATUS_COLORS[a.status] || "default"} />
                        <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
                          {time ? new Date(time).toLocaleString() : ""}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>

                  <CardActions>
                    <Button size="small" onClick={() => setPreview(a)}>Preview</Button>

                    {a.status === "Pending" ? (
                      <Button size="small" onClick={() => updateStatus(id, "Acknowledged")}>Acknowledge</Button>
                    ) : a.status === "Acknowledged" ? (
                      <Button size="small" onClick={() => updateStatus(id, "Resolved")}>Resolve</Button>
                    ) : (
                      <Button size="small" disabled>Resolved</Button>
                    )}

                    <Button size="small" color="error" onClick={() => handleDelete(id)} sx={{ marginLeft: "auto" }}>
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog open={!!preview} onClose={() => setPreview(null)} maxWidth="sm" fullWidth>
        <DialogTitle>SOS Details</DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {preview?.name} — Flat {preview?.flatNumber}
          </Typography>

          <Typography sx={{ mt: 2 }}>{preview?.details}</Typography>

          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
            {preview?.createdAt ? new Date(preview.createdAt).toLocaleString() : ""}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setPreview(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.severity}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
