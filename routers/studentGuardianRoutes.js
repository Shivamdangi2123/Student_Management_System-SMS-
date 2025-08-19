const express = require('express');
const router = express.Router();
const { linkStudentGuardian } = require('../controllers/studentGuardianController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admin or Staff with 'link_student_guardian' permission can link guardians
router.post(
  '/studentguardians',
  verifyToken,
  checkRole(['Admin', 'Staff']),
  checkPermission(['link_student_guardian']),
  linkStudentGuardian
);

module.exports = router;
