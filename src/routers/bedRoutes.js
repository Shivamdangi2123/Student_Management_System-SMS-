// bedRoutes.js
const router = require("express").Router();
const { 
  createBed, getAllBeds, getBedById, getBedsByRoom,
  updateBed, deleteBed, assignBed, releaseBed
} = require("../controllers/bedController");
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// ✅ All bed routes under /beds
router.post("/bed", verifyToken, checkRole(["Admin"]), createBed); 
router.get("//hostelroom", verifyToken, getAllBeds); 
router.get("/beds/by-room/:room_id", verifyToken, getBedsByRoom);
router.get("/beds/:bed_id", verifyToken, getBedById);
router.put("/beds/:bed_id", verifyToken, checkRole(["Admin"]), updateBed);
router.delete("/beds/:bed_id", verifyToken, checkRole(["Admin"]), deleteBed);
router.post("/beds/assign", verifyToken, assignBed);
router.post("/beds/release", verifyToken, releaseBed);

module.exports = router;
