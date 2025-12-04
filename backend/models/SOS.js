// backend/models/SOS.js
const mongoose = require("mongoose");

const sosSchema = new mongoose.Schema({
  name: { type: String, required: true },
  flatNumber: { type: String, default: "" },
  type: { type: String, default: "Other" },
  details: { type: String, default: "" },
  status: { type: String, enum: ["Pending", "Acknowledged", "Resolved"], default: "Pending" },
  priority: { type: String, enum: ["Normal", "High"], default: "Normal" },
}, { timestamps: true });

module.exports = mongoose.model("SOS", sosSchema);
