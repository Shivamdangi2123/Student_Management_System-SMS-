const express = require('express');
const router = express.Router();
const {
  createClassRoom,getAllClassRooms} = require('../controllers/classRoomController');

const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// ➕ Create Classroom — Only Admin with create_classroom permission
router.post(
  '/classrooms',
  verifyToken,
  checkRole(['Admin']),
  // checkPermission(['create_classroom','manage_class_rooms']),
  createClassRoom
);
router.get(
  '/classrooms',
  verifyToken,
  checkRole(['Admin']),
  getAllClassRooms
);

module.exports = router;
