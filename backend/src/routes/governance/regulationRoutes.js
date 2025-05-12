import express from "express";
import {
  createRegulation,
  getAllRegulations,
  getRegulationById,
  updateRegulation,
  deleteRegulation,
} from "../../controllers/governance/regulationController.js";

const router = express.Router();

router.post("/", createRegulation);
router.get("/", getAllRegulations);
router.get("/:id", getRegulationById);
router.put("/:id", updateRegulation);
router.delete("/:id", deleteRegulation);

export default router;
