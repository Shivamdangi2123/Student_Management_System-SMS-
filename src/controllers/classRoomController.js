const client = require('../config/db');

// ➕ Create a Classroom
const createClassRoom = async (req, res) => {
  const { room_name, room_capacity, room_type, is_available = true } = req.body;
 const institution_id = req.user?.institution_id;
   if (!institution_id) {
    return res.status(400).json({ message: 'Institution ID not found in token.' });
  }
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
const getAllClassRooms = async (req, res) => {
  const institution_id = req.user?.institution_id;
  if (!institution_id) {
    return res.status(400).json({ message: 'Institution ID missing in token' });
  }

  try {
   const result = await client.query(
  `SELECT * FROM ClassRooms WHERE institution_id = $1`,
  [institution_id]
);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching classrooms:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createClassRoom,
  getAllClassRooms,
};


