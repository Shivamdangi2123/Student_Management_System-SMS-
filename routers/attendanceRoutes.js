const express = require('express');
const router = express.Router();
const { markAttendance } = require('../controllers/attendanceController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// ✅ Only Teacher or Admin with 'create_attendance' permission can mark attendance
router.post(
  '/mark',
  verifyToken,
  checkRole(['Teacher', 'Admin']),
  checkPermission(['create_attendance']),
  markAttendance
);

module.exports = router;
