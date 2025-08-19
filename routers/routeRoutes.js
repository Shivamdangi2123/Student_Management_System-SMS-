const express = require('express');
const router = express.Router();
const { createRoute } = require('../controllers/routeController');

const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// ➕ Create transport route — Admin or Transport Manager with permission
router.post(
  '/',
  verifyToken,
  checkRole(['Admin', 'TransportManager']),
  checkPermission(['manage_transport_routes']),
  createRoute
);

module.exports = router;
