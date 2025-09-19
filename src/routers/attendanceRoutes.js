const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance
} = require("../controllers/attendanceController");

const { verifyToken, checkRole, checkPermission } = require("../middlewares/authMiddleware");
const {
  validateMarkAttendance,
  validateUpdateAttendance,
  validateAttendanceId
} = require("../validators/attendanceValidator");
const validateRequest = require("../middlewares/validateRequest");

// ✅ Create
router.post(
  "/attendance",
  verifyToken,
  checkRole(["Teacher", "Admin"]),
  checkPermission(["create_attendance"]),
  validateMarkAttendance,
  validateRequest,
  markAttendance
);

// ✅ Get All
router.get(
  "/attendance",
  verifyToken,
  checkRole(["Teacher", "Admin"]),
  checkPermission(["view_attendance"]),
  getAllAttendance
);

// ✅ Get Single
router.get(
  "/attendance/:id",
  verifyToken,
  checkRole(["Teacher", "Admin"]),
  checkPermission(["view_attendance"]),
  validateAttendanceId,
  validateRequest,
  getAttendanceById
);

// ✅ Update
router.put(
  "/attendance",
  verifyToken,
  checkRole(["Teacher", "Admin"]),
  checkPermission(["update_attendance"]),
  validateUpdateAttendance,
  validateRequest,
  updateAttendance
);

// ✅ Delete
router.delete(
  "/attendance/:id",
  verifyToken,
  checkRole(["Admin"]),
  checkPermission(["delete_attendance"]),
  validateAttendanceId,
  validateRequest,
  deleteAttendance
);

module.exports = router;
