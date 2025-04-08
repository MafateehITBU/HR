import express from "express";
import {
  createJobTitle,
  getAllJobTitles,
  getJobTitleById,
  updateJobTitle,
  deleteJobTitle,
} from "../../controllers/Employee Management/jobtitleController.js";

const router = express.Router();

router.post("/", createJobTitle);
router.get("/", getAllJobTitles);
router.get("/:id", getJobTitleById);
router.put("/:id", updateJobTitle);
router.delete("/:id", deleteJobTitle);

export default router;
