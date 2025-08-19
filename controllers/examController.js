const client = require('../config/db');

// Create Exam
const createExam = async (req, res) => {
  const {
    exam_name,
    academic_year_id,
    class_id,
    exam_type_id,
    start_date,
    end_date,
    max_marks,
    passing_marks
  } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO Exams (
        exam_name,
        academic_year_id,
        class_id,
        exam_type_id,
        start_date,
        end_date,
        max_marks,
        passing_marks
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING exam_id`,
      [
        exam_name,
        academic_year_id,
        class_id,
        exam_type_id,
        start_date,
        end_date,
        max_marks,
        passing_marks
      ]
    );

    res.status(201).json({
      message: 'Exam created successfully',
      exam_id: result.rows[0].exam_id
    });

  } catch (err) {
    console.error('Error creating exam:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  createExam,

};
