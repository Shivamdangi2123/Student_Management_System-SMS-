const express = require('express');
const router = express.Router();
const { createAcademicYear } = require('../controllers/academicYearController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// ✅ Only Admins with create_academic_year permission can create academic year
router.post(
  '/academic',
  verifyToken,
  checkRole(['Admin']),
  checkPermission(['create_academic_year']),
  createAcademicYear
);

module.exports = router;
