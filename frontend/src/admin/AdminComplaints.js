import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://zeecurity-backend.onrender.com/api";

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/complaints`)
      .then((res) => setComplaints(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Complaints (Admin View)
      </Typography>

      <Grid container spacing={2}>
        {complaints.map((c) => (
          <Grid item xs={12} md={6} key={c._id}>
            <Card>
              <CardContent>
                <Typography fontWeight={600}>
                  {c.name} — Flat {c.flatNumber}
                </Typography>
                <Typography sx={{ mt: 1 }}>{c.details}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Status: {c.status || "Pending"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {complaints.length === 0 && (
        <Typography color="text.secondary">
          No complaints found
        </Typography>
      )}
    </Box>
  );
}