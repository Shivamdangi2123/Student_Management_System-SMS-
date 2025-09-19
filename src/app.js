const express = require('express');
const cors = require('cors');
const app = express();
require('./config/db'); // DB connect hote hi console log dega


// Middleware to parse JSON
app.use(cors({
    origin: "*", // development me sab allow
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],

})); 
app.use(express.json());
const authRoutes = require('./routers/authRoutes');
const institution = require('./routers/institutionRouter');
const roles =require('./routers/rolesRoutes');
const userroles =require('./routers/userrolesRoutes');
const permissionRoutes = require('./routers/permissionRoutes');
const rolePermission = require('./routers/rolePermissionRoutes');
const dashboard =require('./routers/dashboardRoutes');
const classes =require('./routers/classesRoutes');
const section =require('./routers/sectionRoutes');
const academic =require('./routers/academicYearRoutes');
const subject =require("./routers/subjectRoutes");
const classsubject =require("./routers/classSubjectRoutes");
const student= require('./routers/studentRoutes');
const studenthistory =require('./routers/studentHistoryRoutes');
const guardian= require('./routers/guardianRoutes');
const studentguardian = require('./routers/studentGuardianRoutes');
const staff =require('./routers/staffRoutes');
const department =require('./routers/departmentRoutes');
const ssac =require('./routers/staffSubjectRoutes');
const attendance = require('./routers/attendanceRoutes');
const staff_attendance = require('./routers/staffAttendanceRoutes');
const exam =require('./routers/examRoutes');
const examtype =require('./routers/examTypeRoutes');
const examsubject =require('./routers/examSubjectRoutes');
const examresult =require('./routers/examResultRoutes');
const grade =require('./routers/gradeRoutes');
const feecategories = require('./routers/feeCategoryRoutes');
const feestructures =require('./routers/feeStructureRoutes');
const student_fee = require('./routers/studentFeeRoutes');
const feepayment =require('./routers/feePaymentRoutes');
const feeconsession =require ('./routers/feeConcessionRoutes');
const book = require('./routers/bookRoutes');
const borrow =require('./routers/borrowRoutes');
const route =require('./routers/routeRoutes');
const stop =require('./routers/stopRoutes');
const vehicle = require('./routers/vehicleRoutes');
const studenttransport =require('./routers/studentTransportRoutes');
const hostel = require('./routers/hostelRoutes');
const room =require('./routers/roomRoutes');
const bed = require('./routers/bedRoutes');
const studenthostelassignment =require('./routers/studentHostelAssignmentRoutes');
const timeslot= require('./routers/timeSlotRoutes');
const weekday =require('./routers/weekDayRoutes');
const classrooms =require('./routers/classRoomRoutes');
const timetableevent = require('./routers/timetableEventRoutes');
const holiday = require('./routers/holidayRoutes');
const expensecategories =require('./routers/expensecategoryRoutes');
const expense =require('./routers/expenseRoutes');
const incomeCategories =require('./routers/incomeCategoriesRoutes');
const income =require('./routers/incomesRoutes');
// const employee = require('./routers/employeeRoutes');
// const bus =require('./routers/busRoutes');
// const teacher =require('./routers/teacherRoutes');
// const classes =require('./routers/classRoutes');
app.use('/', authRoutes);
app.use('/', institution);
app.use('/',roles);
app.use('/',userroles);
app.use('/', permissionRoutes);
app.use('/', rolePermission);

app.use('/',classes);
app.use('/',section);
app.use('/',academic);
app.use('/',subject);
app.use('/',dashboard);
app.use('/',classsubject);
app.use('/',student);
app.use('/',studenthistory);
app.use('/',guardian);
app.use('/',studentguardian);
app.use('/', staff);
app.use('/',classrooms);
app.use('/',department);
app.use('/',ssac);
app.use('/',attendance);
app.use('/',staff_attendance);
app.use('/',exam);
app.use('/',examtype);
app.use('/',examsubject);
app.use('/',examresult);
app.use('/',grade);
app.use('/',feecategories);
app.use('/',feestructures);
app.use('/',student_fee);
app.use('/',feepayment);
app.use('/',feeconsession);
app.use('/',book);
app.use('/',borrow);
app.use('/',route);
app.use('/',stop);
app.use('/',vehicle);
app.use('/',studenttransport);
app.use('/',hostel);
app.use('/',room);
app.use('/',bed);
app.use('/studenthostelassignment', studenthostelassignment);
app.use('/',timeslot);
app.use('/',weekday);
app.use('/',expense);
app.use('/',expensecategories);
app.use('/',incomeCategories);
app.use('/',income);
app.use('/',timetableevent);
app.use('/', holiday);
// app.use('/',employee);
// app.use('/',bus);
// app.use('/',teacher);
// app.use('/',classes)

module.exports = app;
