// backend/routes/noticeRoutes.js
const express = require("express");
const router = express.Router();
const Notice = require("../models/Notice");

// GET all notices
router.get("/", async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    console.error("Error fetching notices:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST create
router.post("/", async (req, res) => {
  try {
    const { title, message } = req.body;
    const n = new Notice({ title, message });
    const saved = await n.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating notice:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE with logging
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("DELETE /api/notices/:id called for id:", id);

    const deleted = await Notice.findByIdAndDelete(id);
    if (!deleted) {
      console.warn("Notice not found for delete:", id);
      return res.status(404).json({ success: false, error: "Not found" });
    }

    console.log("Notice deleted:", id);
    return res.json({ success: true });
  } catch (err) {
    console.error("Error deleting notice:", err && err.message ? err.message : err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
