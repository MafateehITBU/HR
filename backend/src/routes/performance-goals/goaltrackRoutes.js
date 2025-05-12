import express from "express";
import {
  getAllGoalTracks,
  getGoalTrackById,
  updateGoalTrack,
  deleteGoalTrack,
} from "../../controllers/performance-goals/goaltrackController.js";

const router = express.Router();

router.get("/", getAllGoalTracks);
router.get("/:id", getGoalTrackById);
router.put("/:id", updateGoalTrack);
router.delete("/:id", deleteGoalTrack);

export default router;