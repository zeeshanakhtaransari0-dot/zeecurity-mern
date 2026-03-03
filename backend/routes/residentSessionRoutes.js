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
      { residentId: residentId, status: "online" }, // ONLY active session
      {
        status: "offline",
        logoutTime: new Date(),
      },
      { sort: { createdAt: -1 }, new: true } // 🔥 latest one
    );

    if (!session) {
      return res.status(404).json({ message: "Active session not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;