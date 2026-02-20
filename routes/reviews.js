const express = require('express');
const Review = require('../models/Review');
const Contract = require('../models/Contract');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('experienced'), async (req, res) => {
  try {
    const { contract, rating, feedback } = req.body;

    const contractData = await Contract.findById(contract);
    
    if (!contractData) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }

    if (contractData.client.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to review this contract' });
    }

    if (contractData.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Contract must be completed before reviewing' });
    }

    if (!contractData.freelancer) {
      return res.status(400).json({ success: false, message: 'No freelancer assigned to this contract' });
    }

    const reviewData = {
      contract,
      reviewer: req.user.id,
      reviewee: contractData.freelancer,
      rating,
      feedback
    };

    const review = await Review.create(reviewData);
    const populatedReview = await Review.findById(review._id)
      .populate('reviewer', 'name email')
      .populate('reviewee', 'name email');

    res.status(201).json({
      success: true,
      data: populatedReview
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this contract' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name email')
      .populate('contract', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/my-reviews', protect, async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.user.id })
      .populate('reviewer', 'name email')
      .populate('contract', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
