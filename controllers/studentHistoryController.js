const client = require('../config/db');

const addStudentHistory = async (req, res) => {
  const {
    student_id,
    academic_year_id,
    class_id,
    section_id,
    promotion_status,
    date_of_leaving,
    leaving_reason
  } = req.body;

  try {
    // Basic validation (optional)
    if (!student_id || !academic_year_id || !class_id || !section_id || !promotion_status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await client.query(`
      INSERT INTO StudentAcademicHistory (
        student_id, academic_year_id, class_id, section_id,
        promotion_status, date_of_leaving, leaving_reason
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING student_history_id
    `, [
      student_id, academic_year_id, class_id, section_id,
      promotion_status, date_of_leaving || null, leaving_reason || null
    ]);

    res.status(201).json({ message: 'Student academic history added', history_id: result.rows[0].student_history_id });
  } catch (err) {
    console.error('Error adding student history:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { addStudentHistory };
