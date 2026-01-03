import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";

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
      setLoading(true);
      const res = await axios.get(`${API_BASE}/residents`);
      setResidents(res.data || []);
    } catch (err) {
      console.error("Failed to fetch residents", err);
      setError("Unable to load residents");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Residents Logged In
      </Typography>

      {/* 🔄 Loading */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* ❌ Error */}
      {!loading && error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* ℹ️ No Residents */}
      {!loading && !error && residents.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No residents have logged in yet.
        </Alert>
      )}

      {/* ✅ Residents List */}
      {!loading &&
        !error &&
        residents.map((r, i) => (
          <Card key={r._id || i} sx={{ mb: 2 }}>
            <CardContent>
              <Typography>
                <strong>Name:</strong> {r.name}
              </Typography>
              <Typography>
                <strong>Flat:</strong> {r.flatNumber}
              </Typography>
              {r.createdAt && (
                <Typography variant="caption" color="text.secondary">
                  Logged at: {new Date(r.createdAt).toLocaleString()}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
    </Box>
  );
}