import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Card, CardContent, CircularProgress } from "@mui/material";

const API_BASE = "https://zeecurity-backend.onrender.com/api";

export default function ResidentsPage() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const res = await axios.get(`${API_BASE}/residentsessions`);
      setResidents(res.data);
    } catch (err) {
      console.error("❌ Failed to load residents:", err);
      setError("Failed to load residents");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (residents.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>No residents logged in yet</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Residents Logged In
      </Typography>

      {residents.map((r) => (
        <Card key={r._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography><b>Name:</b> {r.name}</Typography>
            <Typography><b>Flat:</b> {r.flatNumber}</Typography>
            <Typography>
              <b>Status:</b>{" "}
              {r.status === "online" ? "🟢 Online" : "🔴 Offline"}
            </Typography>
            <Typography variant="caption">
              Logged at: {r.loginTime ? new Date(r.loginTime).toLocaleString() : "N/A"}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}