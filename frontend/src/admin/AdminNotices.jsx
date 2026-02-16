import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const fetchNotices = async () => {
    try {
      const res = await axios.get(
        "https://zeecurity-backend.onrender.com/api/notices"
      );
      setNotices(res.data);
    } catch (err) {
      console.error("Notice fetch error:", err);
    }
  };

  const addNotice = async () => {
    if (!title || !message) return;

    try {
      await axios.post(
        "https://zeecurity-backend.onrender.com/api/notices",
        { title, message }
      );

      setTitle("");
      setMessage("");
      fetchNotices();
    } catch (err) {
      console.error("Add notice error:", err);
    }
  };

  const deleteNotice = async (id) => {
    try {
      await axios.delete(
        `https://zeecurity-backend.onrender.com/api/notices/${id}`
      );
      fetchNotices();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <Box sx={{ ml: "220px", p: 3 }}>
        <Typography variant="h4" fontWeight={700} mb={3}>
          Notice Panel
        </Typography>

        {/* Add Notice Card */}
        <Card sx={{ p: 3, mb: 3 }}>
          <TextField
            fullWidth
            label="Notice Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Notice Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button variant="contained" onClick={addNotice}>
            Post Notice
          </Button>
        </Card>

        {/* Notice List */}
        {notices.map((notice) => (
          <Card key={notice._id} sx={{ p: 2, mb: 2 }}>
            <Typography fontWeight={600}>
              {notice.title}
            </Typography>

            <Typography sx={{ my: 1 }}>
              {notice.message}
            </Typography>

            <Button
              color="error"
              onClick={() => deleteNotice(notice._id)}
            >
              Delete
            </Button>
          </Card>
        ))}
      </Box>
    </>
  );
}