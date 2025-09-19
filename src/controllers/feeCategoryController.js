const client = require('../config/db');

const createFeeCategory = async (req, res) => {
  const { category_name, description } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO FeeCategories (category_name, description)
       VALUES ($1, $2) RETURNING *`,
      [category_name, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};


const getFeeCategories = async (req, res) => {
  try {
    const result = await client.query(`SELECT * FROM feecategories ORDER BY created_at DESC`);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching fee categories:', error);
    res.status(500).json({ error: 'Something went wrong while fetching fee categories' });
  }
};



module.exports = { createFeeCategory, getFeeCategories };
