const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  contract: {
    type: mongoose.Schema.ObjectId,
    ref: 'Contract',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  proposal: {
    type: String,
    required: [true, 'Please add a proposal'],
    maxlength: [1000, 'Proposal cannot be more than 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

ApplicationSchema.index({ contract: 1, freelancer: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
