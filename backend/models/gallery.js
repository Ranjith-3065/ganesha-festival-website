const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  filename: String,
  caption: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Gallery', GallerySchema);
