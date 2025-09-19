const express = require('express');
const router = express.Router();
const {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,getRoomsWithHostels
} = require('../controllers/roomController');

const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// ➕ Create
router.post(
  '/hostelroom',
  verifyToken,
  checkRole(['Admin']),
  // checkPermission(['manage_rooms']),
  createRoom
);

// 📄 Read
router.get('/rooms', verifyToken, getAllRooms);
router.get('/roomswithhostels', verifyToken, getRoomById);
router.get('/rooms/with-hostels',verifyToken,getRoomsWithHostels)
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
