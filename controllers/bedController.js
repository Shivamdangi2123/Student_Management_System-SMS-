const client = require('../config/db');

// ➕ Create Bed
const createBed = async (req, res) => {
  const { room_id, bed_number, is_occupied } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO Beds (room_id, bed_number, is_occupied)
       VALUES ($1, $2, $3) RETURNING *`,
      [room_id, bed_number, is_occupied ?? false]
    );

    res.status(201).json({ message: 'Bed created successfully', bed: result.rows[0] });
  } catch (error) {
    console.error('Error creating bed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 📄 Get All Beds
const getAllBeds = async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM Beds ORDER BY bed_id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching beds:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 🔍 Get Bed by ID
const getBedById = async (req, res) => {
  const { bed_id } = req.params;

  try {
    const result = await client.query('SELECT * FROM Beds WHERE bed_id = $1', [bed_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Bed not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching bed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✏️ Update Bed
const updateBed = async (req, res) => {
  const { bed_id } = req.params;
  const { room_id, bed_number, is_occupied } = req.body;

  try {
    const result = await client.query(
      `UPDATE Beds SET room_id = $1, bed_number = $2, is_occupied = $3
       WHERE bed_id = $4 RETURNING *`,
      [room_id, bed_number, is_occupied, bed_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Bed not found' });
    }

    res.json({ message: 'Bed updated successfully', bed: result.rows[0] });
  } catch (error) {
    console.error('Error updating bed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ❌ Delete Bed
const deleteBed = async (req, res) => {
  const { bed_id } = req.params;

  try {
    const result = await client.query('DELETE FROM Beds WHERE bed_id = $1 RETURNING *', [bed_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Bed not found' });
    }

    res.json({ message: 'Bed deleted successfully' });
  } catch (error) {
    console.error('Error deleting bed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createBed,
  getAllBeds,
  getBedById,
  updateBed,
  deleteBed
};
