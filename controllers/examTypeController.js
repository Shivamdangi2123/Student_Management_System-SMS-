const client = require('../config/db');

// Create Exam Type
const createExamType = async (req, res) => {
  const { exam_type_name } = req.body;

  try {
    // Check if already exists
    const check = await client.query(
      'SELECT * FROM ExamTypes WHERE exam_type_name = $1',
      [exam_type_name]
    );

    if (check.rows.length > 0) {
      return res.status(400).json({ message: 'Exam type already exists' });
    }

    const result = await client.query(
      `INSERT INTO ExamTypes (exam_type_name)
       VALUES ($1) RETURNING exam_type_id`,
      [exam_type_name]
    );

    res.status(201).json({
      message: 'Exam type created successfully',
      exam_type_id: result.rows[0].exam_type_id
    });

  } catch (err) {
    console.error('Error creating exam type:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  createExamType,
};
