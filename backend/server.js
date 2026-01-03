const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

/* ===================== CORS (FINAL FIX) ===================== */
const allowedOrigins = [
  "http://localhost:3000",
  "https://zeecurity-mern.vercel.app",
  /^https:\/\/zeecurity-mern-.*\.vercel\.app$/ // ✅ allow ALL preview URLs
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / curl

    const allowed = allowedOrigins.some(o =>
      typeof o === "string" ? o === origin : o.test(origin)
    );

    if (allowed) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// ✅ IMPORTANT: preflight support
app.options("*", cors());

/* ===================== BODY PARSER ===================== */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ===================== ROUTES ===================== */
app.use("/api/residents", require("./routes/residentRoutes"));
app.use("/api/visitors", require("./routes/visitorRoutes"));
app.use("/api/notices", require("./routes/noticeRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/maintenance", require("./routes/maintenanceRoutes"));
app.use("/api/sos", require("./routes/sosRoutes"));

/* ===================== ROOT ===================== */
app.get("/", (req, res) => {
  res.send("✅ Zeecurity Backend Running");
});

/* ===================== DB ===================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err.message));

/* ===================== SERVER ===================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);