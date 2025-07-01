const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const Donation = require("../models/Donation");
const Expense = require("../models/Expense");

router.get("/", authMiddleware, async (req, res) => {
  try {
    // Fetch all donation and expense documents
    const donations = await Donation.find();
    const expenses = await Expense.find();

    // Log data for debugging
    console.log("✅ Donations found:", donations.length);
    console.log("✅ Expenses found:", expenses.length);

    // Calculate totals
    const totalDonations = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.cost || 0), 0);
    const remainingBalance = totalDonations - totalExpenses;

    // Send result
    res.json({
      totalDonations,
      totalExpenses,
      remainingBalance
    });

  } catch (err) {
    console.error("❌ Summary error:", err.message);
    res.status(500).json({ error: "Failed to calculate summary", details: err.message });
  }
});

module.exports = router;
