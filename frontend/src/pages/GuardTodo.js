import React, { useEffect, useState } from "react";
import { Box, Typography, Card, Checkbox,Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://zeecurity-backend.onrender.com/api";

export default function GuardTodo() {
    const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);

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
  const toggleDone = async (task) => {
    try {
      await axios.put(`${API_BASE}/tasks/${task._id}`, {
        completed: !task.completed
      });
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
    Today’s Tasks
  </Typography>

  <Button
    variant="outlined"
    color="error"
    onClick={() => navigate("/guard")}
  >
    EXIT
  </Button>
</Box>

     {tasks.map((task) => (
  <Card
    key={task._id}
    sx={{
      p: 2,
      mb: 2,
      borderRadius: 3,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: task.completed
        ? "#e8f5e9"
        : "#f5f7fb"
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      
      <Checkbox
        checked={task.completed}
        onChange={() => toggleDone(task)}
      />

      <Typography
        sx={{
          textDecoration: task.completed ? "line-through" : "none",
          fontWeight: 500
        }}
      >
        {task.title}
      </Typography>

    </Box>

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