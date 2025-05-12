import prisma from "../../config/prisma.js";

// Create a new audit
export const createAudit = async (req, res) => {
  const {
    type,
    policyId,
    regulationId,
    date,
    findings,
    correctiveAction,
    status,
  } = req.body;

  try {
    if (!type || !date || !findings || !correctiveAction || !status) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the type is valid
    if (type !== "POLICY" && type !== "REGULATION") {
      return res.status(400).json({
        error: "Invalid audit type, type must be POLICY or REGULATION",
      });
    }

    // Check if the status is valid
    if (status !== "PENDING" && status !== "COMPLETED" && status !== "FAILED") {
      return res.status(400).json({
        error:
          "Invalid audit status, status must be PENDING or COMPLETED or FAILED",
      });
    }

    // check if only one of policyId or regulationId is provided
    if (
      (policyId && regulationId) || // Both provided
      (!policyId && !regulationId) // Neither provided
    ) {
      return "Provide either Policy ID or Regulation ID, not both or neither";
    }

    // Check if the policyId is valid
    if (policyId) {
      const policy = await prisma.policy.findUnique({
        where: { id: parseInt(policyId) },
      });
      if (!policy) {
        return res
          .status(400)
          .json({ error: "Invalid policyId, policy does not exist" });
      }
    }

    // Check if the regulationId is valid
    if (regulationId) {
      const regulation = await prisma.regulation.findUnique({
        where: { id: parseInt(regulationId) },
      });
      if (!regulation) {
        return res
          .status(400)
          .json({ error: "Invalid regulationId, regulation does not exist" });
      }
    }

    const audit = await prisma.audit.create({
      data: {
        type,
        policyId: policyId ? parseInt(policyId) : null,
        regulationId: regulationId ? parseInt(regulationId) : null,
        date: new Date(date),
        findings: [findings],
        correctiveAction: correctiveAction,
        status,
      },
    });

    res.status(201).json({
      message: "Audit created successfully",
      audit,
    });
  } catch (error) {
    console.error("Error creating audit:", error);
    res.status(500).json({ error: "Failed to create audit" });
  }
};

// Get all audits
export const getAllAudits = async (req, res) => {
  try {
    const audits = await prisma.audit.findMany({
      include: {
        policy: {
          select: {
            title: true,
          },
        },
        regulation: {
          select: {
            title: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Audits retrieved successfully",
      audits,
    });
  } catch (error) {
    console.error("Error getting all audits:", error);
    res.status(500).json({ error: "Failed to get all audits" });
  }
};

// Get an audit by ID
export const getAuditById = async (req, res) => {
  const { id } = req.params;
  try {
    const audit = await prisma.audit.findUnique({
      where: { id: parseInt(id) },
      include: {
        policy: {
          select: {
            title: true,
          },
        },
        regulation: {
          select: {
            title: true,
          },
        },
      },
    });
    if (!audit) {
      return res.status(404).json({ error: "Audit not found" });
    }
    res.status(200).json({ audit });
  } catch (error) {
    console.error("Error getting audit by ID:", error);
    res.status(500).json({ error: "Failed to get audit by ID" });
  }
};

// Update an audit
export const updateAudit = async (req, res) => {
  const { id } = req.params;
  const {
    type,
    policyId,
    regulationId,
    date,
    findings,
    correctiveAction,
    status,
  } = req.body;

  try {
    const audit = await prisma.audit.findUnique({
      where: { id: parseInt(id) },
    });
    if (!audit) {
      return res.status(404).json({ error: "Audit not found" });
    }

    const updates = {};

    if (type) res.json({ message: "You cannot update the type of an audit, please create another one" });

    if (policyId) {
      updates.policyId = parseInt(policyId);
      const policy = await prisma.policy.findUnique({
        where: { id: parseInt(policyId) },
      });
      if (!policy) {
        return res
          .status(400)
          .json({ error: "Invalid policyId, policy does not exist" });
      }
    }

    if (regulationId) {
      updates.regulationId = parseInt(regulationId);
      const regulation = await prisma.regulation.findUnique({
        where: { id: parseInt(regulationId) },
      });
      if (!regulation) {
        return res
          .status(400)
          .json({ error: "Invalid regulationId, regulation does not exist" });
      }
    }

    if (date) updates.date = new Date(date);

    if (findings) {
      const currentFindings = audit.findings || [];
      // Allow pushing a single finding or an array
      const newFindings = Array.isArray(findings) ? findings : [findings];
      updates.findings = [...currentFindings, ...newFindings];
    }

    if (correctiveAction) updates.correctiveAction = correctiveAction;

    if (status) updates.status = status;

    const updatedAudit = await prisma.audit.update({
      where: { id: parseInt(id) },
      data: updates,
    });

    res.status(200).json({
      message: "Audit updated successfully",
      updatedAudit,
    });
  } catch (error) {
    console.error("Error updating audit:", error);
    res.status(500).json({ error: "Failed to update audit" });
  }
};

// Delete an audit
export const deleteAudit = async (req, res) => {
  const { id } = req.params;
  try {
    const audit = await prisma.audit.delete({
      where: { id: parseInt(id) },
    });
    if (!audit) {
      return res.status(404).json({ error: "Audit not found" });
    }
    res.status(200).json({ message: "Audit deleted successfully" });
  } catch (error) {
    console.error("Error deleting audit:", error);
    res.status(500).json({ error: "Failed to delete audit" });
  }
};
