import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Paper,
  Stack,
  Divider,
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
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Complaints (Guard Panel)
      </Typography>

      {/* LOG STYLE LIST */}
      {complaints.map((c) => (
        <Paper
          key={c._id}
          elevation={0}
          sx={{
            mb: 2,
            p: 2,
            border: "1px solid #e5e7eb",
            borderRadius: 2,
            background: "#ffffff",
          }}
        >
          {/* NAME */}
          <Typography sx={{ fontWeight: 700, fontSize: 15 }}>
            {c.name} — {c.flatNumber}
          </Typography>

          {/* MESSAGE */}
          <Typography sx={{ mt: 0.5, color: "#374151", fontSize: 14 }}>
            {c.details}
          </Typography>

          {/* STATUS */}
          <Typography sx={{ mt: 0.5, fontSize: 13, color: "#6b7280" }}>
            Status: <strong>{c.status}</strong>
          </Typography>

          <Divider sx={{ my: 1.5 }} />

          {/* ACTION BUTTONS */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ flexWrap: "wrap", rowGap: 1 }}
          >
            <Button
              size="small"
              variant={c.status === "Pending" ? "contained" : "outlined"}
              onClick={() => updateStatus(c._id, "Pending")}
            >
              Pending
            </Button>

            <Button
              size="small"
              variant={c.status === "In Progress" ? "contained" : "outlined"}
              onClick={() => updateStatus(c._id, "In Progress")}
            >
              In Progress
            </Button>

            <Button
              size="small"
              color="success"
              variant={c.status === "Resolved" ? "contained" : "outlined"}
              onClick={() => updateStatus(c._id, "Resolved")}
            >
              Resolved
            </Button>

            <Box sx={{ flexGrow: 1 }} />

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
          </Stack>
        </Paper>
      ))}

      {/* PREVIEW DIALOG */}
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

      {/* SNACKBAR */}
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