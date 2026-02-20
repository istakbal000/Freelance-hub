const express = require('express');
const Contract = require('../models/Contract');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let query = { status: 'open' };
    
    if (req.query.status) {
      query.status = req.query.status;
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

router.get('/:id', async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('client', 'name email rating bio skills')
      .populate('freelancer', 'name email rating bio skills');

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

router.post('/', protect, authorize('experienced'), async (req, res) => {
  try {
    const contractData = {
      ...req.body,
      client: req.user.id
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

    contract = await Contract.findByIdAndUpdate(req.params.id, req.body, {
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
