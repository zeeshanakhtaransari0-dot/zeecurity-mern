import React from "react";
import { Box, Typography, Card, CardContent, Grid, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function ResidentHome() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Welcome Aman Sharma
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Important Notices
              </Typography>
              <Typography variant="body2" sx={{ color: "#555", mb: 2 }}>
                View all latest society notices and announcements.
              </Typography>
              <Button variant="contained" component={RouterLink} to="/resident/notices">
                View Notices
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Raise a Complaint
              </Typography>
              <Typography variant="body2" sx={{ color: "#555", mb: 2 }}>
                Register complaints about society services or issues.
              </Typography>
              <Button variant="contained" component={RouterLink} to="/resident/complaints">
                File Complaint
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Maintenance Payments
              </Typography>
              <Typography variant="body2" sx={{ color: "#555", mb: 2 }}>
                View payment history and track pending dues.
              </Typography>
              <Button variant="contained" component={RouterLink} to="/resident/payments">
                View Payments
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Emergency SOS
              </Typography>
              <Typography variant="body2" sx={{ color: "#555", mb: 2 }}>
                Send urgent help alert to society security team.
              </Typography>
              <Button variant="contained" color="error" component={RouterLink} to="/resident/sos">
                Send SOS
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
