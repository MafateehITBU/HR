import express from 'express';
import {
  getAllCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate
} from '../../controllers/Recruitment/candidateController.js';

const router = express.Router();

// Get all candidates
router.get('/', getAllCandidates);

// Get candidate by ID
router.get('/:id', getCandidateById);

// Create new candidate
router.post('/', createCandidate);

// Update candidate
router.put('/:id', updateCandidate);

// Delete candidate
router.delete('/:id', deleteCandidate);

export default router; 