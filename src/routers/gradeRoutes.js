const express = require('express');
const router = express.Router();
const {
  createGrade,
} = require('../controllers/gradeController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admins with 'manage_grades' permission can create grades
router.post(
  '/grade',
  verifyToken,
  checkRole(['Admin']),
  // checkPermission(['manage_grades']),
  createGrade
);

module.exports = router;
