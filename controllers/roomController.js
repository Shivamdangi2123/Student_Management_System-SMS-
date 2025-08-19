const client = require('../config/db');

// ➕ Create Room
const createRoom = async (req, res) => {
  const { hostel_id, room_number, room_type, capacity, occupancy_status } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO Rooms (hostel_id, room_number, room_type, capacity, occupancy_status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [hostel_id, room_number, room_type, capacity, occupancy_status || 'Available']
    );

    res.status(201).json({ message: 'Room created successfully', room: result.rows[0] });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 📄 Get All Rooms
const getAllRooms = async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM Rooms ORDER BY room_id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 🔍 Get Room by ID
const getRoomById = async (req, res) => {
  const { room_id } = req.params;

  try {
    const result = await client.query('SELECT * FROM Rooms WHERE room_id = $1', [room_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✏️ Update Room
const updateRoom = async (req, res) => {
  const { room_id } = req.params;
  const { hostel_id, room_number, room_type, capacity, occupancy_status } = req.body;

  try {
    const result = await client.query(
      `UPDATE Rooms SET hostel_id = $1, room_number = $2, room_type = $3, 
       capacity = $4, occupancy_status = $5
       WHERE room_id = $6 RETURNING *`,
      [hostel_id, room_number, room_type, capacity, occupancy_status, room_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ message: 'Room updated successfully', room: result.rows[0] });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ❌ Delete Room
const deleteRoom = async (req, res) => {
  const { room_id } = req.params;

  try {
    const result = await client.query('DELETE FROM Rooms WHERE room_id = $1 RETURNING *', [room_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom
};
