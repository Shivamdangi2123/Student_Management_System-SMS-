const express = require('express');
const router = express.Router();
const {
  createFeePayment,
} = require('../controllers/feePaymentController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Routes
router.post(
  '/',
  verifyToken,
  checkRole(['Admin', 'Accountant']),
  checkPermission(['manage_fee_payments']),
  createFeePayment
);

module.exports = router;
