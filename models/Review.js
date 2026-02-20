const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  contract: {
    type: mongoose.Schema.ObjectId,
    ref: 'Contract',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  reviewee: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating'],
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    maxlength: [500, 'Feedback cannot be more than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ReviewSchema.index({ contract: 1, reviewer: 1 }, { unique: true });

ReviewSchema.statics.getAverageRating = async function(userId) {
  const obj = await this.aggregate([
    {
      $match: { reviewee: userId }
    },
    {
      $group: {
        _id: '$reviewee',
        averageRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);

  try {
    await this.model('User').findByIdAndUpdate(userId, {
      rating: Math.ceil(obj[0] ? obj[0].averageRating : 0),
      totalReviews: obj[0] ? obj[0].count : 0
    });
  } catch (err) {
    console.error(err);
  }
};

ReviewSchema.post('save', async function() {
  await this.constructor.getAverageRating(this.reviewee);
});

ReviewSchema.post('remove', async function() {
  await this.constructor.getAverageRating(this.reviewee);
});

module.exports = mongoose.model('Review', ReviewSchema);
