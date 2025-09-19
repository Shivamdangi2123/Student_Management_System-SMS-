const client = require('../config/db');

// Create Permission
const createPermission = async (req, res) => {
  const { permission_name } = req.body;

  // Validate input
  if (!permission_name) {
    return res.status(400).json({ message: 'Permission name is required' });
  }

  try {
    // Check if permission already exists
    const existing = await client.query(
      'SELECT * FROM Permissions WHERE permission_name = $1',
      [permission_name]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Permission already exists' });
    }

    // Insert permission
    const result = await client.query(
      `INSERT INTO Permissions (permission_name)
       VALUES ($1)
       RETURNING permission_id`,
      [permission_name]
    );

    res.status(201).json({
      message: 'Permission created successfully',
      permission_id: result.rows[0].permission_id
    });

  } catch (error) {
    console.error('Error creating permission:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createPermission,
};
