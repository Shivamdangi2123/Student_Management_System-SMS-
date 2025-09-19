const client = require('../config/db');

// ➕ Create a Week Day
const createWeekDay = async (req, res) => {
  const { day_name, day_order } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO WeekDays (day_name, day_order)
       VALUES ($1, $2)
       RETURNING *`,
      [day_name, day_order]
    );

    res.status(201).json({ message: 'Week day created', weekDay: result.rows[0] });
  } catch (error) {
    console.error('Error creating week day:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 📄 Get All Week Days
const getAllWeekDays = async (req, res) => {
  try {
    const result = await client.query(
      'SELECT * FROM WeekDays ORDER BY day_order'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching week days:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 🔍 Get Week Day by ID
// const getWeekDayById = async (req, res) => {
//   const { day_id } = req.params;

//   try {
//     const result = await client.query(
//       'SELECT * FROM WeekDays WHERE day_id = $1',
//       [day_id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'Week day not found' });
//     }

//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error('Error fetching week day:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// ✏️ Update Week Day
const updateWeekDay = async (req, res) => {
  const { day_id } = req.params;
  const { day_name, day_order } = req.body;

  try {
    const result = await client.query(
      `UPDATE WeekDays SET
         day_name = $1,
         day_order = $2
       WHERE day_id = $3
       RETURNING *`,
      [day_name, day_order, day_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Week day not found' });
    }

    res.json({ message: 'Week day updated', weekDay: result.rows[0] });
  } catch (error) {
    console.error('Error updating week day:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ❌ Delete Week Day
const deleteWeekDay = async (req, res) => {
  const { day_id } = req.params;

  try {
    const result = await client.query(
      'DELETE FROM WeekDays WHERE day_id = $1 RETURNING *',
      [day_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Week day not found' });
    }

    res.json({ message: 'Week day deleted successfully' });
  } catch (error) {
    console.error('Error deleting week day:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createWeekDay,
  getAllWeekDays,
  // getWeekDayById,
  updateWeekDay,
  deleteWeekDay
};
