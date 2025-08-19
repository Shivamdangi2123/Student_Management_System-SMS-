const express = require('express');
const router = express.Router();
const {
  createFeeStructure,
} = require('../controllers/feeStructureController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Routes
router.post(
  '/feeStructure',
  verifyToken,
  checkRole(['Admin']),
  checkPermission(['manage_fee_structure']),
  createFeeStructure
);

module.exports = router;
