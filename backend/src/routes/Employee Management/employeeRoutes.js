import express from "express";
import {
  createEmployee,
  signin,
  updateEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  updateProfilePicture,
} from "../../controllers/Employee Management/employeeController.js";
import upload from "../../middleware/photoUpload.js";

const router = express.Router();

router.post("/", upload.single("profilePic"), createEmployee);
router.post("/signin", signin);
router.get("/", getAllEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);
router.patch("/:id/profile-picture", upload.single("profilePic"), updateProfilePicture);

export default router;