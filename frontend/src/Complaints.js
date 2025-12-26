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
  const [name, setName] = useState(localStorage.getItem("residentName") || "");
  const [flat, setFlat] = useState(localStorage.getItem("residentFlat") || "");
  const [details, setDetails] = useState("");

  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
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
    } catch (err) {
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
        msg: "Failed to submit complaint",
      });
    }
  }

  async function saveEditedComplaint() {
    try {
      await axios.put(
        `${API_BASE}/complaints/${preview._id}`,
        preview
      );
      setPreview(null);
      fetchComplaints();
      setSnack({
        open: true,
        severity: "success",
        msg: "Complaint updated",
      });
    } catch {
      setSnack({
        open: true,
        severity: "error",
        msg: "Update failed",
      });
    }
  }

  async function deleteComplaint(id) {
    if (!window.confirm("Delete this complaint?")) return;
    try {
      await axios.delete(`${API_BASE}/complaints/${id}`);
      setComplaints((p) => p.filter((c) => c._id !== id));
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

      {/* SUBMIT FORM */}
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
            <TextField label="Status" value="Pending" disabled fullWidth />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Complaint Details"
              multiline
              minRows={3}
              fullWidth
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

      {/* FILTER */}
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

      {/* LIST */}
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
                  <Button onClick={() => setPreview(c)}>Preview / Edit</Button>
                  <Button color="error" onClick={() => deleteComplaint(c._id)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* EDIT MODAL */}
      <Dialog open={!!preview} onClose={() => setPreview(null)} fullWidth>
        <DialogTitle>Edit Complaint</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Name"
            value={preview?.name || ""}
            onChange={(e) =>
              setPreview({ ...preview, name: e.target.value })
            }
          />

          <TextField
            label="Flat Number"
            value={preview?.flatNumber || ""}
            onChange={(e) =>
              setPreview({ ...preview, flatNumber: e.target.value })
            }
          />

          <TextField
            label="Details"
            multiline
            minRows={3}
            value={preview?.details || ""}
            onChange={(e) =>
              setPreview({ ...preview, details: e.target.value })
            }
          />

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={preview?.status || "Pending"}
              label="Status"
              onChange={(e) =>
                setPreview({ ...preview, status: e.target.value })
              }
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setPreview(null)}>Cancel</Button>
          <Button variant="contained" onClick={saveEditedComplaint}>
            Save
          </Button>
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