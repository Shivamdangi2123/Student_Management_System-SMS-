const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories
} = require('../controllers/expensecategoriesController');
 const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');


// POST /api/categories
router.post('/categories',verifyToken,
 createCategory);

// GET /api/categories
router.get('/categories', getAllCategories);

module.exports = router;
