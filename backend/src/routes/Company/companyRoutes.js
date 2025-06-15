import express from 'express';
import {
  createCompany,
  signInCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  updateCompanyPassword,
  deleteCompany,
} from '../../controllers/Company/companyController.js';
import auth from '../../middleware/auth.js';
import upload from "../../middleware/photoUpload.js";

const router = express.Router();

router.post('/', upload.single('profilePic'),createCompany); // Create a new company
router.post('/signin', signInCompany); // Sign in a company
router.get('/', getAllCompanies); // Get all companies
router.get('/:id', getCompanyById); // Get a company by ID
router.put('/:id', upload.single('profilePic'), updateCompany); // Update a company by ID
router.put('/:id/password', updateCompanyPassword); // Update company password
router.delete('/:id', deleteCompany); // Delete a company by ID

export default router;