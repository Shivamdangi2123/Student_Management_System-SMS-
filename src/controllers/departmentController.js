const client = require('../config/db');

// Create a new department
const createDepartment = async (req, res) => {
  const { department_name } = req.body;
 const institution_id = req.user?.institution_id;
   if (!institution_id) {
    return res.status(400).json({ message: 'Institution ID not found in token.' });
  }
  try {
    // Check if department already exists
 const existing = await client.query(
  `SELECT * FROM Departments WHERE department_name = $1 AND institution_id = $2`,
  [department_name, institution_id]
);


    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Department already exists' });
    }

    const result = await client.query(
      `INSERT INTO Departments (department_name,institution_id)
       VALUES ($1,$2) RETURNING department_id`,
      [department_name,institution_id]
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
const getDepartments = async (req, res) => {
  const institution_id = req.user?.institution_id;

  if (!institution_id) {
    return res.status(400).json({ message: 'Institution ID not found in token.' });
  }

  try {
    const result = await client.query(
      `SELECT department_id, department_name FROM Departments WHERE institution_id = $1`,
      [institution_id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createDepartment,getDepartments,
};
