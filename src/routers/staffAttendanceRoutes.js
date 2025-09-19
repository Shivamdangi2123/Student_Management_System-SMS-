const express = require('express');
const router = express.Router();
const { markStaffAttendance } = require('../controllers/staffAttendanceController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Allow only Admin or HR with 'mark_staff_attendance' permission
router.post(
  '/staffAttendance',
  verifyToken,
  checkRole(['Admin', 'HR']),
  // checkPermission(['mark_staff_attendance']),
  markStaffAttendance
);

module.exports = router;
