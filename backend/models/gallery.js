const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  filename: { type: String, required: true },
  publicId: { type: String, required: true },   // Cloudinary public_id
  caption: { type: String, default: "Untitled" },
  url: { type: String, required: true },        // Cloudinary image URL
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Gallery', GallerySchema);
