import prisma from "../../config/prisma.js";
import helpers from "../../utils/helpers.js";
import bcrypt from "bcrypt";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import fs from "fs";
import jwt from "jsonwebtoken";

// Create an employee
export const createEmployee = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    dob,
    hireDate,
    bankDetails,
    companyID,
    shift,
    depID,
    jobTitleID,
    teamID,
    salary,
    compensation,
    compensations
  } = req.body;

  // Validate required fields
  if (!name || !email || !password || !hireDate || !depID || !jobTitleID || !salary || !compensation) {
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

  if (isNaN(parseFloat(salary))) {
    return res.status(400).json({ message: "Invalid salary format" });
  }

  const lowercaseEmail = email.toLowerCase();

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

  // Check if the email already exists
  const existingEmployee = await prisma.employee.findUnique({
    where: { email: lowercaseEmail },
  });
  if (existingEmployee) {
    return res.status(400).json({ message: "Email already exists" });
  }

  // Check if companyID is provided and valid
  if (!companyID || isNaN(parseInt(companyID))) {
    return res.status(400).json({ message: "Invalid or missing company ID" });
  }

  // Check if the company exists
  const company = await prisma.company.findUnique({
    where: { id: parseInt(companyID) },
  });
  if (!company) {
    return res.status(400).json({ message: "Company not found" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const employee = await prisma.employee.create({
      data: {
        name,
        email: lowercaseEmail,
        password_hash: hashedPassword,
        phone,
        dob: dob ? new Date(dob) : null,
        hireDate: new Date(hireDate),
        bankDetails,
        profilePicture: profilePictureUrl || "",
        companyID: parseInt(companyID),
        shift: shift,
        depID: parseInt(depID),
        jobTitleID: parseInt(jobTitleID),
        teamID: teamID ? parseInt(teamID) : null,
      },
    });

    // Get the company rules
    const companyRules = await prisma.companyRules.findUnique({
      where: { id: parseInt(company.companyRulesId) },
    });

    if (!companyRules) {
      return res.status(400).json({ message: "Company rules not found" });
    }

    // Create 3 leave balances for the employee (leave, sick, annual)
    await prisma.leaveBalance.createMany({
      data: [
        {
          employeeId: employee.id,
          leaveType: "LEAVE",
          entitlement: companyRules.leavesDays,
          balance: companyRules.leavesDays,
          accrualRate: companyRules.leavesDays,
        },
        {
          employeeId: employee.id,
          leaveType: "SICK",
          balance: companyRules.sickLeaveDays,
          entitlement: companyRules.sickLeaveDays,
          accrualRate: companyRules.sickLeaveDays / 12,
        },
        {
          employeeId: employee.id,
          leaveType: "ANNUAL",
          entitlement: companyRules.annualLeaveDays,
          balance: companyRules.annualLeaveDays,
          accrualRate: companyRules.annualLeaveDays / 12,
        },
      ],
    });

    // Create a payroll
    await prisma.payroll.create({
      data: {
        empId: employee.id,
        baseSalary: parseFloat(salary),
      }
    })

    // Create Compensations if compensation === true
    if (compensation) {
      let parsedCompensations = compensations;

      if (typeof compensations === "string") {
        try {
          parsedCompensations = JSON.parse(compensations);
        } catch (err) {
          return res.status(400).json({ message: "Invalid compensations format" });
        }
      }

      if (!Array.isArray(parsedCompensations)) {
        return res.status(400).json({ message: "Compensations must be an array" });
      }

      await Promise.all(
        parsedCompensations.map((comp) =>
          prisma.compensation.create({
            data: {
              empId: employee.id,
              benefit: comp.benefit,
              amount: parseFloat(comp.amount),
              effectiveDate: new Date(comp.effectiveDate),
            },
          })
        )
      );
    }

    res
      .status(200)
      .json({ message: "Employee created successfully", employee });
  } catch (error) {
    res.status(400).json({ message: "Invalid request" });
    console.log(error);
  }
};

// Employee Signin
export const signin = [
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const employee = await prisma.employee.findUnique({
        where: { email },
      });
      // Check if the employee exists
      if (!employee) {
        return res.status(400).json({ message: "Employee not found" });
      }
      // Check if the password is valid
      const isPasswordValid = await bcrypt.compare(
        password,
        employee.password_hash
      );
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
      }
      // Generate a JWT token
      const token = jwt.sign({ id: employee.id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
      res
        .status(200)
        .json({ message: "Employee signed in successfully", token });
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

// Update employee profile picture
export const updateProfilePicture = async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Get current employee to check if they exist
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id) },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Upload the new picture to Cloudinary
    const profilePictureUrl = await uploadToCloudinary(req.file.path);

    // Delete local temp file
    fs.unlinkSync(req.file.path);

    // Update profile picture in DB
    const updatedEmployee = await prisma.employee.update({
      where: { id: parseInt(id) },
      data: { profilePicture: profilePictureUrl },
    });

    res.status(200).json({
      message: "Profile picture updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile picture" });
    console.error(error);
  }
};

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
      console.error(error);
      res.status(400).json({ message: "Invalid request" });
    }
  },
];
