import prisma from "../../config/prisma.js";

// Create a company rule
export const createCompanyRule = async (req, res) => {
  const companyId = req.user.id;
  const { sickLeaveDays, annualLeaveDays, leavesDays, maxCarryOverDays, companyShifts } = req.body;

  // Validate required fields
  if (
    sickLeaveDays === undefined ||
    annualLeaveDays === undefined ||
    leavesDays === undefined ||
    maxCarryOverDays === undefined
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate types
  if (
    typeof sickLeaveDays !== 'number' ||
    typeof annualLeaveDays !== 'number' ||
    typeof leavesDays !== 'number' ||
    typeof maxCarryOverDays !== 'number'
  ) {
    return res.status(400).json({ message: "Invalid input: all fields must be numbers" });
  }

  try {
    // Check if company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if a rule already exists
    if (company.companyRulesId) {
      return res.status(400).json({ message: "Company rule already exists" });
    }

    // Create the company rule
    const companyRule = await prisma.companyRules.create({
      data: {
        sickLeaveDays,
        annualLeaveDays,
        leavesDays,
        maxCarryOverDays,
      },
    });

    // Link the rule to the company
    await prisma.company.update({
      where: { id: companyId },
      data: { companyRulesId: companyRule.id },
    });

    if (companyShifts) {
      let parsedCompanyShifts = companyShifts;

      if (typeof companyShifts === "string") {
        try {
          parsedCompanyShifts = JSON.parse(companyShifts);
        } catch (err) {
          return res.status(400).json({ message: "Invalid shifts format" });
        }
      }
      if (!Array.isArray(parsedCompanyShifts)) {
        return res.status(400).json({ message: "Shifts must be an array" });
      }

      await Promise.all(
        parsedCompanyShifts.map((shift) =>
          prisma.companyShift.create({
            data: {
              shift: shift.shift,
              startTime: shift.startTime,
              endTime: shift.endTime,
              companyRulesId: companyRule.id,
            },
          })
        )
      );
    }

    return res.status(201).json(companyRule);
  } catch (error) {
    console.error("Error creating company rule:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get company rule by ID
export const getCompanyRuleByCompanyId = async (req, res) => {
  const { companyId } = req.params;

  try {
    // Check if company exists
    const company = await prisma.company.findUnique({
      where: { id: parseInt(companyId) },
    });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Fetch the company rule linked to the company
    const companyRule = await prisma.companyRules.findFirst({
      where: { id: company.companyRulesId },
    });

    if (!companyRule) {
      return res.status(404).json({ message: "Company rule not found" });
    }

    return res.status(200).json(companyRule);
  } catch (error) {
    console.error("Error fetching company rule:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update company rule by ID (only the provided fields in the req body)
export const updateCompanyRule = async (req, res) => {
  const { companyId } = req.params;
  const { sickLeaveDays, annualLeaveDays, leavesDays, maxCarryOverDays } = req.body;

  try {
    // Check if company exists
    const company = await prisma.company.findUnique({
      where: { id: parseInt(companyId) },
    });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Fetch the existing rule
    const existingRule = await prisma.companyRules.findFirst({
      where: { id: company.companyRulesId },
    });

    if (!existingRule) {
      return res.status(404).json({ message: "Company rule not found" });
    }

    // Update the rule with only the provided fields
    const updatedRule = await prisma.companyRules.update({
      where: { id: existingRule.id },
      data: {
        sickLeaveDays: sickLeaveDays ?? existingRule.sickLeaveDays,
        annualLeaveDays: annualLeaveDays ?? existingRule.annualLeaveDays,
        leavesDays: leavesDays ?? existingRule.leavesDays,
        maxCarryOverDays: maxCarryOverDays ?? existingRule.maxCarryOverDays,
      },
    });

    return res.status(200).json(updatedRule);
  } catch (error) {
    console.error("Error updating company rule:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update a company Shift by ID
export const updateCompanyShift = async (req, res) => {
  const { companyShiftId } = req.params;
  const { shift, startTime, endTime } = req.body;
  try {
    // Update the provided fields
    const updatedShiftData = {};
    if (shift) updatedShiftData.shift = shift;
    if (startTime) updatedShiftData.startTime = startTime;
    if (endTime) updatedShiftData.endTime = endTime;

    // Update the company shift
    const updatedShift = await prisma.companyShift.update({
      where: { id: parseInt(companyShiftId) },
      data: updatedShiftData,
    });

    return res.status(200).json(updatedShift);
  } catch (error) {
    console.error("Error updating company shift:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete company rule by ID
export const deleteCompanyRule = async (req, res) => {
  const { companyId } = req.params;

  try {
    // Check if company exists
    const company = await prisma.company.findUnique({
      where: { id: parseInt(companyId) },
    });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Fetch the existing rule
    const existingRule = await prisma.companyRules.findFirst({
      where: { id: company.companyRulesId },
    });

    if (!existingRule) {
      return res.status(404).json({ message: "Company rule not found" });
    }

    // Delete the rule
    await prisma.companyRules.delete({
      where: { id: existingRule.id },
    });

    // Remove the link from the company
    await prisma.company.update({
      where: { id: parseInt(companyId) },
      data: { companyRulesId: null },
    });

    return res.status(200).json({ message: "Company rule deleted successfully" });
  } catch (error) {
    console.error("Error deleting company rule:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};