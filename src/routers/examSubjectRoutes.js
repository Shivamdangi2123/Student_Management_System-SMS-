const express = require('express');
const router = express.Router();
const { createExamSubject,  getExamsSubject } = require('../controllers/examSubjectController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admin or ExamCoordinator can schedule exam subjects
router.post(
  '/examsubject',
  verifyToken,
  checkRole(['Admin', 'ExamCoordinator']),
  // checkPermission(['assign_exam_subject']),
  createExamSubject
);
router.get("/exam-subjects",verifyToken, getExamsSubject)

module.exports = router;
