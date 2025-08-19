const express = require('express');
const router = express.Router();
const { createStop } = require('../controllers/stopController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// ➕ Create Stop (Only Admin or TransportManager with proper permission)
router.post(
  '/',
  verifyToken,
  checkRole(['Admin', 'TransportManager']),
  checkPermission(['create_transport_stop']),
  createStop
);

module.exports = router;
