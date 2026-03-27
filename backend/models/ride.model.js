const mongoose = require('mongoose');

/**
 * Ride Schema - Represents individual ride requests and completions
 * Tracks pickup, dropoff, pricing, OTP verification, and payment details
 */
const rideSchema = new mongoose.Schema(
  {
    pickup: {
      address: {
        type: String,
        required: [true, 'Pickup address is required']
      },
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true
        }
      }
    },
    dropoff: {
      address: {
        type: String,
        required: [true, 'Dropoff address is required']
      },
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true
        }
      }
    },
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Rider is required']
    },
    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Captain',
      default: null
    },
    status: {
      type: String,
      enum: ['requested', 'accepted', 'started', 'completed', 'cancelled'],
      default: 'requested'
    },
    fare: {
      type: Number,
      default: 0
    },
    distance: {
      type: Number, // in kilometers
      default: 0
    },
    duration: {
      type: Number, // in minutes
      default: 0
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'wallet', 'card'],
      default: 'cash'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    otp: {
      code: String,
      verified: {
        type: Boolean,
        default: false
      },
      attempts: {
        type: Number,
        default: 0
      },
      expiresAt: Date
    },
    startTime: {
      type: Date,
      default: null
    },
    endTime: {
      type: Date,
      default: null
    },
    cancelReason: String,
    cancelledBy: {
      type: String,
      enum: ['rider', 'captain', 'system'],
      default: null
    },
    surgeMultiplier: {
      type: Number,
      default: 1,
      min: 1,
      max: 3
    },
    riderRating: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rating',
      default: null
    },
    captainRating: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rating',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries
rideSchema.index({ rider: 1, createdAt: -1 });
rideSchema.index({ captain: 1, createdAt: -1 });
rideSchema.index({ status: 1 });
rideSchema.index({ 'pickup.coordinates': '2dsphere' });
rideSchema.index({ 'dropoff.coordinates': '2dsphere' });

module.exports = mongoose.model('Ride', rideSchema);
