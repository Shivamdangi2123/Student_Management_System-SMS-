const express = require('express');
const router = express.Router();
const { assignTeacherToSubject, getTeachersByClassSubject } = require('../controllers/staffSubjectAssignmentController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// Assign subject to staff
router.post("/staff-subject-assignments", 
  verifyToken,
  checkRole(['Admin', 'Principal']),
  assignTeacherToSubject
);

// Get teachers assigned to a class-subject
router.get("/class-subjects/:class_subject_id/teachers", verifyToken, getTeachersByClassSubject);

module.exports = router;
