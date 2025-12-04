// backend/models/Complaint.js
const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  flatNumber: { type: String, default: "" },

  // support both older `complaintText` and newer `details`
  complaintText: { type: String }, // keep existing field if other code relies on this
  details: { type: String },      // also accept `details`

  // normalize: at runtime we'll use (details || complaintText)
  status: { type: String, enum: ["Pending","In Progress","Resolved"], default: "Pending" },
}, { timestamps: true });

// optional: instance virtual to get the canonical text easily
complaintSchema.virtual("text").get(function() {
  return this.details || this.complaintText || "";
});

module.exports = mongoose.model("Complaint", complaintSchema);
