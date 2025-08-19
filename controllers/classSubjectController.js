const client = require('../config/db');

// Assign subject to class
const assignSubjectToClass = async (req, res) => {
  const { class_id, subject_id, academic_year_id } = req.body;

  try {
    // Check if already exists
    const check = await client.query(
      `SELECT * FROM ClassSubjects WHERE class_id = $1 AND subject_id = $2 AND academic_year_id = $3`,
      [class_id, subject_id, academic_year_id]
    );

    if (check.rows.length > 0) {
      return res.status(400).json({ message: 'Subject already assigned to this class for the academic year' });
    }

    const result = await client.query(
      `INSERT INTO ClassSubjects (class_id, subject_id, academic_year_id)
       VALUES ($1, $2, $3) RETURNING *`,
      [class_id, subject_id, academic_year_id]
    );

    res.status(201).json({
      message: 'Subject assigned to class successfully',
      class_subject: result.rows[0]
    });
  } catch (err) {
    console.error('Error assigning subject to class:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { assignSubjectToClass };
