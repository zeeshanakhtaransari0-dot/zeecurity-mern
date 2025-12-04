// backend/routes/maintenanceRoutes.js
const express = require("express");
const router = express.Router();
const Maintenance = require("../models/Maintenance");

// GET all payments (maintenance)
router.get("/", async (req, res) => {
  try {
    console.log("GET /api/maintenance");
    const payments = await Maintenance.find().sort({ date: -1 });
    // match the shape your frontend expects { success: true, payments }
    return res.json({ success: true, payments });
  } catch (err) {
    console.error("FETCH ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ADD payment (maintenance)
router.post("/", async (req, res) => {
  try {
    console.log("POST /api/maintenance payload:", req.body);
    // Create using the maintenance schema fields (make sure required ones are present)
    const payment = new Maintenance(req.body);
    await payment.save();
    console.log("Saved maintenance/payment:", payment._id);
    return res.status(201).json({ success: true, payment });
  } catch (err) {
    console.error("SAVE ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE payment by id
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("DELETE /api/maintenance/:id called for id:", id);

    const deleted = await Maintenance.findByIdAndDelete(id);
    if (!deleted) {
      console.warn("Maintenance record not found for delete:", id);
      return res.status(404).json({ success: false, message: "Not found" });
    }

    console.log("Deleted maintenance record:", id);
    return res.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
