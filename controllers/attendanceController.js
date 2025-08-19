const client = require('../config/db');

const markAttendance = async (req, res) => {
  const {
    student_id,
    academic_year_id,
    class_id,
    section_id,
    attendance_date,
    status,
    recorded_by_staff_id,
    remarks
  } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO Attendance (
        student_id, academic_year_id, class_id, section_id,
        attendance_date, status, recorded_by_staff_id, remarks, created_at
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7, $8, NOW()
      ) RETURNING attendance_id`,
      [
        student_id,
        academic_year_id,
        class_id,
        section_id,
        attendance_date,
        status,
        recorded_by_staff_id,
        remarks
      ]
    );

    res.status(201).json({
      message: 'Attendance marked successfully',
      attendance_id: result.rows[0].attendance_id
    });

  } catch (err) {
    console.error('Error marking attendance:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  markAttendance
};
