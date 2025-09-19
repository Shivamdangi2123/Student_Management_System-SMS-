const express = require('express');
const router = express.Router();
const {
  createFeeStructure,  getFeeStructures,
} = require('../controllers/feeStructureController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Routes
router.post(
  '/feeStructure',
  verifyToken,
  checkRole(['Admin']),
  // checkPermission(['manage_fee_structure']),
  createFeeStructure
);
router.get('/Feestructure',verifyToken,  getFeeStructures,)
module.exports = router;
