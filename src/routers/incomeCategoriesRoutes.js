const express = require('express');
const router = express.Router();
const {
  createIncomeCategory,
  getAllIncomeCategories,
} = require('../controllers/incomeCategoriesController');

// POST /api/income-categories
router.post('/income-categories', createIncomeCategory);

// GET /api/income-categories
router.get('/income-categories', getAllIncomeCategories);

module.exports = router;
