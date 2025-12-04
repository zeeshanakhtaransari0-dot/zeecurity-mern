// src/Complaints.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Grid, Card, CardContent, CardActions, Typography, TextField, Button,
  Select, MenuItem, FormControl, InputLabel, Chip, CircularProgress, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

const STATUS_COLORS = { Pending: "warning", "In Progress": "info", Resolved: "success" };

export default function Complaints() {
  const [name, setName] = useState("");
  const [flat, setFlat] = useState("");
  const [details, setDetails] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, severity: "success", msg: "" });
  const [preview, setPreview] = useState(null);

  useEffect(() => { fetchComplaints(); }, []);

  async function fetchComplaints() {
    try {
      setLoading(true);
      console.log("GET", `${API_BASE}/complaints`);
      const res = await axios.get(`${API_BASE}/complaints`);
      console.log("GET /complaints response:", res.status, res.data);
      let list = Array.isArray(res.data) ? res.data : (res.data && res.data.complaints) || [];
      list.sort((a, b) => new Date(b.createdAt || b.inTime) - new Date(a.createdAt || a.inTime));
      setComplaints(list);
    } catch (err) {
      console.error("fetchComplaints error:", err);
      setSnack({ open: true, severity: "error", msg: "Failed to load complaints: " + getErrText(err) });
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }

  function getErrText(err) {
    if (!err) return "Unknown error";
    if (err.response) return `${err.response.status} ${err.response.statusText} - ${JSON.stringify(err.response.data)}`;
    if (err.request) return "No response from server";
    return err.message;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !flat.trim() || !details.trim()) {
      setSnack({ open: true, severity: "warning", msg: "Fill name, flat & details" });
      return;
    }
    try {
      const payload = { name: name.trim(), flatNumber: flat.trim(), details: details.trim(), status: "Pending" };
      console.log("POST", `${API_BASE}/complaints`, payload);
      const res = await axios.post(`${API_BASE}/complaints`, payload);
      console.log("POST /complaints response:", res.status, res.data);
      const created = res.data;
      if (created && (created._id || created.id)) setComplaints(p => [created, ...p]);
      else await fetchComplaints();
      setSnack({ open: true, severity: "success", msg: "Complaint submitted" });
      setName(""); setFlat(""); setDetails("");
    } catch (err) {
      console.error("submit complaint error:", err);
      setSnack({ open: true, severity: "error", msg: "Failed to submit: " + getErrText(err) });
    }
  }

  async function changeStatus(id, newStatus) {
    try {
      console.log("PUT", `${API_BASE}/complaints/${id}/status`, { status: newStatus });
      const res = await axios.put(`${API_BASE}/complaints/${id}/status`, { status: newStatus });
      console.log("PUT /complaints/:id/status response:", res.status, res.data);
      if (res.status === 200 || (res.data && res.data.success)) {
        setComplaints(p => p.map(c => (c._id === id ? { ...c, status: newStatus } : c)));
        setSnack({ open: true, severity: "success", msg: "Status updated" });
      } else {
        await fetchComplaints();
      }
    } catch (err) {
      console.error("changeStatus error:", err);
      setSnack({ open: true, severity: "error", msg: "Failed to update status: " + getErrText(err) });
    }
  }

  async function handleDelete(id) {
    try {
      if (!id) { setSnack({ open: true, severity: "error", msg: "Invalid id" }); return; }
      if (!window.confirm("Delete this complaint?")) return;
      console.log("DELETE", `${API_BASE}/complaints/${id}`);
      const res = await axios.delete(`${API_BASE}/complaints/${id}`);
      console.log("DELETE /complaints/:id response:", res.status, res.data);
      if (res.status === 200 || (res.data && res.data.success)) {
        setComplaints(p => p.filter(c => (c._id || c.id) !== id));
        setSnack({ open: true, severity: "success", msg: "Complaint deleted" });
      } else { await fetchComplaints(); }
    } catch (err) {
      console.error("delete complaint error:", err);
      setSnack({ open: true, severity: "error", msg: "Failed to delete: " + getErrText(err) });
    }
  }

  const filtered = statusFilter === "All" ? complaints : complaints.filter(c => c.status === statusFilter);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>Submit Complaint</Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField label="Your Name" fullWidth value={name} onChange={e => setName(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="Flat Number" fullWidth value={flat} onChange={e => setFlat(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={5}>
            <FormControl fullWidth>
              <InputLabel>Initial Status</InputLabel>
              <Select value="Pending" label="Initial Status" disabled>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Complaint Details" fullWidth multiline minRows={3} value={details} onChange={e => setDetails(e.target.value)} />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained">Submit Complaint</Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Typography variant="h6">All Complaints</Typography>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Filter Status</InputLabel>
          <Select value={statusFilter} label="Filter Status" onChange={e => setStatusFilter(e.target.value)}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}><CircularProgress /></Box>
      ) : filtered.length === 0 ? (
        <Typography>No complaints found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {filtered.map(c => {
            const id = c._id || c.id;
            const when = c.createdAt || c.inTime;
            return (
              <Grid item xs={12} md={6} key={id}>
                <Card elevation={2}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{c.name} — Flat {c.flatNumber || c.flat}</Typography>
                        <Typography sx={{ mt: 1, whiteSpace: "pre-line" }}>{c.details}</Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Chip label={c.status || "Pending"} color={STATUS_COLORS[c.status] || "default"} />
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>{when ? new Date(when).toLocaleString() : ""}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => setPreview(c)}>Preview</Button>
                    <Button size="small" onClick={() => changeStatus(id, c.status === "Pending" ? "In Progress" : c.status === "In Progress" ? "Resolved" : "Resolved")}>
                      Advance Status
                    </Button>
                    <Button size="small" color="error" onClick={() => handleDelete(id)}>Delete</Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog open={!!preview} onClose={() => setPreview(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Complaint Details</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{preview?.name} — Flat {preview?.flatNumber}</Typography>
          <Typography sx={{ whiteSpace: "pre-line", mt: 2 }}>{preview?.details}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
            {preview?.createdAt ? new Date(preview.createdAt).toLocaleString() : ""}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreview(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snack.severity}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
