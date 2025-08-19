const client = require('../config/db');

// ➕ Create Hostel
const createHostel = async (req, res) => {
  const { hostel_name, gender_capacity, total_rooms, total_beds } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO Hostels (hostel_name, gender_capacity, total_rooms, total_beds)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [hostel_name, gender_capacity, total_rooms, total_beds]
    );

    res.status(201).json({ message: 'Hostel created successfully', hostel: result.rows[0] });
  } catch (error) {
    console.error('Error creating hostel:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 📄 Get All Hostels
const getAllHostels = async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM Hostels ORDER BY hostel_id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching hostels:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 🔍 Get Hostel by ID
const getHostelById = async (req, res) => {
  const { hostel_id } = req.params;

  try {
    const result = await client.query('SELECT * FROM Hostels WHERE hostel_id = $1', [hostel_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching hostel:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✏️ Update Hostel
const updateHostel = async (req, res) => {
  const { hostel_id } = req.params;
  const { hostel_name, gender_capacity, total_rooms, total_beds } = req.body;

  try {
    const result = await client.query(
      `UPDATE Hostels SET hostel_name = $1, gender_capacity = $2, total_rooms = $3, total_beds = $4
       WHERE hostel_id = $5 RETURNING *`,
      [hostel_name, gender_capacity, total_rooms, total_beds, hostel_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    res.json({ message: 'Hostel updated successfully', hostel: result.rows[0] });
  } catch (error) {
    console.error('Error updating hostel:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ❌ Delete Hostel
const deleteHostel = async (req, res) => {
  const { hostel_id } = req.params;

  try {
    const result = await client.query('DELETE FROM Hostels WHERE hostel_id = $1 RETURNING *', [hostel_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    res.json({ message: 'Hostel deleted successfully' });
  } catch (error) {
    console.error('Error deleting hostel:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createHostel,
  getAllHostels,
  getHostelById,
  updateHostel,
  deleteHostel
};
