const client = require('../config/db');

// ➕ Add a New Fee Payment
const createFeePayment = async (req, res) => {
  const {
    student_fee_id,
    amount_paid,
    payment_method,
    transaction_id,
    cheque_dd_number,
    bank_name,
    received_by_user_id,   // ✅ updated field
    remarks
  } = req.body;

  try {
    // Insert Payment Record
    const paymentResult = await client.query(
      `INSERT INTO FeePayments (
        student_fee_id, amount_paid, payment_method,
        transaction_id, cheque_dd_number, bank_name,
        received_by_user_id, remarks
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`,
      [
        student_fee_id,
        amount_paid,
        payment_method,
        transaction_id,
        cheque_dd_number,
        bank_name,
        received_by_user_id,   // ✅ updated field
        remarks
      ]
    );

    // Fetch existing fee data
    const feeResult = await client.query(
      `SELECT amount_payable, amount_paid, discount_amount
       FROM StudentFees WHERE student_fee_id = $1`,
      [student_fee_id]
    );

    if (feeResult.rowCount === 0) {
      return res.status(404).json({ message: 'Student fee record not found' });
    }

    const fee = feeResult.rows[0];
    const newAmountPaid = parseFloat(fee.amount_paid) + parseFloat(amount_paid);
    const newOutstanding = fee.amount_payable - newAmountPaid - parseFloat(fee.discount_amount);

    // Determine new status
    let newStatus = 'Due';
    if (newAmountPaid === 0) {
      newStatus = 'Due';
    } else if (newOutstanding > 0) {
      newStatus = 'Partial Paid';
    } else if (newOutstanding <= 0) {
      newStatus = 'Paid';
    }

    // Update StudentFee record
    await client.query(
      `UPDATE StudentFees SET
        amount_paid = $1,
        outstanding_balance = $2,
        status = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE student_fee_id = $4`,
      [newAmountPaid, newOutstanding, newStatus, student_fee_id]
    );

    res.status(201).json({
      message: 'Fee payment recorded successfully',
      payment: paymentResult.rows[0]
    });
  } catch (error) {
    console.error('Error creating fee payment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createFeePayment,
  
};
