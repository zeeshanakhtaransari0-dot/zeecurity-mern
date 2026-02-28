const express = require("express");
const router = express.Router();
const PreApprovedVisitor = require("../models/PreApprovedVisitor");
const { v4: uuidv4 } = require("uuid");

/* ===============================
   CREATE PRE-APPROVED VISITOR
================================ */
router.post("/", async (req, res) => {
  try {
    const {
      visitorName,
      age,
      phone,
      workType,
      companyName,
      flatNumber,
      residentName,
      residentPhone,
    } = req.body;

    const uniqueCode = uuidv4();

    const newVisitor = new PreApprovedVisitor({
      visitorName,
      age,
      phone,
      workType,
      companyName,
      flatNumber,
      residentName,
      residentPhone,
      uniqueCode,
    });

    await newVisitor.save();
    res.status(201).json(newVisitor);
  } catch (err) {
    console.error("Create visitor error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   GET ALL VISITORS
================================ */
router.get("/", async (req, res) => {
  try {
    const visitors = await PreApprovedVisitor.find().sort({
      createdAt: -1,
    });
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   GET BY UNIQUE CODE
================================ */
router.get("/:code", async (req, res) => {
  try {
    const visitor = await PreApprovedVisitor.findOne({
      uniqueCode: req.params.code,
    });

    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    res.json(visitor);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   APPROVE VISITOR
================================ */
router.put("/:uniqueCode/approve", async (req, res) => {
  try {
    const visitor = await PreApprovedVisitor.findOne({
      uniqueCode: req.params.uniqueCode,
    });

    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    visitor.status = "approved";
    await visitor.save();

    res.json({ message: "Visitor approved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   REJECT VISITOR
================================ */
router.put("/:uniqueCode/reject", async (req, res) => {
  try {
    const visitor = await PreApprovedVisitor.findOne({
      uniqueCode: req.params.uniqueCode,
    });

    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    visitor.status = "rejected";
    await visitor.save();

    res.json({ message: "Visitor rejected" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;