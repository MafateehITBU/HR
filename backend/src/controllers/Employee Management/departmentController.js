import prisma from "../../config/prisma.js";

// Create a department
export const createDepartment = [
  async (req, res) => {
    const { name } = req.body;
    try {
      const department = await prisma.department.create({
        data: { name },
      });
      if (!department) {
        return res.status(400).json({ message: "Department not created" });
      }
      res
        .status(200)
        .json({ message: "Department created successfully", department });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  },
];

// Get all departments
export const getAllDepartments = [
  async (req, res) => {
    try {
      const departments = await prisma.department.findMany({
        include: {
          _count: {
            select: { employees: true },
          },
        },
      });

      if (!departments) {
        return res.status(400).json({ message: "No departments found" });
      }

      // Transform the response to include empCount
      const departmentsWithCount = departments.map((dept) => ({
        ...dept,
        empCount: dept._count.employees,
      }));

      res.status(200).json({
        message: "Departments fetched successfully",
        departments: departmentsWithCount,
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  },
];

// Get a department by ID
export const getDepartmentById = [
  async (req, res) => {
    const { id } = req.params;
    try {
      const department = await prisma.department.findUnique({
        where: { id: parseInt(id) },
        include: {
          _count: {
            select: { employees: true },
          },
        },
      });

      if (!department) {
        return res.status(400).json({ message: "Department not found" });
      }

      // Transform the response to include empCount
      const departmentWithCount = {
        ...department,
        empCount: department._count.employees,
      };

      res.status(200).json({
        message: "Department fetched successfully",
        department: departmentWithCount,
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  },
];

// Update a department by ID
export const updateDepartment = [
  async (req, res) => {
    const { id } = req.params;
    const { name, departmentHeadID } = req.body;
    try {
      const department = await prisma.department.update({
        where: { id: parseInt(id) },
        data: {
          name,
          departmentHeadID: departmentHeadID
            ? parseInt(departmentHeadID)
            : null,
        },
      });
      if (!department) {
        return res.status(400).json({ message: "Department not found" });
      }
      res
        .status(200)
        .json({ message: "Department updated successfully", department });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  },
];

// Delete a department by ID
export const deleteDepartment = [
  async (req, res) => {
    const { id } = req.params;
    try {
      const department = await prisma.department.delete({
        where: { id: parseInt(id) },
      });
      if (!department) {
        return res.status(400).json({ message: "Department not found" });
      }
      res.status(200).json({ message: "Department deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  },
];
