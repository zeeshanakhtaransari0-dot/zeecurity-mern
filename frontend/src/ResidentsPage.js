import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Card, CardContent } from "@mui/material";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://zeecurity-backend.onrender.com/api";

export default function ResidentsPage() {
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const res = await axios.get(`${API_BASE}/residents`);
      setResidents(res.data);
    } catch (err) {
      console.error("Failed to fetch residents", err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Residents Logged In
      </Typography>

      {residents.map((r, i) => (
        <Card key={i} sx={{ mb: 2 }}>
          <CardContent>
            <Typography>Name: {r.name}</Typography>
            <Typography>Flat: {r.flatNumber}</Typography>
            <Typography variant="caption">
              Logged at: {new Date(r.createdAt).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}