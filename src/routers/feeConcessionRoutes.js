const express = require('express');
const router = express.Router();
const {
  createFeeConcession,
} = require('../controllers/feeConcessionController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// POST new concession — only Admin or Accountant with permission
router.post(
  '/feeConcession',
  verifyToken,
  checkRole(['Admin', 'Accountant']),
  // checkPermission(['manage_fee_concessions']),
  createFeeConcession
);

module.exports = router;
