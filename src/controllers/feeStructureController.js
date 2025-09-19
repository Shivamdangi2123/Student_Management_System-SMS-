const client = require('../config/db');

const createFeeStructure = async (req, res) => {
  const {
    class_id,
    fee_category_id,
    amount,
    due_date,
    is_recurring,
    recurrence_interval
  } = req.body;

  const academic_year_id = req.user.academic_year_id; // from token

  try {
    const result = await client.query(
      `INSERT INTO feestructures (
        academic_year_id, class_id, fee_category_id,
        amount, due_date, is_recurring, recurrence_interval
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        academic_year_id,
        class_id || null,
        fee_category_id,
        amount,
        due_date || null,
        is_recurring,
        recurrence_interval || null
      ]
    );

    res.status(201).json({
      message: 'Fee structure created successfully',
      fee_structure: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating fee structure:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getFeeStructures = async (req, res) => {
  const academic_year_id = req.user.academic_year_id; // from token

  try {
    const result = await client.query(
      `SELECT  fee_structure_id, amount, due_date
FROM feestructures
WHERE academic_year_id = $1
ORDER BY due_date ASC;
`,
      [academic_year_id]
    );

    res.status(200).json({
      message: 'Fee structures fetched successfully',
      fee_structures: result.rows
    });
  } catch (error) {
    console.error('Error fetching fee structures:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createFeeStructure,  getFeeStructures,
};
