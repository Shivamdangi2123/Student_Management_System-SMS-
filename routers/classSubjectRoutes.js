const express = require('express');
const router = express.Router();
const { assignSubjectToClass } = require('../controllers/classSubjectController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admin or Academic Manager with 'assign_subject' permission can assign subject
router.post(
  '/classsubjects',
  verifyToken,
  checkRole(['Admin', 'Academic Manager']),
  checkPermission(['assign_subject']),
  assignSubjectToClass
);

module.exports = router;
