import prisma from "../../config/prisma.js";

// Create a job title
export const createJobTitle = [
  async (req, res) => {
    const { title, description, depID } = req.body;

    if (!title || !depID) {
      return res
        .status(400)
        .json({ message: "Title and department ID are required" });
    }
    try {
      const jobTitle = await prisma.jobTitle.create({
        data: {
          title,
          description,
          depID: parseInt(depID),
        },
      });
      if (!jobTitle) {
        return res.status(400).json({ message: "Job title not created" });
      }
      res
        .status(200)
        .json({ message: "Job title created successfully", jobTitle });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  },
];

// Get all job titles
export const getAllJobTitles = [
  async (req, res) => {
    const jobTitles = await prisma.jobTitle.findMany();
    if (!jobTitles) {
      return res.status(400).json({ message: "No job titles found" });
    }
    res
      .status(200)
      .json({ message: "Job titles fetched successfully", jobTitles });
  },
];

// Get a job title by ID
export const getJobTitleById = [
  async (req, res) => {
    const { id } = req.params;
    const jobTitle = await prisma.jobTitle.findUnique({
      where: { id: parseInt(id) },
    });
    if (!jobTitle) {
      return res.status(400).json({ message: "Job title not found" });
    }
    res
      .status(200)
      .json({ message: "Job title fetched successfully", jobTitle });
  },
];

// Update a job title by ID
export const updateJobTitle = [
  async (req, res) => {
    const { id } = req.params;
    const { title, description, depID } = req.body;

    try {
      // Create update data object with only the fields that are provided
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (depID !== undefined) updateData.depID = parseInt(depID);

      const jobTitle = await prisma.jobTitle.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

      if (!jobTitle) {
        return res.status(400).json({ message: "Job title not found" });
      }
      res
        .status(200)
        .json({ message: "Job title updated successfully", jobTitle });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  },
];

// Delete a job title by ID
export const deleteJobTitle = [
  async (req, res) => {
    const { id } = req.params;
    const jobTitle = await prisma.jobTitle.delete({
      where: { id: parseInt(id) },
    });
    if (!jobTitle) {
      return res.status(400).json({ message: "Job title not found" });
    }
    res
      .status(200)
      .json({ message: "Job title deleted successfully", jobTitle });
  },
];
