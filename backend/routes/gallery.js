const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const router = express.Router();
const Gallery = require('../models/gallery'); // MongoDB Model

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// ✅ Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ganesha_festival_gallery",
    allowed_formats: ["jpg", "png", "jpeg"]
  }
});

const upload = multer({ storage });

// ✅ Upload Image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const newImage = new Gallery({
      filename: req.file.filename || Date.now().toString(),
      caption: req.body.caption,
      url: req.file.path // Cloudinary permanent URL
    });

    await newImage.save();

    res.json({
      success: true,
      imageUrl: req.file.path,
      caption: req.body.caption,
      filename: newImage.filename
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

// ✅ Get Images
router.get('/images', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ uploadedAt: -1 });
    res.json({ success: true, images });
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ success: false, message: 'Failed to load gallery' });
  }
});

// ✅ Delete Image
router.delete("/:filename", async (req, res) => {
  try {
    const img = await Gallery.findOne({ filename: req.params.filename });
    if (!img) return res.status(404).json({ success: false, message: "Image not found" });

    // Extract public_id from Cloudinary URL
    const publicId = img.url.split('/').slice(-1)[0].split('.')[0];
    await cloudinary.uploader.destroy(`ganesha_festival_gallery/${publicId}`);

    await Gallery.deleteOne({ filename: req.params.filename });

    res.json({ success: true });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ success: false, message: "Delete Failed" });
  }
});

// ✅ For moments.html
router.get('/moments', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ uploadedAt: -1 });
    res.json({ success: true, images });
  } catch (err) {
    console.error("Moments Fetch Error:", err);
    res.status(500).json({ success: false, message: 'Failed to load moments' });
  }
});

module.exports = router;
