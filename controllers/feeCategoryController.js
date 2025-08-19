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

module.exports = { createFeeCategory };
