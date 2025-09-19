const client = require('../config/db');

// Create income category
const createIncomeCategory = async (req, res) => {
  const { category_name } = req.body;
  try {
    const result = await client.query(
      `INSERT INTO incomecategories (income_category_id, category_name)
       VALUES (uuid_generate_v4(), $1) RETURNING *`,
      [category_name]
    );
    res.status(201).json({ message: 'Income category created', data: result.rows[0] });
  } catch (err) {
    console.error('createIncomeCategory error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Get all income categories
const getAllIncomeCategories = async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM incomecategories');
    res.json(result.rows);
  } catch (err) {
    console.error('getAllIncomeCategories error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

module.exports = {
  createIncomeCategory,
  getAllIncomeCategories,
};
