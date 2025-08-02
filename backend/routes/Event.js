const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Event = require("../models/Event");

// ➕ Add event — Admin only
router.post("/add", authMiddleware, async (req, res) => {
  const { title, date, time, description } = req.body;

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied: Admins only" });
  }

  try {
    // ✅ Combine date and time into a single datetime object
    const datetime = new Date(`${date}T${time}`);

    const event = new Event({ title, datetime, description });
    await event.save();
    res.status(201).json({ message: "Event added", event });
  } catch (err) {
    console.error("Add Event Error:", err);
    res.status(500).json({ error: "Failed to add event", details: err.message });
  }
});

// 📅 Get all events (Admin / logged-in only)
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const events = await Event.find().sort({ datetime: 1 });
    res.json(events);
  } catch (err) {
    console.error("Fetch Events Error:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// 🌍 Public route - view events without login
router.get("/public", async (req, res) => {
  try {
    const events = await Event.find().sort({ datetime: 1 });
    res.json(events);
  } catch (err) {
    console.error("Public Fetch Events Error:", err);
    res.status(500).json({ error: "Failed to fetch public events" });
  }
});

module.exports = router;
