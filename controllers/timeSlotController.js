const client = require('../config/db');

// ➕ Create Time Slot
const createTimeSlot = async (req, res) => {
  const { slot_name, start_time, end_time, is_break = false, institution_id } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO TimeSlots 
        (slot_name, start_time, end_time, is_break, institution_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [slot_name, start_time, end_time, is_break, institution_id]
    );

    res.status(201).json({ message: 'Time slot created', timeSlot: result.rows[0] });
  } catch (error) {
    console.error('Error creating time slot:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 📄 Get All Time Slots
const getAllTimeSlots = async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM TimeSlots ORDER BY start_time');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching time slots:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 🔍 Get Time Slot by ID
const getTimeSlotById = async (req, res) => {
  const { slot_id } = req.params;

  try {
    const result = await client.query(
      'SELECT * FROM TimeSlots WHERE slot_id = $1',
      [slot_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Time slot not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching time slot:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✏️ Update Time Slot
const updateTimeSlot = async (req, res) => {
  const { slot_id } = req.params;
  const { slot_name, start_time, end_time, is_break, institution_id } = req.body;

  try {
    const result = await client.query(
      `UPDATE TimeSlots SET
        slot_name = $1,
        start_time = $2,
        end_time = $3,
        is_break = $4,
        institution_id = $5
       WHERE slot_id = $6
       RETURNING *`,
      [slot_name, start_time, end_time, is_break, institution_id, slot_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Time slot not found' });
    }

    res.json({ message: 'Time slot updated', timeSlot: result.rows[0] });
  } catch (error) {
    console.error('Error updating time slot:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ❌ Delete Time Slot
const deleteTimeSlot = async (req, res) => {
  const { slot_id } = req.params;

  try {
    const result = await client.query(
      'DELETE FROM TimeSlots WHERE slot_id = $1 RETURNING *',
      [slot_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Time slot not found' });
    }

    res.json({ message: 'Time slot deleted successfully' });
  } catch (error) {
    console.error('Error deleting time slot:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createTimeSlot,
  getAllTimeSlots,
  getTimeSlotById,
  updateTimeSlot,
  deleteTimeSlot
};
    