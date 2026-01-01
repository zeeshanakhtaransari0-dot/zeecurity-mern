const mongoose = require("mongoose");

const residentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    flatNumber: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resident", residentSchema);