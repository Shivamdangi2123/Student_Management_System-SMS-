const express = require('express');
const router = express.Router();
const { createSection,assignClassTeacher , getSectionsByClass} = require('../controllers/sectionController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admin with 'create_section' permission can create sections
router.post(
  '/sections',
  verifyToken,
  checkRole(['Admin']),
  // checkPermission(['manage_sections']),
  createSection
);
router.put('/sections/assign-teacher',
  verifyToken,
  checkRole(['Admin']),
  // checkPermission(['manage_sections']),
  assignClassTeacher
);
router.get('/classes/:class_id/sections',  verifyToken,
  checkRole(['Admin']),getSectionsByClass);
module.exports = router;
