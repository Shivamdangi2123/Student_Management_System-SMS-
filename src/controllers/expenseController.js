const client = require('../config/db');

// Create a new expense
const createExpense = async (req, res) => {
  const { expense_category_id, amount, expense_date, decription, payment_method } = req.body;
const paid_by_staff_id = req.user.user_id; // or req.user.staff_id / req.user.id


  try {
    const result = await client.query(
  `INSERT INTO expense (expense_category_id, amount, expense_date, decription, paid_by_staff_id, payment_method)
   VALUES ($1, $2, $3, $4, $5, $6)
   RETURNING *`,
  [expense_category_id, amount, expense_date, decription, paid_by_staff_id, payment_method]
);

    res.status(201).json({ message: 'Expense added', data: result.rows[0] });
  } catch (err) {
    console.error('Error in createExpense:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Get all expenses
const getAllExpenses = async (req, res) => {
  try {
    const result = await client.query(`
      SELECT e.*, c.category_name
      FROM expense e
      LEFT JOIN expensecategories c
      ON e.expense_category_id = c.expense_category_id
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error in getAllExpenses:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

module.exports = {
  createExpense,
  getAllExpenses,
};
