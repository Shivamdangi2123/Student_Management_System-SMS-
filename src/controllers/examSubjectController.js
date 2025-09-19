const client = require('../config/db');

// Create Exam Subject (schedule subject for exam)
const createExamSubject = async (req, res) => {
  const {
    exam_id,
    subject_id,
    exam_date,
    start_time,
    end_time,
    room_number,
    max_marks,
    passing_marks
  } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO ExamSubjects (
        exam_id,
        subject_id,
        exam_date,
        start_time,
        end_time,
        room_number,
        max_marks,
        passing_marks
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING exam_subject_id`,
      [
        exam_id,
        subject_id,
        exam_date,
        start_time,
        end_time,
        room_number,
        max_marks,
        passing_marks
      ]
    );

    res.status(201).json({
      message: 'Exam subject scheduled successfully',
      exam_subject_id: result.rows[0].exam_subject_id
    });

  } catch (err) {
    console.error('Error scheduling exam subject:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Get All Exam Subjects
const getExamsSubject = async (req, res) => {
  try {
    const result = await client.query(`
      SELECT 
        es.exam_subject_id,
        es.exam_id,
        es.subject_id,
        es.exam_date,
        es.start_time,
        es.end_time,
        es.room_number,
        es.max_marks,
        es.passing_marks,
        e.exam_name,
        s.subject_name
      FROM ExamSubjects es
      JOIN Exams e ON es.exam_id = e.exam_id
      JOIN Subjects s ON es.subject_id = s.subject_id
      ORDER BY es.exam_date DESC
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching exam subjects:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createExamSubject,
  getExamsSubject
};


