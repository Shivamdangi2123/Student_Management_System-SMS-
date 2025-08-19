const client = require('../config/db');

// ➕ Create New Fee Concession
const createFeeConcession = async (req, res) => {
  const {
    student_id,
    fee_category_id,
    academic_year_id,
    concession_percentage,
    concession_amount,
    reason,
    approved_by_staff_id,
    approved_date
  } = req.body;

  try {
    // Insert into FeeConcessions
    const result = await client.query(
      `INSERT INTO FeeConcessions (
        student_id, fee_category_id, academic_year_id,
        concession_percentage, concession_amount, reason,
        approved_by_staff_id, approved_date
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`,
      [
        student_id,
        fee_category_id,
        academic_year_id,
        concession_percentage,
        concession_amount,
        reason,
        approved_by_staff_id,
        approved_date
      ]
    );

    res.status(201).json({
      message: 'Fee concession created successfully',
      concession: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating fee concession:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports = {
  createFeeConcession,
 
};
