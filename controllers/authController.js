    const client = require('../config/db');
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    const { v4: uuidv4 } = require('uuid'); // top of file me import karo

    const employeeId = uuidv4(); // yaha generate ho raha employeeId


    // REGISTER
    const register = async (req, res) => {
      const { username, email, password, mobile_number, user_type, roles = [] } = req.body;

      try {
        const check = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (check.rows.length > 0) {
          return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

            // 🔑 Token se institution_id uthao
      // const institution_id = req.user.institution_id;
const result = await client.query(
  `INSERT INTO users (username, email, password_hash, mobile_number, user_type, is_active, created_at, updated_at)
   VALUES ($1, $2, $3, $4, $5, $6,NOW(), NOW())
   RETURNING user_id`,
  [username, email, hashedPassword, mobile_number, user_type || 'Staff', true]
);


        const userId = result.rows[0].user_id;

        // ✅ Assign roles
        for (const roleName of roles) {
          let roleResult = await client.query('SELECT role_id FROM Roles WHERE role_name = $1', [roleName]);

          let roleId;

          if (roleResult.rows.length === 0) {
            const insertRole = await client.query(
              'INSERT INTO Roles (role_name) VALUES ($1) RETURNING role_id',
              [roleName]
            );
            roleId = insertRole.rows[0].role_id;
          } else {
            roleId = roleResult.rows[0].role_id;
          }

          await client.query('INSERT INTO UserRoles (user_id, role_id) VALUES ($1, $2)', [userId, roleId]);
        }

        
  //  👇 Insert into staff or student table based on user_type
    if ((user_type || 'staff').toLowerCase() === 'staff') {
      await client.query(`
        INSERT INTO staff ( user_id, username , mobile_number, email, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
      `, [ userId, username, mobile_number, email]);
      console.log("Staff table me data gaya ✅");
    } else if (user_type.toLowerCase() === 'student') {
      await client.query(`
        INSERT INTO students (user_id, username, mobile_number, email, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
      `, [userId, username, mobile_number, email]);   
      console.log("Student table me data gaya ✅");
    }


        res.status(201).json({ message: 'User registered successfully', user_id: userId });
      } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Something went wrong' });
      }
    };

    // LOGIN
    const login = async (req, res) => {
      const { email, password } = req.body;

      try {
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
          return res.status(400).json({ message: 'User not found' });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid password' });
        }

        // Roles
        const roleResult = await client.query(
          `SELECT r.role_name FROM UserRoles ur
          JOIN Roles r ON ur.role_id = r.role_id
          WHERE ur.user_id = $1`,
          [user.user_id]
        );
        const userRoles = roleResult.rows.map(r => r.role_name);

        // Permissions
        const permResult = await client.query(
          `SELECT p.permission_name FROM UserRoles ur
          JOIN RolePermissions rp ON ur.role_id = rp.role_id
          JOIN Permissions p ON rp.permission_id = p.permission_id
          WHERE ur.user_id = $1`,
          [user.user_id]
        );
        const userPermissions = permResult.rows.map(p => p.permission_name);

        // Token
        const payload = {
          user_id: user.user_id,
          // institution_id: user.institution_id,
          roles: userRoles,
          permissions: userPermissions
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
      } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Login failed' });
      }
    };

    module.exports = {
      register,
      login
    };
