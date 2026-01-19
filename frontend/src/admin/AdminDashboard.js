import React, { useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("role") !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  const stats = [
    { label: "Total Residents", value: 128 },
    { label: "Total Guards", value: 6 },
    { label: "Total Complaints", value: 34 },
    { label: "SOS Alerts", value: 3 },
    { label: "Payments Records", value: 412 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={2}>
        {stats.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.label}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography
        variant="caption"
        sx={{ display: "block", mt: 3, color: "text.secondary" }}
      >
        * Admin panel is currently in monitoring mode (read-only)
      </Typography>
    </Box>
  );
}