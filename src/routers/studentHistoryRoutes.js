const express = require('express');
const router = express.Router();
const { addStudentHistory } = require('../controllers/studentHistoryController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admin or Staff with 'add_student_history' permission can add student academic history
router.post(
  '/studenthistory',
  verifyToken,
  checkRole(['Admin', 'Staff']),
  // checkPermission(['add_student_history']),
  addStudentHistory
);

module.exports = router;
