import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import axios from "axios";
import Sidebar from "../components/Sidebar";

export default function GuardPreApproved() {
  const [code, setCode] = useState("");
  const [visitor, setVisitor] = useState(null);
  const [history, setHistory] = useState([]);

  // 🔎 Search Visitor
  const fetchVisitor = async () => {
    if (!code) return;

    try {
      const res = await axios.get(
       `https://zeecurity-backend.onrender.com/api/preapproved/${code}`
      );
      setVisitor(res.data);
    } catch (err) {
      alert("Visitor not found");
      setVisitor(null);
    }
  };

  // ✅ Approve
  const approveVisitor = async () => {
    await axios.put(
 `https://zeecurity-backend.onrender.com/api/preapproved/${visitor.uniqueCode}/approve`
);
    fetchVisitor();
    fetchHistory();
  };

  // ❌ Reject
  const rejectVisitor = async () => {
   await axios.put(
  `https://zeecurity-backend.onrender.com/api/preapproved/${visitor.uniqueCode}/reject`
);
    fetchVisitor();
    fetchHistory();
  };

  // 📋 History
  const fetchHistory = async () => {
    const res = await axios.get(
      "https://zeecurity-backend.onrender.com/api/preapproved"
    );
    setHistory(res.data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <>
      <Sidebar />

      <Box sx={{ ml: "220px", p: 3 }}>
        <Typography variant="h4" fontWeight={700} mb={3}>
          Pre-Approved Visitors
        </Typography>

        {/* 🔍 Search Section */}
        <Card sx={{ p: 3, mb: 3 }}>
          <TextField
            fullWidth
            label="Enter Unique Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button variant="contained" onClick={fetchVisitor}>
            Search
          </Button>
        </Card>

        {/* 👤 Visitor Details */}
        {visitor && (
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography fontWeight={600}>
              Name: {visitor.visitorName}
            </Typography>
            <Typography>Flat: {visitor.flatNumber}</Typography>
            <Typography>Work: {visitor.workType}</Typography>
            <Typography>Status: {visitor.status}</Typography>

            {visitor.status === "pending" && (
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ mr: 2 }}
                  onClick={approveVisitor}
                >
                  Approve
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  onClick={rejectVisitor}
                >
                  Reject
                </Button>
              </Box>
            )}
          </Card>
        )}

        {/* 📊 History Table */}
        <Typography variant="h6" mb={2}>
          Visitor History
        </Typography>

        <Grid container spacing={2}>
          {history.map((v) => (
            <Grid item xs={12} md={6} key={v._id}>
              <Card sx={{ p: 2 }}>
                <Typography fontWeight={600}>
                  {v.visitorName}
                </Typography>
                <Typography>Flat: {v.flatNumber}</Typography>
                <Typography>Work: {v.workType}</Typography>
                <Typography>Status: {v.status}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}