import express from 'express';
import {
    createBonus,
    getAllBonuses,
    getBonusesByEmployee,
    getBonusById,
    updateBonus,
    deleteBonus
} from '../../controllers/Payroll Management/bonusController.js';
import auth from '../../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createBonus); // Create a new bonus
router.get('/', auth, getAllBonuses); // Get all bonuses
router.get('/employee/:empId', auth, getBonusesByEmployee); // Get bonuses by employee ID
router.get('/:id', auth, getBonusById); // Get a bonus by ID
router.put('/:id', auth, updateBonus); // Update a bonus by ID
router.delete('/:id', auth, deleteBonus); // Delete a bonus by ID

export default router;