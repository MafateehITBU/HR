import express from "express";
import {
  createAudit,
  getAllAudits,
  getAuditById,
  updateAudit,
  deleteAudit,
} from "../../controllers/governance/auditController.js";

const router = express.Router();

router.post("/", createAudit);
router.get("/", getAllAudits);
router.get("/:id", getAuditById);
router.put("/:id", updateAudit);
router.delete("/:id", deleteAudit);

export default router;
