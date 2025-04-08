import express from 'express';
import {
  getJobPostings,
  getJobPosting,
  createJobPosting,
  updateJobPosting,
  deleteJobPosting,
  getJobPostingTrack,
  updateJobPostingTrack
} from '../../controllers/Recruitment/jobPostingController.js';

const router = express.Router();

// Job posting routes
router.get('/', getJobPostings);
router.get('/:id', getJobPosting);
router.post('/', createJobPosting);
router.put('/:id', updateJobPosting);
router.delete('/:id', deleteJobPosting);

// Job posting track routes
router.get('/:id/track', getJobPostingTrack);
router.put('/:id/track', updateJobPostingTrack);

export default router; 