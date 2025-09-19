    const client = require('../config/db');
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    const { v4: uuidv4 } = require('uuid'); // top of file me import karo

    // const employeeId = uuidv4(); // yaha generate ho raha employeeId


    // REGISTER
// REGISTER
const register = async (req, res) => {
  const { username, email, password, mobile_number, user_type, roles = [] } = req.body;

  try {
    // check if already exists
    const existingUser = await client.query(
      "SELECT * FROM users WHERE email = $1 OR mobile_number = $2",
      [email, mobile_number]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User with this email or mobile number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ institution_id uthao token se ya null
    const institution_id = req.user?.institution_id || null;

    // ✅ active academic year uthao
    const yearRes = await client.query(
      `SELECT academic_year_id FROM academicyears WHERE is_current = true LIMIT 1`
    );
    const academic_year_id = yearRes.rows[0]?.academic_year_id || null;

    if (!academic_year_id) {
      return res.status(400).json({ message: "No active academic year found. Please create one." });
    }

    // ✅ ab insert karo
 const result = await client.query(
  `INSERT INTO users 
   (username, email, password_hash, mobile_number, user_type, institution_id, academic_year_id, created_at, updated_at)
   VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW())
   RETURNING user_id`,
  [username, email, hashedPassword, mobile_number, user_type || "Staff", institution_id, academic_year_id]
);


    const userId = result.rows[0].user_id;

    // ✅ Assign roles
    for (const roleName of roles) {
      let roleResult = await client.query("SELECT role_id FROM Roles WHERE role_name = $1", [roleName]);
      let roleId;

      if (roleResult.rows.length === 0) {
        const insertRole = await client.query(
          "INSERT INTO Roles (role_name) VALUES ($1) RETURNING role_id",
          [roleName]
        );
        roleId = insertRole.rows[0].role_id;
      } else {
        roleId = roleResult.rows[0].role_id;
      }

      await client.query("INSERT INTO UserRoles (user_id, role_id) VALUES ($1, $2)", [userId, roleId]);
    }

    // ✅ Fetch roles list
    const roleResult = await client.query(
      `SELECT r.role_name FROM UserRoles ur
       JOIN Roles r ON ur.role_id = r.role_id
       WHERE ur.user_id = $1`,
      [userId]
    );
    const userRoles = roleResult.rows.map((r) => r.role_name);

    // ✅ Fetch permissions
    const permResult = await client.query(
      `SELECT p.permission_name FROM UserRoles ur
       JOIN RolePermissions rp ON ur.role_id = rp.role_id
       JOIN Permissions p ON rp.permission_id = p.permission_id
       WHERE ur.user_id = $1`,
      [userId]
    );
    const userPermissions = permResult.rows.map((p) => p.permission_name);

    // ✅ payload me academic_year_id dalna zaroori hai
    // const payload = {
    //   user_id: userId,
    //   institution_id,
    //   academic_year_id,
    //   roles: userRoles,
    //   permissions: userPermissions,
    // };

    // const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      message: "User registered and logged in successfully",
      // token,
      user_id: userId,
      roles: userRoles,
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};



    // LOGIN
    const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await client.query(  `SELECT user_id, email, password_hash, institution_id, academic_year_id
   FROM users WHERE email = $1`, [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Roles
    const roleResult = await client.query(
      `SELECT r.role_name FROM UserRoles ur
       JOIN Roles r ON ur.role_id = r.role_id
       WHERE ur.user_id = $1`,
      [user.user_id]
    );
    const userRoles = roleResult.rows.map((r) => r.role_name);

    // Permissions
    const permResult = await client.query(
      `SELECT p.permission_name FROM UserRoles ur
       JOIN RolePermissions rp ON ur.role_id = rp.role_id
       JOIN Permissions p ON rp.permission_id = p.permission_id
       WHERE ur.user_id = $1`,
      [user.user_id]
    );
    const userPermissions = permResult.rows.map((p) => p.permission_name);

    const payload = {
  user_id: user.user_id,
  institution_id: user.institution_id,
  academic_year_id: user.academic_year_id,   // ✅ ye bhi bhejna hai
  roles: userRoles,
  permissions: userPermissions,
};


    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

    module.exports = {
      register,
      login
    };
