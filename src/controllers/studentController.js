const client = require('../config/db');
const bcrypt = require('bcrypt');

const createStudent = async (req, res) => {
  const {
    roll_no,
    date_of_birth,
    gender,
    blood_group,
    aadhaar_number,
    place_of_birth,
    nationality = "Indian",
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
    email,
    mobile_number,
    username // optional: agar aap chaho backend generate kare
  } = req.body;

  try {
    await client.query("BEGIN");

    // 1️⃣ Admission No generate
    const seqRes = await client.query(`SELECT nextval('admission_no_seq') as seq`);
    const seq = seqRes.rows[0].seq;
    const year = new Date(admission_date || Date.now()).getFullYear();
    const admission_no = `${year}-${String(seq).padStart(4, "0")}`;

    // 2️⃣ Username = admission_no (agar form me na mile to backend generate karega)
    const finalUsername = username || admission_no;

    // 3️⃣ Password = DOB
    const plainPassword = date_of_birth;
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // 4️⃣ Academic year
    const yearRes = await client.query(
      `SELECT academic_year_id FROM academicyears WHERE is_current = true LIMIT 1`
    );
    const academic_year_id = yearRes.rows[0]?.academic_year_id;
    if (!academic_year_id) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "No active academic year found." });
    }

    // 5️⃣ User create
    const userInsert = await client.query(
      `INSERT INTO users (
        username, email, password_hash, mobile_number,
        user_type, academic_year_id, created_at, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())
      RETURNING user_id`,
      [finalUsername, email, hashedPassword, mobile_number, "Student", academic_year_id]
    );
    const user_id = userInsert.rows[0].user_id;

    // 6️⃣ Student insert
   const studentInsert = await client.query(
  `INSERT INTO Students (
    admission_no, roll_no, date_of_birth, gender,
    blood_group, aadhaar_number, place_of_birth, nationality, religion, category,
    mother_tongue, current_address_line1, current_address_line2, current_city, current_state, current_pincode,
    permanent_address_line1, permanent_address_line2, permanent_city, permanent_state, permanent_pincode,
    profile_picture_url, admission_date, is_active, user_id, created_at, updated_at,
    email, mobile_number, username
  ) VALUES (
    $1,$2,$3,$4,
    $5,$6,$7,$8,$9,$10,
    $11,$12,$13,$14,$15,$16,
    $17,$18,$19,$20,$21,
    $22,$23, TRUE, $24, NOW(), NOW(),
    $25,$26,$27
  ) RETURNING student_id`,
  [
    admission_no, roll_no, date_of_birth, gender,
    blood_group, aadhaar_number, place_of_birth, nationality, religion, category || null,
    mother_tongue, current_address_line1, current_address_line2, current_city, current_state, current_pincode,
    permanent_address_line1, permanent_address_line2, permanent_city, permanent_state, permanent_pincode,
    profile_picture_url, admission_date, user_id,
    email, mobile_number, finalUsername
  ]
);

    await client.query("COMMIT");

    res.status(201).json({
      message: "Student and user created successfully",
      student_id: studentInsert.rows[0].student_id,
      username: finalUsername,
      default_password: plainPassword
    });
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getAllStudents = async (req, res) => {
  try {
    const result = await client.query(`
      SELECT 
        student_id,
        admission_no,
        email,
        username,
        mobile_number
      FROM students
      ORDER BY created_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};



module.exports = {
  createStudent,
  getAllStudents
};
