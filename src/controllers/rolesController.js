const client = require('../config/db');

const createRole = async (req, res) => {
  const { role_name } = req.body;

  if (!role_name) {
    return res.status(400).json({ message: 'role_name is required' });
  }

  try {
    const result = await client.query(
      'INSERT INTO roles (role_name) VALUES ($1) RETURNING *',
      [role_name]
    );
    res.status(201).json({ message: 'Role created successfully', role: result.rows[0] });
  } catch (err) {
   
    console.error('Error inserting role:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports ={
    createRole
}