const express = require('express');
const router = express.Router();
const {
  createFeeCategory,getFeeCategories
} = require('../controllers/feeCategoryController');

const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admins with 'manage_fee_category' permission can create fee category
router.post(
  '/feecategory',
  verifyToken,
  checkRole(['Admin']),
  // checkPermission(['manage_fee_categories']),
  createFeeCategory
);
router.get('/feecategories', verifyToken,getFeeCategories);
module.exports = router;
