import express from "express";
import {
    createLeaveRequest,
    getAllLeaveRequests,
    getLeaveRequestById,
    approveLeaveRequest
} from "../../controllers/Attendance-leave Management/leaveRequestController.js";
import auth from "../../middleware/auth.js";
import upload from "../../middleware/photoUpload.js";

const router = express.Router();

router.post("/", auth, upload.single('sickPic'), createLeaveRequest); // Create new Leave Request
router.get('/', auth, getAllLeaveRequests); // Get All leave requests
router.get('/:id', auth, getLeaveRequestById); // Get  a Leave Request by ID
router.post('/:id', auth, approveLeaveRequest); // Approve/ Reject a Leave Request

export default router;