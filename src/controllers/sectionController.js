const client = require('../config/db');
// const { v4: uuidv4 } = require('uuid');

// ➕ Create Section
const createSection = async (req, res) => {
   console.log("📩 Request Body:", req.body);
  console.log("👤 User from token:", req.user);
  const {
    section_name,
    class_id,
    class_teacher_id = null,
    max_students,
    default_room_id = null, 
    
  } = req.body;

  // academic_year_id hamesha token se uthao
// academic_year_id token se ya DB se uthao
let academic_year_id = req.user?.academic_year_id;

if (!academic_year_id) {
  const yearRes = await client.query(
    `SELECT academic_year_id FROM academicyears WHERE is_current = true LIMIT 1`
  );
  academic_year_id = yearRes.rows[0]?.academic_year_id;
}
const institution_id = req.user?.institution_id;
if (!academic_year_id || !req.user?.institution_id) {
  return res.status(400).json({ message: 'Academic Year or Institution ID missing' });
}

  try {
    // check duplicate section
    const existing = await client.query(
      `SELECT * FROM Sections 
       WHERE section_name = $1 AND class_id = $2 AND academic_year_id = $3`,
      [section_name, class_id, academic_year_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Section already exists for this class and academic year' });
    }

    const result = await client.query(
      `INSERT INTO Sections 
        (section_name, class_id, academic_year_id, class_teacher_id, max_students, default_room_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
      
        section_name,
        class_id,
        academic_year_id,
       
        class_teacher_id,
        max_students,
        default_room_id
      ]
    );

    res.status(201).json({ message: 'Section created successfully', section: result.rows[0] });
  } catch (err) {
    console.error('❌ Section creation error:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// 👨‍🏫 Assign Class Teacher
const assignClassTeacher = async (req, res) => {
  const { section_id, staff_id } = req.body;

  try {
    const result = await client.query(
      `UPDATE Sections
       SET class_teacher_id = $1, updated_at = NOW()
       WHERE section_id = $2
       RETURNING *`,
      [staff_id, section_id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Section not found' });

    res.json({ message: 'Class teacher assigned successfully', section: result.rows[0] });
  } catch (error) {
    console.error('❌ Error assigning class teacher:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 📄 Get Sections by Class (Academic Year token se uthana better hai)
// sectionController.js
const getSectionsByClass = async (req, res) => {
  const { class_id } = req.params;
  const academic_year_id = req.user?.academic_year_id;

  try {
    const result = await client.query(
      `SELECT section_id, section_name AS name
       FROM Sections
       WHERE class_id = $1 AND academic_year_id = $2`,
      [class_id, academic_year_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching sections:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createSection, assignClassTeacher, getSectionsByClass };
