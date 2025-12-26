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
  const storedName = localStorage.getItem("residentName") || "";
  const storedFlat = localStorage.getItem("residentFlat") || "";
  const isResident = !!storedFlat;

  const [name, setName] = useState(storedName);
  const [flat, setFlat] = useState(storedFlat);
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

  async function submitComplaint(e) {
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
      const res = await axios.post(`${API_BASE}/complaints`, {
        name,
        flatNumber: flat,
        details,
        status: "Pending",
      });

      setComplaints((prev) => [res.data, ...prev]);
      setDetails("");
      setSnack({
        open: true,
        severity: "success",
        msg: "Complaint submitted",
      });
    } catch {
      setSnack({
        open: true,
        severity: "error",
        msg: "Submit failed",
      });
    }
  }

  async function changeStatus(id, status) {
    try {
      await axios.put(`${API_BASE}/complaints/${id}/status`, { status });
      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status } : c))
      );
      setPreview((p) => (p ? { ...p, status } : p));
    } catch {
      setSnack({
        open: true,
        severity: "error",
        msg: "Status update failed",
      });
    }
  }

  async function deleteComplaint(id) {
    if (!window.confirm("Delete this complaint?")) return;
    try {
      await axios.delete(`${API_BASE}/complaints/${id}`);
      setComplaints((prev) => prev.filter((c) => c._id !== id));
      setPreview(null);
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

      <Box component="form" onSubmit={submitComplaint} sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Your Name"
              fullWidth
              value={name}
              disabled={isResident}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="Flat Number"
              fullWidth
              value={flat}
              disabled={isResident}
              onChange={(e) => setFlat(e.target.value)}
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

      <FormControl size="small" sx={{ mb: 2 }}>
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

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {filtered.map((c) => (
            <Grid item xs={12} md={6} key={c._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    {c.name} — Flat {c.flatNumber}
                  </Typography>
                  <Typography>{c.details}</Typography>
                  <Chip
                    sx={{ mt: 1 }}
                    label={c.status}
                    color={STATUS_COLORS[c.status]}
                  />
                </CardContent>
                <CardActions>
                  <Button onClick={() => setPreview(c)}>Preview</Button>
                  {!isResident && (
                    <Button
                      color="error"
                      onClick={() => deleteComplaint(c._id)}
                    >
                      Delete
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* PREVIEW + STATUS CHANGE */}
      <Dialog open={!!preview} onClose={() => setPreview(null)} fullWidth>
        <DialogTitle>Complaint</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontWeight: 700 }}>
            {preview?.name} — Flat {preview?.flatNumber}
          </Typography>
          <Typography sx={{ mt: 2 }}>{preview?.details}</Typography>

          {!isResident && (
            <FormControl fullWidth sx={{ mt: 3 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={preview?.status || "Pending"}
                label="Status"
                onChange={(e) =>
                  changeStatus(preview._id, e.target.value)
                }
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
          )}
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