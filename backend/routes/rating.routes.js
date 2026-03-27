const express = require('express');
const ratingController = require('../controllers/rating.controller');
const { verifyRider, verifyCaptain } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * Rating Routes
 */

router.post('/rate', ratingController.rateRide);
router.get('/my-ratings', ratingController.getMyRatings);
router.get('/ride/:rideId', ratingController.getRideRatings);

module.exports = router;
