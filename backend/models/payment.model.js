const mongoose = require('mongoose');

/**
 * Payment Schema - Records all financial transactions in the system
 * Tracks Razorpay integration, payment status, and refunds
 */
const paymentSchema = new mongoose.Schema(
  {
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
      required: [true, 'Ride is required']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Captain',
      default: null
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative']
    },
    method: {
      type: String,
      enum: ['cash', 'card', 'wallet', 'upi'],
      default: 'cash'
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'refunded'],
      default: 'pending'
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    refund: {
      status: {
        type: String,
        enum: ['not_requested', 'pending', 'completed', 'failed'],
        default: 'not_requested'
      },
      amount: {
        type: Number,
        default: 0
      },
      razorpayRefundId: String,
      reason: String,
      requestedAt: Date,
      completedAt: Date
    },
    failureReason: String,
    walletDeduction: {
      type: Number,
      default: 0
    },
    discount: {
      code: String,
      amount: {
        type: Number,
        default: 0
      }
    },
    platformFee: {
      type: Number,
      default: 0
    },
    captainPayout: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ ride: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ razorpayOrderId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
