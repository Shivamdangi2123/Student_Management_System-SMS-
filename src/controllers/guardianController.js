const client = require('../config/db');

const addGuardian = async (req, res) => {
  const {
    first_name,
    middle_name,
    last_name,
    relation_to_student,
    occupation,
    income,
    mobile_number,
    email,
    aadhaar_number,
    education_qualification,
    user_id
  } = req.body;

  try {
    // Optional: Check if Aadhaar/email already exists
    if (email) {
      const emailCheck = await client.query('SELECT * FROM Guardians WHERE email = $1', [email]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ message: 'Guardian with this email already exists' });
      }
    }

    if (aadhaar_number) {
      const aadhaarCheck = await client.query('SELECT * FROM Guardians WHERE aadhaar_number = $1', [aadhaar_number]);
      if (aadhaarCheck.rows.length > 0) {
        return res.status(400).json({ message: 'Guardian with this Aadhaar already exists' });
      }
    }

    const result = await client.query(`
      INSERT INTO Guardians (
        first_name, middle_name, last_name, relation_to_student,
        occupation, income, mobile_number, email, aadhaar_number,
        education_qualification, user_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING guardian_id
    `, [
      first_name,
      middle_name || null,
      last_name,
      relation_to_student,
      occupation || null,
      income || null,
      mobile_number,
      email || null,
      aadhaar_number || null,
      education_qualification || null,
      user_id || null
    ]);

    res.status(201).json({ message: 'Guardian added successfully', guardian_id: result.rows[0].guardian_id });
  } catch (err) {
    console.error('Error adding guardian:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { addGuardian };
