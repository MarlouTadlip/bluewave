import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { month, year } = await req.json();

    if (!month || !year) {
      return NextResponse.json(
        { error: "Month and year required" },
        { status: 400 }
      );
    }

    const users = await prisma.user.findMany({
      where: {
        role: "ORGANIZER",
      },
      select: {
        userId: true,
        employeeId: true,
        dailyRate: true,
        attendance: {
          select: {
            id: true,
            employeeId: true,
            date: true,
            attended: true,
          },
        },
      },
    });

    const salaryRecords = await Promise.all(
      users.map(async (user) => {
        const attendedDays = user.attendance.filter(
          (att) =>
            att.attended &&
            att.date.getMonth() + 1 === month &&
            att.date.getFullYear() === year
        ).length;

        const dailyRate = user.dailyRate ?? 0;
        const totalSalary = attendedDays * dailyRate;

        const salaryRecord = await prisma.salaryRecord.upsert({
          where: {
            employeeId_month_year: {
              employeeId: user.employeeId || "",
              month,
              year,
            },
          },
          update: {
            totalDays: attendedDays,
            totalSalary,
          },
          create: {
            employeeId: user.employeeId || "",
            month,
            year,
            totalDays: attendedDays,
            totalSalary,
          },
        });

        return salaryRecord;
      })
    );

    return NextResponse.json(salaryRecords, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error calculating salaries" },
      { status: 500 }
    );
  }
}
