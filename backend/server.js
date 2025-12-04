// server.js
// Zeecurity backend entrypoint
console.log("Server starting...");

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

// ---------- CONFIG / LOGGING ----------
console.log("Loaded MONGO_URI =", process.env.MONGO_URI ? "FOUND" : "MISSING");

// Simple request logger (shows method + url)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} → ${req.method} ${req.originalUrl}`);
  next();
});

// ---------- MIDDLEWARE ----------
app.use(cors());
// Allow large payloads (QR images are base64 strings)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ---------- STATIC FILES (public) ----------
// Serve any static file placed in backend/public at root (including favicon.ico)
app.use(express.static(path.join(__dirname, "public")));

// ---------- ROUTES (import) ----------
const visitorRoutes = require("./routes/visitorRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const sosRoutes = require("./routes/sosRoutes");

// optional dashboard route — wrapped in try/catch if file missing
try {
  const dashboardRoutes = require("./routes/dashboardRoutes");
  app.use("/api/dashboard", dashboardRoutes);
} catch (err) {
  console.warn("Dashboard route not found — skipping /api/dashboard mount.");
}

// mount main routes
app.use("/api/visitors", visitorRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/sos", sosRoutes);

// simple test root
app.get("/", (req, res) => {
  res.send("Zeecurity Backend Running Successfully!");
});

// ---------- SAFER 404 FOR UNKNOWN API ROUTES ----------
// this should be after your /api routes so only unknown API paths hit it
app.use("/api", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// ---------- ERROR HANDLER ----------
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err && (err.stack || err.message) ? (err.stack || err.message) : err);
  res.status(err.status || 500).json({ error: "Server error", message: err.message || String(err) });
});

// ---------- MONGODB CONNECTION ----------
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ ERROR: Missing MONGO_URI in .env file!");
}

mongoose.set("strictQuery", false);

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err && err.message ? err.message : err);
  });

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// ---------- GRACEFUL SHUTDOWN ----------
process.on("SIGINT", () => {
  console.log("\nGracefully shutting down...");
  server.close(() => {
    mongoose.disconnect().then(() => {
      console.log("MongoDB disconnected. Bye!");
      process.exit(0);
    });
  });
});
