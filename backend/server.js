const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

/* ---------- CORS (FIXED FOR VERCEL + LOCALHOST) ---------- */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://zeecurity-mern.vercel.app",
      "https://zeecurity-mern-3ylgji7u-zeeshan-ansaris-projects-03aa24f8.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/* 🔥 IMPORTANT: allow preflight requests */
app.options("*", cors());

/* ---------- BODY PARSER ---------- */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ---------- ROUTES ---------- */
app.use("/api/residents", require("./routes/residentRoutes"));
app.use("/api/visitors", require("./routes/visitorRoutes"));
app.use("/api/notices", require("./routes/noticeRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/maintenance", require("./routes/maintenanceRoutes"));
app.use("/api/sos", require("./routes/sosRoutes"));

/* ---------- TEST ---------- */
app.get("/", (req, res) => {
  res.send("✅ Zeecurity Backend Running");
});

/* ---------- DB ---------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);