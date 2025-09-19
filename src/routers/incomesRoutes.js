const express = require('express');
const router = express.Router();
const {
  createIncome,
  getAllIncomes,
} = require('../controllers/incomesController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// POST /api/incomes
router.post('/incomes', verifyToken,createIncome);

// GET /api/incomes
router.get('/', getAllIncomes);

module.exports = router;
