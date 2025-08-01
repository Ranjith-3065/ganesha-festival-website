const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const router = express.Router();
const Gallery = require('../models/gallery'); // ✅ MongoDB Model

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// ✅ Use Cloudinary for storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ganesha_festival_gallery", // Cloudinary folder
    allowed_formats: ["jpg", "png", "jpeg"]
  }
});

const upload = multer({ storage });

// ✅ Upload an image with caption and save Cloudinary URL to MongoDB
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const newImage = new Gallery({
      filename: req.file.filename || Date.now().toString(),
      caption: req.body.caption,
      url: req.file.path // Cloudinary URL
    });

    await newImage.save();

    res.json({
      success: true,
      imageUrl: req.file.path, // permanent Cloudinary URL
      caption: req.body.caption,
      filename: newImage.filename
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

// ✅ Get all images with captions
router.get('/images', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ uploadedAt: -1 });

    const imageList = images.map(img => ({
      url: img.url, // Use Cloudinary URL
      filename: img.filename,
      caption: img.caption
    }));

    res.json({ success: true, images: imageList });
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ success: false, message: 'Failed to load gallery' });
  }
});

// ✅ Delete image from Cloudinary + MongoDB
router.delete("/:filename", async (req, res) => {
  try {
    // Find the image in DB
    const img = await Gallery.findOne({ filename: req.params.filename });
    if (!img) return res.status(404).json({ success: false, message: "Image not found" });

    // Delete from Cloudinary
    const publicId = img.url.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`ganesha_festival_gallery/${publicId}`);

    // Delete from MongoDB
    await Gallery.deleteOne({ filename: req.params.filename });

    res.json({ success: true });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ success: false, message: "Delete Failed" });
  }
});

// ✅ For moments.html (same as gallery, just reused)
router.get('/moments', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ uploadedAt: -1 });

    const imageList = images.map(img => ({
      url: img.url, // Cloudinary permanent URL
      filename: img.filename,
      caption: img.caption
    }));

    res.json({ success: true, images: imageList });
  } catch (err) {
    console.error("Moments Fetch Error:", err);
    res.status(500).json({ success: false, message: 'Failed to load moments' });
  }
});

module.exports = router;
