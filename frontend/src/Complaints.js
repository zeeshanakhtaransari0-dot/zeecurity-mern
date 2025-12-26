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
  // ✅ auto-fill from login but EDITABLE
  const [name, setName] = useState(
    localStorage.getItem("residentName") || ""
  );
  const [flat, setFlat] = useState(
    localStorage.getItem("residentFlat") || ""
  );

  const [details, setDetails] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const [snack, setSnack] = useState({
    open: false,
    severity: "success",
    msg: "",
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  async function fetchComplaints() {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/complaints`);
      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.complaints || [];
      setComplaints(list);
    } catch {
      setSnack({
        open: true,
        severity: "error",
        msg: "Failed to load complaints",
      });
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
        msg: "Please fill all fields",
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
      setComplaints((prev) => [res.data, ...prev]);

      setSnack({
        open: true,
        severity: "success",
        msg: "Complaint submitted",
      });

      setDetails("");
    } catch {
      setSnack({
        open: true,
        severity: "error",
        msg: "Failed to submit complaint",
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
        msg: "Delete failed",
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

      {/* ---------- FORM ---------- */}
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
            <TextField label="Status" value="Pending" fullWidth disabled />
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

      {/* ---------- FILTER ---------- */}
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

      {/* ---------- LIST ---------- */}
      {loading ? (
        <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <Typography>No complaints found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {filtered.map((c) => {
            const id = c._id;
            return (
              <Grid item xs={12} md={6} key={id}>
                <Card>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {c.name} — Flat {c.flatNumber}
                        </Typography>
                        <Typography sx={{ mt: 1 }}>{c.details}</Typography>
                      </Box>
                      <Chip
                        label={c.status}
                        color={STATUS_COLORS[c.status]}
                      />
                    </Box>
                  </CardContent>

                  <CardActions>
                    <Button size="small" onClick={() => setPreview(c)}>
                      Preview
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* ---------- PREVIEW ---------- */}
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

      {/* ---------- SNACKBAR ---------- */}
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