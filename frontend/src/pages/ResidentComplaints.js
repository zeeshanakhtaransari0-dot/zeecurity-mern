// src/pages/ResidentComplaints.js
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
} from "@mui/material";

const API_BASE = "https://zeecurity-backend.onrender.com/api";

export default function ResidentComplaints() {
  const residentName = localStorage.getItem("residentName") || "";
  const residentFlat = localStorage.getItem("residentFlat") || "";

  const [details, setDetails] = useState("");

  // ✅ wrapped with useCallback
  const fetchComplaints = useCallback(async () => {
    try {
      await axios.get(`${API_BASE}/complaints`);
      // complaints list not used in UI → safely ignored
    } catch (err) {
      console.error("Failed to load complaints", err);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const submitComplaint = async (e) => {
    e.preventDefault();
    if (!details.trim()) return;

    try {
      await axios.post(`${API_BASE}/complaints`, {
        name: residentName,
        flatNumber: residentFlat,
        details,
        status: "Pending",
      });

      setDetails("");
      fetchComplaints();
    } catch (err) {
      console.error("Submit failed", err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Raise a Complaint
      </Typography>

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
    </Box>
  );
}