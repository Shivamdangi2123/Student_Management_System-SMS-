const express = require('express');
const router = express.Router();

const { createHoliday } = require('../controllers/holidayController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admin or AcademicCoordinator with 'create_holiday' permission can create holidays
router.post(
  '/holiday',
  verifyToken,
  checkRole(['Admin', 'AcademicCoordinator']),
  // checkPermission(['manage_holidays']),
  createHoliday
);

module.exports = router;
