const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/payment.model');
const Ride = require('../models/ride.model');
const ApiResponse = require('../utils/apiResponse');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * Create payment order
 * POST /api/payment/create-order
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { rideId, amount } = req.body;

    if (!rideId || !amount) {
      return res.status(400).json(
        new ApiResponse(400, null, 'Ride ID and amount are required', false)
      );
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Amount in paise
      currency: 'INR',
      receipt: `ripple_${rideId}`,
      notes: {
        rideId: rideId
      }
    });

    const payment = await Payment.create({
      ride: rideId,
      user: req.user._id,
      amount,
      method: 'card',
      status: 'pending',
      razorpayOrderId: order.id
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          orderId: order.id,
          amount,
          currency: order.currency,
          paymentId: payment._id
        },
        'Order created successfully',
        true
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Verify payment
 * POST /api/payment/verify-payment
 */
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, rideId } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json(
        new ApiResponse(400, null, 'All payment details are required', false)
      );
    }

    // Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpaySignature;

    if (!isSignatureValid) {
      return res.status(401).json(
        new ApiResponse(401, null, 'Payment verification failed', false)
      );
    }

    // Update payment status
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId },
      {
        razorpayPaymentId,
        razorpaySignature,
        status: 'success'
      },
      { new: true }
    );

    // Update ride payment status
    await Ride.findByIdAndUpdate(rideId, {
      paymentStatus: 'completed',
      paymentId: payment._id
    });

    return res.status(200).json(
      new ApiResponse(200, { payment }, 'Payment verified successfully', true)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get payment history
 * GET /api/payment/history
 */
exports.getPaymentHistory = async (req, res, next) => {
  try {
    const { limit = 10, skip = 0 } = req.query;

    const payments = await Payment.find({ user: req.user._id })
      .populate('ride')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Payment.countDocuments({ user: req.user._id });

    return res.status(200).json(
      new ApiResponse(
        200,
        { payments, total, limit: parseInt(limit), skip: parseInt(skip) },
        'Payment history retrieved successfully',
        true
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Request refund
 * POST /api/payment/refund/:paymentId
 */
exports.requestRefund = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json(
        new ApiResponse(400, null, 'Refund reason is required', false)
      );
    }

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json(
        new ApiResponse(404, null, 'Payment not found', false)
      );
    }

    if (payment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json(
        new ApiResponse(403, null, 'Unauthorized', false)
      );
    }

    if (payment.status !== 'success') {
      return res.status(400).json(
        new ApiResponse(400, null, 'Only successful payments can be refunded', false)
      );
    }

    // Process refund
    const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
      amount: Math.round(payment.amount * 100),
      notes: {
        reason
      }
    });

    // Update payment
    payment.refund.status = 'completed';
    payment.refund.amount = payment.amount;
    payment.refund.reason = reason;
    payment.refund.razorpayRefundId = refund.id;
    payment.refund.completedAt = new Date();
    payment.status = 'refunded';
    await payment.save();

    return res.status(200).json(
      new ApiResponse(200, { payment }, 'Refund processed successfully', true)
    );
  } catch (error) {
    next(error);
  }
};
