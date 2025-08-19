const express = require('express');
const router = express.Router();
const { assignSubjectToStaff } = require('../controllers/staffSubjectAssignmentController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admin or Principal with 'assign_subject_to_staff' permission can assign subjects
router.post(
  '/assignsubject',
  verifyToken,
  checkRole(['Admin', 'Principal']),
  checkPermission(['assign_subject_to_staff']),
  assignSubjectToStaff
);

module.exports = router;
