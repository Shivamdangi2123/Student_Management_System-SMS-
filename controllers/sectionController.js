const client = require('../config/db');

// Create Section Controller
const createSection = async (req, res) => {
  const {
    section_name,
    class_id,
    academic_year_id,
    class_teacher_id = null,
    max_students,
    default_room_id = null
  } = req.body;

  try {
    // Check if section already exists in this class and academic year
    const existing = await client.query(
      `SELECT * FROM sections 
       WHERE section_name = $1 AND class_id = $2 AND academic_year_id = $3`,
      [section_name, class_id, academic_year_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Section already exists for this class and academic year' });
    }

    // Insert section
    const result = await client.query(
      `INSERT INTO sections 
        (section_name, class_id, academic_year_id, class_teacher_id, max_students, default_room_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [section_name, class_id, academic_year_id, class_teacher_id, max_students, default_room_id]
    );

    res.status(201).json({
      message: 'Section created successfully',
      section: result.rows[0]
    });

  } catch (err) {
    console.error('Section creation error:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = { createSection };
