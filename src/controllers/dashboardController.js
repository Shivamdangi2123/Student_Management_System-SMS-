// // C:\sms\controllers\dashboardController.js
// const client = require("../config/db"); // PostgreSQL connection

// // Dashboard Summary + Trends API
// exports.getDashboardData = async (req, res) => {
//   try {
//     // 1. Summary Cards
//     const totalStudents = await client.query("SELECT COUNT(*) FROM students WHERE is_active = true");
//     const totalStaff = await client.query("SELECT COUNT(*) FROM staff WHERE is_active = true");
//     const totalClasses = await client.query("SELECT COUNT(*) FROM classes");
//     const totalSubjects = await client.query("SELECT COUNT(*) FROM subjects");
//     const feesCollected = await client.query("SELECT COALESCE(SUM(amount_paid),0) as collected FROM studentfees");
//     const feesPending = await client.query("SELECT COALESCE(SUM(outstanding_balance),0) as pending FROM studentfees");

//     // 2. Attendance Trend (last 7 days students)
//     const attendanceTrend = await client.query(`
//       SELECT attendance_date::text as date,
//         COUNT(CASE WHEN status = 'Present' THEN 1 END) as present,
//         COUNT(CASE WHEN status = 'Absent' THEN 1 END) as absent
//       FROM attendance
//       WHERE attendance_date >= CURRENT_DATE - INTERVAL '6 days'
//       GROUP BY attendance_date
//       ORDER BY attendance_date;
//     `);

//     // 3. Fees Trend (monthly collection)
//     const feesTrend = await client.query(`
//       SELECT TO_CHAR(payment_date, 'Mon') as month,
//         SUM(amount_paid) as collected
//       FROM feepayments
//       GROUP BY TO_CHAR(payment_date, 'Mon'), date_part('month', payment_date)
//       ORDER BY date_part('month', payment_date)
//       LIMIT 6;
//     `);

//     // Pending Fees per month
//     const pendingFees = await client.query(`
//       SELECT TO_CHAR(due_date, 'Mon') as month,
//         SUM(outstanding_balance) as pending
//       FROM studentfees
//       GROUP BY TO_CHAR(due_date, 'Mon'), date_part('month', due_date)
//       ORDER BY date_part('month', due_date)
//       LIMIT 6;
//     `);

//     // 4. Recent Activity (example from logs or students/staff insert)
//     const recent = await client.query(`
//       SELECT 'Student ' || first_name || ' ' || last_name || ' added' as message, created_at
//       FROM students
//       ORDER BY created_at DESC
//       LIMIT 5;
//     `);

//     res.json({
//       summary: {
//         totalStudents: parseInt(totalStudents.rows[0].count),
//         totalStaff: parseInt(totalStaff.rows[0].count),
//         totalClasses: parseInt(totalClasses.rows[0].count),
//         totalSubjects: parseInt(totalSubjects.rows[0].count),
//         feesCollected: parseFloat(feesCollected.rows[0].collected),
//         feesPending: parseFloat(feesPending.rows[0].pending),
//       },
//       attendanceTrend: attendanceTrend.rows,
//       feesTrend: feesTrend.rows.map((f, i) => ({
//         month: f.month,
//         collected: parseFloat(f.collected),
//         pending: pendingFees.rows[i] ? parseFloat(pendingFees.rows[i].pending) : 0,
//       })),
//       recent: recent.rows,
//     });
//   } catch (err) {
//     console.error("Dashboard API Error:", err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
// controllers/dashboardController.js
const client = require('../config/db');

const getStaffSummary = async (req, res) => {
  const { institution_id } = req.user;
  try {
    const result = await client.query(
      `SELECT COUNT(*) AS total_staff FROM staff WHERE institution_id = $1`,
      [institution_id]
    );
    res.json({ totalStaff: parseInt(result.rows[0].total_staff, 10) });
  } catch (err) {
    console.error('Error fetching staff summary:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getStaffSummary };
