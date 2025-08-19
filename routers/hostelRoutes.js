const express = require('express');
const router = express.Router();
const {
  createHostel,
  getAllHostels,
  getHostelById,
  updateHostel,
  deleteHostel
} = require('../controllers/hostelController');

const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// ➕ Create
router.post(
  '/',
  verifyToken,
  checkRole(['Admin']),
  checkPermission(['manage_hostels']),
  createHostel
);

// 📄 Read
router.get('/', verifyToken, getAllHostels);
router.get('/:hostel_id', verifyToken, getHostelById);

// ✏️ Update
router.put(
  '/:hostel_id',
  verifyToken,
  checkRole(['Admin']),
  checkPermission(['manage_hostels']),
  updateHostel
);

// ❌ Delete
router.delete(
  '/:hostel_id',
  verifyToken,
  checkRole(['Admin']),
  checkPermission(['manage_hostels']),
  deleteHostel
);

module.exports = router;
