const client = require('../config/db');

// Create Exam Result
const createExamResult = async (req, res) => {
  const {
    exam_subject_id,
    student_id,
    marks_obtained,
    is_passed,
    grade,
    remarks,
    recorded_by_staff_id
  } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO ExamResults (
        exam_subject_id,
        student_id,
        marks_obtained,
        is_passed,
        grade,
        remarks,
        recorded_by_staff_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING exam_result_id`,
      [
        exam_subject_id,
        student_id,
        marks_obtained,
        is_passed,
        grade,
        remarks,
        recorded_by_staff_id
      ]
    );

    res.status(201).json({
      message: 'Result added successfully',
      exam_result_id: result.rows[0].exam_result_id
    });

  } catch (err) {
    console.error('Error creating exam result:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports = {
  createExamResult,

};
