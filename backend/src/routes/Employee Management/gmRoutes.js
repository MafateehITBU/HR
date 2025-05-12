import express from "express";
import {
  registerGM,
  SigninGM,
  getAllGMs,
  getGMById,
  updateGM,
  deleteGM,
} from "../../controllers/Employee Management/gmController.js";
import upload from "../../middleware/photoUpload.js";

const router = express.Router();

router.post("/register", upload.single("profilePic"), registerGM);
router.post("/signin", SigninGM);
router.get("/", getAllGMs);
router.get("/:id", getGMById);
router.put("/:id", updateGM);
router.delete("/:id", deleteGM);

export default router;
