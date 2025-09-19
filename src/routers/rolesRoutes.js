const express = require('express');
const router = express.Router();
const { createRole } = require('../controllers/rolesController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admin with 'manage_roles' permission can create roles
router.post(
  '/roles',
  verifyToken,
  checkRole(['Admin']),
  checkPermission(['manage_roles']),
  createRole
);

module.exports = router;

