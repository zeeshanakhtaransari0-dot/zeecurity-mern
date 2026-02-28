const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    username: String,
    password: String,
    flatNumber: String,
    role: {
      type: String,
      enum: ["guard", "resident"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);