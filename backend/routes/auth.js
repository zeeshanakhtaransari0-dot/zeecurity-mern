const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Resident = require("../models/Resident");
const ResidentSession = require("../models/ResidentSession");


// =============================
// 🟢 RESIDENT LOGIN
// =============================
router.post("/login/resident", async (req, res) => {
  console.log("RESIDENT LOGIN HIT");
  console.log("BODY:", req.body);

  try {
    const { username, flatNumber } = req.body;

    if (!username || !flatNumber) {
      return res.status(400).json({ message: "Username and flatNumber required" });
    }

    const resident = await Resident.findOne({
      name: { $regex: `^${username}$`, $options: "i" },
      flatNumber: { $regex: `^${flatNumber}$`, $options: "i" },
    });

    console.log("FOUND RESIDENT:", resident);

    if (!resident) {
      return res.status(401).json({ message: "Resident not found" });
    }

    // Create session
    await ResidentSession.create({
      residentId: resident._id,
      name: resident.name,
      flatNumber: resident.flatNumber,
      status: "online",
    });

    res.json({
      success: true,
      user: {
        name: resident.name,
        flatNumber: resident.flatNumber,
        role: "resident",
      },
    });

  } catch (err) {
    console.error("Resident Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// =============================
// 🔵 GUARD LOGIN
// =============================
router.post("/login/guard", async (req, res) => {
  console.log("GUARD LOGIN HIT");
  console.log("BODY:", req.body);

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const guard = await User.findOne({
      username,
      password,
      role: "guard",
    });

    if (!guard) {
      return res.status(401).json({ message: "Invalid guard credentials" });
    }

    res.json({
      success: true,
      user: {
        name: guard.name,
        role: "guard",
      },
    });

  } catch (err) {
    console.error("Guard Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// =============================
// 🟣 ADMIN LOGIN
// =============================
router.post("/login/admin", async (req, res) => {
  console.log("ADMIN LOGIN HIT");
  console.log("BODY:", req.body);

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const admin = await User.findOne({
      username,
      password,
      role: "admin",
    });

    if (!admin) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    res.json({
      success: true,
      user: {
        name: admin.name,
        role: "admin",
      },
    });

  } catch (err) {
    console.error("Admin Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;