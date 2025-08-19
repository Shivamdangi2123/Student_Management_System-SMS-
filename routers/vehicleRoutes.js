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
router.post('/', verifyToken, checkRole(['Admin', 'TransportManager']), checkPermission(['create_vehicle']), createVehicle);

module.exports = router;
