import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import fs from "fs";
import prisma from "../../config/prisma.js";
import helpers from "../../utils/helpers.js";

// Register a new GM
export const registerGM = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Validate email format
    if (!helpers.validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    // Validate phone format
    if (!helpers.validatePhone(phone)) {
      return res.status(400).json({ message: "Invalid phone format" });
    }
    // Validate password format
    if (!helpers.validatePassword(password)) {
      return res.status(400).json({ message: "Invalid password format" });
    }

    const lowercaseEmail = email.toLowerCase();

    // Check if a file is uploaded
    let profilePictureUrl = "";
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

    // Check if the email already exists
    const existingGM = await prisma.gM.findUnique({
      where: { email: lowercaseEmail },
    });
    if (existingGM) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const gm = await prisma.gM.create({
      data: {
        name,
        email: lowercaseEmail,
        password_hash: hashedPassword,
        phone,
        profilePicture: profilePictureUrl, // This will be an empty string if no picture was uploaded
      },
    });

    res.status(201).json({ message: "GM added successfully", gm });
  } catch (error) {
    res.status(400).json({ message: "Invalid request" });
    console.log(error);
  }
};

// Sign in a GM
export const SigninGM = [
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const gm = await prisma.gM.findUnique({
        where: { email: email.toLowerCase() },
      });
      if (!gm) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      const isPasswordValid = await bcrypt.compare(password, gm.password_hash);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      const token = jwt.sign(
        { gmId: gm.id, email: gm.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  },
];

// Get all GMs
export const getAllGMs = [
  async (req, res) => {
    try {
      const gMs = await prisma.gM.findMany();
      if (!gMs) {
        return res.status(400).json({ message: "No GMs found" });
      }
      res.status(200).json({ message: "GMs fetched successfully", gMs });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  },
];

// Get a GM by ID
export const getGMById = [
  async (req, res) => {
    const { id } = req.params;
    // Convert id to number
    const idNumber = parseInt(id);

    try {
      const gm = await prisma.gM.findUnique({
        where: { id: idNumber },
      });
      if (!gm) {
        return res.status(400).json({ message: "GM not found" });
      }
      res.status(200).json({ message: "GM fetched successfully", gm });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  },
];

// Update a GM by ID
export const updateGM = [
  async (req, res) => {
    const { id } = req.params;
    // Convert id to number
    const idNumber = parseInt(id);
    const { name, email, password, phone } = req.body;
    try {
      const gm = await prisma.gM.update({
        where: { id: idNumber },
        data: { name, email, password, phone },
      });
      if (!gm) {
        return res.status(400).json({ message: "GM not found" });
      }
      res.status(200).json({ message: "GM updated successfully", gm });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  },
];

// Delete a GM by ID
export const deleteGM = [
  async (req, res) => {
    const { id } = req.params;
    // Convert id to number
    const idNumber = parseInt(id);
    try {
      const gm = await prisma.gM.delete({
        where: { id: idNumber },
      });
      if (!gm) {
        return res.status(400).json({ message: "GM not found" });
      }
      res.status(200).json({ message: "GM deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  },
];
