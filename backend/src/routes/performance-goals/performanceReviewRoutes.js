import express from 'express';
import {
    createPerformanceReview,
    getAllPerformanceReviews,
    getPerformanceReviewById,
    updatePerformanceReview,
    deletePerformanceReview,
} from '../../controllers/performance-goals/performanceReviewController.js';

const router = express.Router();

router.post('/', createPerformanceReview);
router.get('/', getAllPerformanceReviews);
router.get('/:id', getPerformanceReviewById);
router.put('/:id', updatePerformanceReview);
router.delete('/:id', deletePerformanceReview);

export default router;
