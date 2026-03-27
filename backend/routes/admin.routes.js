const express = require('express');
const adminController = require('../controllers/admin.controller');
const { verifyAdmin } = require('../middlewares/role.middleware');

const router = express.Router();

/**
 * Admin Routes (all require admin role)
 */

router.get('/dashboard-stats', verifyAdmin, adminController.getDashboardStats);

// User management
router.get('/users', verifyAdmin, adminController.getAllUsers);
router.put('/ban-user/:userId', verifyAdmin, adminController.banUser);

// Captain management
router.get('/captains', verifyAdmin, adminController.getAllCaptains);
router.put('/approve-captain/:captainId', verifyAdmin, adminController.approveCaptain);
router.put('/suspend-captain/:captainId', verifyAdmin, adminController.suspendCaptain);

// Ride and revenue
router.get('/all-rides', verifyAdmin, adminController.getAllRides);
router.get('/revenue-report', verifyAdmin, adminController.getRevenueReport);

// Promotions
router.post('/create-promo', verifyAdmin, adminController.createPromoCode);

module.exports = router;
