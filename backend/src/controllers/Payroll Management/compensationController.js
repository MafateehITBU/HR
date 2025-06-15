import prisma from "../../config/prisma.js";

// Create a new compensation
export const createCompensation = async (req, res) => {
    const { empId, benefit, amount, effectiveDate } = req.body;

    if (!empId || !benefit || amount == null || !effectiveDate) {
        return res.status(400).json({ message: "Please fill all required fields" });
    }

    if (Number(amount) <= 0) {
        return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const validBenefits = ["HEALTH_INSURANCE", "RETIREMENT_CONTRIBUTIONS", "TRANSPORTATION"];
    if (!validBenefits.includes(benefit)) {
        return res.status(400).json({
            message: `Invalid benefit type. Valid options are: ${validBenefits.join(", ")}`
        });
    }

    try {
        const employee = await prisma.employee.findUnique({
            where: { id: parseInt(empId) },
        });

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const existingComp = await prisma.compensation.findFirst({
            where: {
                empId: parseInt(empId),
                benefit,
            },
        });

        if (existingComp) {
            return res.status(409).json({
                message: `Compensation for '${benefit}' already exists for this employee.`,
                existingCompensation: existingComp,
            });
        }

        const compensation = await prisma.compensation.create({
            data: {
                empId: employee.id,
                benefit,
                amount: Number(amount),
                effectiveDate: new Date(effectiveDate),
                effective: true,
            },
        });

        res.status(201).json({
            message: "Compensation created successfully",
            compensation,
        });
    } catch (error) {
        console.error("Error creating compensation:", error);
        res.status(500).json({ message: "Internal server error while creating compensation" });
    }
};

// Get all compensations grouped by employee with employee name
export const getAllCompensationsGrouped = async (req, res) => {
    try {
        const compensations = await prisma.compensation.findMany({
            include: {
                employee: {
                    select: { name: true }
                }
            }
        });

        const grouped = compensations.reduce((acc, comp) => {
            const empId = comp.empId;
            if (!acc[empId]) {
                acc[empId] = {
                    empId,
                    employeeName: comp.employee?.name || "Unknown",
                    compensations: []
                };
            }
            acc[empId].compensations.push({
                id: comp.id,
                benefit: comp.benefit,
                amount: comp.amount,
                effectiveDate: comp.effectiveDate,
                effective: comp.effective
            });
            return acc;
        }, {});

        res.status(200).json(Object.values(grouped));
    } catch (error) {
        console.error("Error fetching compensations:", error);
        res.status(500).json({ message: "Failed to fetch compensations" });
    }
};

// Update a compensation by ID (only provided fields)
export const updateCompensation = async (req, res) => {
    const { compensationId } = req.params;
    const { benefit, amount, effectiveDate } = req.body;

    try {
        const existing = await prisma.compensation.findUnique({
            where: { id: parseInt(compensationId) }
        });

        if (!existing) {
            return res.status(404).json({ message: "Compensation not found" });
        }

        const data = {};
        if (benefit) data.benefit = benefit;
        if (amount != null) {
            if (Number(amount) <= 0) {
                return res.status(400).json({ message: "Amount must be greater than 0" });
            }
            data.amount = Number(amount);
        }
        if (effectiveDate) data.effectiveDate = new Date(effectiveDate);

        const updated = await prisma.compensation.update({
            where: { id: parseInt(compensationId) },
            data
        });

        res.status(200).json({ message: "Compensation updated", updated });
    } catch (error) {
        console.error("Error updating compensation:", error);
        res.status(500).json({ message: "Internal server error while updating compensation" });
    }
};

// Toggle effective (by ID)
export const toggleCompensationEffective = async (req, res) => {
    const { compensationId } = req.params;

    try {
        const comp = await prisma.compensation.findUnique({
            where: { id: parseInt(compensationId) }
        });

        if (!comp) {
            return res.status(404).json({ message: "Compensation not found" });
        }

        const updated = await prisma.compensation.update({
            where: { id: comp.id },
            data: { effective: !comp.effective }
        });

        res.status(200).json({
            message: `Compensation is now ${updated.effective ? "active" : "inactive"}`,
            updated
        });
    } catch (error) {
        console.error("Error toggling compensation:", error);
        res.status(500).json({ message: "Failed to toggle compensation status" });
    }
};

// Delete a compensation (by ID)
export const deleteCompensation = async (req, res) => {
    const { compensationId } = req.params;

    try {
        const deleted = await prisma.compensation.delete({
            where: { id: parseInt(compensationId) }
        });

        res.status(200).json({ message: "Compensation deleted successfully", deleted });
    } catch (error) {
        console.error("Error deleting compensation:", error);
        res.status(500).json({ message: "Failed to delete compensation" });
    }
};