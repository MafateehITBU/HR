import prisma from "../../config/prisma.js";

// PUT update a payroll
export const updatePayroll = async (req, res) => {
    const { empId, baseSalary, deductions, payPeriod, bonus } = req.body;

    if (!empId) {
        return res.status(400).json({ message: "Please choose an Employee" });
    }

    // update data dynamically
    const updateData = {};
    if (baseSalary !== undefined) updateData.baseSalary = parseFloat(baseSalary);
    if (deductions !== undefined) updateData.deductions = parseFloat(deductions);
    if (payPeriod !== undefined) updateData.payPeriod = payPeriod;
    if (bonus !== undefined) updateData.bonus = parseFloat(bonus);

    try {
        // Confirm employee exists
        const employee = await prisma.employee.findUnique({
            where: { id: parseInt(empId) },
        });

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const payroll = await prisma.payroll.findFirst({
            where: { empId: parseInt(empId) },
        });

        if (!payroll) {
            return res.status(404).json({ message: "Payroll not found for this employee" });
        }

        const updatedPayroll = await prisma.payroll.update({
            where: { id: payroll.id },
            data: updateData,
        });

        res.status(200).json({
            message: "Payroll updated successfully",
            updatedPayroll,
        });

    } catch (error) {
        console.error("Error Updating Payroll:", error);
        res.status(500).json({ message: "Error updating payroll", error: error.message });
    }
};

// GET all payrolls with employee name
export const getAllPayrolls = async (req, res) => {
    try {
        const payrolls = await prisma.payroll.findMany({
            include: {
                employee: {
                    select: {
                        name: true
                    }
                }
            }
        });

        // Format response to include employee name directly
        const formattedPayrolls = payrolls.map(payroll => ({
            id: payroll.id,
            empId: payroll.empId,
            employeeName: payroll.employee?.name || "Unknown",
            baseSalary: payroll.baseSalary,
            deductions: payroll.deductions,
            bonus: payroll.bonus,
            payPeriod: payroll.payPeriod,
            netPay: payroll.netPay
        }));

        res.status(200).json(formattedPayrolls);
    } catch (error) {
        console.error("Error fetching payrolls:", error);
        res.status(500).json({ message: "Failed to fetch payrolls" });
    }
};

// GET a payroll by ID
export const getPayrollByID = async (req, res) => {
    const { payrollId } = req.params;

    try {
        const payroll = await prisma.payroll.findUnique({
            where: { id: parseInt(payrollId) },
            include: {
                employee: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if (!payroll) {
            return res.status(404).json({ message: "Payroll not found" });
        }

        // Format response to include employee name directly
        const formattedPayroll = {
            id: payroll.id,
            empId: payroll.empId,
            employeeName: payroll.employee?.name || "Unknown",
            baseSalary: payroll.baseSalary,
            deductions: payroll.deductions,
            bonus: payroll.bonus,
            payPeriod: payroll.payPeriod,
            netPay: payroll.netPay
        };

        res.status(200).json(formattedPayroll);
    } catch (error) {
        console.error("Error fetching payroll:", error);
        res.status(500).json({ message: "Failed to fetch payroll" });
    }
};