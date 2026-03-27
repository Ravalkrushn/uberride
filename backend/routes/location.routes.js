const express = require('express');
const locationController = require('../controllers/location.controller');
const { verifyCaptain, verifyRider } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * Location Routes
 */

router.post('/update', verifyCaptain, locationController.updateLocation);
router.get('/nearby-captains', verifyRider, locationController.getNearbyCaptains);
router.get('/availability', verifyRider, locationController.getAvailability);

module.exports = router;
