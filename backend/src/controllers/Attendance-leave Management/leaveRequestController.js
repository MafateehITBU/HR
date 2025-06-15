import prisma from "../../config/prisma.js";
import fs from "fs";
import { uploadToCloudinary } from "../../utils/cloudinary.js";

// Create a leave Request
export const createLeaveRequest = async (req, res) => {
    const empId = req.user.id;
    const { leaveType, startDate, endDate, leaveReason } = req.body;

    // Validate requested fields
    if (!leaveType || !startDate || !endDate) {
        return res.status(400).json({ message: "Please Fill all requested fields." });
    }

    // Check if there's an image uploaded for sick leaveType
    let sickLeaveImgURL = null;
    if (leaveType === 'SICK' && req.file) {
        try {
            sickLeaveImgURL = await uploadToCloudinary(req.file.path);
            // Delete the local file after uploading
            fs.unlinkSync(req.file.path);
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Failed to upload Sick leave picture" });
        }
    }

    try {
        // Check if the employee exists
        const employee = await prisma.employee.findUnique({
            where: { id: empId },
        });

        if (!employee) {
            return res
                .status(404)
                .json({ message: "Employee not found!" });
        }

        // Get the employee departemnt head ID
        const depID = employee.depID;
        const department = await prisma.department.findUnique({
            where: { id: depID },
        });

        if (!department) {
            return res
                .status(404)
                .json({ message: "Department not found!" });
        }

        const depHeadID = department.departmentHeadID;

        // Create new Leave Request
        const leaveRequest = await prisma.leaveRequest.create({
            data: {
                empId: empId,
                approvalEmpId: depHeadID,
                leaveType: leaveType,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                leaveReason: leaveReason || null,
                sickLeaveImg: sickLeaveImgURL || null
            }
        })

        return res.status(201).json({
            message: "Leave Request Created successfully",
            leaveRequest
        });
    } catch (error) {
        console.log("Error creating leave Request: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Get All leave Requests (with the emp Name and approvalEmpId)
export const getAllLeaveRequests = async (req, res) => {
    try {
        const leaveRequests = await prisma.leaveRequest.findMany({
            include: {
                requester: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                approver: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        res.status(200).json(leaveRequests);
    } catch (error) {
        console.error("Error fetching leave requests:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Leave requiest by ID (with the emp Name and approvalEmpId)
export const getLeaveRequestById = async (req, res) => {
    const { id } = req.params;

    try {
        const leaveRequest = await prisma.leaveRequest.findUnique({
            where: { id: parseInt(id) },
            include: {
                requester: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                approver: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!leaveRequest) {
            return res.status(404).json({ message: "Leave request not found" });
        }

        res.status(200).json(leaveRequest);
    } catch (error) {
        console.error("Error fetching leave request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Helper function to create or update PAID_BY_EMPLOYEE balance
const handlePaidByEmployeeFallback = async (empId, leaveDays) => {
    let paidBalance = await prisma.leaveBalance.findFirst({
        where: {
            employeeId: empId,
            leaveType: "PAID_BY_EMPLOYEE",
        },
    });

    if (!paidBalance) {
        await prisma.leaveBalance.create({
            data: {
                employeeId: empId,
                leaveType: "PAID_BY_EMPLOYEE",
                balance: 0,
                taken: leaveDays,
            },
        });
    } else {
        await prisma.leaveBalance.update({
            where: { id: paidBalance.id },
            data: {
                taken: paidBalance.taken + leaveDays,
            },
        });
    }
};

// Approve/Reject a leave request
export const approveLeaveRequest = async (req, res) => {
    const approverId = req.user.id;
    const { id } = req.params;
    const { approval } = req.body; // "APPROVED" or "REJECTED"

    try {
        const leaveRequest = await prisma.leaveRequest.findUnique({
            where: { id: parseInt(id) },
        });

        if (!leaveRequest) {
            return res.status(404).json({ message: "Leave request not found." });
        }

        if (approverId !== leaveRequest.approvalEmpId) {
            return res.status(403).json({
                message: "You are not authorized to approve/reject this leave request.",
            });
        }

        if (leaveRequest.status !== "UNDER_CONSIDERATION") {
            return res.status(400).json({ message: "Action denied. This leave request has already been processed." });
        }

        if (approval === "REJECTED") {
            await prisma.leaveRequest.update({
                where: { id: parseInt(id) },
                data: { status: "REJECTED" },
            });
            return res.status(200).json({ message: "Leave request rejected." });
        }

        // Calculate the number of leave days
        const leaveDays =
            (new Date(leaveRequest.endDate) - new Date(leaveRequest.startDate)) /
            (1000 * 60 * 60 * 24);

        const { empId, leaveType } = leaveRequest;

        let leaveBalance = await prisma.leaveBalance.findFirst({
            where: {
                employeeId: empId,
                leaveType: leaveType,
            },
        });

        // Deduct leave based on leave type
        if (leaveType === "ANNUAL") {
            if (leaveBalance && leaveBalance.carryOverDays >= leaveDays) {
                await prisma.leaveBalance.update({
                    where: { id: leaveBalance.id },
                    data: {
                        carryOverDays: leaveBalance.carryOverDays - leaveDays,
                        taken: leaveBalance.taken + leaveDays,
                    },
                });
            } else if (leaveBalance && leaveBalance.balance >= leaveDays) {
                await prisma.leaveBalance.update({
                    where: { id: leaveBalance.id },
                    data: {
                        balance: leaveBalance.balance - leaveDays,
                        taken: leaveBalance.taken + leaveDays,
                    },
                });
            } else {
                await handlePaidByEmployeeFallback(empId, leaveDays);
            }
        } else if (leaveType === "SICK" || leaveType === "LEAVE") {
            if (leaveBalance && leaveBalance.carryOverDays >= leaveDays) {
                await prisma.leaveBalance.update({
                    where: { id: leaveBalance.id },
                    data: {
                        carryOverDays: leaveBalance.carryOverDays - leaveDays,
                        taken: leaveBalance.taken + leaveDays,
                    },
                });
            } else if (leaveBalance && leaveBalance.balance >= leaveDays) {
                await prisma.leaveBalance.update({
                    where: { id: leaveBalance.id },
                    data: {
                        balance: leaveBalance.balance - leaveDays,
                        taken: leaveBalance.taken + leaveDays,
                    },
                });
            } else {
                // Try using ANNUAL leave if available
                const annualBalance = await prisma.leaveBalance.findFirst({
                    where: {
                        employeeId: empId,
                        leaveType: "ANNUAL",
                    },
                });

                if (annualBalance && annualBalance.balance >= leaveDays) {
                    await prisma.leaveBalance.update({
                        where: { id: annualBalance.id },
                        data: {
                            balance: annualBalance.balance - leaveDays,
                            taken: annualBalance.taken + leaveDays,
                        },
                    });
                } else {
                    await handlePaidByEmployeeFallback(empId, leaveDays);
                }
            }
        }

        // Final status update
        await prisma.leaveRequest.update({
            where: { id: parseInt(id) },
            data: { status: "APPROVED" },
        });

        res.status(200).json({ message: "Leave request approved successfully." });
    } catch (error) {
        console.error("Error approving leave request:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};