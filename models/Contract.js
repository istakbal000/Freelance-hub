const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a contract title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a contract description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  skillsRequired: [{
    type: String,
    trim: true
  }],
  budget: {
    type: Number,
    required: [true, 'Please add a budget'],
    min: [1, 'Budget must be at least 1']
  },
  deadline: {
    type: Date,
    required: [true, 'Please add a deadline'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Deadline must be in the future'
    }
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'completed'],
    default: 'open'
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ContractSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Contract', ContractSchema);
