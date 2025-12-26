// backend/routes/complaintRoutes.js
const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

// GET all complaints
router.get("/", async (req, res) => {
  try {
    console.log("GET /api/complaints");
    const list = await Complaint.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error("Error fetching complaints:", err && err.stack ? err.stack : err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST create complaint (robust: accepts complaintText OR details)
router.post("/", async (req, res) => {
  try {
    console.log("POST /api/complaints payload:", req.body);

    // accept both shapes from frontend:
    // { name, flatNumber, details }  OR  { name, flatNumber, complaintText }
    const { name, flatNumber } = req.body;
    let { details, complaintText, status } = req.body;

    // normalize: prefer details, otherwise use complaintText
    const finalText = (details && details.trim()) ? details.trim() : (complaintText && complaintText.trim() ? complaintText.trim() : "");

    // Basic server-side validation
    if (!name || !flatNumber || !finalText) {
      return res.status(400).json({ error: "Missing required fields: name, flatNumber, complaint text (details or complaintText)" });
    }

    // Create document using both fields so both legacy and new clients work
    const c = new Complaint({
      name: name.trim(),
      flatNumber: flatNumber.trim(),
      details: details ? details.trim() : undefined,
      complaintText: (!details && complaintText) ? complaintText.trim() : undefined,
      status: status || "Pending",
    });

    const saved = await c.save();
    console.log("Complaint saved:", saved._id);
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating complaint:", err && err.stack ? err.stack : err);
    res.status(500).json({ error: "Server error", message: err && err.message ? err.message : "" });
  }
});

// UPDATE complaint (name / flatNumber / details / status)
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const { name, flatNumber, details, complaintText, status } = req.body;

    const updateData = {};

    if (name) updateData.name = name.trim();
    if (flatNumber) updateData.flatNumber = flatNumber.trim();
    if (details) updateData.details = details.trim();
    if (complaintText) updateData.complaintText = complaintText.trim();
    if (status) updateData.status = status;

    const updated = await Complaint.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    console.log("Complaint updated:", id);
    res.json(updated);
  } catch (err) {
    console.error("Error updating complaint:", err);
    res.status(500).json({ error: "Update failed" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    console.log("DELETE /api/complaints/:id called for id:", req.params.id);
    const id = req.params.id;
    const d = await Complaint.findByIdAndDelete(id);
    if (!d) return res.status(404).json({ error: "Not found" });
    console.log("Complaint deleted:", id);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting complaint:", err && err.stack ? err.stack : err);
    res.status(500).json({ error: "Server error", message: err && err.message ? err.message : "" });
  }
});

module.exports = router;
