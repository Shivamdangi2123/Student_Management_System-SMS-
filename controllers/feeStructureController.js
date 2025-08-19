const client = require('../config/db');

// ➕ Create Fee Structure
const createFeeStructure = async (req, res) => {
  const {
    academic_year_id,
    class_id,
    fee_category_id,
    amount,
    due_date,
    is_recurring = false,
    recurrence_interval
  } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO FeeStructures (
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


module.exports = {
  createFeeStructure,
 
};
