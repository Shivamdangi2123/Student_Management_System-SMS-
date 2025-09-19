const client = require('../config/db');

const createIncome = async (req, res) => {
  const {
    income_category_id,
    amount,
    income_date,
    description,
    payment_method,
  } = req.body;

  const received_by_staff_id = req.user.user_id; // from token

  try {
    const result = await client.query(
      `INSERT INTO incomes (
         income_category_id,
         amount,
         income_date,
         description,
         received_by_staff_id,
         payment_method
       ) VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        income_category_id,
        amount,
        income_date,
        description,
        received_by_staff_id,
        payment_method
      ]
    );

    res.status(201).json({ message: 'Income recorded', data: result.rows[0] });
  } catch (err) {
    console.error('createIncome error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Get all incomes with category name
const getAllIncomes = async (req, res) => {
  try {
    const result = await client.query(`
      SELECT i.*, c.category_name
      FROM incomes i
      LEFT JOIN incomecategories c ON i.income_category_id = c.income_category_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('getAllIncomes error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

module.exports = {
  createIncome,
  getAllIncomes,
};
