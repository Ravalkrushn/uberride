const express = require('express');
const captainController = require('../controllers/captain.controller');
const { verifyCaptain } = require('../middlewares/auth.middleware');
const { uploadDocuments, uploadErrorHandler } = require('../middlewares/upload.middleware');

const router = express.Router();

/**
 * Captain Routes
 */

router.get('/profile', verifyCaptain, captainController.getProfile);
router.put('/update-profile', verifyCaptain, captainController.updateProfile);
router.put('/toggle-online', verifyCaptain, captainController.toggleOnlineStatus);
router.post(
  '/upload-documents',
  verifyCaptain,
  uploadDocuments,
  uploadErrorHandler,
  captainController.uploadDocuments
);
router.get('/earnings', verifyCaptain, captainController.getEarnings);
router.get('/performance-stats', verifyCaptain, captainController.getPerformanceStats);

module.exports = router;
