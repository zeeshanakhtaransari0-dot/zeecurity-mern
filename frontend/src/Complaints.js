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
  // ✅ auto-fill but editable
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
      setComplaints(res.data || []);
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
        msg: "All fields required",
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

      setComplaints((p) => [res.data, ...p]);
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

  async function updateStatus(id, status) {
    await axios.put(`${API_BASE}/complaints/${id}/status`, { status });
    fetchComplaints();
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete complaint?")) return;
    await axios.delete(`${API_BASE}/complaints/${id}`);
    fetchComplaints();
  }

  const filtered =
    statusFilter === "All"
      ? complaints
      : complaints.filter((c) => c.status === statusFilter);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Submit Complaint
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Your Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)} // ✅ editable
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Flat Number"
              fullWidth
              value={flat}
              onChange={(e) => setFlat(e.target.value)} // ✅ editable
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

      <FormControl size="small" sx={{ mb: 2, minWidth: 150 }}>
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
          {filtered.map((c) => {
            const id = c._id || c.id;
            return (
              <Grid item xs={12} md={6} key={id}>
                <Card>
                  <CardContent>
                    <Typography fontWeight={700}>
                      {c.name} — Flat {c.flatNumber}
                    </Typography>
                    <Typography>{c.details}</Typography>
                    <Chip
                      label={c.status}
                      color={STATUS_COLORS[c.status]}
                      sx={{ mt: 1 }}
                    />
                  </CardContent>

                  <CardActions>
                    <Button onClick={() => setPreview(c)}>Preview</Button>

                    <Button
                      onClick={() =>
                        updateStatus(
                          id,
                          c.status === "Pending"
                            ? "In Progress"
                            : "Resolved"
                        )
                      }
                    >
                      Advance Status
                    </Button>

                    <Button color="error" onClick={() => handleDelete(id)}>
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

     <Dialog open={!!preview} onClose={() => setPreview(null)} fullWidth maxWidth="sm">
  <DialogTitle>Complaint Preview</DialogTitle>

  <DialogContent>
    <Typography sx={{ fontWeight: 700 }}>
      {preview?.name} — Flat {preview?.flatNumber}
    </Typography>

    <Typography sx={{ mt: 2 }}>
      {preview?.details}
    </Typography>

    {/* STATUS DROPDOWN */}
    <FormControl fullWidth sx={{ mt: 3 }}>
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

    <Button
      variant="contained"
      onClick={async () => {
        try {
          await axios.put(
            `${API_BASE}/complaints/${preview._id}/status`,
            { status: preview.status }
          );

          // update UI immediately
          setComplaints((prev) =>
            prev.map((c) =>
              c._id === preview._id
                ? { ...c, status: preview.status }
                : c
            )
          );

          setPreview(null);
        } catch (err) {
          alert("Failed to update status");
        }
      }}
    >
      Update Status
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