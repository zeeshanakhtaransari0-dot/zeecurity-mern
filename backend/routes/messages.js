const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

/* ===============================
   SEND MESSAGE
================================ */

router.post("/", async (req, res) => {
  try {
    const { senderRole, senderName, message } = req.body;

    const newMessage = new Message({
      senderRole,
      senderName,
      message,
    });

    await newMessage.save();

    res.json(newMessage);
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   GET ALL MESSAGES
================================ */

router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Fetch messages error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;