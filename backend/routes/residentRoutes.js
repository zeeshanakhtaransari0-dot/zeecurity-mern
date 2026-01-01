const express = require("express");
const router = express.Router();
const Resident = require("../models/Resident");

// CREATE resident (login)
router.post("/", async (req, res) => {
  try {
    const { name, flatNumber } = req.body;

    const resident = new Resident({
      name,
      flatNumber,
    });

    await resident.save();
    res.status(201).json(resident);
  } catch (err) {
    res.status(500).json({ error: "Failed to save resident" });
  }
});

// GET all residents (guard panel)
router.get("/", async (req, res) => {
  try {
    const residents = await Resident.find().sort({ createdAt: -1 });
    res.json(residents);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch residents" });
  }
});

module.exports = router;