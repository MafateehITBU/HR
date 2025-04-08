import prisma from "../../config/prisma.js";
import helpers from "../../utils/helpers.js";

// Create an employee
export const createEmployee = [
  async (req, res) => {
    const {
      name,
      email,
      password,
      phone,
      dob,
      hireDate,
      bankDetails,
      depID,
      jobTitleID,
      teamID,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !hireDate || !depID || !jobTitleID) {
      return res
        .status(400)
        .json({ message: "All fields except teamID are required" });
    }

    // Validate email format
    if (!helpers.validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate phone format if provided
    if (phone && !helpers.validatePhone(phone)) {
      return res.status(400).json({ message: "Invalid phone format" });
    }

    // Validate password format
    if (!helpers.validatePassword(password)) {
      return res.status(400).json({ message: "Invalid password format" });
    }

    // Validate DOB if provided
    if (dob && !helpers.validateDOB(dob)) {
      return res
        .status(400)
        .json({ message: "Employee must be at least 18 years old" });
    }

    try {
      const employee = await prisma.employee.create({
        data: {
          name,
          email: email.toLowerCase(),
          password_hash: password, // Note: You should hash the password before storing
          phone,
          dob: dob ? new Date(dob) : null,
          hireDate: new Date(hireDate),
          bankDetails,
          depID: parseInt(depID),
          jobTitleID: parseInt(jobTitleID),
          teamID: teamID ? parseInt(teamID) : null,
        },
      });
      res
        .status(200)
        .json({ message: "Employee created successfully", employee });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  },
];

// Get all employees
export const getAllEmployees = [
  async (req, res) => {
    try {
      const employees = await prisma.employee.findMany({
        include: {
          department: true,
          jobTitle: true,
          team: true,
        },
      });
      res
        .status(200)
        .json({ message: "Employees fetched successfully", employees });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  },
];

// Get an employee by ID
export const getEmployeeById = [
  async (req, res) => {
    const { id } = req.params;
    try {
      const employee = await prisma.employee.findUnique({
        where: { id: parseInt(id) },
        include: {
          department: true,
          jobTitle: true,
          team: true,
        },
      });

      if (!employee) {
        return res.status(400).json({ message: "Employee not found" });
      }
      res
        .status(200)
        .json({ message: "Employee fetched successfully", employee });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  },
];

// Update an employee by ID
export const updateEmployee = [
  async (req, res) => {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      dob,
      hireDate,
      bankDetails,
      depID,
      jobTitleID,
      teamID,
    } = req.body;

    try {
      // Create update data object with only the fields that are provided
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) {
        if (!helpers.validateEmail(email)) {
          return res.status(400).json({ message: "Invalid email format" });
        }
        updateData.email = email.toLowerCase();
      }
      if (phone !== undefined) {
        if (!helpers.validatePhone(phone)) {
          return res.status(400).json({ message: "Invalid phone format" });
        }
        updateData.phone = phone;
      }
      if (dob !== undefined) {
        if (!helpers.validateDOB(dob)) {
          return res
            .status(400)
            .json({ message: "Employee must be at least 18 years old" });
        }
        updateData.dob = new Date(dob);
      }
      if (hireDate !== undefined) updateData.hireDate = new Date(hireDate);
      if (bankDetails !== undefined) updateData.bankDetails = bankDetails;
      if (depID !== undefined) updateData.depID = parseInt(depID);
      if (jobTitleID !== undefined)
        updateData.jobTitleID = parseInt(jobTitleID);
      if (teamID !== undefined)
        updateData.teamID = teamID ? parseInt(teamID) : null;

      const employee = await prisma.employee.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

      if (!employee) {
        return res.status(400).json({ message: "Employee not found" });
      }
      res
        .status(200)
        .json({ message: "Employee updated successfully", employee });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  },
];

// Delete an employee by ID
export const deleteEmployee = [
  async (req, res) => {
    const { id } = req.params;
    try {
      const employee = await prisma.employee.delete({
        where: { id: parseInt(id) },
      });
      if (!employee) {
        return res.status(400).json({ message: "Employee not found" });
      }
      res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  },
];
