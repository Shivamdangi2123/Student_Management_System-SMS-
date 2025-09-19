const express = require('express');
const router = express.Router();
const { createStudent,getAllStudents } = require('../controllers/studentController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admin or Staff with 'create_student' permission can create student
router.post(
  '/students',
  verifyToken,
  checkRole(['Admin', 'Staff']),
  // checkPermission(['create_student']),
  createStudent
);
router.get('/students',verifyToken,getAllStudents)
module.exports = router;
