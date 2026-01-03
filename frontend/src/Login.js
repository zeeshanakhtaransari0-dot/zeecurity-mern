import React from "react";
import { Button } from "@mui/material";

export default function Login() {
  return (
    <div style={{ padding: 50 }}>
      <h1>CLICK TEST</h1>

      <Button
        variant="contained"
        onClick={() => {
          alert("🔥 BUTTON CLICKED");
          console.log("🔥 BUTTON CLICKED");
        }}
      >
        CLICK ME
      </Button>
    </div>
  );
}