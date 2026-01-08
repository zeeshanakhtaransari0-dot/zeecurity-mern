const express = require("express");
const router = express.Router();
const Resident = require("../models/Resident");

// ================= CREATE or UPDATE RESIDENT =================
router.post("/", async (req, res) => {
  try {
    const { name, flatNumber } = req.body;

    if (!name || !flatNumber) {
      return res.status(400).json({ error: "Name and flatNumber required" });
    }

    // 🔥 UPDATE if flat exists, else CREATE
    const resident = await Resident.findOneAndUpdate(
      { flatNumber: flatNumber.trim() }, // search by flat
      { name: name.trim() },             // update name
      {
        new: true,
        upsert: true,                    // 👈 THIS IS THE KEY
      }
    );

    console.log("Resident saved/updated:", resident);

    res.status(200).json(resident);
  } catch (err) {
    console.error("Resident save error:", err);
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