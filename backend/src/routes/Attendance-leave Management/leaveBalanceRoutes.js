import express from "express";
import {
   getLeaveBalances,
   updateLeaveBalance,
} from "../../controllers/Attendance-leave Management/leaveBalanceController.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.get("/:userId", auth, getLeaveBalances); // Get leave balances for a user
router.put("/:userId", auth, updateLeaveBalance); // Update a leave balance for a user


export default router;