import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";

const API_BASE = "https://zeecurity-backend.onrender.com/api";

export default function AdminVisitors() {
  const [visitors, setVisitors] = useState([]);

  const fetchVisitors = async () => {
    try {
      const res = await axios.get(`${API_BASE}/preapproved`);
      setVisitors(res.data);
    } catch (err) {
      console.error("Visitors fetch error:", err);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  return (
    <Box sx={{ p: 5 }}>
      <Typography variant="h4">
        Visitor Monitoring
      </Typography>

      <Grid container spacing={4}>
        {visitors.map((v) => (
          <Grid key={v._id}>
            <Card sx={{ p: 1 }}>
              <CardContent>
                <Typography fontWeight={700}>
                  {v.visitorName}
                </Typography>

                <Typography>
                  Flat: {v.flatNumber}
                </Typography>

                <Typography>
                  Work: {v.workType}
                </Typography>

                <Typography>
                  Resident: {v.residentName}
                </Typography>

                <Typography>
                  Phone: {v.phone}
                </Typography>

                <Typography
  sx={{
    mt: 1,
    fontWeight: 600,
    color:
      v.status === "approved"
        ? "#22c55e"
        : v.status === "pending"
        ? "#facc15"
        : "#ef4444"
  }}
>
Status: {v.status}
</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
