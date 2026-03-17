import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent,Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const API_BASE = "https://zeecurity-backend.onrender.com/api";

export default function GuardRoster() {
  const navigate = useNavigate();
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
  <Box sx={{ p: 3 }}>

    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2
      }}
    >
      <Typography variant="h5" fontWeight={600}>
        Guard Roster
      </Typography>

      <Button
        variant="outlined"
        color="error"
        onClick={() => navigate("/admin")}
        sx={{ borderRadius: 2 }}
      >
        EXIT
      </Button>
    </Box>
       

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