import prisma from "../../config/prisma.js";
import helpers from "../../utils/helpers.js";
import bcrypt from "bcrypt";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import fs from "fs";
import jwt from "jsonwebtoken";

// Create a company
export const createCompany = async (req, res) => {
    const { name, email, password, phone } = req.body;
    // Validate required fields
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required" });
    }
    // Validate email format
    if (!helpers.validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
    // Validate phone format if provided
    if (phone && !helpers.validatePhone(phone)) {
        return res.status(400).json({ message: "Invalid phone format" });
    }
    // Check if a file is uploaded
    let profilePictureUrl = null;
    if (req.file) {
        try {
            profilePictureUrl = await uploadToCloudinary(req.file.path);
            // Delete the local file after uploading
            fs.unlinkSync(req.file.path);
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Failed to upload profile picture" });
        }
    }

    try {
        // Check if the company already exists
        const existingCompany = await prisma.company.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (existingCompany) {
            return res.status(400).json({ message: "Company already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create the company
        const newCompany = await prisma.company.create({
            data: {
                name,
                email: email.toLowerCase(),
                password_hash: hashedPassword,
                phone: phone,
                profilePicture: profilePictureUrl,
            },
        });

        return res.status(201).json({
            message: "Company created successfully",
            company: {
                id: newCompany.id,
                name: newCompany.name,
                email: newCompany.email,
                phone: newCompany.phone,
                profilePicture: newCompany.profilePicture,
            },
        });
    } catch (error) {
        console.error("Error creating company:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Sign in a company
export const signInCompany = async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Find the company by email
        const company = await prisma.company.findUnique({
            where: { email: email.toLowerCase() },
        });

        // Check if the company exists
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        // Compare the password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, company.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: company.id },
            process.env.JWT_SECRET
            , {
                expiresIn: '1d',
            });

        return res.status(200).json({
            message: "Sign in successful",
            token,
        });
    } catch (error) {
        console.error("Error signing in company:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Get all companies
export const getAllCompanies = async (req, res) => {
    try {
        const companies = await prisma.company.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                profilePicture: true,
            },
        });
        return res.status(200).json(companies);
    } catch (error) {
        console.error("Error fetching companies:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get a company by ID
export const getCompanyById = async (req, res) => {
    const { id } = req.params;

    try {
        const company = await prisma.company.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                profilePicture: true,
            },
        });

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        return res.status(200).json(company);
    } catch (error) {
        console.error("Error fetching company:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Update a company by ID (Only provided fields in the request body will be updated)
export const updateCompany = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    try {
        // Check if the company exists
        const existingCompany = await prisma.company.findUnique({
            where: { id: parseInt(id) },
        });
        if (!existingCompany) {
            return res.status(404).json({ message: "Company not found" });
        }

        // Validate email format
        if (email && !helpers.validateEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Validate phone format if provided
        if (phone && !helpers.validatePhone(phone)) {
            return res.status(400).json({ message: "Invalid phone format" });
        }

        // Check if a file is uploaded
        let profilePictureUrl = existingCompany.profilePicture;
        if (req.file) {
            try {
                profilePictureUrl = await uploadToCloudinary(req.file.path);
                // Delete the local file after uploading
                fs.unlinkSync(req.file.path);
            } catch (error) {
                return res
                    .status(500)
                    .json({ message: "Failed to upload profile picture" });
            }
        }

        // Update the company
        const updatedCompany = await prisma.company.update({
            where: { id: parseInt(id) },
            data: {
                name,
                email: email ? email.toLowerCase() : existingCompany.email,
                phone,
                profilePicture: profilePictureUrl,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                profilePicture: true,
            },
        });

        return res.status(200).json({
            message: "Company updated successfully",
            company: updatedCompany,
        });
    } catch (error) {
        console.error("Error updating company:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Update company password (newPassword, confirmNewPassword)
export const updateCompanyPassword = async (req, res) => {
    const { id } = req.params;
    const { newPassword, confirmNewPassword } = req.body;

    try {
        // Check if the company exists
        const existingCompany = await prisma.company.findUnique({
            where: { id: parseInt(id) },
        });
        if (!existingCompany) {
            return res.status(404).json({ message: "Company not found" });
        }

        // Validate password match
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the company's password
        await prisma.company.update({
            where: { id: parseInt(id) },
            data: { password_hash: hashedPassword },
        });

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating company password:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Delete a company by ID
export const deleteCompany = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the company exists
        const existingCompany = await prisma.company.findUnique({
            where: { id: parseInt(id) },
        });
        if (!existingCompany) {
            return res.status(404).json({ message: "Company not found" });
        }

        // Delete the company
        await prisma.company.delete({
            where: { id: parseInt(id) },
        });

        return res.status(200).json({ message: "Company deleted successfully" });
    } catch (error) {
        console.error("Error deleting company:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};