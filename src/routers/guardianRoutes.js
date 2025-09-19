const express = require('express');
const router = express.Router();
const { addGuardian } = require('../controllers/guardianController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admin or Staff with 'add_guardian' permission can add guardians
router.post(
  '/guardians',
  verifyToken,
  checkRole(['Admin', 'Staff']),
  // checkPermission(['manage_guardian']),
  addGuardian
);

module.exports = router;
