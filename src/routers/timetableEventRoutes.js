const express = require('express');
const router = express.Router();

const { createTimetableEvent } = require('../controllers/timetableEventController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Allow only Admin or AcademicController to create timetable events
router.post(
  '/timetable-events',
  verifyToken,
  checkRole(['Admin', 'AcademicController']),
  // checkPermission(['create_timetable_event']),
  createTimetableEvent
);

module.exports = router;
