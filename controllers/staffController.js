const client = require('../config/db');

const createStaff = async (req, res) => {
  const {
    employee_id,
    first_name,
    middle_name,
    last_name,
    date_of_birth,
    gender,
    aadhaar_number,
    pan_number,
    epf_number,
    esi_number,
    mobile_number,
    email,
    address_line1,
    address_line2,
    city,
    state,
    pincode,
    joining_date,
    designation,
    department_id,
    qualification,
    experience_years,
    bank_account_number,
    ifsc_code,
    profile_picture_url,
    user_id
  } = req.body;

  try {

  const adminInstitutionId = req.user.institution_id;

  const userInstitutionQuery = await client.query(
    'SELECT institution_id FROM users WHERE user_id = $1',
    [user_id]
  );

  if (userInstitutionQuery.rows.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  const userInstitutionId = userInstitutionQuery.rows[0].institution_id;

  if (adminInstitutionId !== userInstitutionId) {
    return res.status(403).json({ message: 'Access denied: Institution mismatch' });
  }
    // Check if employee_id or email already exists
    const check = await client.query(
      `SELECT * FROM Staff WHERE employee_id = $1 OR email = $2`,
      [employee_id, email]
    );

    if (check.rows.length > 0) {
      return res.status(400).json({ message: 'Staff with same employee ID or email already exists' });
    }

    const result = await client.query(
      `INSERT INTO Staff (
        employee_id, first_name, middle_name, last_name, date_of_birth, gender,
        aadhaar_number, pan_number, epf_number, esi_number,
        mobile_number, email, address_line1, address_line2, city, state, pincode,
        joining_date, designation, department_id, qualification, experience_years,
        bank_account_number, ifsc_code, profile_picture_url,
        is_active, user_id, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17,
        $18, $19, $20, $21, $22,
        $23, $24, $25,
        true, $26, NOW(), NOW()
      ) RETURNING staff_id`,
      [
        employee_id, first_name, middle_name, last_name, date_of_birth, gender,
        aadhaar_number, pan_number, epf_number, esi_number,
        mobile_number, email, address_line1, address_line2, city, state, pincode,
        joining_date, designation, department_id, qualification, experience_years,
        bank_account_number, ifsc_code, profile_picture_url,
        user_id
      ]
    );

    res.status(201).json({
      message: 'Staff created successfully',
      staff_id: result.rows[0].staff_id
    });
  } catch (err) {
    console.error('Error creating staff:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createStaff
};
