const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Expense = require("../models/Expense");

// ➕ Add expense — Admin only
router.post("/add", authMiddleware, async (req, res) => {
  const { item, cost, reason } = req.body;

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied: Admins only" });
  }

  try {
    const expense = new Expense({ item, cost, reason });
    await expense.save();
    res.status(201).json({ message: "Expense added", expense });
  } catch (err) {
    res.status(500).json({ error: "Failed to add expense" });
  }
});

// ✅ View all expenses
router.get("/all", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

module.exports = router;
