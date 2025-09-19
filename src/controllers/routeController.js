const client = require('../config/db');

// ➕ Create a new route
const createRoute = async (req, res) => {
  const { route_name, fare_amount, driver_id, vehicle_id } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO Routes (route_name, fare_amount, driver_id, vehicle_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [route_name, fare_amount, driver_id, vehicle_id]
    );

    res.status(201).json({ message: 'Route created successfully', route: result.rows[0] });
  } catch (error) {
    console.error('Error creating route:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports = {
  createRoute
 
};
