import prisma from "../../config/prisma.js";

// Get the 3 types of leave balances for a user (LEAVE, SICK, ANNUAL)
export const getLeaveBalances = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Fetch leave balances for the user
        const leaveBalances = await prisma.leaveBalance.findMany({
            where: { employeeId: parseInt(userId) }
        });

        if (!leaveBalances || leaveBalances.length === 0) {
            return res.status(404).json({ message: "No leave balances found" });
        }

        res.status(200).json(leaveBalances);
    } catch (error) {
        console.error("Error fetching leave balances:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update a leave balance for an Employee
export const updateLeaveBalance = async (req, res) => {
    try {
        const { userId } = req.params;
        const { leaveType, balance, entitlement, taken } = req.body;

        if (!userId || !leaveType ) {
            return res.status(400).json({ message: "User ID and leave type are required" });
        }

        // Update the leave balance for the user (only the provided data in the request body)
        let updateData = {};
        if (balance !== undefined) updateData.balance = balance;
        if (entitlement !== undefined) updateData.entitlement = entitlement;
        if (taken !== undefined) updateData.taken = taken;
        
        const updatedLeaveBalance = await prisma.leaveBalance.update({
            where: {
                employeeId_leaveType: {
                    employeeId: parseInt(userId),
                    leaveType: leaveType
                }
            },
            data: updateData
        });

        res.status(200).json(updatedLeaveBalance);
    } catch (error) {
        console.error("Error updating leave balance:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};