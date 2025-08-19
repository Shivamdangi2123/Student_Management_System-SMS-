const express = require('express');
const router = express.Router();
const { createExamSubject, getExamSubjects } = require('../controllers/examSubjectController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admin or ExamCoordinator can schedule exam subjects
router.post(
  '/examsubject',
  verifyToken,
  checkRole(['Admin', 'ExamCoordinator']),
  checkPermission(['assign_exam_subject']),
  createExamSubject
);

module.exports = router;
