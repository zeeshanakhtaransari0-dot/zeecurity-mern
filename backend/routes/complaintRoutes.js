// backend/routes/complaintRoutes.js
const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

// ================= GET ALL COMPLAINTS =================
router.get("/", async (req, res) => {
  try {
    console.log("GET /api/complaints");
    const list = await Complaint.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error("Error fetching complaints:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= CREATE COMPLAINT =================
router.post("/", async (req, res) => {
  try {
    console.log("POST /api/complaints payload:", req.body);

    const { name, flatNumber } = req.body;
    let { details, complaintText, status } = req.body;

    const finalText =
      details?.trim() ||
      complaintText?.trim() ||
      "";

    if (!name || !flatNumber || !finalText) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const c = new Complaint({
      name: name.trim(),
      flatNumber: flatNumber.trim(),
      details: details?.trim(),
      complaintText: complaintText?.trim(),
      status: status || "Pending",
    });

    const saved = await c.save();
    console.log("Complaint saved:", saved._id);
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating complaint:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= UPDATE COMPLAINT (FULL) =================
router.put("/:id", async (req, res) => {
  try {
    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating complaint:", err);
    res.status(500).json({ error: "Update failed" });
  }
});

// ================= ✅ UPDATE STATUS (THIS FIXES YOUR BUG) =================
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    console.log("Status updated:", req.params.id, status);
    res.json(updated);
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ error: "Status update failed" });
  }
});

// ================= DELETE COMPLAINT =================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Complaint.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Complaint not found" });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting complaint:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;