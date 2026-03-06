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
    <Box sx={{ p: 3, ml: "220px" }}>

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
              height: 400,
              overflowY: "auto",
              border: "1px solid #ddd",
              borderRadius: 2,
              p: 2,
              mb: 2
            }}
          >
            {messages.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No messages yet
              </Typography>
            ) : (
             messages.map((m) => (
  <Typography key={m._id} sx={{ mb: 1 }}>
    <b>{m.senderRole === "guard" ? "Guard" : "Admin"}:</b> {m.message}
  </Typography>
))
            )}
          </Box>

          {/* Send message */}
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

        </CardContent>
      </Card>

    </Box>
  );
}