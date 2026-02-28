const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/login", async (req, res) => {
  try {
    const { username, role } = req.body;

    const user = await User.findOne({ username, role });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

   

    res.json({
      success: true,
      user: {
        name: user.name,
        role: user.role,
        flatNumber: user.flatNumber || null,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;