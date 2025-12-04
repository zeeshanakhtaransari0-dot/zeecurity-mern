const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    flatNumber: { type: String, required: true },
    month: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMode: { type: String, default: "Online" },
    status: { type: String, default: "Paid" },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Maintenance", maintenanceSchema);
