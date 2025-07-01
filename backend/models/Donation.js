const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  donor: { type: String, required: true },
  amount: { type: Number, required: true },
  purpose: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Donation", donationSchema);
