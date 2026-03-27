const mongoose = require('mongoose');

/**
 * Rating Schema - Stores user and captain feedback for each completed ride
 * Tracks stars, tags, and comments for quality assessment
 */
const ratingSchema = new mongoose.Schema(
  {
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
      required: [true, 'Ride is required'],
      unique: true
    },
    ratedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Rater is required']
    },
    ratedTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Rated to user/captain is required']
    },
    role: {
      type: String,
      enum: ['rider', 'captain'],
      required: [true, 'Role is required']
    },
    stars: {
      type: Number,
      required: [true, 'Star rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    tags: [
      {
        type: String,
        enum: [
          'clean_vehicle',
          'polite',
          'fast',
          'safe_driving',
          'friendly',
          'professional_vehicle',
          'dirty_vehicle',
          'rude',
          'slow',
          'dangerous_driving',
          'unfriendly'
        ]
      }
    ],
    comment: {
      type: String,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    anonymous: {
      type: Boolean,
      default: false
    },
    helpful: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries
ratingSchema.index({ ratedTo: 1, createdAt: -1 });
ratingSchema.index({ ratedBy: 1 });
ratingSchema.index({ ride: 1 });
ratingSchema.index({ role: 1 });

module.exports = mongoose.model('Rating', ratingSchema);
