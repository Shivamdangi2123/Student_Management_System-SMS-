const client = require('../config/db'); // Your DB connection module

exports.assignUserRole = async (req, res) => {
  const { user_id, role_id } = req.body;

  if (!user_id || !role_id) {
    return res.status(400).json({ message: 'user_id and role_id are required' });
  }

  try {
    const exists = await client.query(
      'SELECT * FROM userroles WHERE user_id = $1 AND role_id = $2',
      [user_id, role_id]
    );

    if (exists.rows.length > 0) {
      return res.status(409).json({ message: 'User already has this role assigned' });
    }

    const result = await client.query(
      'INSERT INTO userroles (user_id, role_id) VALUES ($1, $2) RETURNING *',
      [user_id, role_id]
    );

    res.status(201).json({ message: 'Role assigned successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error assigning role to user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
