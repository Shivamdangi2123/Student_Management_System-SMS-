const client = require('../config/db');

// Create Class Controller
const createClass = async (req, res) => {
  const { class_name, class_numeric, institution_id } = req.body;

  try {
    // Check if class already exists for same institution
    const existing = await client.query(
      `SELECT * FROM classes WHERE institution_id = $1 AND class_numeric = $2`,
      [institution_id, class_numeric]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Class already exists for this institution' });
    }

    // Insert new class
    const result = await client.query(
      `INSERT INTO classes (class_name, class_numeric, institution_id)
       VALUES ($1, $2, $3) RETURNING *`,
      [class_name, class_numeric, institution_id]
    );

    res.status(201).json({
      message: 'Class created successfully',
      class: result.rows[0]
    });

  } catch (err) {
    console.error('Error creating class:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = { createClass };
