const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 5000; // ✅ This is the key line
app.use(express.json());
app.use(cors({
  origin: '*',  // Or your frontend domain like "https://ganesha-frontend.onrender.com"
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

// Serve static files from /public/gallery folder
app.use('/gallery', express.static(path.join(__dirname, 'public/gallery'), {
  setHeaders: (res, path) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // 👈 important
  }
}));


// Import & Use routes
const authRoutes = require("./routes/auth");
const donationRoutes = require("./routes/donation");
const summaryRoutes = require("./routes/summary");
const expenseRoutes = require("./routes/expense");
const eventRoutes = require("./routes/Event");
const galleryRoutes = require("./routes/gallery");

app.use("/api/auth", authRoutes);
app.use("/api/donation", donationRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/gallery", galleryRoutes); // ✅ Correctly registered here

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(5000, () => console.log("🚀 Server running at http://localhost:5000"));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
