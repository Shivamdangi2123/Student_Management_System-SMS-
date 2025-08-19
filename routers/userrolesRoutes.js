const express = require('express');
const router = express.Router();
const { assignUserRole } = require('../controllers/userrolesController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admin can assign roles
router.post('/user-roles', verifyToken, checkRole(['Admin']), checkPermission(['assign_user_role']), assignUserRole);

module.exports = router;
