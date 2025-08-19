const client = require('../config/db');

// ➕ Create a Classroom
const createClassRoom = async (req, res) => {
  const { room_name, room_capacity, room_type, is_available = true, institution_id } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO ClassRooms 
        (room_name, room_capacity, room_type, is_available, institution_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [room_name, room_capacity, room_type, is_available, institution_id]
    );

    res.status(201).json({ message: 'Classroom created', classRoom: result.rows[0] });
  } catch (error) {
    console.error('Error creating classroom:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  createClassRoom

};
