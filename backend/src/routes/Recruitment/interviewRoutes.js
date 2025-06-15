import express from 'express';
import {
  getInterviews,
  getInterview,
  createInterview,
  updateInterview,
  deleteInterview
} from '../../controllers/Recruitment/interviewController.js';

const router = express.Router();

// Interview routes
router.get('/', getInterviews);
router.get('/:id', getInterview);
router.post('/', createInterview);
router.put('/:id', updateInterview);
router.delete('/:id', deleteInterview);

export default router;
