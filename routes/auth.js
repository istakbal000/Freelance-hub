const express = require('express');
const validator = require('validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, profession, skills, bio, portfolioLinks } = req.body;

    // 1. Validation & Sanitization
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, password, and role' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const userData = {
      name: validator.escape(name.trim()).substring(0, 50),
      email: email.toLowerCase().trim(),
      password, // Bcrypt will handle this in model pre-save
      role,
      profession: profession ? validator.escape(profession.trim()).substring(0, 100) : '',
      bio: bio ? validator.escape(bio.trim()).substring(0, 500) : '',
      skills: Array.isArray(skills) ? skills.map(s => validator.escape(String(s).trim()).substring(0, 30)) : [],
      portfolioLinks: Array.isArray(portfolioLinks) ? portfolioLinks.filter(l => validator.isURL(l, { protocols: ['http','https'], require_protocol: true })) : []
    };

    const user = await User.create(userData);

    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profession: user.profession,
        skills: user.skills,
        bio: user.bio,
        portfolioLinks: user.portfolioLinks,
        rating: user.rating,
        totalReviews: user.totalReviews
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        bio: user.bio,
        portfolioLinks: user.portfolioLinks,
        rating: user.rating,
        totalReviews: user.totalReviews
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
