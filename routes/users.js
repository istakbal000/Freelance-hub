const express = require('express');
const validator = require('validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../middleware/upload');

const router = express.Router();

router.post('/upload-photo', protect, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const photoUrl = await uploadToCloudinary(req.file.buffer);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePhoto: photoUrl },
      { new: true }
    );

    res.status(200).json({ success: true, profilePhoto: user.profilePhoto });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, bio, profession, skills, portfolioLinks } = req.body;

    // 1. Validate and sanitize string fields
    const updateData = {};
    
    if (name !== undefined) {
      if (typeof name !== 'string') return res.status(400).json({ success: false, message: 'Name must be a string' });
      updateData.name = validator.escape(name.trim()).substring(0, 50);
    }
    
    if (profession !== undefined) {
      if (typeof profession !== 'string') return res.status(400).json({ success: false, message: 'Profession must be a string' });
      updateData.profession = validator.escape(profession.trim()).substring(0, 100);
    }
    
    if (bio !== undefined) {
      if (typeof bio !== 'string') return res.status(400).json({ success: false, message: 'Bio must be a string' });
      updateData.bio = validator.escape(bio.trim()).substring(0, 500);
    }

    // 2. Validate and sanitize arrays
    if (skills !== undefined) {
      if (!Array.isArray(skills)) return res.status(400).json({ success: false, message: 'Skills must be an array' });
      updateData.skills = skills
        .filter(s => typeof s === 'string')
        .map(s => validator.escape(s.trim()).substring(0, 30))
        .filter(s => s.length > 0);
    }

    if (portfolioLinks !== undefined) {
      if (!Array.isArray(portfolioLinks)) return res.status(400).json({ success: false, message: 'Portfolio links must be an array' });
      updateData.portfolioLinks = portfolioLinks
        .filter(l => typeof l === 'string')
        .map(l => l.trim())
        .filter(l => validator.isURL(l, { protocols: ['http','https'], require_protocol: true }))
        .map(l => l.substring(0, 255));
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email -phoneNumber');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('name profession profilePhoto skills rating totalReviews');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
