// src/Complaints.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://zeecurity-backend.onrender.com/api";

const STATUS_COLORS = {
  Pending: "warning",
  "In Progress": "info",
  Resolved: "success",
};

export default function Complaints() {
  const [name, setName] = useState("");
  const [flat, setFlat] = useState("");
  const [details, setDetails] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    severity: "success",
    msg: "",
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchComplaints() {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/complaints`);
      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.complaints || [];
      list.sort(
        (a, b) =>
          new Date(b.createdAt || b.inTime) -
          new Date(a.createdAt || a.inTime)
      );
      setComplaints(list);
    } catch (err) {
      setSnack({
        open: true,
        severity: "error",
        msg: "Failed to load complaints",
      });
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !flat || !details) {
      setSnack({
        open: true,
        severity: "warning",
        msg: "Fill all fields",
      });
      return;
    }
    try {
      const payload = {
        name,
        flatNumber: flat,
        details,
        status: "Pending",
      };
      const res = await axios.post(`${API_BASE}/complaints`, payload);
      setComplaints((p) => [res.data, ...p]);
      setSnack({
        open: true,
        severity: "success",
        msg: "Complaint submitted",
      });
      setName("");
      setFlat("");
      setDetails("");
    } catch {
      setSnack({
        open: true,
        severity: "error",
        msg: "Failed to submit complaint",
      });
    }
  }

  async function changeStatus(id, status) {
    try {
      await axios.put(`${API_BASE}/complaints/${id}/status`, {
        status,
      });
      setComplaints((p) =>
        p.map((c) => (c._id === id ? { ...c, status } : c))
      );
    } catch {
      setSnack({
        open: true,
        severity: "error",
        msg: "Failed to update status",
      });
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this complaint?")) return;
    try {
      await axios.delete(`${API_BASE}/complaints/${id}`);
      setComplaints((p) => p.filter((c) => c._id !== id));
      setSnack({
        open: true,
        severity: "success",
        msg: "Complaint deleted",
      });
    } catch {
      setSnack({
        open: true,
        severity: "error",
        msg: "Failed to delete complaint",
      });
    }
  }

  const filtered =
    statusFilter === "All"
      ? complaints
      : complaints.filter((c) => c.status === statusFilter);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
        Submit Complaint
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Your Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Flat Number"
              fullWidth
              value={flat}
              onChange={(e) => setFlat(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <TextField
              label="Status"
              fullWidth
              value="Pending"
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Complaint Details"
              fullWidth
              multiline
              minRows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained">
              Submit Complaint
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Typography variant="h6">All Complaints</Typography>
        <FormControl size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <Typography>No complaints found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {filtered.map((c) => (
            <Grid item xs={12} md={6} key={c._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {c.name} — Flat {c.flatNumber}
                  </Typography>
                  <Typography sx={{ mt: 1 }}>{c.details}</Typography>
                  <Chip
                    sx={{ mt: 1 }}
                    label={c.status}
                    color={STATUS_COLORS[c.status]}
                  />
                </CardContent>
                <CardActions>
                  <Button onClick={() => setPreview(c)}>Preview</Button>
                  <Button
                    onClick={() =>
                      changeStatus(
                        c._id,
                        c.status === "Pending"
                          ? "In Progress"
                          : "Resolved"
                      )
                    }
                  >
                    Advance Status
                  </Button>
                  <Button color="error" onClick={() => handleDelete(c._id)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={!!preview} onClose={() => setPreview(null)}>
        <DialogTitle>Complaint</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontWeight: 700 }}>
            {preview?.name} — Flat {preview?.flatNumber}
          </Typography>
          <Typography sx={{ mt: 2 }}>{preview?.details}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreview(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.severity}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}