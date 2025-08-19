const client = require('../config/db');

const createStudent = async (req, res) => {
  const {
    admission_no,
    roll_no,
    first_name,
    middle_name,
    last_name,
    date_of_birth,
    gender,
    blood_group,
    aadhaar_number,
    place_of_birth,
    nationality = 'Indian',
    religion,
    category,
    mother_tongue,
    current_address_line1,
    current_address_line2,
    current_city,
    current_state,
    current_pincode,
    permanent_address_line1,
    permanent_address_line2,
    permanent_city,
    permanent_state,
    permanent_pincode,
    profile_picture_url,
    admission_date,
    user_id
  } = req.body;

  try {
    // Unique check
    const existing = await client.query(`SELECT * FROM Students WHERE admission_no = $1`, [admission_no]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Admission number already exists' });
    }

    const result = await client.query(`
      INSERT INTO Students (
        admission_no, roll_no, first_name, middle_name, last_name, date_of_birth, gender,
        blood_group, aadhaar_number, place_of_birth, nationality, religion, category,
        mother_tongue, current_address_line1, current_address_line2, current_city, current_state, current_pincode,
        permanent_address_line1, permanent_address_line2, permanent_city, permanent_state, permanent_pincode,
        profile_picture_url, admission_date, is_active, user_id, created_at, updated_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13,
        $14, $15, $16, $17, $18, $19,
        $20, $21, $22, $23, $24,
        $25, $26, TRUE, $27, NOW(), NOW()
      )
      RETURNING student_id
    `, [
      admission_no, roll_no, first_name, middle_name, last_name, date_of_birth, gender,
      blood_group, aadhaar_number, place_of_birth, nationality, religion, category,
      mother_tongue, current_address_line1, current_address_line2, current_city, current_state, current_pincode,
      permanent_address_line1, permanent_address_line2, permanent_city, permanent_state, permanent_pincode,
      profile_picture_url, admission_date, user_id
    ]);

    res.status(201).json({ message: 'Student created successfully', student_id: result.rows[0].student_id });
  } catch (err) {
    console.error('Error creating student:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createStudent };
