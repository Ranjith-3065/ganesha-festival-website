const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  item: { type: String, required: true },
  cost: { type: Number, required: true },
  reason: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Expense", expenseSchema);
