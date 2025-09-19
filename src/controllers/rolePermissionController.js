const client = require('../config/db');

// Assign Permission to Role
const assignPermissionToRole = async (req, res) => {
  const { role_id, permission_id } = req.body;

  if (!role_id || !permission_id) {
    return res.status(400).json({ message: 'role_id and permission_id are required' });
  }

  try {
    // Check if the mapping already exists
    const exists = await client.query(
      'SELECT * FROM RolePermissions WHERE role_id = $1 AND permission_id = $2',
      [role_id, permission_id]
    );

    if (exists.rows.length > 0) {
      return res.status(409).json({ message: 'Permission already assigned to this role' });
    }

    // Insert new mapping
    const result = await client.query(
      `INSERT INTO RolePermissions (role_id, permission_id)
       VALUES ($1, $2)
       RETURNING role_permission_id`,
      [role_id, permission_id]
    );

    res.status(201).json({
      message: 'Permission assigned to role successfully',
      role_permission_id: result.rows[0].role_permission_id
    });

  } catch (error) {
    console.error('Error assigning permission to role:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  assignPermissionToRole,
};
