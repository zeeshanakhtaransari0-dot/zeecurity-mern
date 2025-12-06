// src/ResidentsPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Grid, Card, CardContent, Typography, Avatar, TextField, Button } from "@mui/material";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

export default function ResidentsPage() {
  const [residents, setResidents] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => { fetchResidents(); }, []);

  async function fetchResidents() {
    try {
      const res = await axios.get(`${API_BASE}/residents`); // you need backend route; else supply static
      const data = Array.isArray(res.data) ? res.data : (res.data.residents || []);
      setResidents(data);
    } catch (err) {
      console.error("fetchResidents", err);
      // Fallback demo data
      setResidents([
        { _id: "r-1", name: "Aman Kumar", flat: "A-101", phone: "98765" },
        { _id: "r-2", name: "Riya Sharma", flat: "B-201", phone: "91234" },
      ]);
    }
  }

  const filtered = residents.filter(r => !q || r.name.toLowerCase().includes(q.toLowerCase()) || (r.flat||"").toLowerCase().includes(q.toLowerCase()));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Residents</Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField value={q} onChange={e => setQ(e.target.value)} label="Search by name or flat" />
        <Button variant="contained" onClick={fetchResidents}>Refresh</Button>
      </Box>

      <Grid container spacing={2}>
        {filtered.map(r => (
          <Grid item xs={12} sm={6} md={4} key={r._id}>
            <Card>
              <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Avatar src={`https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=1976d2&color=fff`} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 700 }}>{r.name}</Typography>
                  <Typography variant="body2" color="text.secondary">Flat: {r.flat || r.flatNumber}</Typography>
                  <Typography variant="body2" color="text.secondary">Phone: {r.phone || "-"}</Typography>
                </Box>
                <Box>
                  <Button size="small" variant="outlined" sx={{ mb: 1 }}>View</Button><br/>
                  <Button size="small" variant="contained">Message</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
