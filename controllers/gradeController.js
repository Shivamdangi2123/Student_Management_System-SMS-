const client = require('../config/db');

// Create Grade
const createGrade = async (req, res) => {
  const { grade_name, min_percentage, max_percentage } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO Grades (grade_name, min_percentage, max_percentage)
       VALUES ($1, $2, $3) RETURNING *`,
      [grade_name, min_percentage, max_percentage]
    );

    res.status(201).json({
      message: 'Grade created successfully',
      grade: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating grade:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createGrade
};
