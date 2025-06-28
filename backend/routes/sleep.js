const express = require('express');
const router = express.Router();
const {
  createSleepData,
  getMySleepData,
  getSleepData,
  updateSleepData,
  deleteSleepData,
  getSleepStats,
  getPublicSleepData
} = require('../controllers/sleepController');
const { protect, optionalAuth } = require('../middleware/auth');
const { validateSleepData } = require('../middleware/validation');

// Public routes
router.get('/public', optionalAuth, getPublicSleepData);

// Protected routes
router.route('/')
  .post(protect, validateSleepData, createSleepData)
  .get(protect, getMySleepData);

router.get('/stats', protect, getSleepStats);

router.route('/:id')
  .get(protect, getSleepData)
  .put(protect, validateSleepData, updateSleepData)
  .delete(protect, deleteSleepData);

module.exports = router; 