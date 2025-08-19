const express = require('express');
const router = express.Router();
const { createTransportAssignment } = require('../controllers/studentTransportController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// ➕ Create transport assignment (Admin or TransportManager with manage_transport permission)
router.post(
  '/',
  verifyToken,
  checkRole(['Admin', 'TransportManager']),
  checkPermission(['manage_transport']),
  createTransportAssignment
);

module.exports = router;
