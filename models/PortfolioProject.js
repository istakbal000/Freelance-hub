const mongoose = require('mongoose');

const PortfolioProjectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a project title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
    default: ''
  },
  imageUrl: {
    type: String,
    trim: true,
    default: ''
  },
  category: {
    type: String,
    enum: [
      'Web & App Development',
      'Design & Creative',
      'Writing & Content',
      'Digital Marketing',
      'Video & Animation',
      'Music & Audio',
      'Photography & Art',
      'Business & Finance',
      'Legal',
      'Education & Tutoring',
      'Virtual Assistant',
      'Data & Analytics',
      'Architecture & Engineering',
      'Other'
    ],
    default: 'Other'
  },
  tags: [{
    type: String,
    trim: true
  }],
  liveUrl: {
    type: String,
    trim: true,
    default: ''
  },
  projectLink: {
    type: String,
    trim: true,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

PortfolioProjectSchema.index({ user: 1, order: 1 });

module.exports = mongoose.model('PortfolioProject', PortfolioProjectSchema);
