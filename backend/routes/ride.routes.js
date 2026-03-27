const express = require('express');
const rideController = require('../controllers/ride.controller');
const { verifyRider, verifyCaptain } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * Ride Routes
 */

// Ride request and estimation
router.post('/request', verifyRider, rideController.requestRide);
router.get('/estimate-fare', rideController.estimateFare);

// Captain actions
router.post('/accept/:rideId', verifyCaptain, rideController.acceptRide);
router.post('/start/:rideId', verifyCaptain, rideController.startRide);
router.post('/end/:rideId', verifyCaptain, rideController.endRide);

// Shared actions
router.post('/cancel/:rideId', rideController.cancelRide);

// Ride history and details
router.get('/history', rideController.getRideHistory);
router.get('/active', rideController.getActiveRides);
router.get('/:rideId', rideController.getRideDetails);

module.exports = router;
