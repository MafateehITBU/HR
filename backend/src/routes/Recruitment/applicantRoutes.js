import express from 'express';
import {
  getApplicants,
  getApplicant,
  createApplicant,
  updateApplicant,
  deleteApplicant
} from '../../controllers/Recruitment/applicantController.js';

const router = express.Router();

// Applicant routes
router.get('/', getApplicants);
router.get('/:id', getApplicant);
router.post('/', createApplicant);
router.put('/:id', updateApplicant);
router.delete('/:id', deleteApplicant);

export default router; 