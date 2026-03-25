import { Box, Typography, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export default function EmergencyPage() {
    const navigate = useNavigate();
  return (
    <Box sx={{ p: 3 }}>

      <Typography variant="h5" fontWeight={700} mb={2}>
        Emergency Contact
      </Typography>

      <Typography mb={3}>
        Your safety is our priority. In case of any emergency,
        please contact the numbers below immediately.
      </Typography>

      <Card sx={{ p: 3, mb: 2 }}>
        <Typography><a href="tel:100">📞 Guard: +91 XXXXX XXXXX</a></Typography>
      </Card>

      <Card sx={{ p: 3, mb: 2 }}>
        <Typography><a href="tel:100">📞 Admin: +91 XXXXX XXXXX</a></Typography>
      </Card>

      <Card sx={{ p: 3, mb: 2 }}>
        <Typography><a href="tel:100">🚨 Police: 100</a></Typography>
      </Card>

      <Card sx={{ p: 3, mb: 2 }}>
        <Typography><a href="tel:100">🚑 Ambulance: 108</a></Typography>
      </Card>
<Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
  <Button
    variant="outlined"
    color="error"
    onClick={() => navigate("/resident")}
  >
    EXIT
  </Button>
</Box>
    </Box>
  );
}