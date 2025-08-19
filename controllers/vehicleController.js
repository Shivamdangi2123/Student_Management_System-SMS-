const client = require('../config/db');

// ➕ Create Vehicle
const createVehicle = async (req, res) => {
  const { vehicle_number, vehicle_type, capacity, insurance_expiry, fitness_expiry, is_active = true } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO Vehicles (vehicle_number, vehicle_type, capacity, insurance_expiry, fitness_expiry, is_active)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [vehicle_number, vehicle_type, capacity, insurance_expiry, fitness_expiry, is_active]
    );

    res.status(201).json({ message: 'Vehicle created successfully', vehicle: result.rows[0] });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createVehicle,

};
