const client = require("../config/db");

// ✅ Create Academic Year
const createAcademicYear = async (req, res) => {
  const { year_name, start_date, end_date, is_current = false } = req.body;
  const institution_id = req.user?.institution_id;

  if (!institution_id) {
    return res.status(400).json({ message: "Institution ID not found in token." });
  }

  try {
    const check = await client.query(
      "SELECT * FROM AcademicYears WHERE year_name = $1 AND institution_id = $2",
      [year_name, institution_id]
    );

    if (check.rows.length > 0) {
      return res.status(400).json({ message: "Academic Year already exists" });
    }

    if (is_current) {
      await client.query(
        "UPDATE AcademicYears SET is_current = FALSE WHERE institution_id = $1",
        [institution_id]
      );
    }

    const result = await client.query(
      `INSERT INTO AcademicYears (year_name, start_date, end_date, is_current, institution_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [year_name, start_date, end_date, is_current, institution_id]
    );

    res.status(201).json({
      message: "Academic Year created successfully",
      academicYear: result.rows[0]
    });
  } catch (err) {
    console.error("Error creating Academic Year:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Update Academic Year
const updateAcademicYear = async (req, res) => {
  const { academic_year_id, year_name, start_date, end_date, is_current = false } = req.body;
  const institution_id = req.user?.institution_id;

  if (!institution_id) {
    return res.status(400).json({ message: "Institution ID not found in token." });
  }

  try {
    const existing = await client.query(
      "SELECT * FROM AcademicYears WHERE academic_year_id = $1 AND institution_id = $2",
      [academic_year_id, institution_id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Academic Year not found or unauthorized" });
    }

    if (is_current) {
      await client.query(
        "UPDATE AcademicYears SET is_current = FALSE WHERE institution_id = $1",
        [institution_id]
      );
    }

    const result = await client.query(
      `UPDATE AcademicYears
       SET year_name = $1, start_date = $2, end_date = $3, is_current = $4
       WHERE academic_year_id = $5 AND institution_id = $6
       RETURNING *`,
      [year_name, start_date, end_date, is_current, academic_year_id, institution_id]
    );

    res.status(200).json({
      message: "Academic Year updated successfully",
      academicYear: result.rows[0]
    });
  } catch (err) {
    console.error("Error updating Academic Year:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get all Academic Years
const getAcademicYears = async (req, res) => {
  const institution_id = req.user?.institution_id;

  if (!institution_id) {
    return res.status(400).json({ message: "Institution ID not found in token." });
  }

  try {
    const result = await client.query(
      "SELECT * FROM AcademicYears WHERE institution_id = $1 ORDER BY start_date DESC",
      [institution_id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching Academic Years:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get single Academic Year
const getAcademicYearById = async (req, res) => {
  const { id } = req.params;
  const institution_id = req.user?.institution_id;

  if (!institution_id) {
    return res.status(400).json({ message: "Institution ID not found in token." });
  }

  try {
    const result = await client.query(
      "SELECT * FROM AcademicYears WHERE academic_year_id = $1 AND institution_id = $2",
      [id, institution_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Academic Year not found or unauthorized" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching Academic Year:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Delete Academic Year
const deleteAcademicYear = async (req, res) => {
  const { id } = req.params;
  const institution_id = req.user?.institution_id;

  if (!institution_id) {
    return res.status(400).json({ message: "Institution ID not found in token." });
  }

  try {
    const existing = await client.query(
      "SELECT * FROM AcademicYears WHERE academic_year_id = $1 AND institution_id = $2",
      [id, institution_id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Academic Year not found or unauthorized" });
    }

    await client.query(
      "DELETE FROM AcademicYears WHERE academic_year_id = $1 AND institution_id = $2",
      [id, institution_id]
    );

    res.status(200).json({ message: "Academic Year deleted successfully" });
  } catch (err) {
    console.error("Error deleting Academic Year:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createAcademicYear,
  updateAcademicYear,
  getAcademicYears,
  getAcademicYearById,
  deleteAcademicYear
};
