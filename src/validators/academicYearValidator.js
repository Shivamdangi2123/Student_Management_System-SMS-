const { body, param } = require("express-validator");

// ✅ Create Academic Year Validation
exports.validateCreateAcademicYear = [
  body("year_name")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Year name must be between 4 and 20 characters")
    .escape(),

  body("start_date")
    .isDate()
    .withMessage("Start date must be a valid date"),

  body("end_date")
    .isDate()
    .withMessage("End date must be a valid date"),

  body("is_current")
    .optional()
    .isBoolean()
    .withMessage("is_current must be a boolean")
];

// ✅ Update Academic Year Validation
exports.validateUpdateAcademicYear = [
  body("academic_year_id")
    .isInt()
    .withMessage("academic_year_id must be an integer"),

  body("year_name")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Year name must be between 4 and 20 characters")
    .escape(),

  body("start_date")
    .isDate()
    .withMessage("Start date must be a valid date"),

  body("end_date")
    .isDate()
    .withMessage("End date must be a valid date"),

  body("is_current")
    .optional()
    .isBoolean()
    .withMessage("is_current must be a boolean")
];

// ✅ Delete Academic Year Validation (id from params)
exports.validateDeleteAcademicYear = [
  param("id")
    .isInt()
    .withMessage("Academic Year ID must be an integer")
];

// ✅ Get Single Academic Year Validation (id from params)
exports.validateGetAcademicYear = [
  param("id")
    .isInt()
    .withMessage("Academic Year ID must be an integer")
];
