const express = require('express');
const router = express.Router();

const { createPermission } = require('../controllers/permissionController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admin with 'manage_permissions' permission can create permissions
router.post(
  '/permission',
  verifyToken,
  checkRole(['Admin']),
  // checkPermission(['manage_permissions']),
  createPermission
);

module.exports = router;
