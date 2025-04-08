import express from "express";
import {
  registerGM,
  SigninGM,
  getAllGMs,
  getGMById,
  updateGM,
  deleteGM,
} from "../../controllers/Employee Management/gmController.js";

const router = express.Router();

router.post("/register", registerGM);
router.post("/signin", SigninGM);
router.get("/", getAllGMs);
router.get("/:id", getGMById);
router.put("/:id", updateGM);
router.delete("/:id", deleteGM);

export default router;
