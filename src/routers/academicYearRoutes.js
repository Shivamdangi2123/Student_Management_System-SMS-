
const express = require("express");
const router = express.Router();

const {
  createAcademicYear,
  updateAcademicYear,
  getAcademicYears,
  getAcademicYearById,
  deleteAcademicYear
} = require("../controllers/academicYearController");

const { verifyToken, checkRole, checkPermission } = require("../middlewares/authMiddleware");

const {
  validateCreateAcademicYear,
  validateUpdateAcademicYear,
  validateDeleteAcademicYear,
  validateGetAcademicYear
} = require("../validators/academicYearValidator");

const validateRequest = require("../middlewares/validateRequest");

// ✅ Create Academic Year
router.post(
  "/academic",
  verifyToken,
  checkRole(["Admin", "Principal"]),
  // checkPermission(["create_academic_year"]),
  validateCreateAcademicYear,
  validateRequest,
  createAcademicYear
);

// ✅ Update Academic Year
router.put(
  "/",
  verifyToken,
  checkRole(["Admin", "Principal"]),
  // checkPermission(["update_academic_year"]),
  validateUpdateAcademicYear,
  validateRequest,
  updateAcademicYear
);

// ✅ Get All Academic Years
router.get(
  "/",
  verifyToken,
  checkRole(["Admin", "Principal", "Teacher"]),
  // checkPermission(["view_academic_year"]),
  getAcademicYears
);

// ✅ Get Single Academic Year
router.get(
  "/:id",
  verifyToken,
  checkRole(["Admin", "Principal", "Teacher"]),
  // checkPermission(["view_academic_year"]),
  validateGetAcademicYear,
  validateRequest,
  getAcademicYearById
);

// ✅ Delete Academic Year
router.delete(
  "/:id",
  verifyToken,
  checkRole(["Admin", "Principal"]),
  // checkPermission(["delete_academic_year"]),
  validateDeleteAcademicYear,
  validateRequest,
  deleteAcademicYear
);

module.exports = router;
