const express = require('express');
const router = express.Router();
const { createStudentFee   ,getStudentFeeById,
  getAllStudentFees,} = require('../controllers/studentFeeController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admin or Accountant with 'create_student_fee' permission
router.post(
  '/studentfee',
  verifyToken,
  checkRole(['Admin', 'Accountant']),
  // checkPermission(['create_student_fee']),
  createStudentFee
);
// Get all
router.get("/studentfees", verifyToken, getAllStudentFees);

// Get by ID
router.get("/studentfees/:id", verifyToken, getStudentFeeById);

module.exports = router;
