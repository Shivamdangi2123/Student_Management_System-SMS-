const client = require('../config/db');

const markStaffAttendance = async (req, res) => {
  const {
    staff_id,
    attendance_date,
    status,
    in_time,
    out_time,
    remarks
  } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO StaffAttendance (
        staff_id, attendance_date, status,
        in_time, out_time, remarks, created_at
      ) VALUES (
        $1, $2, $3,
        $4, $5, $6, NOW()
      ) RETURNING staff_attendance_id`,
      [staff_id, attendance_date, status, in_time, out_time, remarks]
    );

    res.status(201).json({
      message: 'Staff attendance marked successfully',
      staff_attendance_id: result.rows[0].staff_attendance_id
    });

  } catch (err) {
    console.error('Error marking staff attendance:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  markStaffAttendance
};
