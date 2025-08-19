const client = require('../config/db');

// Create a new department
const createDepartment = async (req, res) => {
  const { department_name } = req.body;

  try {
    // Check if department already exists
    const existing = await client.query(
      `SELECT * FROM Departments WHERE department_name = $1`,
      [department_name]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Department already exists' });
    }

    const result = await client.query(
      `INSERT INTO Departments (department_name)
       VALUES ($1) RETURNING department_id`,
      [department_name]
    );

    res.status(201).json({
      message: 'Department created successfully',
      department_id: result.rows[0].department_id
    });
  } catch (err) {
    console.error('Error creating department:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createDepartment
};
