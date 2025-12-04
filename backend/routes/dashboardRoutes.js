// backend/routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();

const Visitor = require("../models/Visitor");
const Complaint = require("../models/Complaint");
const SOS = require("../models/SOS");
const Notice = require("../models/Notice");
const Maintenance = require("../models/Maintenance"); // your payments model

// GET /api/dashboard
router.get("/", async (req, res) => {
  try {
    console.log("GET /api/dashboard - aggregate stats");

    // counts (safe: each promise catches its own error)
    const [
      visitorsCount,
      complaintsCount,
      pendingComplaintsCount,
      sosCount,
      pendingSosCount,
      noticesCount,
      paymentsCount
    ] = await Promise.all([
      Visitor.countDocuments().catch(() => 0),
      Complaint.countDocuments().catch(() => 0),
      Complaint.countDocuments({ status: "Pending" }).catch(() => 0),
      SOS.countDocuments().catch(() => 0),
      SOS.countDocuments({ status: "Pending" }).catch(() => 0),
      Notice.countDocuments().catch(() => 0),
      Maintenance.countDocuments().catch(() => 0),
    ]);

    // recent lists (limit 5)
    const [recentVisitors, recentComplaints, recentSos, recentNotices, recentPayments] = await Promise.all([
      Visitor.find().sort({ inTime: -1 }).limit(5).lean().catch(() => []),
      Complaint.find().sort({ createdAt: -1 }).limit(5).lean().catch(() => []),
      SOS.find().sort({ createdAt: -1 }).limit(5).lean().catch(() => []),
      Notice.find().sort({ createdAt: -1 }).limit(5).lean().catch(() => []),
      Maintenance.find().sort({ date: -1 }).limit(5).lean().catch(() => []),
    ]);

    res.json({
      counts: {
        visitors: visitorsCount,
        complaints: complaintsCount,
        pendingComplaints: pendingComplaintsCount,
        sos: sosCount,
        pendingSos: pendingSosCount,
        notices: noticesCount,
        payments: paymentsCount,
      },
      recent: {
        visitors: recentVisitors,
        complaints: recentComplaints,
        sos: recentSos,
        notices: recentNotices,
        payments: recentPayments,
      },
    });
  } catch (err) {
    console.error("Error /api/dashboard:", err && err.stack ? err.stack : err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
