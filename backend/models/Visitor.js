// backend/models/Visitor.js
const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, default: "" },
  flatNumber: { type: String, default: "" },
  purpose: { type: String, default: "" },
  inTime: { type: Date, default: Date.now },
  outTime: { type: Date, default: null },
  qrCode: { type: String, default: "" } // <-- ensure qrCode is in schema
}, { timestamps: true });

// Export model
module.exports = mongoose.model("Visitor", visitorSchema);
