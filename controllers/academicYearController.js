const client = require('../config/db');

// Add new Academic Year
const createAcademicYear = async (req, res) => {
  const { year_name, start_date, end_date, is_current = false } = req.body;

  try {
    // Check for duplicate year_name
    const check = await client.query(
      'SELECT * FROM AcademicYears WHERE year_name = $1',
      [year_name]
    );

    if (check.rows.length > 0) {
      return res.status(400).json({ message: 'Academic Year already exists' });
    }

    // If is_current = true, reset others to false
    if (is_current) {
      await client.query('UPDATE AcademicYears SET is_current = FALSE');
    }

    const result = await client.query(
      `INSERT INTO AcademicYears (year_name, start_date, end_date, is_current)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [year_name, start_date, end_date, is_current]
    );

    res.status(201).json({
      message: 'Academic Year created successfully',
      academicYear: result.rows[0]
    });
  } catch (err) {
    console.error('Error creating Academic Year:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createAcademicYear };
