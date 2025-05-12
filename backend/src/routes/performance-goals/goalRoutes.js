import express from "express";
import {
  createGoal,
  getAllGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
} from "../../controllers/performance-goals/goalController.js";

const router = express.Router();

router.post("/", createGoal);
router.get("/", getAllGoals);
router.get("/:id", getGoalById);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);

export default router;
