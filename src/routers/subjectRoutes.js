const express = require('express');
const router = express.Router();
const { createSubject, getSubjects } = require('../controllers/subjectController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admin or Academic Manager can add subject with permission
router.post(
  '/subjects',
  verifyToken,
  checkRole(['Admin', 'Academic Manager']),
  // checkPermission(['create_subject']),
  createSubject
);
router.get('/subjects',verifyToken,checkRole(['Admin']),getSubjects)

module.exports = router;
