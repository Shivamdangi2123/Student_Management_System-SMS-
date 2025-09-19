const client = require('../config/db');

// ➕ Create Student Fee Record
const createStudentFee = async (req, res) => {
  const {
    student_id,
    fee_structure_id,
    academic_year_id,
    amount_payable,
    amount_paid = 0.00,
    due_date,
    status,
    is_discount_applied = false,
    discount_amount = 0.00
  } = req.body;

  const outstanding_balance = amount_payable - amount_paid - discount_amount;

  try {
    const result = await client.query(
      `INSERT INTO StudentFees (
        student_id, fee_structure_id, academic_year_id,
        amount_payable, amount_paid, due_date,
        status, is_discount_applied, discount_amount,
        outstanding_balance
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`,
      [
        student_id,
        fee_structure_id,
        academic_year_id,
        amount_payable,
        amount_paid,
        due_date,
        status,
        is_discount_applied,
        discount_amount,
        outstanding_balance
      ]
    );

    res.status(201).json({
      message: 'Student fee record created successfully',
      student_fee: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating student fee record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// 🔍 Get Student Fee by ID
const getStudentFeeById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await client.query(
      `SELECT * FROM StudentFees WHERE student_fee_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Student fee record not found' });
    }

    res.status(200).json({
      message: 'Student fee record fetched successfully',
      student_fee: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching student fee record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// 🔁 Get All Student Fee Records (for dropdown)
const getAllStudentFees = async (req, res) => {
  try {
  const result = await client.query(`
  SELECT student_fee_id, student_id, amount_payable, amount_paid, outstanding_balance 
  FROM StudentFees
`);


    res.status(200).json({
      message: "Student fee records fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching student fee records:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createStudentFee,
  getStudentFeeById,
  getAllStudentFees, // 👈 Export new handler
};




