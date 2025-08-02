const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const Donation = require("../models/Donation");
const Expense = require("../models/Expense");

// 🔒 Authenticated route (admins/users with token)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const donations = await Donation.find();
    const expenses = await Expense.find();

    const totalDonations = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.cost || 0), 0);
    const remainingBalance = totalDonations - totalExpenses;

    res.json({ totalDonations, totalExpenses, remainingBalance });
  } catch (err) {
    console.error("❌ Summary error:", err.message);
    res.status(500).json({ error: "Failed to calculate summary", details: err.message });
  }
});

// 🌍 Public route (no login required)
router.get("/public", async (req, res) => {
  try {
    const donations = await Donation.find();
    const expenses = await Expense.find();

    const totalDonations = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.cost || 0), 0);
    const remainingBalance = totalDonations - totalExpenses;

    res.json({ totalDonations, totalExpenses, remainingBalance });
  } catch (err) {
    console.error("❌ Public summary error:", err.message);
    res.status(500).json({ error: "Failed to load public summary", details: err.message });
  }
});

module.exports = router;
