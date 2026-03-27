const express = require('express');
const userController = require('../controllers/user.controller');
const { verifyRider } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * User Routes
 */

router.get('/profile', verifyRider, userController.getProfile);
router.put('/update-profile', verifyRider, userController.updateProfile);
router.put('/change-password', verifyRider, userController.changePassword);
router.post('/add-saved-address', verifyRider, userController.addSavedAddress);
router.get('/saved-addresses', verifyRider, userController.getSavedAddresses);
router.delete('/account', verifyRider, userController.deleteAccount);

module.exports = router;
