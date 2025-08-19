const express = require('express');
const router = express.Router();
const { createClass } = require('../controllers/classesController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// ✅ Only Admin or Class Coordinator with 'create_class' permission can create class
router.post(
  '/classes',
  verifyToken,
  checkRole(['Admin', 'Class Coordinator']),
  checkPermission(['create_class']),
  createClass
);

module.exports = router;
