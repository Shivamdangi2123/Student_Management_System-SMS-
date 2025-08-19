const client = require('../config/db');

// Create Subject
const createSubject = async (req, res) => {
  const {
    subject_name,
    subject_code,
    is_elective = false,
    subject_level,
    minimum_designation_required
  } = req.body;

  try {
    // Check for duplicate subject_code
    const existing = await client.query(
      'SELECT * FROM Subjects WHERE subject_code = $1',
      [subject_code]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Subject code already exists' });
    }

    const result = await client.query(
      `INSERT INTO Subjects (
        subject_name, subject_code, is_elective,
        subject_level, minimum_designation_required
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [subject_name, subject_code, is_elective, subject_level, minimum_designation_required]
    );

    res.status(201).json({
      message: 'Subject created successfully',
      subject: result.rows[0]
    });
  } catch (err) {
    console.error('Error creating subject:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createSubject };
