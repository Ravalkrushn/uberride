const Razorpay = require('razorpay');

/**
 * Initialize Razorpay instance
 */
let razorpayInstance = null;

const initializeRazorpay = () => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials are not set in environment variables');
    }

    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    console.log('Razorpay initialized successfully');
    return razorpayInstance;
  } catch (error) {
    console.error('Razorpay initialization error:', error.message);
    throw error;
  }
};

/**
 * Get Razorpay instance
 */
const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    return initializeRazorpay();
  }
  return razorpayInstance;
};

/**
 * Create order
 * @param {number} amount - Amount in currency units (will be converted to paise)
 * @param {string} currency - Currency code (e.g., 'INR')
 * @param {string} receipt - Receipt ID
 * @param {object} notes - Additional notes
 * @returns {Promise<object>} Order details
 */
const createOrder = async (amount, currency = 'INR', receipt, notes = {}) => {
  try {
    const razorpay = getRazorpayInstance();

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt,
      notes
    });

    return order;
  } catch (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }
};

/**
 * Fetch order details
 * @param {string} orderId - Razorpay Order ID
 * @returns {Promise<object>} Order details
 */
const fetchOrder = async (orderId) => {
  try {
    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.fetch(orderId);
    return order;
  } catch (error) {
    throw new Error(`Failed to fetch order: ${error.message}`);
  }
};

/**
 * Fetch payment details
 * @param {string} paymentId - Razorpay Payment ID
 * @returns {Promise<object>} Payment details
 */
const fetchPayment = async (paymentId) => {
  try {
    const razorpay = getRazorpayInstance();
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    throw new Error(`Failed to fetch payment: ${error.message}`);
  }
};

/**
 * Process refund
 * @param {string} paymentId - Razorpay Payment ID
 * @param {number} amount - Refund amount (optional, full refund if not specified)
 * @param {object} notes - Refund notes
 * @returns {Promise<object>} Refund details
 */
const processRefund = async (paymentId, amount = null, notes = {}) => {
  try {
    const razorpay = getRazorpayInstance();

    const refundData = { notes };
    if (amount) {
      refundData.amount = Math.round(amount * 100);
    }

    const refund = await razorpay.payments.refund(paymentId, refundData);
    return refund;
  } catch (error) {
    throw new Error(`Failed to process refund: ${error.message}`);
  }
};

/**
 * Fetch refund details
 * @param {string} refundId - Razorpay Refund ID
 * @returns {Promise<object>} Refund details
 */
const fetchRefund = async (refundId) => {
  try {
    const razorpay = getRazorpayInstance();
    const refund = await razorpay.refunds.fetch(refundId);
    return refund;
  } catch (error) {
    throw new Error(`Failed to fetch refund: ${error.message}`);
  }
};

/**
 * Create payment link (for direct payments without order)
 * @param {number} amount - Amount in currency units
 * @param {string} description - Payment description
 * @param {string} customerEmail - Customer email
 * @param {string} customerPhone - Customer phone
 * @returns {Promise<object>} Payment link details
 */
const createPaymentLink = async (
  amount,
  description,
  customerEmail,
  customerPhone
) => {
  try {
    const razorpay = getRazorpayInstance();

    const paymentLink = await razorpay.paymentLink.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      accept_partial: true,
      first_min_partial_amount: 100,
      description,
      customer: {
        email: customerEmail,
        contact: customerPhone
      },
      notify: {
        sms: true,
        email: true
      },
      reminder_enable: true,
      notes: {
        policy_name: 'Uberride Payment'
      }
    });

    return paymentLink;
  } catch (error) {
    throw new Error(`Failed to create payment link: ${error.message}`);
  }
};

/**
 * Validate payment signature
 * @param {string} orderId - Razorpay Order ID
 * @param {string} paymentId - Razorpay Payment ID
 * @param {string} signature - Payment signature
 * @returns {boolean} Whether signature is valid
 */
const validateSignature = (orderId, paymentId, signature) => {
  try {
    const crypto = require('crypto');
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Signature validation error:', error);
    return false;
  }
};

// Initialize on module load
initializeRazorpay();

module.exports = {
  initializeRazorpay,
  getRazorpayInstance,
  createOrder,
  fetchOrder,
  fetchPayment,
  processRefund,
  fetchRefund,
  createPaymentLink,
  validateSignature
};
