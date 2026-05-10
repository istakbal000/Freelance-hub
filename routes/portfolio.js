const express = require('express');
const validator = require('validator');
const PortfolioProject = require('../models/PortfolioProject');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Helper: allowed URL schemes (prevents javascript:, data:, etc.)
const isSafeUrl = (url) => {
  if (!url || typeof url !== 'string') return true; // empty is fine
  const t = url.trim();
  if (t === '') return true;
  return validator.isURL(t, { protocols: ['http','https'], require_protocol: true });
};

// GET /api/portfolio/:userId — public
router.get('/:userId', async (req, res) => {
  try {
    const projects = await PortfolioProject.find({ user: req.params.userId })
      .sort({ featured: -1, order: 1, createdAt: -1 });

    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /api/portfolio — protected
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, imageUrl, category, tags, liveUrl, projectLink, featured, completedAt } = req.body;

    if (!title || typeof title !== 'string') return res.status(400).json({ success: false, message: 'Title is required' });

    if (!isSafeUrl(imageUrl) || !isSafeUrl(liveUrl) || !isSafeUrl(projectLink)) {
      return res.status(400).json({ success: false, message: 'Invalid URL: only http/https links are allowed.' });
    }

    const count = await PortfolioProject.countDocuments({ user: req.user.id });
    const project = await PortfolioProject.create({
      user: req.user.id,
      title: validator.escape(title.trim()).substring(0, 100),
      description: validator.escape(String(description || '').trim()).substring(0, 2000),
      imageUrl: imageUrl || '',
      category: category || 'Other',
      tags: Array.isArray(tags) ? tags.map(t => validator.escape(String(t).trim()).substring(0, 30)) : [],
      liveUrl: liveUrl || '',
      projectLink: projectLink || '',
      featured: !!featured,
      order: count,
      completedAt: completedAt || undefined
    });

    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/portfolio/:id — protected, owner only
router.put('/:id', protect, async (req, res) => {
  try {
    const project = await PortfolioProject.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { title, description, imageUrl, category, tags, liveUrl, projectLink, featured, completedAt } = req.body;
    
    if (!isSafeUrl(imageUrl) || !isSafeUrl(liveUrl) || !isSafeUrl(projectLink)) {
      return res.status(400).json({ success: false, message: 'Invalid URL: only http/https links are allowed.' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = validator.escape(String(title).trim()).substring(0, 100);
    if (description !== undefined) updateData.description = validator.escape(String(description).trim()).substring(0, 2000);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined && Array.isArray(tags)) {
      updateData.tags = tags.map(t => validator.escape(String(t).trim()).substring(0, 30));
    }
    if (liveUrl !== undefined) updateData.liveUrl = liveUrl;
    if (projectLink !== undefined) updateData.projectLink = projectLink;
    if (featured !== undefined) updateData.featured = !!featured;
    if (completedAt !== undefined) updateData.completedAt = completedAt;

    const updated = await PortfolioProject.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/portfolio/:id — protected, owner only
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await PortfolioProject.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await project.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH /api/portfolio/:id/feature — toggle featured
router.patch('/:id/feature', protect, async (req, res) => {
  try {
    const project = await PortfolioProject.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    project.featured = !project.featured;
    await project.save();
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
