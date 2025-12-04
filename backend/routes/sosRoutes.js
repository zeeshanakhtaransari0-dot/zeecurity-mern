// backend/routes/sosRoutes.js
const express = require("express");
const router = express.Router();
const SOS = require("../models/SOS");

// GET all SOS alerts ---- returns direct ARRAY (frontend expects this)
router.get("/", async (req, res) => {
  try {
    console.log("GET /api/sos");
    const list = await SOS.find().sort({ createdAt: -1 });
    // IMPORTANT: return the array directly
    res.json(list);
  } catch (err) {
    console.error("Error fetching sos:", err && err.stack ? err.stack : err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST create
router.post("/", async (req, res) => {
  try {
    console.log("POST /api/sos payload:", req.body);
    const { name, flatNumber, type, details, status, priority } = req.body;

    if (!name || !flatNumber || !details) {
      return res.status(400).json({ error: "Missing fields: name, flatNumber, details" });
    }

    const s = new SOS({ name, flatNumber, type, details, status: status || "Pending", priority: priority || "Normal" });
    const saved = await s.save();
    console.log("SOS saved:", saved._id);
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating sos:", err && err.stack ? err.stack : err);
    res.status(500).json({ error: "Server error", message: err && err.message ? err.message : "" });
  }
});

// PUT update status
router.put("/:id/status", async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    console.log("PUT /api/sos/:id/status", id, status);
    if (!status) return res.status(400).json({ error: "Missing status" });

    const updated = await SOS.findByIdAndUpdate(id, { $set: { status } }, { new: true });
    if (!updated) return res.status(404).json({ error: "Not found" });
    console.log("SOS status updated:", id, status);
    res.json({ success: true, sos: updated });
  } catch (err) {
    console.error("Error updating sos status:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("DELETE /api/sos/:id called for id:", id);
    const deleted = await SOS.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    console.log("SOS deleted:", id);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting sos:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
