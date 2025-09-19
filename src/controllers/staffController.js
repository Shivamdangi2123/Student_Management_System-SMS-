const client = require("../config/db");
const bcrypt = require("bcrypt");

const createStaff = async (req, res) => {
  const {
    username,
    password,
    email,
    mobile_number,
    date_of_birth,
    gender,
    aadhaar_number,
    pan_number,
    epf_number,
    esi_number,
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
    roles = [] // admin staff ko roles assign kar sake
  } = req.body;

  const InstitutionId = req.user?.institution_id;

  if (!InstitutionId) {
    return res
      .status(400)
      .json({ message: "Institution ID not found in token" });
  }

  try {
    // 1. Check if email already exists
    const userCheck = await client.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    if (userCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert into users
    const userResult = await client.query(
      `INSERT INTO users (
        username, email, password_hash, mobile_number, user_type, institution_id, is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, 'Staff', $5, true, NOW(), NOW())
      RETURNING user_id`,
      [username, email, hashedPassword, mobile_number, InstitutionId]
    );

    const user_id = userResult.rows[0].user_id;

    let finalRoleId = null;

    // 4. Roles assign karo
    for (const roleName of roles) {
      let roleResult = await client.query(
        `SELECT role_id FROM roles 
         WHERE role_name = $1 AND department_id = $2 AND institution_id = $3`,
        [roleName, department_id, InstitutionId]
      );

      let roleId;
      if (roleResult.rows.length === 0) {
        const insertRole = await client.query(
          `INSERT INTO roles (role_name, department_id, institution_id) 
           VALUES ($1, $2, $3) RETURNING role_id`,
          [roleName, department_id, InstitutionId]
        );
        roleId = insertRole.rows[0].role_id;
      } else {
        roleId = roleResult.rows[0].role_id;
      }

      finalRoleId = roleId; // staff table me ek role_id save karne ke liye

      // Agar userroles table bhi use karna hai
      await client.query(
        `INSERT INTO userroles (user_id, role_id) 
         VALUES ($1, $2) 
         ON CONFLICT DO NOTHING`,
        [user_id, roleId]
      );
    }

    // 5. Insert into staff table
    await client.query(
      `INSERT INTO staff (
        user_id, username, email, mobile_number,
        date_of_birth, gender, aadhaar_number, pan_number, epf_number, esi_number,
        address_line1, address_line2, city, state, pincode,
        joining_date, designation, department_id, qualification, experience_years,
        bank_account_number, ifsc_code, profile_picture_url,
        institution_id, role_id, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20,
        $21, $22, $23,
        $24, $25, NOW(), NOW()
      )`,
      [
        user_id,
        username,
        email,
        mobile_number,
        date_of_birth,
        gender,
        aadhaar_number,
        pan_number,
        epf_number,
        esi_number,
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
        InstitutionId,
        finalRoleId,
      ]
    );

    res.status(201).json({ message: "✅ Staff registered successfully", user_id });
  } catch (err) {
    console.error("Error in createStaff:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getStaffList = async (req, res) => {
  const institution_id = req.user?.institution_id;
  if (!institution_id) {
    return res.status(400).json({ message: "Institution ID missing in token" });
  }

  try {
    const result = await client.query(
      `SELECT s.staff_id, s.username 
       FROM staff s
       JOIN users u ON s.user_id = u.user_id
       WHERE s.institution_id = $1`,
      [institution_id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching staff list:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get only Teachers
const getTeachers = async (req, res) => {
  try {
    const result = await client.query(
      `SELECT s.staff_id, s.username, r.role_name 
       FROM staff s
       JOIN roles r ON s.role_id = r.role_id
       WHERE LOWER(r.role_name) = 'teacher'`
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching teachers:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  createStaff,
  getStaffList,
  getTeachers
};

