import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient();

const monthlyPayroll = () => {
    // Change the cron based on the company rule (payroll date)
    cron.schedule("0 0 1 * *", async () => {
        try {
            console.log("Running monthly payroll...");
            const startOfMonth = dayjs().startOf("month").toDate();
            const endOfMonth = dayjs().endOf("month").toDate();

            const employees = await prisma.employee.findMany({
                include: {
                    payrolls: true,
                    Attendance: {
                        where: {
                            clockInTime: {
                                gte: startOfMonth,
                                lte: endOfMonth,
                            },
                        },
                    },
                    bonuses: {
                        where: {
                            createdAt: {
                                gte: startOfMonth,
                                lte: endOfMonth,
                            },
                        },
                    },
                    compensations: {
                        where: {
                            effectiveDate: {
                                gte: startOfMonth,
                                lte: endOfMonth,
                            },
                        },
                    },
                },
            });

            const updatedPayrolls = [];

            for (const emp of employees) {
                const { id, weeklyWorkingHours, payrolls, bonuses, compensations, Attendance } = emp;

                const payroll = payrolls[0];

                const baseSalary = payroll?.baseSalary || 0;
                const deductions = payroll?.deductions || 0;
                const payPeriod = payroll?.payPeriod || "MONTHLY";

                let overtimeHours = 0;
                Attendance.forEach((att) => {
                    if (att.overtimeHours) overtimeHours += att.overtimeHours;
                });

                const hourlyRate = weeklyWorkingHours
                    ? baseSalary / weeklyWorkingHours
                    : 0;

                const overtimePay = hourlyRate * overtimeHours;

                let bonusSum = bonuses.reduce((acc, b) => acc + b.bonusAmount + b.commissionAmount, 0);
                let compensationSum = compensations.reduce((acc, c) => acc + c.amount, 0);

                const netPay = baseSalary - deductions + bonusSum + compensationSum + overtimePay;

                const updated = await prisma.payroll.updateMany({
                    where: { empId: id },
                    data: {
                        bonus: bonusSum,
                        compensation: compensationSum,
                        netPay,
                    },
                });

                updatedPayrolls.push({ employeeId: id, netPay });
            }

            console.log("Monthly payroll run completed:", updatedPayrolls);
        } catch (error) {
            console.error("Error running payroll:", error);
        }
    })
};

const monthlyPayrollCleanUp = () => {
    cron.schedule("0 0 1 * *", async () => {
        try {
            console.log("Resetting payrolls at midnight on the 1st...");

            const payrolls = await prisma.payroll.findMany();

            for (const p of payrolls) {
                await prisma.payroll.update({
                    where: { id: p.id },
                    data: {
                        deductions: 0,
                        bonus: 0,
                        compensation: 0,
                        netPay: 0,
                    },
                });
            }

            console.log("Payrolls reset successfully.");
        } catch (err) {
            console.error("Error resetting payrolls:", err);
        }
    })
};

export default {
    monthlyPayroll,
    monthlyPayrollCleanUp,
};