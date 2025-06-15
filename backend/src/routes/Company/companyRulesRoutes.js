import express from 'express';
import {
    createCompanyRule,
    getCompanyRuleByCompanyId,
    updateCompanyRule,
    updateCompanyShift,
    deleteCompanyRule,
} from '../../controllers/Company/companyRulesController.js';
import auth from '../../middleware/auth.js';
import authorizeRole from '../../middleware/authorizeRole.js';

const router = express.Router();

router.post('/', auth, createCompanyRule); // Create a new company rule
router.get('/:companyId', auth, getCompanyRuleByCompanyId); // Get company rule by company ID
router.put('/:companyId', auth, updateCompanyRule); // Update company rule by company ID
router.put('/:companyShiftId/shift', auth, updateCompanyShift); // Update company shift by ID
router.delete('/:companyId', auth, deleteCompanyRule); // Delete company rule by company ID

export default router;