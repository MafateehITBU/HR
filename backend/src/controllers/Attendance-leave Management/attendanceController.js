import prisma from "../../config/prisma.js";

// Clock-In controller
export const clockIn = async (req, res) => {
    const id = req.user?.id;
    const { clockInMethod, location } = req.body;

    try {
        if (!clockInMethod || !location) {
            return res
                .status(400)
                .json({ message: "Clock-in method and location are required" });
        }

        // Check if the employee exists
        const employee = await prisma.employee.findUnique({
            where: { id },
        });

        if (!employee) {
            return res
                .status(404)
                .json({ message: "Employee not found!" });
        }

        // Check if there's already a clock-in without a clockOutTime
        const existingAttendance = await prisma.attendance.findFirst({
            where: {
                empId: id,
                clockOutTime: null,
            },
        });

        if (existingAttendance) {
            return res.status(409).json({
                message: "You have already clocked in and haven't clocked out yet.",
                attendance: existingAttendance,
            });
        }

        // Create new attendance
        const attendance = await prisma.attendance.create({
            data: {
                empId: id,
                clockInTime: new Date(),
                clockInMethod,
                location,
            },
        });

        res.status(201).json({
            message: "Attendance created successfully",
            attendance,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

// Get all attendances with emp data (name, email)
export const getAllAttendances = async (req, res) => {
    try {
        const attendances = await prisma.attendance.findMany({
            include: {
                employee: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                clockInTime: 'desc',
            },
        });

        res.status(200).json( attendances );
    } catch (error) {
        console.error("Error fetching attendances:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

// Get an attendance by ID with emp data (name, email)
export const getAttendanceById = async (req, res) => {
    const { attendanceId } = req.params;

    try {
        const attendance = await prisma.attendance.findUnique({
            where: { id: parseInt(attendanceId) },
            include: {
                employee: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (!attendance) {
            return res.status(404).json({ message: "Attendance not found" });
        }

        res.status(200).json( attendance );
    } catch (error) {
        console.error("Error fetching attendance by ID:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

// Start Break Controller
export const startBreak = async (req, res) => {
    const userId = req.user?.id;

    try {
        const employee = await prisma.employee.findUnique({
            where: { id: userId },
        });

        if (!employee) {
            return res.status(404).json({ message: "Employee not found!" });
        }

        const attendance = await prisma.attendance.findFirst({
            where: {
                empId: userId,
                clockOutTime: null,
            },
            orderBy: {
                clockInTime: 'desc',
            },
        });

        if (!attendance) {
            return res.status(404).json({ message: "No active attendance record for today." });
        }

        if (attendance.breakStartTime) {
            return res.status(409).json({ message: "Break already started." });
        }

        const updatedAttendance = await prisma.attendance.update({
            where: { id: attendance.id },
            data: {
                breakStartTime: new Date(),
            },
        });

        res.status(200).json({
            message: "Break started successfully.",
            attendance: updatedAttendance,
        });
    } catch (error) {
        console.error("Error starting break:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

// End Break Controller
export const endBreak = async (req, res) => {
    const userId = req.user?.id;

    try {
        const employee = await prisma.employee.findUnique({
            where: { id: userId },
        });

        if (!employee) {
            return res.status(404).json({ message: "Employee not found!" });
        }

        const attendance = await prisma.attendance.findFirst({
            where: {
                empId: userId,
                clockOutTime: null,
            },
            orderBy: {
                clockInTime: 'desc',
            },
        });

        if (!attendance) {
            return res.status(404).json({ message: "No active attendance record for today." });
        }

        if (!attendance.breakStartTime) {
            return res.status(400).json({ message: "You must start the break first!" });
        }

        if (attendance.breakEndTime) {
            return res.status(409).json({ message: "Break already ended." });
        }

        const updatedAttendance = await prisma.attendance.update({
            where: { id: attendance.id },
            data: {
                breakEndTime: new Date(),
            },
        });

        res.status(200).json({
            message: "Break ended successfully.",
            attendance: updatedAttendance,
        });
    } catch (error) {
        console.error("Error ending break:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

// Clock Out Controller
export const clockOut = async (req, res) => {
    const userId = req.user?.id;

    try {
        // Check if the employee exists
        const employee = await prisma.employee.findUnique({
            where: { id: userId },
        });

        if (!employee) {
            return res.status(404).json({ message: "Employee not found!" });
        }

        const attendance = await prisma.attendance.findFirst({
            where: {
                empId: userId,
                clockOutTime: null,
            },
            orderBy: {
                clockInTime: 'desc',
            },
        });

        if (!attendance) {
            return res.status(404).json({ message: "No active clock-in found for today." });
        }

        const now = new Date();

        // Calculate workHours: (clockOut - clockIn) - (breakEnd - breakStart)
        const clockIn = new Date(attendance.clockInTime);
        const breakStart = attendance.breakStartTime ? new Date(attendance.breakStartTime) : null;
        const breakEnd = attendance.breakEndTime ? new Date(attendance.breakEndTime) : null;

        const totalWorkMilliseconds = now - clockIn;

        let breakMilliseconds = 0;
        if (breakStart && breakEnd) {
            breakMilliseconds = breakEnd - breakStart;
        }

        const netWorkMilliseconds = totalWorkMilliseconds - breakMilliseconds;
        const workHours = netWorkMilliseconds / (1000 * 60 * 60); // convert to hours

        // Calculate overtime
        const dailyExpectedHours = employee.weeklyWorkingHours / 6;
        const overtimeHours = workHours - dailyExpectedHours;

        const updatedAttendance = await prisma.attendance.update({
            where: { id: attendance.id },
            data: {
                clockOutTime: now,
                workHours: parseFloat(workHours.toFixed(2)),
                overtimeHours: overtimeHours > 0 ? parseFloat(overtimeHours.toFixed(2)) : 0,
            },
        });

        res.status(200).json({
            message: "Clock-out successful.",
            attendance: updatedAttendance,
        });

    } catch (error) {
        console.error("Error during clock-out:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

// Update an attendance
export const updateAttendance = async (req, res) => {
    const userId = req.user?.id;
    const { attendanceId } = req.params;
    const updateData = req.body;

    try {
        const employee = await prisma.employee.findUnique({
            where: { id: userId },
        });

        if (!employee) {
            return res.status(404).json({ message: "Employee not found!" });
        }

        const attendance = await prisma.attendance.findUnique({
            where: { id: parseInt(attendanceId) },
        });

        if (!attendance || attendance.empId !== userId) {
            return res
                .status(404)
                .json({ message: "Attendance not found or unauthorized" });
        }

        const allowedFields = [
            "clockInTime",
            "clockOutTime",
            "breakStartTime",
            "breakEndTime",
            "clockInMethod",
            "location",
        ];

        const sanitizedData = {};
        let timeFieldsChanged = false;

        for (const key of allowedFields) {
            if (updateData[key] !== undefined) {
                if (
                    ["clockInTime", "clockOutTime", "breakStartTime", "breakEndTime"].includes(
                        key
                    )
                ) {
                    sanitizedData[key] = new Date(updateData[key]);
                    timeFieldsChanged = true;
                } else {
                    sanitizedData[key] = updateData[key];
                }
            }
        }

        if (timeFieldsChanged) {
            const clockIn = sanitizedData.clockInTime || attendance.clockInTime;
            const clockOut = sanitizedData.clockOutTime || attendance.clockOutTime;

            if (clockIn && clockOut) {
                const breakStart =
                    sanitizedData.breakStartTime ?? attendance.breakStartTime;
                const breakEnd =
                    sanitizedData.breakEndTime ?? attendance.breakEndTime;

                const totalWorkMs = new Date(clockOut) - new Date(clockIn);
                let breakMs = 0;

                if (breakStart && breakEnd) {
                    breakMs = new Date(breakEnd) - new Date(breakStart);
                }

                const netMs = totalWorkMs - breakMs;
                const workHours = netMs / (1000 * 60 * 60);

                const dailyExpected = employee.weeklyWorkingHours / 6;
                const overtime = workHours - dailyExpected;

                sanitizedData.workHours = parseFloat(workHours.toFixed(2));
                sanitizedData.overtimeHours = overtime > 0 ? parseFloat(overtime.toFixed(2)) : 0;
            }
        }

        if (Object.keys(sanitizedData).length === 0) {
            return res.status(400).json({ message: "No valid fields provided." });
        }

        const updatedAttendance = await prisma.attendance.update({
            where: { id: attendance.id },
            data: sanitizedData,
        });

        res.status(200).json({
            message: "Attendance updated successfully.",
            attendance: updatedAttendance,
        });
    } catch (error) {
        console.error("Error updating attendance:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};
