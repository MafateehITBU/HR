import cron from "node-cron";
import { PrismaClient, LeaveType } from "@prisma/client";
const prisma = new PrismaClient();

// Define only ANNUAL and SICK types for yearly accrual
const annualLeaveTypes = {
    [LeaveType.ANNUAL]: "annualLeaveDays",
    [LeaveType.SICK]: "sickLeaveDays"
};

const yearlyLeaveAccrual = () => {
    // Set schedule to run once per year: Jan 1st at 00:00 (midnight)
    cron.schedule("0 0 1 1 *", async () => {
        console.log("Starting yearly leave reset and accrual process...");

        try {
            const companies = await prisma.company.findMany({
                include: {
                    companyRules: true,
                    employees: {
                        include: {
                            leaveBalances: true
                        }
                    }
                }
            });

            for (const company of companies) {
                const rules = company.companyRules;

                if (!rules) {
                    console.warn(`Company ${company.id} (${company.name}) has no CompanyRules defined. Skipping.`);
                    continue;
                }

                const carryOverLimit = rules.maxCarryOverDays;

                if (typeof carryOverLimit !== "number") {
                    console.warn(`Company ${company.id} (${company.name}) has invalid or missing 'maxCarryOverDays'. Skipping carry-over.`);
                    continue;
                }

                for (const emp of company.employees) {
                    console.log(`Processing employee ${emp.id} in company ${company.id}`);

                    for (const [type, ruleField] of Object.entries(annualLeaveTypes)) {
                        const newEntitlement = rules[ruleField];

                        if (typeof newEntitlement !== "number") {
                            console.warn(`Employee ${emp.id}: Missing or invalid entitlement for ${type} (${ruleField}). Skipping.`);
                            continue;
                        }

                        const existingBalance = emp.leaveBalances.find(b => b.leaveType === type);
                        const prevBalance = existingBalance?.balance ?? 0;

                        // Carry-over only applies to ANNUAL/SICK with valid limit
                        let carryOverAmount = Math.min(prevBalance, carryOverLimit);
                        carryOverAmount = Math.max(0, carryOverAmount);

                        const newBalance = newEntitlement;

                        console.log(`Employee ${emp.id}, Type: ${type}, Prev: ${prevBalance}, CarryOver: ${carryOverAmount}, NewEntitlement: ${newEntitlement}, FinalBalance: ${newBalance}`);

                        try {
                            await prisma.leaveBalance.upsert({
                                where: {
                                    employeeId_leaveType: {
                                        employeeId: emp.id,
                                        leaveType: type
                                    }
                                },
                                update: {
                                    balance: newBalance,
                                    entitlement: newBalance,
                                    taken: 0,
                                    carryOverDays: carryOverAmount
                                },
                                create: {
                                    employeeId: emp.id,
                                    leaveType: type,
                                    balance: newBalance,
                                    entitlement: newBalance,
                                    taken: 0,
                                    carryOverDays: carryOverAmount
                                }
                            });
                        } catch (dbError) {
                            console.error(`Failed to upsert leave balance for employee ${emp.id}, type ${type}:`, dbError);
                        }
                    }
                }
            }

            console.log("Yearly leave reset and accrual process completed.");
        } catch (err) {
            console.error("Error during yearly leave accrual cron job:", err);
        }
    });
};

export default yearlyLeaveAccrual;