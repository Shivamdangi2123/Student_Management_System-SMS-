const express = require('express');
const router = express.Router();
const {
  createExpense,
  getAllExpenses
} = require('../controllers/expenseController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// POST /api/expenses
router.post('/expenses',verifyToken, createExpense);

// GET /api/expenses
router.get('/', getAllExpenses);

module.exports = router;
