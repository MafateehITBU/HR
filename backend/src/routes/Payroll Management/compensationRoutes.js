import express from "express";
import {
    createCompensation,
    getAllCompensationsGrouped,
    updateCompensation,
    toggleCompensationEffective,
    deleteCompensation
} from "../../controllers/Payroll Management/compensationController.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.post('/', auth, createCompensation); // Create a compensation
router.get('/', auth, getAllCompensationsGrouped); // Get all compensations
router.put('/:compensationId', auth, updateCompensation); // Update compensation by ID
router.patch('/:compensationId/toggle', auth, toggleCompensationEffective); // Toggle Compensation by ID
router.delete('/:compensationId', auth, deleteCompensation); // Delete compensation by ID

export default router;