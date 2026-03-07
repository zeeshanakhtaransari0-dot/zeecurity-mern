import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import axios from "axios";

const API_BASE = "https://zeecurity-backend.onrender.com/api";

export default function GuardRoster() {
  const [guards, setGuards] = useState([]);

  const fetchGuards = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users`);
      
      const onlyGuards = res.data.filter(
        (u) => u.role && u.role.toLowerCase() === "guard"
      );

      setGuards(onlyGuards);
    } catch (err) {
      console.error("Guard fetch error:", err);
    }
  };

  useEffect(() => {
    fetchGuards();
  }, []);

  return (
    <Box sx={{ ml: "220px", p: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Guard Duty Roster
      </Typography>

      <Grid container spacing={3}>
        {guards.map((g) => (
          <Grid item xs={12} md={4} key={g._id}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>

                <Typography variant="h6" fontWeight={700}>
                  {g.name}
                </Typography>

                <Typography>
                  🚪 Gate: {g.gate || "Not Assigned"}
                </Typography>

                <Typography>
                  ⏰ Duty Time: {g.dutyTime || "Not Set"}
                </Typography>

                <Typography>
                  📋 Duty: {g.dutyAssigned || "General Security"}
                </Typography>

                <Typography>
                  📞 Phone: {g.phone || "Not Available"}
                </Typography>
            <Typography
 sx={{
  mt:1,
  fontWeight:600,
  color: g.dutyTime === "10 PM - 6 AM" ? "#ef4444" : "#22c55e"
 }}
>
{g.dutyTime === "10 PM - 6 AM" ? "🔴 Off Duty" : "🟢 On Duty"}
</Typography>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}