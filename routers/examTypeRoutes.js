const express = require('express');
const router = express.Router();
const { createExamType } = require('../controllers/examTypeController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admin or ExamCoordinator can create exam types
router.post(
  '/examtype',
  verifyToken,
  checkRole(['Admin', 'ExamCoordinator']),
  checkPermission(['manage_exam_types']),
  createExamType
);

module.exports = router;
