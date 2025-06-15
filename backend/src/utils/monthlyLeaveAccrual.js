import cron from "node-cron";
import { PrismaClient, LeaveType } from "@prisma/client";
const prisma = new PrismaClient();

const monthlyLeaveAccrual = () => {
    cron.schedule('0 0 1 * *', async () => {
        try {
            const today = new Date();
            const currentMonth = today.getMonth();
            const prevMonthStart = new Date(today.getFullYear(), currentMonth - 1, 1);
            const prevMonthEnd = new Date(today.getFullYear(), currentMonth, 0);
            const daysInPrevMonth = prevMonthEnd.getDate();

            const companies = await prisma.company.findMany({
                include: {
                    companyRules: true,
                    employees: {
                        include: { leaveBalances: true }
                    }
                }
            });

            for (const company of companies) {
                const rules = company.companyRules;
                if (!rules) continue;

                for (const emp of company.employees) {
                    const hireDate = new Date(emp.hireDate);
                    if (hireDate > prevMonthEnd) continue; // he's been hired this month

                    for (const type of [LeaveType.ANNUAL, LeaveType.SICK, LeaveType.LEAVE]) {
                        const balanceRecord = emp.leaveBalances.find(lb => lb.leaveType === type);
                        if (!balanceRecord) continue;

                        if (type === LeaveType.LEAVE) {
                            const leavesDays = rules.leavesDays;
                            if (typeof leavesDays !== 'number') continue;

                            await prisma.leaveBalance.update({
                                where: {
                                    employeeId_leaveType: {
                                        employeeId: emp.id,
                                        leaveType: type
                                    }
                                },
                                data: {
                                    balance: leavesDays,
                                    entitlement: leavesDays
                                }
                            });
                        } else {
                            const annualDays = rules[`${type.toLowerCase()}LeaveDays`];
                            if (typeof annualDays !== 'number') continue;

                            const accrualRate = annualDays / 12;
                            let addedLeave = accrualRate;

                            if (hireDate > prevMonthStart && hireDate <= prevMonthEnd) {
                                const daysWorked = prevMonthEnd.getDate() - hireDate.getDate() + 1;
                                addedLeave = (daysWorked / daysInPrevMonth) * accrualRate;
                            }

                            await prisma.leaveBalance.update({
                                where: {
                                    employeeId_leaveType: {
                                        employeeId: emp.id,
                                        leaveType: type
                                    }
                                },
                                data: {
                                    balance: {
                                        increment: parseFloat(addedLeave.toFixed(2))
                                    },
                                    entitlement: {
                                        increment: parseFloat(addedLeave.toFixed(2))
                                    }
                                }
                            });
                        }
                    }
                }
            }

            console.log("Monthly leave accrual done for all companies.");
        } catch (err) {
            console.error("Monthly cron error:", err);
        }
    });
};

export default monthlyLeaveAccrual;