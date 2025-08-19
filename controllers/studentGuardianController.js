const client = require('../config/db');

const linkStudentGuardian = async (req, res) => {
  const { student_id, guardian_id, is_primary_contact = false } = req.body;

  try {
    // Check if this relationship already exists
    const check = await client.query(
      `SELECT * FROM StudentGuardians WHERE student_id = $1 AND guardian_id = $2`,
      [student_id, guardian_id]
    );

    if (check.rows.length > 0) {
      return res.status(400).json({ message: 'Student and Guardian are already linked' });
    }

    const result = await client.query(`
      INSERT INTO StudentGuardians (student_id, guardian_id, is_primary_contact)
      VALUES ($1, $2, $3)
      RETURNING student_guardian_id
    `, [student_id, guardian_id, is_primary_contact]);

    res.status(201).json({
      message: 'Guardian linked to student successfully',
      student_guardian_id: result.rows[0].student_guardian_id
    });
  } catch (err) {
    console.error('Error linking guardian:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { linkStudentGuardian };
