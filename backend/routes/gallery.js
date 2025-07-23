const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const Gallery = require('../models/gallery'); // ✅ MongoDB Model

const galleryDir = path.join(__dirname, '../public/gallery');

// Set up Multer for file upload
const storage = multer.diskStorage({
  destination: galleryDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ✅ Upload an image with caption and save to MongoDB
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const newImage = new Gallery({
      filename: req.file.filename,
      caption: req.body.caption
    });

    await newImage.save();

    res.json({
      success: true,
      imageUrl: `/gallery/${req.file.filename}`,
      caption: req.body.caption,
      filename: req.file.filename
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

// ✅ Get all images with captions from MongoDB
router.get('/images', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ uploadedAt: -1 });

    const imageList = images.map(img => ({
      url: `/gallery/${img.filename}`,
      filename: img.filename,
      caption: img.caption
    }));

    res.json({ success: true, images: imageList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to load gallery' });
  }
});

// ✅ Delete image from folder and MongoDB
router.delete("/:filename", async (req, res) => {
  const filePath = path.join(galleryDir, req.params.filename);
  try {
    // Delete file only if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete MongoDB record always
    await Gallery.deleteOne({ filename: req.params.filename });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});




module.exports = router;
