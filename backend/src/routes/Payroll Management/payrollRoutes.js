import express from "express";
import {
    updatePayroll,
    getAllPayrolls,
    getPayrollByID,
} from "../../controllers/Payroll Management/payrollController.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.put('/', auth, updatePayroll); // Update Payroll
router.get('/', auth, getAllPayrolls); // Get All payrolls
router.get('/:payrollId', auth, getPayrollByID); // Get a payroll by ID

export default router;