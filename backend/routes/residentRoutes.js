const express = require("express");
const router = express.Router();
const Resident = require("../models/Resident");

// ✅ CREATE resident (on login)
router.post("/", async (req, res) => {
  try {
    const { name, flatNumber } = req.body;

    if (!name || !flatNumber) {
      return res.status(400).json({ error: "Name and flat number required" });
    }

    const resident = new Resident({
      name: name.trim(),
      flatNumber: flatNumber.trim(),
    });

    const saved = await resident.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Create resident error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET all residents (for guard)
router.get("/", async (req, res) => {
  try {
    const residents = await Resident.find().sort({ createdAt: -1 });
    res.json(residents);
  } catch (err) {
    console.error("Fetch residents error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;