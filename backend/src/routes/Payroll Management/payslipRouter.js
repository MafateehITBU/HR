import express from "express";
import {
    createPayslip,
    getAllPayslips,
    getPayslipsByEmployee,
    getPayslipById,
    deletePayslip
} from '../../controllers/Payroll Management/payslipController.js';
import auth from "../../middleware/auth.js";

const router = express.Router();

router.post("/", auth, createPayslip); // Create a new Payslip
router.get("/", auth, getAllPayslips); // Get all Payslips 
router.get("/employee/:empId", auth, getPayslipsByEmployee); // Get Payslips by Employee ID
router.get("/:id", auth, getPayslipById); // Get Payslip by ID
router.delete("/:id", auth, deletePayslip); // Delete a Payslip by ID

export default router;