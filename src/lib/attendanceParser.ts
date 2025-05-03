import * as XLSX from "xlsx";

export function parseAttendanceExcel(
  buffer: Buffer,
  filename: string | undefined
) {
  const workbook = XLSX.read(buffer, { type: "buffer" });

  const summarySheetName = workbook.SheetNames[0];
  const summarySheet = workbook.Sheets[summarySheetName];
  const summaryData: (string | number | null)[][] = XLSX.utils.sheet_to_json(
    summarySheet,
    { header: 1, raw: false }
  );

  let year = 0,
    month = 0,
    day = 1;

  // Extract date from header (e.g., "Date: 2025/05/01 ~ 05/01")
  for (let i = 0; i < Math.min(2, summaryData.length); i++) {
    const row = summaryData[i];
    for (let j = 0; j < row.length; j++) {
      const cell = String(row[j] || "").trim();
      const dateMatch = cell.match(/Date:\s*(\d{4})\/(\d{2})\/(\d{2})/);
      if (dateMatch) {
        year = parseInt(dateMatch[1], 10);
        month = parseInt(dateMatch[2], 10);
        day = parseInt(dateMatch[3], 10);
        console.log(`Extracted date from header: ${year}-${month}-${day}`);
        break;
      }
    }
    if (year > 0 && month > 0 && day > 0) break;
  }

  // Fallback to filename if date not found in header
  if (year === 0 || month === 0 || day === 0) {
    if (filename && filename.includes("_")) {
      const parts = filename.split("_");
      if (parts.length >= 3) {
        year = parseInt(parts[1], 10);
        month = parseInt(parts[2], 10);
      }
    }
  }

  // Final fallback to current date
  if (year === 0 || month === 0 || day === 0) {
    const now = new Date();
    year = now.getFullYear();
    month = now.getMonth() + 1;
    day = now.getDate();
    console.log(`Fallback to current date: ${year}-${month}-${day}`);
  }

  // Validate and create date
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    throw new Error(`Invalid date extracted: ${year}-${month}-${day}`);
  }
  const date = new Date(year, month - 1, day, 0, 0, 0); // Set to midnight to avoid timezone shifts
  console.log(`Constructed date: ${date.toISOString()}`);

  const attendanceRecords: {
    employeeId: string;
    date: Date;
    attended: boolean;
  }[] = [];

  for (let i = 2; i < summaryData.length; i++) {
    const row = summaryData[i];
    const employeeId = row[0];
    const attendStatus = row[11];

    if (employeeId && attendStatus && String(attendStatus).trim() === "1/1") {
      attendanceRecords.push({
        employeeId: String(employeeId),
        date: new Date(date), // Use the constructed date
        attended: true,
      });
      console.log(
        `Added record: employeeId=${employeeId}, date=${new Date(
          date
        ).toISOString()}`
      );
    }
  }

  console.log(`Total records parsed: ${attendanceRecords.length}`);
  return attendanceRecords;
}
