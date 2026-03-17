const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// GET all tasks
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD task
router.post("/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE task (done/undone)
router.put("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Task updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;