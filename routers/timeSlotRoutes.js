const express = require('express');
const router = express.Router();
const {
  createTimeSlot,
  getAllTimeSlots,
  getTimeSlotById,
  updateTimeSlot,
  deleteTimeSlot
} = require('../controllers/timeSlotController');

const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// ➕ Create
router.post(
  '/',
  verifyToken,
  checkRole(['Admin']),
  checkPermission(['create_time_slot']),
  createTimeSlot
);

// 📄 Read
router.get('/', verifyToken, getAllTimeSlots);
router.get('/:slot_id', verifyToken, getTimeSlotById);

// ✏️ Update
router.put(
  '/:slot_id',
  verifyToken,
  checkRole(['Admin']),
  checkPermission(['update_time_slot']),
  updateTimeSlot
);

// ❌ Delete
router.delete(
  '/:slot_id',
  verifyToken,
  checkRole(['Admin']),
  checkPermission(['delete_time_slot']),
  deleteTimeSlot
);

module.exports = router;
