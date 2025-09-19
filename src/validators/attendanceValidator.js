const { body, param } = require("express-validator");

// ✅ Create Attendance
exports.validateMarkAttendance = [
  body("student_id").isInt().withMessage("student_id must be an integer"),
  body("academic_year_id").isInt().withMessage("academic_year_id must be an integer"),
  body("class_id").isInt().withMessage("class_id must be an integer"),
  body("section_id").isInt().withMessage("section_id must be an integer"),
  body("attendance_date").isDate().withMessage("attendance_date must be a valid date"),
  body("status")
    .isIn(["Present", "Absent", "Late", "Excused"])
    .withMessage("status must be one of: Present, Absent, Late, Excused"),
  body("recorded_by_user_id").isInt().withMessage("recorded_by_user_id must be an integer"),
  body("remarks").optional().trim().escape()
];

// ✅ Update Attendance
exports.validateUpdateAttendance = [
  body("attendance_id").isInt().withMessage("attendance_id must be an integer"),
  body("status")
    .isIn(["Present", "Absent", "Late", "Excused"])
    .withMessage("status must be one of: Present, Absent, Late, Excused"),
  body("remarks").optional().trim().escape()
];

// ✅ Get/Delete by ID
exports.validateAttendanceId = [
  param("id").isInt().withMessage("Attendance ID must be an integer")
];
