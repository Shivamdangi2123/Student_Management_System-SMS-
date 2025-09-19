const express = require('express');
const router = express.Router();
const { createStaff,getStaffList,getTeachers } = require('../controllers/staffController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admin with 'create_staff' permission can add staff
router.post(
  '/staff',
  verifyToken,
  checkRole(['Admin']),
  // checkPermission(['create_staff']),
  createStaff
);
router.get('/staff', verifyToken, getStaffList);
router.get('/teachers', verifyToken, getTeachers);
module.exports = router;
