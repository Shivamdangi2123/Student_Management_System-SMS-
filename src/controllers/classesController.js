const client = require('../config/db');

// ➕ Create Class
const createClass = async (req, res) => {
  const { class_name, class_numeric } = req.body;
  const institution_id = req.user?.institution_id;

  if (!institution_id) {
    return res.status(400).json({ message: 'Institution ID not found in token.' });
  }

  try {
    // Check duplicate class for institution
    const existing = await client.query(
      `SELECT * FROM Classes WHERE institution_id = $1 AND class_numeric = $2`,
      [institution_id, class_numeric]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Class already exists for this institution' });
    }

    const result = await client.query(
      `INSERT INTO Classes (class_name, class_numeric, institution_id)
       VALUES ($1, $2, $3) RETURNING *`,
      [class_name, class_numeric, institution_id]
    );

    res.status(201).json({ message: 'Class created successfully', class: result.rows[0] });
  } catch (err) {
    console.error('Error creating class:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// 📄 Get All Classes for institution
const getAllClasses = async (req, res) => {
  const institution_id = req.user?.institution_id;

  if (!institution_id) {
    return res.status(400).json({ message: 'Institution ID not found in token.' });
  }

  try {
    const result = await client.query(
      `SELECT * FROM Classes WHERE institution_id = $1 ORDER BY class_numeric`,
      [institution_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createClass, getAllClasses };
