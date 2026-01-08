import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Card, CardContent, CircularProgress } from "@mui/material";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://zeecurity-backend.onrender.com/api";

export default function ResidentsPage() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      console.log("📡 Fetching residents...");
      const res = await axios.get(`${API_BASE}/residents`, {
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      console.log("✅ Residents response:", res.data);

      if (!Array.isArray(res.data)) {
        throw new Error("Invalid response format");
      }

      setResidents(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch residents:", err);
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
            <Typography variant="caption">
              Logged at: {new Date(r.createdAt).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}