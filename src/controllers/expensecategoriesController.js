const client = require('../config/db');

// Create a new category
const createCategory = async (req, res) => {
  const { category_name } = req.body;
  try {
   const result = await client.query(
  `INSERT INTO expensecategories (category_name)
   VALUES ($1) RETURNING *`,
  [category_name]
);

    res.status(201).json({ message: 'Category created', data: result.rows[0] });
  } catch (err) {
    console.error('Error in createCategory:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const result = await client.query(`SELECT * FROM expensecategories`);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error in getAllCategories:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
};
