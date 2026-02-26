const express = require('express');
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
    const { name, bio, skills, portfolioLinks } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio, skills, portfolioLinks },
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
    const user = await User.findById(req.params.id);

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
    const users = await User.find().select('-password');

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
