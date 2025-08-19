const express = require('express');
const router = express.Router();
const { createStaff } = require('../controllers/staffController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admin with 'create_staff' permission can add staff
router.post(
  '/staff',
  verifyToken,
  checkRole(['Admin']),
  checkPermission(['create_staff']),
  createStaff
);

module.exports = router;
