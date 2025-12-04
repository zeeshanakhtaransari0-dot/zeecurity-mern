const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,  // ⭐ this creates createdAt & updatedAt automatically
  }
);

module.exports = mongoose.model("Notice", noticeSchema);
