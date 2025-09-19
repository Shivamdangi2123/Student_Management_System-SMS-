const express = require('express');
const router = express.Router();
const { createExam, getAllExams } = require('../controllers/examController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admin or ExamCoordinator can create exams
router.post(
  '/exam',
  verifyToken,
  checkRole(['Admin', 'ExamCoordinator']),
  // checkPermission(['create_exam']),
  createExam
);
router.get(
  '/exams',
  verifyToken,
  // checkRole(['Admin', 'ExamCoordinator', 'Teacher']), // Add roles as needed
  getAllExams
);

module.exports = router;
