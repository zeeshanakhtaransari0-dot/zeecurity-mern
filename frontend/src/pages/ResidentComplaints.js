// src/pages/ResidentComplaints.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
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

export default function ResidentComplaints() {
  const residentName = localStorage.getItem("residentName") || "";
  const residentFlat = localStorage.getItem("residentFlat") || "";

  const [details, setDetails] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [preview, setPreview] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: "", type: "success" });

  useEffect(() => {
    fetchComplaints();
  }, []);

  async function fetchComplaints() {
    try {
      const res = await axios.get(`${API_BASE}/complaints`);
      const mine = res.data.filter(
        (c) => c.flatNumber === residentFlat
      );
      setComplaints(mine);
    } catch {
      setSnack({ open: true, msg: "Failed to load complaints", type: "error" });
    }
  }

  async function submitComplaint(e) {
    e.preventDefault();

    if (!details.trim()) {
      setSnack({ open: true, msg: "Enter complaint details", type: "warning" });
      return;
    }

    try {
      await axios.post(`${API_BASE}/complaints`, {
        name: residentName,
        flatNumber: residentFlat,
        details,
        status: "Pending",
      });

      setDetails("");
      fetchComplaints();
      setSnack({ open: true, msg: "Complaint submitted", type: "success" });
    } catch {
      setSnack({ open: true, msg: "Submit failed", type: "error" });
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Raise a Complaint
      </Typography>

      {/* SUBMIT FORM */}
      <Box component="form" onSubmit={submitComplaint} sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField label="Name" value={residentName} fullWidth disabled />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="Flat" value={residentFlat} fullWidth disabled />
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

      {/* LIST */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        My Complaints
      </Typography>

      <Grid container spacing={2}>
        {complaints.map((c) => (
          <Grid item xs={12} md={6} key={c._id}>
            <Card>
              <CardContent>
                <Typography fontWeight={700}>
                  Status: {c.status}
                </Typography>
                <Typography sx={{ mt: 1 }}>
                  {c.details}
                </Typography>

                <Button
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => setPreview(c)}
                >
                  Preview
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* PREVIEW */}
      <Dialog open={!!preview} onClose={() => setPreview(null)}>
        <DialogTitle>Complaint Preview</DialogTitle>
        <DialogContent>
          <Typography fontWeight={700}>
            {preview?.name} — {preview?.flatNumber}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            {preview?.details}
          </Typography>
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