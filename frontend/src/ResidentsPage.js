import React, { useEffect, useState } from "react";

import { Box, Typography, Card, CardContent, CircularProgress } from "@mui/material";



export default function ResidentsPage() {
  
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResidents();
  }, []);

 const fetchResidents = () => {
  try {
    const stored =
      JSON.parse(localStorage.getItem("loggedResidents")) || [];

    setResidents(stored);
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
            <Typography variant="caption">
            Logged at: {r.createdAt ? new Date(r.createdAt).toLocaleString() : "N/A"}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}