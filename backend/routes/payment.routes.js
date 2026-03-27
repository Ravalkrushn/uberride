const express = require('express');
const paymentController = require('../controllers/payment.controller');
const { verifyRider } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * Payment Routes
 */

router.post('/create-order', verifyRider, paymentController.createOrder);
router.post('/verify-payment', verifyRider, paymentController.verifyPayment);
router.get('/history', verifyRider, paymentController.getPaymentHistory);
router.post('/refund/:paymentId', verifyRider, paymentController.requestRefund);

module.exports = router;
