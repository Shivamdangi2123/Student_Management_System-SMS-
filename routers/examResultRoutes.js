const express = require('express');
const router = express.Router();
const {
  createExamResult,
  getResultsByExamSubject
} = require('../controllers/examResultController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Routes
router.post(
  '/examresult',
  verifyToken,
  checkRole(['Admin', 'Teacher', 'ExamCoordinator']),
  checkPermission(['publish_exam_result']),
  createExamResult
);

module.exports = router;
