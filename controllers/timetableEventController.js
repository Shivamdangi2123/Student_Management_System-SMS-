const client = require('../config/db');

// Create Timetable Event
const createTimetableEvent = async (req, res) => {
  const {
    academic_year_id,
    class_id,
    section_id,
    day_id,
    slot_id,
    subject_id,
    staff_id,
    room_id,
    is_active = true,
    created_by_user_id,
    updated_by_user_id
  } = req.body;

  // Validation
  if (!academic_year_id || !class_id || !day_id || !slot_id || !subject_id || !staff_id || !room_id || !created_by_user_id || !updated_by_user_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Optional: Check for duplication (same slot, class, section, day)
    const check = await client.query(
      `SELECT * FROM TimetableEvents
       WHERE academic_year_id = $1 AND class_id = $2 AND day_id = $3 AND slot_id = $4 AND section_id = $5`,
      [academic_year_id, class_id, day_id, slot_id, section_id]
    );

    if (check.rows.length > 0) {
      return res.status(409).json({ message: 'Timetable event already exists for this slot' });
    }

    const result = await client.query(
      `INSERT INTO TimetableEvents (
        academic_year_id, class_id, section_id, day_id, slot_id,
        subject_id, staff_id, room_id, is_active,
        created_by_user_id, updated_by_user_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING event_id`,
      [
        academic_year_id,
        class_id,
        section_id || null,
        day_id,
        slot_id,
        subject_id,
        staff_id,
        room_id,
        is_active,
        created_by_user_id,
        updated_by_user_id
      ]
    );

    res.status(201).json({
      message: 'Timetable event created successfully',
      event_id: result.rows[0].event_id
    });

  } catch (err) {
    console.error('Error creating timetable event:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createTimetableEvent,
};
