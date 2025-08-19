const express = require('express');
const router = express.Router();
const {
  createFeeCategory,
} = require('../controllers/feeCategoryController');

const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admins with 'manage_fee_category' permission can create fee category
router.post(
  '/feecategory',
  verifyToken,
  checkRole(['Admin']),
  checkPermission(['manage_fee_categories']),
  createFeeCategory
);

module.exports = router;
