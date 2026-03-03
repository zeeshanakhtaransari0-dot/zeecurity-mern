import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  Grid,
} from "@mui/material";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import QRScanner from "../components/QRScanner";

export default function GuardPreApproved() {
  const [code, setCode] = useState("");
  const [visitor, setVisitor] = useState(null);
  const [history, setHistory] = useState([]);

  // 🔎 Search Visitor
  const fetchVisitor = async (scannedCode) => {
  const codeToUse = scannedCode || code;
  if (!codeToUse) return;

  try {
    const res = await axios.get(
      `https://zeecurity-backend.onrender.com/api/preapproved/${codeToUse}`
    );
    setVisitor(res.data);
    console.log(visitor);
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
        {/* 📷 QR Scanner Section */}
<Card sx={{ p: 3, mb: 3 }}>
  <QRScanner
    onScan={(decodedText) => {
      const extractedCode = decodedText.split("/").pop();
      setCode(extractedCode);
      fetchVisitor(extractedCode);
    }}
  />
</Card>

        {/* 👤 Visitor Details */}
        {visitor && (
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography fontWeight={600}><strong>
              Name:</strong> {visitor.visitorName}
            </Typography>
            <Typography><strong>Flat:</strong> {visitor.flatNumber}</Typography>
            <Typography><strong>Work:</strong> {visitor.workType}</Typography>
            <Typography><strong>Age:</strong> {visitor.age}</Typography>
            <Typography><strong>Phone:</strong> {visitor.phone}</Typography>
            <Typography><strong>Resident:</strong> {visitor.residentName}</Typography>
            <Typography><strong>Resident Phone:</strong> {visitor.residentPhone}</Typography>
            <Typography><strong>Status:</strong> {visitor.status}</Typography>

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