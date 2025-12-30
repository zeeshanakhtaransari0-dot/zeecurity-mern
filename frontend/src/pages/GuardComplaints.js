// src/pages/GuardComplaints.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://zeecurity-backend.onrender.com/api";

export default function GuardComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [preview, setPreview] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: "", type: "success" });

  useEffect(() => {
    fetchComplaints();
  }, []);

  async function fetchComplaints() {
    const res = await axios.get(`${API_BASE}/complaints`);
    setComplaints(res.data);
  }

  async function updateStatus(id, status) {
    try {
      await axios.put(`${API_BASE}/complaints/${id}/status`, { status });
      fetchComplaints();
    } catch {
      setSnack({ open: true, msg: "Update failed", type: "error" });
    }
  }

  async function deleteComplaint(id) {
    if (!window.confirm("Delete complaint?")) return;
    await axios.delete(`${API_BASE}/complaints/${id}`);
    fetchComplaints();
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Complaints (Guard Panel)
      </Typography>

      <Grid container spacing={2}>
        {complaints.map((c) => (
          <Grid item xs={12} md={6} key={c._id}>
            <Card>
              <CardContent>
                <Typography fontWeight={700}>
                  {c.name} — {c.flatNumber}
                </Typography>
                <Typography sx={{ mt: 1 }}>{c.details}</Typography>
                <Typography sx={{ mt: 1 }}>
                  Status: {c.status}
                </Typography>

                <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                  <Button size="small" onClick={() => updateStatus(c._id, "Pending")}>
                    Pending
                  </Button>
                  <Button size="small" onClick={() => updateStatus(c._id, "In Progress")}>
                    In Progress
                  </Button>
                  <Button size="small" onClick={() => updateStatus(c._id, "Resolved")}>
                    Resolved
                  </Button>
                </Box>

                <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                  <Button size="small" onClick={() => setPreview(c)}>
                    Preview
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => deleteComplaint(c._id)}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={!!preview} onClose={() => setPreview(null)}>
        <DialogTitle>Complaint Preview</DialogTitle>
        <DialogContent>
          <Typography fontWeight={700}>
            {preview?.name} — {preview?.flatNumber}
          </Typography>
          <Typography sx={{ mt: 2 }}>{preview?.details}</Typography>
          <Typography sx={{ mt: 2 }}>
            Status: {preview?.status}
          </Typography>
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
        <Alert severity={snack.type}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}