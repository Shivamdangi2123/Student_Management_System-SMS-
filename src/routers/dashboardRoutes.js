// C:\sms\routes\dashboardRoutes.js
const express = require("express");
const router = express.Router();
// const dashboardController = require("../controllers/dashboardController");

// router.get("/api/dashboard", dashboardController.getDashboardData);
const { getStaffSummary } = require('../controllers/dashboardController');

router.get('/dashboard/summary', getStaffSummary);
module.exports = router;
