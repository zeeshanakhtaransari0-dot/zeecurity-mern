import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
} from "@mui/material";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

export default function PreApprovedVisitor() {
  const [form, setForm] = useState({
    visitorName: "",
    age: "",
    phone: "",
    workType: "",
    companyName: "",
    flatNumber: localStorage.getItem("residentFlat") || "",
    residentName: localStorage.getItem("residentName") || "",
    residentPhone: "",
  });

  const [qrValue, setQrValue] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
      "https://zeecurity-backend.onrender.com/api/preapproved",
  form
      );

      setQrValue(res.data.uniqueCode);
    } catch (err) {
      console.error("Create pre-approved error:", err);
    }
  };

  return (
    <Box sx={{ p: 3, ml: "220px" }}>
      <Typography variant="h4" mb={3}>
        Pre-Approved Visitor
      </Typography>

      <Card sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          label="Visitor Name"
          name="visitorName"
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Age"
          name="age"
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Phone"
          name="phone"
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Work Type"
          name="workType"
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Company Name"
          name="companyName"
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Resident Phone"
          name="residentPhone"
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <Button variant="contained" onClick={handleSubmit}>
          Generate QR
        </Button>
      </Card>

      {qrValue && (
        <Card sx={{ p: 3, textAlign: "center" }}>
          <Typography mb={2}>Share this QR with visitor</Typography>
          <QRCodeCanvas value={qrValue} size={200} />
        </Card>
      )}
    </Box>
  );
}