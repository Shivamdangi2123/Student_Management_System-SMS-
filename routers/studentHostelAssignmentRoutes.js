const express = require('express');
const router = express.Router();
const {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment
} = require('../controllers/studentHostelAssignmentController');

const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// ➕ Create
router.post(
  '/',
  verifyToken,
  checkRole(['Admin']),
  checkPermission(['manage_student_hostel_assignment']),
  createAssignment
);

// 📄 Read
router.get('/', verifyToken, getAllAssignments);
router.get('/:assignment_id', verifyToken, getAssignmentById);

// ✏️ Update
router.put(
  '/:assignment_id',
  verifyToken,
  checkRole(['Admin']),
  checkPermission(['manage_student_hostel_assignment']),
  updateAssignment
);

// ❌ Delete
router.delete(
  '/:assignment_id',
  verifyToken,
  checkRole(['Admin']),
  checkPermission(['manage_student_hostel_assignment']),
  deleteAssignment
);

module.exports = router;
