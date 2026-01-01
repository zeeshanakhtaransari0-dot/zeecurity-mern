import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("guard");
  const [username, setUsername] = useState("");
  const [flat, setFlat] = useState("");

  const handleLogin = async () => {
    if (!username.trim()) {
      alert("Please enter name");
      return;
    }

    // 🔹 GUARD LOGIN
    if (role === "guard") {
      localStorage.setItem("role", "guard");
      navigate("/guard");
      return;
    }

    // 🔹 RESIDENT LOGIN
    if (!flat.trim()) {
      alert("Please enter flat number");
      return;
    }

    try {
      await fetch(`${process.env.REACT_APP_API_BASE}/residents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: username.trim(),
          flatNumber: flat.trim(),
        }),
      });

      localStorage.setItem("residentName", username.trim());
      localStorage.setItem("residentFlat", flat.trim());
      localStorage.setItem("role", "resident");

      navigate("/resident");
    } catch (err) {
      console.error("Resident login failed", err);
      alert("Server error");
    }
  };
console.log("Current role:", role);
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f4f6",
      }}
    >
      <Card sx={{ p: 4, width: 350, textAlign: "center", borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Zeecurity Login
        </Typography>

        <ToggleButtonGroup
  color="primary"
  value={role}
  exclusive
  onChange={(e, newRole) => {
    if (newRole !== null) setRole(newRole);
  }}
  sx={{ mb: 3 }}
  fullWidth
>
  <ToggleButton value="guard">Guard</ToggleButton>
  <ToggleButton value="resident">Resident</ToggleButton>
</ToggleButtonGroup>

        <TextField
          fullWidth
          label="Name"
          sx={{ mb: 2 }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {role === "resident" && (
          <TextField
            fullWidth
            label="Flat Number"
            sx={{ mb: 2 }}
            value={flat}
            onChange={(e) => setFlat(e.target.value)}
          />
        )}

        <Button fullWidth variant="contained" onClick={handleLogin}>
          Continue
        </Button>
      </Card>
    </Box>
  );
}