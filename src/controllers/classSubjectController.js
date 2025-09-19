const client = require('../config/db');

// ➕ Assign Subject to Class
const assignSubjectToClass = async (req, res) => {
  const { class_id, subject_id } = req.body;
  const academic_year_id = req.user?.academic_year_id;

  try {
    const existing = await client.query(
      `SELECT * FROM classsubjects 
       WHERE class_id = $1 AND subject_id = $2 AND academic_year_id = $3`,
      [class_id, subject_id, academic_year_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Subject already assigned to this class' });
    }

    const result = await client.query(
      `INSERT INTO classsubjects (class_id, subject_id, academic_year_id)
       VALUES ($1, $2, $3) RETURNING *`,
      [class_id, subject_id, academic_year_id]
    );

    res.status(201).json({
      message: 'Subject assigned successfully',
      classSubject: result.rows[0]
    });
  } catch (error) {
    console.error('Error assigning subject:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 📄 Get Subjects of a Class
const getSubjectsByClass = async (req, res) => {
  const { class_id } = req.params;
  const academic_year_id = req.user?.academic_year_id;

  try {
    const result = await client.query(
      `SELECT s.subject_id, s.subject_name, s.subject_code, s.is_elective, s.subject_level
       FROM classsubjects cs
       JOIN subjects s ON cs.subject_id = s.subject_id
       WHERE cs.class_id = $1 AND cs.academic_year_id = $2`,
      [class_id, academic_year_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { assignSubjectToClass, getSubjectsByClass };
