const express = require('express');
const router = express.Router();
const {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicleController');

const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// ➕ Create
router.post('/vehicle', verifyToken, checkRole(['Admin', 'TransportManager']), createVehicle);

module.exports = router;
