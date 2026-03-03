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
// LOGOUT resident (update latest active session)
router.put("/logout/:residentId", async (req, res) => {
  try {
    const { residentId } = req.params;

    const session = await ResidentSession.findOneAndUpdate(
      { residentId, status: "online" }, // find active session
      {
        status: "offline",
        logoutTime: new Date(),
      },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: "Active session not found" });
    }

    res.json({ message: "Logged out successfully", session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;