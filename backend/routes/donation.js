const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Donation = require("../models/Donation");

// 🔐 Protected route test (optional)
router.get("/secure", authMiddleware, (req, res) => {
  res.json({ message: "You accessed a protected route!", user: req.user });
});

// ➕ Add donation — Admin only
router.post("/add", authMiddleware, async (req, res) => {
  const { donor, amount, purpose } = req.body;

  // ✅ Check admin
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied: Admins only" });
  }

  try {
    const donation = new Donation({ donor, amount, purpose });
    await donation.save();
    res.status(201).json({ message: "Donation added", donation });
  } catch (err) {
    console.error("Error adding donation:", err);
    res.status(500).json({ error: "Failed to add donation" });
  }
});

// 📥 Get all donations
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const donations = await Donation.find().sort({ date: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch donations" });
  }
});

// 📊 Get total donations
router.get("/total", authMiddleware, async (req, res) => {
  try {
    const donations = await Donation.find();
    const total = donations.reduce((sum, d) => sum + d.amount, 0);
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: "Failed to calculate total" });
  }
});

module.exports = router;
