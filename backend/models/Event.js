const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  datetime: { type: Date, required: true }, // ✅ Combined date + time
  description: { type: String }
});

module.exports = mongoose.model("Event", eventSchema);
