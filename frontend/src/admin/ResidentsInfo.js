import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Grid, Card, Typography } from "@mui/material";

export default function ResidentsInfo() {

  const [residents, setResidents] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [visitors, setVisitors] = useState([]);

  const API = "https://zeecurity-backend.onrender.com/api";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {

      const r = await axios.get(`${API}/residents`);
      const c = await axios.get(`${API}/complaints`);
      const v = await axios.get(`${API}/preapproved`);

      setResidents(r.data);
      setComplaints(c.data);
      setVisitors(v.data);

    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  const getStatus = (flat) => {

    const complaint = complaints.find(c => c.flatNumber === flat);
    const visitor = visitors.find(v => v.flatNumber === flat);

    if (complaint) return "🔴 Complaint Active";
    if (visitor) return "🟡 Visitor Expected";

    return "🟢 Normal";
  };

  return (
    <Box sx={{ p: 3 }}>

      <Typography variant="h4" fontWeight={700} mb={3}>
        Residents Info
      </Typography>

      <Grid container spacing={3}>

        {residents.map((r, i) => (

          <Grid item xs={12} md={4} key={i}>

            <Card sx={{ p:2 }}>

              <Typography variant="h6">
                {r.name}
              </Typography>

              <Typography>
                Flat: {r.flatNumber}
              </Typography>

              <Typography>
                Phone: {r.phone || "Not Available"}
              </Typography>

              <Typography>
                Complaint: {
                  complaints.some(c => c.flatNumber === r.flatNumber)
                  ? "Yes"
                  : "None"
                }
              </Typography>

              <Typography>
                Visitors: {
                  visitors.filter(v => v.flatNumber === r.flatNumber).length
                }
              </Typography>

              <Typography sx={{ mt:1, fontWeight:600 }}>
                Status: {getStatus(r.flatNumber)}
              </Typography>

            </Card>

          </Grid>

        ))}

      </Grid>

    </Box>
  );
}