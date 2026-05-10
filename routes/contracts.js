const express = require('express');
const Contract = require('../models/Contract');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let query = {};

    if (req.query.status) {
      query.status = req.query.status;
    } else {
      query.status = 'open';
    }

    if (req.query.category && req.query.category.toLowerCase() !== 'all') {
      query.category = req.query.category;
    }

    const contracts = await Contract.find(query)
      .populate('client', 'name rating profilePhoto')
      .populate('freelancer', 'name rating profilePhoto')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contracts.length,
      data: contracts
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('client', 'name rating bio skills profession profilePhoto')
      .populate('freelancer', 'name rating bio skills profession profilePhoto');

    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }

    res.status(200).json({
      success: true,
      data: contract
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

const validator = require('validator');

router.post('/', protect, authorize('experienced'), async (req, res) => {
  try {
    const { title, description, budget, deadline, category, tags } = req.body;

    // 1. Validation & Sanitization
    if (!title || typeof title !== 'string') return res.status(400).json({ success: false, message: 'Title is required' });
    if (!description || typeof description !== 'string') return res.status(400).json({ success: false, message: 'Description is required' });

    const contractData = {
      client: req.user.id,
      title: validator.escape(title.trim()).substring(0, 100),
      description: validator.escape(description.trim()).substring(0, 2000),
      budget: Number(budget) || 0,
      deadline: deadline || undefined,
      category: category || 'Other',
      tags: Array.isArray(tags) ? tags.map(t => validator.escape(String(t).trim()).substring(0, 20)) : []
    };

    const contract = await Contract.create(contractData);
    
    const populatedContract = await Contract.findById(contract._id)
      .populate('client', 'name email rating');

    res.status(201).json({
      success: true,
      data: populatedContract
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    let contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }

    if (contract.client.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this contract' });
    }

    // Strict destructuring for update
    const { title, description, budget, deadline, category, tags, status } = req.body;
    const updateData = {};

    if (title !== undefined) updateData.title = validator.escape(String(title).trim()).substring(0, 100);
    if (description !== undefined) updateData.description = validator.escape(String(description).trim()).substring(0, 2000);
    if (budget !== undefined) updateData.budget = Number(budget) || 0;
    if (deadline !== undefined) updateData.deadline = deadline;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined && Array.isArray(tags)) {
      updateData.tags = tags.map(t => validator.escape(String(t).trim()).substring(0, 20));
    }
    if (status !== undefined) updateData.status = status;

    contract = await Contract.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).populate('client', 'name email rating')
     .populate('freelancer', 'name email rating');

    res.status(200).json({
      success: true,
      data: contract
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/my/contracts', protect, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'experienced') {
      query.client = req.user.id;
    } else {
      query.freelancer = req.user.id;
    }

    const contracts = await Contract.find(query)
      .populate('client', 'name email rating')
      .populate('freelancer', 'name email rating')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contracts.length,
      data: contracts
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
