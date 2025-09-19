const client = require('../config/db');



// ➕ Create Subject
const createSubject = async (req, res) => {
  const {
    subject_name,
    subject_code,
    is_elective,
    subject_level,
    minimum_designation_required,
  } = req.body;

  const institution_id = req.user?.institution_id; // ✅ token se uthaya

  try {
    if (!institution_id) {
      return res.status(400).json({ message: "Institution ID missing from token" });
    }

    const result = await client.query(
      `INSERT INTO subjects 
       (subject_name, subject_code, is_elective, subject_level, minimum_designation_required, institution_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        subject_name,
        subject_code,
        is_elective || false,
        subject_level,
        minimum_designation_required,
        institution_id,
      ]
    );

    res.status(201).json({
      message: "Subject created successfully",
      subject: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// 📥 GET All Subjects
const getSubjects = async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM subjects ORDER BY subject_name ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching subjects:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createSubject,
  getSubjects,
};
