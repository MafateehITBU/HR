import express from "express";
import {
    clockIn,
    getAllAttendances,
    getAttendanceById,
    startBreak,
    endBreak,
    clockOut,
    updateAttendance,
} from "../../controllers/Attendance-leave Management/attendanceController.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.post("/", auth, clockIn); // Clock -In controller
router.get("/", auth, getAllAttendances); // Get all attendences
router.put("/start-break", auth, startBreak); // Start Break by ID
router.put("/end-break", auth, endBreak); // End Break by ID
router.put("/clock-out", auth, clockOut); // Clock-Out controller
router.get('/:attendanceId', auth, getAttendanceById); // Get an attendance by ID
router.put("/:attendanceId", auth, updateAttendance); // Update an attendance by ID

export default router;