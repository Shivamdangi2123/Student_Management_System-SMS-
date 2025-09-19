const client = require('../config/db');

// Create Holiday
const createHoliday = async (req, res) => {
  const { holiday_date, holiday_name, academic_year_id } = req.body;

  // Validate required fields
  if (!holiday_date || !holiday_name || !academic_year_id) {
    return res.status(400).json({ message: 'holiday_date, holiday_name, and academic_year_id are required' });
  }

  try {
    // Check if the holiday already exists for that date
    const existing = await client.query(
      'SELECT * FROM Holidays WHERE holiday_date = $1 AND academic_year_id = $2',
      [holiday_date, academic_year_id]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Holiday already exists for this date in the academic year' });
    }

    const result = await client.query(
      `INSERT INTO Holidays (holiday_date, holiday_name, academic_year_id)
       VALUES ($1, $2, $3) RETURNING holiday_id`,
      [holiday_date, holiday_name, academic_year_id]
    );

    res.status(201).json({
      message: 'Holiday created successfully',
      holiday_id: result.rows[0].holiday_id
    });

  } catch (error) {
    console.error('Error creating holiday:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createHoliday,
};
