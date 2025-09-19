const client = require("../config/db");

// ✅ Create (Mark Attendance)
const markAttendance = async (req, res) => {
  const {
    student_id,
    academic_year_id,
    class_id,
    section_id,
    attendance_date,
    status,
    recorded_by_user_id,
    remarks
  } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO Attendance (
        student_id, academic_year_id, class_id, section_id,
        attendance_date, status, recorded_by_user_id, remarks, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING attendance_id`,
      [
        student_id,
        academic_year_id,
        class_id,
        section_id,
        attendance_date,
        status,
        recorded_by_user_id,
        remarks
      ]
    );

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance_id: result.rows[0].attendance_id
    });
  } catch (err) {
    console.error("Error marking attendance:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get All Attendance
const getAllAttendance = async (req, res) => {
  try {
    const result = await client.query(
      "SELECT * FROM Attendance ORDER BY attendance_date DESC"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching attendance:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get Attendance by ID
const getAttendanceById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await client.query(
      "SELECT * FROM Attendance WHERE attendance_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching attendance:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Update Attendance
const updateAttendance = async (req, res) => {
  const {
    attendance_id,
    status,
    remarks
  } = req.body;

  try {
    const existing = await client.query(
      "SELECT * FROM Attendance WHERE attendance_id = $1",
      [attendance_id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    const result = await client.query(
      `UPDATE Attendance
       SET status = $1, remarks = $2, updated_at = NOW()
       WHERE attendance_id = $3
       RETURNING *`,
      [status, remarks, attendance_id]
    );

    res.status(200).json({
      message: "Attendance updated successfully",
      attendance: result.rows[0]
    });
  } catch (err) {
    console.error("Error updating attendance:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Delete Attendance
const deleteAttendance = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await client.query(
      "SELECT * FROM Attendance WHERE attendance_id = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    await client.query("DELETE FROM Attendance WHERE attendance_id = $1", [id]);

    res.status(200).json({ message: "Attendance deleted successfully" });
  } catch (err) {
    console.error("Error deleting attendance:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  markAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance
};
