const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const router = express.Router();
const Gallery = require('../models/gallery');

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
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: (req, file) =>
      Date.now() + "-" + file.originalname.split(".")[0]
  }
});

const upload = multer({ storage });

// ✅ Upload Image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ success: false, message: "Image upload failed" });
    }

    const filename = req.file.filename || Date.now().toString();

    const newImage = new Gallery({
      filename,
      publicId: req.file.filename, // ✅ Store Cloudinary's filename
      caption: req.body.caption || "Untitled",
      url: req.file.path // ✅ Permanent Cloudinary URL
    });

    await newImage.save();

    res.json({
      success: true,
      imageUrl: req.file.path,
      caption: newImage.caption,
      filename: newImage.filename
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

// ✅ Get Images
router.get('/images', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ uploadedAt: -1 });

    res.json({
      success: true,
      images: images.map(img => ({
        url: img.url || "https://via.placeholder.com/400x250?text=Image+Unavailable",
        filename: img.filename,
        caption: img.caption || "No caption"
      }))
    });
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ success: false, message: "Failed to load gallery" });
  }
});

// ✅ Delete Image
router.delete("/:filename", async (req, res) => {
  try {
    const img = await Gallery.findOne({ filename: req.params.filename });
    if (!img) return res.status(404).json({ success: false, message: "Image not found" });

    // ✅ Delete from Cloudinary using stored publicId
    await cloudinary.uploader.destroy(img.publicId);

    // ✅ Remove from MongoDB
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

    res.json({
      success: true,
      images: images.map(img => ({
        url: img.url || "https://via.placeholder.com/400x250?text=Image+Unavailable",
        filename: img.filename,
        caption: img.caption || "No caption"
      }))
    });
  } catch (err) {
    console.error("Moments Fetch Error:", err);
    res.status(500).json({ success: false, message: "Failed to load moments" });
  }
});

module.exports = router;
