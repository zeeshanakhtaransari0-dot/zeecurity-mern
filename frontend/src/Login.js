import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

export default function Login() {
  const [name, setName] = useState("");
  const [flat, setFlat] = useState("");
  const navigate = useNavigate();

  const handleResidentLogin = () => {
    if (!name || !flat) {
      alert("Please enter name and flat number");
      return;
    }

    localStorage.setItem("residentName", name);
    localStorage.setItem("residentFlat", flat);

    navigate("/resident");
  };

  const handleGuardLogin = () => {
    navigate("/guard");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
       background: "radial-gradient(circle at top, #2a3f47, #3b5b66, #4f7d8b)",
      }}
    >
      <Paper elevation={10} sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Zeecurity Login
        </Typography>

        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Flat Number"
          fullWidth
          margin="normal"
          value={flat}
          onChange={(e) => setFlat(e.target.value)}
        />

       <Button
  variant="contained"
  fullWidth
  disabled
  sx={{
    mt: 2,
    backgroundColor: "#ffffff",
    color: "#1976d2",          // MUI blue
    fontWeight: 600,
    opacity: 1,
    "&.Mui-disabled": {
      backgroundColor: "#ffffff",
      color: "#1976d2",
      opacity: 1,
    },
  }}
>
  CONTINUE
</Button>

        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 1 }}
          onClick={handleGuardLogin}
        >
          Guard Panel
        </Button>
      </Paper>
    </Box>
  );
}




