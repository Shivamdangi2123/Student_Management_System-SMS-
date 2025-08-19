const express = require('express');
const router = express.Router();
const {
  createBed,
  getAllBeds,
  getBedById,
  updateBed,
  deleteBed
} = require('../controllers/bedController');

const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// ➕ Create
router.post(
  '/',
  verifyToken,
  checkRole(['Admin']),
  checkPermission(['create_bed','manage_beds']),
  createBed
);

// 📄 Read All Beds
router.get(
  '/',
  verifyToken,
  checkPermission(['view_beds']),
  getAllBeds
);

// 📄 Read Single Bed by ID
router.get(
  '/:bed_id',
  verifyToken,
  checkPermission(['view_beds']),
  getBedById
);

// ✏️ Update Bed
router.put(
  '/:bed_id',
  verifyToken,
  checkRole(['Admin']),
  checkPermission(['update_bed']),
  updateBed
);

// ❌ Delete Bed
router.delete(
  '/:bed_id',
  verifyToken,
  checkRole(['Admin']),
  checkPermission(['delete_bed']),
  deleteBed
);

module.exports = router;
