const client = require("../config/db");

// ➕ Assign Teacher to a Class-Subject
// ➕ Assign Teacher to a Class-Subject
const assignTeacherToSubject = async (req, res) => {
  const {
    staff_id,
    subject_id,
    class_id,
    academic_year_id,
    can_teach,
    teaching_preference,
    max_periods_per_day,
    max_periods_per_week,
    is_class_teacher
  } = req.body;

  try {
    // 🛑 Check staff role
    const staffCheck = await client.query(
      `SELECT role FROM staff WHERE staff_id = $1`,
      [staff_id]
    );

    if (staffCheck.rows.length === 0) {
      return res.status(404).json({ message: "Staff not found" });
    }

    if (staffCheck.rows[0].role.toLowerCase() !== "teacher") {
      return res.status(400).json({ message: "Only teachers can be assigned subjects" });
    }

    // ✅ Check duplicate assignment
    const existing = await client.query(
      `SELECT 1 FROM staffsubjectassignments 
       WHERE staff_id = $1 AND subject_id = $2 AND class_id = $3 AND academic_year_id = $4`,
      [staff_id, subject_id, class_id, academic_year_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Teacher already assigned." });
    }

    // ✅ Insert assignment
    const result = await client.query(
      `INSERT INTO staffsubjectassignments 
       (staff_id, subject_id, class_id, academic_year_id, can_teach, teaching_preference, max_periods_per_day, max_periods_per_week, is_class_teacher)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [staff_id, subject_id, class_id, academic_year_id, can_teach, teaching_preference, max_periods_per_day, max_periods_per_week, is_class_teacher]
    );

    res.status(201).json({
      message: "Teacher assigned successfully",
      assignment: result.rows[0],
    });
  } catch (err) {
    console.error("Error assigning teacher:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// 📌 Get All Teachers for a Class-Subject
const getTeachersByClassSubject = async (req, res) => {
  const { class_subject_id } = req.params;

  try {
    const result = await client.query(
      `SELECT 
          ssa.assignment_id,
          ssa.workload_hours,
          ssa.preference,
          st.staff_id,
          st.username AS teacher_name,
          sub.subject_name,
          cs.class_id
       FROM StaffSubjectAssignments ssa
       JOIN Staff st ON ssa.staff_id = st.staff_id
       JOIN ClassSubjects cs ON ssa.class_subject_id = cs.class_subject_id
       JOIN Subjects sub ON cs.subject_id = sub.subject_id
       WHERE ssa.class_subject_id = $1`,
      [class_subject_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching teachers:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  assignTeacherToSubject,
  getTeachersByClassSubject,
};
    