const client = require('../config/db');

const assignSubjectToStaff = async (req, res) => {
  const {
    staff_id,
    subject_id,
    class_id,
    academic_year_id,
    can_teach = true,
    teaching_preference,
    max_periods_per_day,
    max_periods_per_week,
    is_class_teacher = false
  } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO StaffSubjectAssignments (
        staff_id, subject_id, class_id, academic_year_id,
        can_teach, teaching_preference, max_periods_per_day,
        max_periods_per_week, is_class_teacher
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7,
        $8, $9
      ) RETURNING assignment_id`,
      [
        staff_id,
        subject_id,
        class_id,
        academic_year_id,
        can_teach,
        teaching_preference,
        max_periods_per_day,
        max_periods_per_week,
        is_class_teacher
      ]
    );

    res.status(201).json({
      message: "Subject assigned to staff successfully",
      assignment_id: result.rows[0].assignment_id
    });

  } catch (err) {
    console.error("Error assigning subject to staff:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  assignSubjectToStaff
};
