const express = require('express');
const router = express.Router();
const { createSection } = require('../controllers/sectionController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admin with 'create_section' permission can create sections
router.post(
  '/sections',
  verifyToken,
  checkRole(['Admin']),
  checkPermission(['manage_sections']),
  createSection
);

module.exports = router;
