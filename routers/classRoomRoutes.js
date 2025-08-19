const express = require('express');
const router = express.Router();
const {
  createClassRoom
} = require('../controllers/classRoomController');

const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// ➕ Create Classroom — Only Admin with create_classroom permission
router.post(
  '/classrooms',
  verifyToken,
  checkRole(['Admin']),
  checkPermission(['create_classroom','manage_class_rooms']),
  createClassRoom
);

module.exports = router;
