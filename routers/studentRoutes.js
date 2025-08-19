const express = require('express');
const router = express.Router();
const { createStudent } = require('../controllers/studentController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admin or Staff with 'create_student' permission can create student
router.post(
  '/students',
  verifyToken,
  checkRole(['Admin', 'Staff']),
  checkPermission(['create_student']),
  createStudent
);

module.exports = router;
