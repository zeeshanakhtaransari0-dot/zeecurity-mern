import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Card, TextField, Button, Typography, ToggleButtonGroup, ToggleButton
} from "@mui/material";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("guard");

  const handleLogin = () => {
    if (role === "guard") navigate("/guard");
    else navigate("/resident");
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f3f4f6" }}>
      <Card sx={{ p: 4, width: 350, textAlign: "center", borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Zeecurity Login
        </Typography>

        <ToggleButtonGroup
          value={role}
          exclusive
          onChange={(e, value) => value && setRole(value)}
          sx={{ mb: 3 }}
        >
          <ToggleButton value="guard">Guard</ToggleButton>
          <ToggleButton value="resident">Resident</ToggleButton>
        </ToggleButtonGroup>

        <TextField fullWidth label="Email" sx={{ mb: 2 }} />
        <TextField fullWidth type="password" label="Password" sx={{ mb: 3 }} />

        <Button fullWidth variant="contained" onClick={handleLogin}>
          Continue
        </Button>
      </Card>
    </Box>
  );
}
