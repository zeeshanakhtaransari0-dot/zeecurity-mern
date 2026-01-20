// src/admin/AdminResidents.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AdminResidents() {
  const navigate = useNavigate();
  const [residents, setResidents] = useState([]);

  // 🔐 ADMIN PROTECTION
  useEffect(() => {
    if (localStorage.getItem("role") !== "admin") {
      navigate("/");
      return;
    }

    const stored =
      JSON.parse(localStorage.getItem("loggedResidents")) || [];

    setResidents(stored);
  }, [navigate]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Residents (Monitoring Mode)
      </Typography>

      {residents.length === 0 ? (
        <Typography color="text.secondary">
          No residents have logged in yet.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {residents.map((r, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography fontWeight={600}>
                    Name: {r.name}
                  </Typography>
                  <Typography>
                    Flat: {r.flatNumber || "—"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Logged at:{" "}
                    {new Date(r.createdAt).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Typography
        variant="caption"
        sx={{ display: "block", mt: 3, color: "text.secondary" }}
      >
        * Admin can only monitor residents in Phase-1
      </Typography>
    </Box>
  );
}