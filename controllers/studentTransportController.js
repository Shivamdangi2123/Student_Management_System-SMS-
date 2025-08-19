const client = require('../config/db');

// ➕ Create Transport Assignment
const createTransportAssignment = async (req, res) => {
  const { student_id, route_id, stop_id, academic_year_id, is_active = true } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO StudentTransportAssignments (student_id, route_id, stop_id, academic_year_id, is_active)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [student_id, route_id, stop_id, academic_year_id, is_active]
    );

    res.status(201).json({ message: 'Transport assignment created', assignment: result.rows[0] });
  } catch (error) {
    console.error('Error creating transport assignment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  createTransportAssignment,
 
};
