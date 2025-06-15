import prisma from "../../config/prisma.js";

// Generate a Payslip (Create new one)
export const createPayslip = async (req, res) => {
    const { empId } = req.body;

    if (!empId) {
        return res.status(400).json({ message: "Employee ID is required" });
    }

    try {
        const payroll = await prisma.payroll.findFirst({
            where: { empId: parseInt(empId) },
        });

        if (!payroll) {
            return res.status(404).json({ message: "Payroll not found for this employee" });
        }

        const payslip = await prisma.payslip.create({
            data: {
                empId: parseInt(empId),
                dateIssued: new Date(),
                payrollId: payroll.id,
            },
            include: {
                employee: true,
                payroll: true,
            },
        });

        res.status(201).json({ message: "Payslip generated", payslip });
    } catch (error) {
        console.error("Error creating payslip:", error);
        res.status(500).json({ message: "Failed to create payslip", error: error.message });
    }
};

// Get all Payslips
export const getAllPayslips = async (req, res) => {
    try {
        const payslips = await prisma.payslip.findMany({
            include: {
                employee: true,
                payroll: true,
            },
            orderBy: {
                dateIssued: 'desc',
            },
        });

        res.status(200).json(payslips);
    } catch (error) {
        console.error("Error fetching payslips:", error);
        res.status(500).json({ message: "Failed to fetch payslips", error: error.message });
    }
};

// Get Payslips by Employee ID
export const getPayslipsByEmployee = async (req, res) => {
    const { empId } = req.params;

    try {
        const payslips = await prisma.payslip.findMany({
            where: { empId: parseInt(empId) },
            include: {
                payroll: true,
            },
            orderBy: {
                dateIssued: 'desc',
            },
        });

        res.status(200).json(payslips);
    } catch (error) {
        console.error("Error fetching employee payslips:", error);
        res.status(500).json({ message: "Failed to fetch payslips", error: error.message });
    }
};

// Get Payslip by ID
export const getPayslipById = async (req, res) => {
    const { id } = req.params;

    try {
        const payslip = await prisma.payslip.findUnique({
            where: { id: parseInt(id) },
            include: {
                employee: true,
                payroll: true,
            },
        });

        if (!payslip) {
            return res.status(404).json({ message: "Payslip not found" });
        }

        res.status(200).json(payslip);
    } catch (error) {
        console.error("Error fetching payslip:", error);
        res.status(500).json({ message: "Failed to fetch payslip", error: error.message });
    }
};

// Delete a Payslip by ID
export const deletePayslip = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await prisma.payslip.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ message: "Payslip deleted", deleted });
    } catch (error) {
        console.error("Error deleting payslip:", error);
        res.status(500).json({ message: "Failed to delete payslip", error: error.message });
    }
};
