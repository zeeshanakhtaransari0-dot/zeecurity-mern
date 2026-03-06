import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://zeecurity-backend.onrender.com/api";

export default function AdminChat() {
    const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error("Fetch message error:", err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      await axios.post(`${API_BASE}/messages`, {
        senderRole: "admin",
        senderName: "Admin",
        message: text
      });

      setText("");
      fetchMessages();

    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  useEffect(() => {
  fetchMessages();

  const interval = setInterval(() => {
    fetchMessages();
  }, 2000); // refresh every 2 seconds

  return () => clearInterval(interval);
}, []);

  return (
    <Box sx={{ p: 3, ml: "220px" }}>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Guard ↔ Admin Chat
      </Typography>
       <Button
          variant="outlined"
          color="error"
          onClick={() => navigate("/guard")}
        >
          Exit
        </Button>

      <Box
        sx={{
          border: "1px solid #ddd",
          borderRadius: 2,
          height: 400,
          overflowY: "auto",
          p: 2,
          mb: 2
        }}
      >

        {messages.map((m) => (
          <Typography key={m._id}>
            <b>{m.senderName}:</b> {m.message}
          </Typography>
        ))}

      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>

        <TextField
          fullWidth
          placeholder="Type message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <Button variant="contained" onClick={sendMessage}>
          Send
        </Button>

      </Box>

    </Box>
  );
}