const express = require('express');
const router = express.Router();
const { createDepartment } = require('../controllers/departmentController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admin with 'create_department' permission can create department
router.post(
  '/departments',
  verifyToken,
  checkRole(['Admin']),
  checkPermission(['manage_departments']),
  createDepartment
);

module.exports = router;
