const express = require('express');
const router = express.Router();
const {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom
} = require('../controllers/roomController');

const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// ➕ Create
router.post(
  '/',
  verifyToken,
  checkRole(['Admin']),
  checkPermission(['manage_rooms']),
  createRoom
);

// 📄 Read
router.get('/', verifyToken, getAllRooms);
router.get('/:room_id', verifyToken, getRoomById);

// ✏️ Update
router.put(
  '/:room_id',
  verifyToken,
  checkRole(['Admin']),
  checkPermission(['manage_rooms']),
  updateRoom
);

// ❌ Delete
router.delete(
  '/:room_id',
  verifyToken,
  checkRole(['Admin']),
  checkPermission(['manage_rooms']),
  deleteRoom
);

module.exports = router;
