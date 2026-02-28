import React, { useEffect, useState } from "react";
import { Box, Typography, Card, Grid } from "@mui/material";
import axios from "axios";
import ResidentSidebar from "../components/ResidentSidebar";

export default function ResidentPreApproved() {
  const [visitors, setVisitors] = useState([]);

  const fetchVisitors = async () => {
    const res = await axios.get(
     "https://zeecurity-backend.onrender.com/api/preapproved"
    );

    // Filter only this resident's visitors
    const residentName = localStorage.getItem("residentName");

    const myVisitors = res.data.filter(
      (v) => v.residentName === residentName
    );

    setVisitors(myVisitors);
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  return (
    <>
      <ResidentSidebar />
      <Box sx={{ ml: "220px", p: 3 }}>
        <Typography variant="h4" mb={3}>
          My Visitors
        </Typography>

        <Grid container spacing={2}>
          {visitors.map((v) => (
            <Grid item xs={12} md={6} key={v._id}>
              <Card sx={{ p: 2 }}>
                <Typography fontWeight={600}>
                  {v.visitorName}
                </Typography>
                <Typography>Work: {v.workType}</Typography>
                <Typography>
                  Status:{" "}
                  <strong
                    style={{
                      color:
                        v.status === "approved"
                          ? "green"
                          : v.status === "rejected"
                          ? "red"
                          : "orange",
                    }}
                  >
                    {v.status}
                  </strong>
                </Typography>

                {v.status === "approved" && (
                  <Typography sx={{ color: "green", mt: 1 }}>
                    Visitor has entered the building 🚪
                  </Typography>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}