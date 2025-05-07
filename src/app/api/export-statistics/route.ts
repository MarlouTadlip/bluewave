import { NextRequest, NextResponse } from "next/server";
import { createObjectCsvStringifier } from "csv-writer";
import { prisma } from "@/lib/db"; // adjust import to your prisma instance path

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const userId = formData.get("userId")?.toString();
  const role = formData.get("role")?.toString();
  const eventId = formData.get("eventId")?.toString();

  if (
    !userId ||
    !role ||
    !["VOLUNTEER", "ORGANIZER", "ADMIN"].includes(role) ||
    !eventId
  ) {
    return new NextResponse("Invalid input data", { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { userId },
    select: { role: true },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  // Fetch event data
  const event = await prisma.event.findUnique({
    where: { eventId },
    include: {
      location: true,
      Participation: {
        include: { user: { select: { fullName: true, isSuspended: true } } },
      },
      cleanUpData: {
        include: {
          category: true,
          User: { select: { fullName: true, isSuspended: true } },
        },
      },
    },
  });

  if (!event) {
    return new NextResponse("Event not found", { status: 404 });
  }

  // Role-based access control
  if (
    role === "VOLUNTEER" &&
    !(await prisma.participation.findFirst({
      where: { eventId, userId, checkOutTime: { not: null } },
    }))
  ) {
    return new NextResponse("Unauthorized access to event data", {
      status: 403,
    });
  } else if (role === "ORGANIZER" && event.organizerId !== userId) {
    return new NextResponse("Unauthorized access to event data", {
      status: 403,
    });
  }

  // Prepare report data
  const participants = event.Participation.filter(
    (p) => !p.user.isSuspended
  ).length;

  const totalHours = event.Participation.filter(
    (p) => !p.user.isSuspended && p.checkInTime && p.checkOutTime
  ).reduce(
    (sum, p) =>
      sum +
      (p.checkOutTime!.getTime() - p.checkInTime!.getTime()) / (1000 * 60 * 60),
    0
  );

  const wasteByCategory = event.cleanUpData
    .filter((d) => !d.User.isSuspended)
    .reduce((acc, data) => {
      acc[data.category.name] =
        (acc[data.category.name] || 0) + data.totalWeight;
      return acc;
    }, {} as Record<string, number>);

  const totalWaste = Object.values(wasteByCategory)
    .reduce((sum, weight) => sum + weight, 0)
    .toFixed(2);

  // Create a single row of data with all the values
  const reportData = {
    "Event Name": event.title,
    Date: event.startDate?.toISOString().split("T")[0] || "N/A",
    Location: event.location.name,
    Participants: participants,
    "Total Hours": totalHours.toFixed(1),
    "Total Waste Collected (kg)": totalWaste,
    // Add waste by category fields
    ...Object.entries(wasteByCategory).reduce((acc, [category, weight]) => {
      acc[`${category} (kg)`] = weight.toFixed(2);
      return acc;
    }, {} as Record<string, string>),
  };

  // Generate CSV with keys as headers and a single row of values
  const csvStringifier = createObjectCsvStringifier({
    header: Object.keys(reportData).map((key) => ({ id: key, title: key })),
  });

  const csvContent =
    csvStringifier.getHeaderString() +
    csvStringifier.stringifyRecords([reportData]);

  const filename = `${event.title.replace(/\s+/g, "_")}_Report_${
    new Date().toISOString().split("T")[0]
  }.csv`;

  // Return the CSV as a response
  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
