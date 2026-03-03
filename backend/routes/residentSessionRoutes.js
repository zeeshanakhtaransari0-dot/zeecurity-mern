const express = require("express");
const router = express.Router();
const ResidentSession = require("../models/ResidentSession");

// GET all resident sessions (for Guard panel)
router.get("/", async (req, res) => {
  try {
    const sessions = await ResidentSession.find()
      .sort({ loginTime: -1 });

    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;