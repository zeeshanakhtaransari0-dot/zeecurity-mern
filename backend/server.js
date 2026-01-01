// server.js
// Zeecurity backend entrypoint
console.log("🚀 Server starting...");

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

/* =========================
   CONFIG / LOGGING
========================= */
console.log(
  "Loaded MONGO_URI =",
  process.env.MONGO_URI ? "FOUND" : "MISSING"
);

// Simple request logger
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} → ${req.method} ${req.originalUrl}`
  );
  next();
});

/* =========================
   CORS (VERY IMPORTANT)
========================= */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://zeecurity-mern.vercel.app",
      "https://zeecurity-mern-3ylgji7u-zeeshan-ansaris-projects-03aa24f8.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

/* =========================
   STATIC FILES
========================= */
app.use(express.static(path.join(__dirname, "public")));

/* =========================
   ROUTES
========================= */
const residentRoutes = require("./routes/residentRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const sosRoutes = require("./routes/sosRoutes");

app.use("/api/residents", residentRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/sos", sosRoutes);

// Optional dashboard route
try {
  const dashboardRoutes = require("./routes/dashboardRoutes");
  app.use("/api/dashboard", dashboardRoutes);
} catch (err) {
  console.warn("⚠️ Dashboard route not found — skipping.");
}

/* =========================
   ROOT TEST
========================= */
app.get("/", (req, res) => {
  res.send("✅ Zeecurity Backend Running Successfully!");
});

/* =========================
   API 404 HANDLER
========================= */
app.use("/api", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);
  res.status(err.status || 500).json({
    error: "Server error",
    message: err.message || String(err)
  });
});

/* =========================
   MONGODB CONNECTION
========================= */
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ ERROR: Missing MONGO_URI in .env file!");
}

mongoose.set("strictQuery", false);

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message || err);
  });

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* =========================
   GRACEFUL SHUTDOWN
========================= */
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down...");
  server.close(() => {
    mongoose.disconnect().then(() => {
      console.log("MongoDB disconnected. Bye 👋");
      process.exit(0);
    });
  });
});