const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
    maxlength: [1000, 'Message cannot be more than 1000 characters']
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

MessageSchema.index({ sender: 1, receiver: 1 });
MessageSchema.index({ receiver: 1, read: 1 });

module.exports = mongoose.model('Message', MessageSchema);
