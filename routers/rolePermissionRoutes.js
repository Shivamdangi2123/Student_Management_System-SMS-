const express = require('express');
const router = express.Router();

const { assignPermissionToRole } = require('../controllers/rolePermissionController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admin with 'assign_permissions' permission can assign permissions to roles
router.post(
  '/rolepermission',
  verifyToken,
  checkRole(['Admin']),
  checkPermission(['manage_role_permissions']),
  assignPermissionToRole
);

module.exports = router;
