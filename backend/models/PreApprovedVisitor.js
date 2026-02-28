const mongoose = require("mongoose");

const preApprovedVisitorSchema = new mongoose.Schema(
  {
    visitorName: { type: String, required: true },
    age: Number,
    phone: String,
    workType: String,
    companyName: String,

    flatNumber: { type: String, required: true },
    residentName: String,
    residentPhone: String,

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    approvedAt: {
      type: Date,
    },

    rejectedAt: {
      type: Date,
    },

    uniqueCode: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "PreApprovedVisitor",
  preApprovedVisitorSchema
);