import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://zeecurity-backend.onrender.com/api";

export default function AdminTodo() {
    const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

 useEffect(() => {
   fetchTasks();
 
   const interval = setInterval(() => {
     fetchTasks();
   }, 2000); // 🔁 every 2 seconds
 
   return () => clearInterval(interval);
 }, []);
 
  const addTask = async () => {
    if (!text.trim()) return;

    try {
      await axios.post(`${API_BASE}/tasks`, {
        title: text
      });

      setText("");
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
  <Box sx={{ p: 3 }}>

   <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 2
  }}
>
  <Typography variant="h5">
    Manage Tasks
  </Typography>

  <Button
    variant="outlined"
    color="error"
    onClick={() => navigate("/admin")}
  >
    EXIT
  </Button>
</Box>

    {/* Input */}
    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
      <TextField
        fullWidth
        placeholder="Enter task..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <Button variant="contained" onClick={addTask}>
        Add
      </Button>
    </Box>

    {/* List */}
    {tasks.map((task) => (
      <Card
        key={task._id}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: task.completed
            ? "#e8f5e9"
            : "#f5f7fb"
        }}
      >
        <Typography
          sx={{
            textDecoration: task.completed ? "line-through" : "none",
            fontWeight: 500
          }}
        >
          {task.title}
        </Typography>

        <Typography
          sx={{
            fontSize: 12,
            color: task.completed ? "green" : "orange",
            fontWeight: 600
          }}
        >
          {task.completed ? "Done" : "Pending"}
        </Typography>
      </Card>
    ))}

  </Box>
);
}