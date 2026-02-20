const express = require('express');
const Application = require('../models/Application');
const Contract = require('../models/Contract');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('beginner'), async (req, res) => {
  try {
    const { contract, proposal } = req.body;

    const contractExists = await Contract.findById(contract);
    if (!contractExists) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }

    if (contractExists.status !== 'open') {
      return res.status(400).json({ success: false, message: 'Contract is not open for applications' });
    }

    const applicationData = {
      contract,
      freelancer: req.user.id,
      proposal
    };

    const application = await Application.create(applicationData);

    const populatedApplication = await Application.findById(application._id)
      .populate('contract', 'title budget status')
      .populate('freelancer', 'name email rating skills');

    res.status(201).json({
      success: true,
      data: populatedApplication
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already applied to this contract' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/my-applications', protect, authorize('beginner'), async (req, res) => {
  try {
    const applications = await Application.find({ freelancer: req.user.id })
      .populate('contract', 'title budget status deadline client')
      .populate('contract.client', 'name email rating')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/contract/:contractId', protect, authorize('experienced'), async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.contractId);

    if (!contract || contract.client.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view these applications' });
    }

    const applications = await Application.find({ contract: req.params.contractId })
      .populate('freelancer', 'name email rating skills bio portfolioLinks')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/:id/:action', protect, authorize('experienced'), async (req, res) => {
  try {
    const { action } = req.params;
    const application = await Application.findById(req.params.id).populate('contract');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.contract.client.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this application' });
    }

    if (!['accepted', 'rejected'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid action' });
    }

    application.status = action;
    await application.save();

    if (action === 'accepted') {
      await Contract.findByIdAndUpdate(application.contract._id, {
        status: 'in_progress',
        freelancer: application.freelancer
      });

      await Application.updateMany(
        { contract: application.contract._id, _id: { $ne: application._id } },
        { status: 'rejected' }
      );
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
