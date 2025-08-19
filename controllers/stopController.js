const client = require('../config/db');

// ➕ Create Stop
const createStop = async (req, res) => {
  const { stop_name, route_id, pickup_time, drop_time, sequence_order } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO Stops (stop_name, route_id, pickup_time, drop_time, sequence_order)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [stop_name, route_id, pickup_time, drop_time, sequence_order]
    );

    res.status(201).json({ message: 'Stop created successfully', stop: result.rows[0] });
  } catch (error) {
    console.error('Error creating stop:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  createStop,
 
};
