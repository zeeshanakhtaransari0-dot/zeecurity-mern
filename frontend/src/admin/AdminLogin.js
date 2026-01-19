import React, { useState } from "react";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../assets/zeecurity_logo.png";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminLogin = () => {
    // 🔒 DEMO LOGIN (INTENTIONAL)
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("role", "admin");
      localStorage.setItem("adminName", "System Admin");
      navigate("/admin");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg,#020617,#0f172a)",
      }}
    >
      <Paper sx={{ p: 4, width: 360, textAlign: "center", borderRadius: 3 }}>
        <img src={logo} alt="Zeecurity" width={80} />

        <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
          Admin Access
        </Typography>

        <TextField
          fullWidth
          label="Admin Username"
          sx={{ mb: 2 }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          sx={{ mb: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleAdminLogin}
        >
          Login
        </Button>

        <Typography variant="caption" sx={{ display: "block", mt: 2 }}>
          Restricted access • Admin only
        </Typography>
      </Paper>
    </Box>
  );
}