import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://zeecurity-backend.onrender.com/api";

export default function GuardChat() {
    const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const guardName = localStorage.getItem("guardName") || "Guard";

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error("Fetch message error:", err);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      await axios.post(`${API_BASE}/messages`, {
        senderRole: "guard",
        senderName: guardName,
        message: text,
      });

      setText("");
      fetchMessages();

    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  // Load messages
 useEffect(() => {
  fetchMessages();

  const interval = setInterval(() => {
    fetchMessages();
  }, 2000); // refresh every 2 seconds

  return () => clearInterval(interval);
}, []);

  return (
    <Box sx={{ p: 3 }}>

    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
  <Typography variant="h5">
    Guard ↔ Admin Chat
  </Typography>

  <Button
    variant="outlined"
    color="error"
    onClick={() => navigate("/guard")}
  >
    Exit
  </Button>
</Box>

      <Card>
        <CardContent>

          {/* Chat messages */}
          <Box
  sx={{
    border: "1px solid #e0e0e0",
    borderRadius: 3,
    height: 400,
    overflowY: "auto",
    p: 2,
    mb: 2,
    background: "#f9fafc"
  }}
>
  {messages.length === 0 ? (
    <Typography variant="body2" color="text.secondary">
      No messages yet
    </Typography>
  ) : (
    messages.map((m) => (
      <Box
        key={m._id}
        sx={{
          mb: 1.5,
          p: 1.5,
          borderRadius: 2,
          background: "#ffffff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          borderLeft: m.senderRole === "admin"
            ? "4px solid #1976d2"
            : "4px solid #4caf50"
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: m.senderRole === "admin" ? "#1976d2" : "#2e7d32"
          }}
        >
          {m.senderRole === "admin" ? "Admin" : "Guard"}
        </Typography>

        <Typography variant="body2">
          {m.message}
        </Typography>
      </Box>
    ))
  )}
</Box>
<Box
  sx={{
    display: "flex",
    gap: 1,
    background: "#fff",
    p: 1,
    borderRadius: 2,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
  }}
>
  <TextField
    fullWidth
    placeholder="Type message..."
    value={text}
    onChange={(e) => setText(e.target.value)}
    size="small"
  />

  <Button
    variant="contained"
    onClick={sendMessage}
    sx={{ borderRadius: 2, px: 3 }}
  >
    Send
  </Button>
</Box>
        </CardContent>
      </Card>

    </Box>
  );
}