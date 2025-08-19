const express = require('express');
const router = express.Router();
const {
  createWeekDay,
  getAllWeekDays,
  getWeekDayById,
  updateWeekDay,
  deleteWeekDay
} = require('../controllers/weekDayController');

const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// ➕ Create
router.post('/', verifyToken, checkRole(['Admin']), checkPermission(['manage_weekday']), createWeekDay);

// 📄 Read
router.get('/', verifyToken, getAllWeekDays);
router.get('/:day_id', verifyToken, getWeekDayById);

// ✏️ Update
router.put('/:day_id', verifyToken, checkRole(['Admin']), checkPermission(['manage_weekday']), updateWeekDay);

// ❌ Delete
router.delete('/:day_id', verifyToken, checkRole(['Admin']), checkPermission(['manage_weekday']), deleteWeekDay);

module.exports = router;
