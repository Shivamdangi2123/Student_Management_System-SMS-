const express = require('express');
const router = express.Router();
const { createStudentFee } = require('../controllers/studentFeeController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admin or Accountant with 'create_student_fee' permission
router.post(
  '/',
  verifyToken,
  checkRole(['Admin', 'Accountant']),
  checkPermission(['create_student_fee']),
  createStudentFee
);

module.exports = router;
