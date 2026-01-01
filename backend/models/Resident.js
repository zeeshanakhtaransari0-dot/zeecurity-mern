const mongoose = require("mongoose");

const ResidentSchema = new mongoose.Schema(
  {
    name: String,
    flatNumber: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resident", ResidentSchema);