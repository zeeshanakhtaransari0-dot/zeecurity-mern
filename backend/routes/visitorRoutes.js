// backend/routes/visitorRoutes.js
const express = require("express");
const router = express.Router();
const QRCode = require("qrcode");
const Visitor = require("../models/Visitor"); // adjust path if your model is in a different folder

// ----------------------------
// GET ALL VISITORS
// ----------------------------
router.get("/", async (req, res) => {
  try {
    console.log("GET /api/visitors - fetching all visitors");
    const visitors = await Visitor.find().sort({ inTime: -1 });
    res.json(visitors);
  } catch (err) {
    console.error("Error fetching visitors:", err && err.message ? err.message : err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------------
// ADD VISITOR + LOG + GENERATE QR (robust)
// ----------------------------
router.post("/", async (req, res) => {
  try {
    // Log payload for debugging
    const { name, phone, flatNumber, purpose } = req.body;
    console.log("POST /api/visitors payload:", { name, phone, flatNumber, purpose });

    // Step 1: Create visitor document (initial save, no qr yet)
    const newVisitor = new Visitor({
      name,
      phone,
      flatNumber,
      purpose,
      inTime: new Date()
    });

    const saved = await newVisitor.save();
    console.log("Visitor saved to DB (no qr yet):", { id: saved._id });

    // Step 2: Generate QR and persist it using findByIdAndUpdate for robustness
    try {
      const qrPayload = `visitor:${saved._id}|name:${saved.name}|flat:${saved.flatNumber || ""}`;
      console.log("Generating QR for payload:", qrPayload);

      const qrImage = await QRCode.toDataURL(qrPayload);

      // Use findByIdAndUpdate to ensure the field is persisted and we get back the updated doc
      const updated = await Visitor.findByIdAndUpdate(
        saved._id,
        { $set: { qrCode: qrImage } },
        { new: true } // return the updated document
      );

      console.log("QR generated and saved for visitor:", saved._id, "hasQr:", !!(updated && updated.qrCode));
      // Return the updated document to the client
      return res.status(201).json(updated);
    } catch (qrErr) {
      // If QR generation fails, log error and return the saved doc (without qr)
      console.error("QR generation error (visitor created without qr):", qrErr && qrErr.message ? qrErr.message : qrErr);
      const full = await Visitor.findById(saved._id);
      console.log("Returning created visitor to client (no qr):", { id: full._id, hasQr: !!full.qrCode });
      return res.status(201).json(full);
    }
  } catch (err) {
    console.error("Error creating visitor:", err && err.message ? err.message : err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ----------------------------
// MARK OUT VISITOR (checkout)
// ----------------------------
router.put("/:id/checkout", async (req, res) => {
  try {
    const visitorId = req.params.id;
    console.log("PUT /api/visitors/:id/checkout called for id:", visitorId);

    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      console.warn("Visitor not found for checkout:", visitorId);
      return res.status(404).json({ error: "Visitor not found" });
    }

    visitor.outTime = new Date();
    await visitor.save();

    console.log("Visitor checked out:", visitorId);
    res.json({ success: true, visitor });
  } catch (err) {
    console.error("Error checking out visitor:", err && err.message ? err.message : err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------------
// DELETE VISITOR
// ----------------------------
router.delete("/:id", async (req, res) => {
  try {
    const visitorId = req.params.id;
    console.log("DELETE /api/visitors/:id called for id:", visitorId);

    const deleted = await Visitor.findByIdAndDelete(visitorId);
    if (!deleted) {
      console.warn("Visitor not found for delete:", visitorId);
      return res.status(404).json({ error: "Visitor not found" });
    }

    console.log("Visitor deleted:", visitorId);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting visitor:", err && err.message ? err.message : err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
