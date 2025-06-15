import prisma from "../../config/prisma.js";

// Create a new bonus
export const createBonus = async (req, res) => {
    const {
        empId,
        bonusAmount,
        commissionAmount = 0,
        incentiveType,
        incentivePeriod,
        incentiveReason,
    } = req.body;

    if (!empId || !bonusAmount || !incentiveType || !incentivePeriod) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const parsedEmpId = parseInt(empId);

        // Create the Bonus entry
        const bonus = await prisma.bonus.create({
            data: {
                empId: parsedEmpId,
                bonusAmount: parseFloat(bonusAmount),
                commissionAmount: parseFloat(commissionAmount),
                incentiveType,
                incentivePeriod,
                incentiveReason,
            },
        });

        res.status(201).json({
            message: "Bonus created and payroll updated",
            bonus,
        });
    } catch (error) {
        console.error("Error creating bonus and updating payroll:", error);
        res.status(500).json({ message: "Failed to create bonus", error: error.message });
    }
};

// Get all bonuses
export const getAllBonuses = async (req, res) => {
    try {
        const bonuses = await prisma.bonus.findMany({
            include: { employee: true },
            orderBy: { createdAt: 'desc' },
        });

        res.status(200).json(bonuses);
    } catch (error) {
        console.error("Error fetching bonuses:", error);
        res.status(500).json({ message: "Failed to fetch bonuses", error: error.message });
    }
};

// Get bonuses by employee ID
export const getBonusesByEmployee = async (req, res) => {
    const { empId } = req.params;

    try {
        const bonuses = await prisma.bonus.findMany({
            where: { empId: parseInt(empId) },
            orderBy: { createdAt: 'desc' },
        });

        res.status(200).json(bonuses);
    } catch (error) {
        console.error("Error fetching bonuses for employee:", error);
        res.status(500).json({ message: "Failed to fetch bonuses", error: error.message });
    }
};

// Get a bonus by ID
export const getBonusById = async (req, res) => {
    const { id } = req.params;

    try {
        const bonus = await prisma.bonus.findUnique({
            where: { id: parseInt(id) },
            include: { employee: true },
        });

        if (!bonus) {
            return res.status(404).json({ message: "Bonus not found" });
        }

        res.status(200).json(bonus);
    } catch (error) {
        console.error("Error fetching bonus:", error);
        res.status(500).json({ message: "Failed to fetch bonus", error: error.message });
    }
};

// Update a bonus by ID
export const updateBonus = async (req, res) => {
    const { id } = req.params;
    const {
        bonusAmount,
        commissionAmount,
        incentiveType,
        incentivePeriod,
        incentiveReason,
    } = req.body;

    try {
        const updated = await prisma.bonus.update({
            where: { id: parseInt(id) },
            data: {
                bonusAmount: bonusAmount !== undefined ? parseFloat(bonusAmount) : undefined,
                commissionAmount: commissionAmount !== undefined ? parseFloat(commissionAmount) : undefined,
                incentiveType,
                incentivePeriod,
                incentiveReason,
            },
        });

        res.status(200).json({ message: "Bonus updated", updated });
    } catch (error) {
        console.error("Error updating bonus:", error);
        res.status(500).json({ message: "Failed to update bonus", error: error.message });
    }
};

// Delete a bonus by ID
export const deleteBonus = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await prisma.bonus.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ message: "Bonus deleted", deleted });
    } catch (error) {
        console.error("Error deleting bonus:", error);
        res.status(500).json({ message: "Failed to delete bonus", error: error.message });
    }
};