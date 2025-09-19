const client = require('../config/db');

// ➕ Create Assignment
const createAssignment = async (req, res) => {
  const {
    student_id,
    hostel_id,
    room_id,
    bed_id,
    academic_year_id,
    allotment_date,
    vacate_date,
    is_active
  } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO StudentHostelAssignments 
        (student_id, hostel_id, room_id, bed_id, academic_year_id, allotment_date, vacate_date, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, TRUE))
       RETURNING *`,
      [student_id, hostel_id, room_id, bed_id, academic_year_id, allotment_date, vacate_date, is_active]
    );

    res.status(201).json({ message: 'Hostel assignment created', assignment: result.rows[0] });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 📄 Get All Assignments
const getAllAssignments = async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM StudentHostelAssignments ORDER BY assignment_id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 🔍 Get Assignment by ID
const getAssignmentById = async (req, res) => {
  const { assignment_id } = req.params;

  try {
    const result = await client.query(
      'SELECT * FROM StudentHostelAssignments WHERE assignment_id = $1',
      [assignment_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✏️ Update Assignment
const updateAssignment = async (req, res) => {
  const { assignment_id } = req.params;
  const {
    student_id,
    hostel_id,
    room_id,
    bed_id,
    academic_year_id,
    allotment_date,
    vacate_date,
    is_active
  } = req.body;

  try {
    const result = await client.query(
      `UPDATE StudentHostelAssignments SET
        student_id = $1,
        hostel_id = $2,
        room_id = $3,
        bed_id = $4,
        academic_year_id = $5,
        allotment_date = $6,
        vacate_date = $7,
        is_active = $8
       WHERE assignment_id = $9
       RETURNING *`,
      [student_id, hostel_id, room_id, bed_id, academic_year_id, allotment_date, vacate_date, is_active, assignment_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json({ message: 'Assignment updated', assignment: result.rows[0] });
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ❌ Delete Assignment
const deleteAssignment = async (req, res) => {
  const { assignment_id } = req.params;

  try {
    const result = await client.query(
      'DELETE FROM StudentHostelAssignments WHERE assignment_id = $1 RETURNING *',
      [assignment_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment
};
