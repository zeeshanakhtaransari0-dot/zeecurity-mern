const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const preApprovedVisitorRoutes = require("./routes/preApprovedVisitorRoutes");

const authRoutes = require("./routes/auth");
const complaintRoutes = require("./routes/complaintRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const sosRoutes = require("./routes/sosRoutes");

dotenv.config();

const app = express(); // app FIRST

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/sos", sosRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Zeecurity backend running ✅");
});
app.use("/api/preapproved", require("./routes/preApprovedVisitorRoutes"));

// db + server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error(err));