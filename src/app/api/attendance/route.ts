import { NextResponse } from "next/server";
import { parseAttendanceExcel } from "@/lib/attendanceParser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name || undefined;

    // Log file details for debugging
    console.log(`Processing file: ${filename}, size: ${file.size}`);

    const records = parseAttendanceExcel(buffer, filename);

    // Log parsed records count
    console.log(`Parsed ${records.length} attendance records`);

    const attendanceData = records.map((record) => ({
      employeeId: record.employeeId,
      date: record.date,
      attended: record.attended,
    }));

    for (const record of attendanceData) {
      // Log each record being processed
      console.log(
        `Checking attendance for employeeId: ${record.employeeId}, date: ${record.date}`
      );

      const existing = await prisma.attendance.findFirst({
        where: {
          employeeId: record.employeeId,
          date: record.date,
        },
      });

      if (!existing) {
        await prisma.attendance.create({
          data: record,
        });
        console.log(
          `Created attendance record for employeeId: ${record.employeeId}`
        );
      } else {
        console.log(
          `Skipping duplicate attendance for employeeId: ${record.employeeId}`
        );
      }
    }

    return NextResponse.json(
      { message: "Attendance uploaded successfully" },
      { status: 200 }
    );
  } catch (error) {
    // Enhanced error logging
    console.error("Error in /api/attendance:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error: "Error processing attendance",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
