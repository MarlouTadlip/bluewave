"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function checkInVolunteer(participationId: string): Promise<void> {
  try {
    await prisma.participation.update({
      where: { participationId },
      data: { checkInTime: new Date() },
    });
    revalidatePath("/check-in");
  } catch (error) {
    console.error("Error checking in volunteer:", error);
    throw new Error("Failed to check in volunteer");
  }
}

export async function checkOutVolunteer(
  participationId: string
): Promise<void> {
  try {
    await prisma.participation.update({
      where: { participationId },
      data: { checkOutTime: new Date() },
    });
    revalidatePath("/check-in");
  } catch (error) {
    console.error("Error checking out volunteer:", error);
    throw new Error("Failed to check out volunteer");
  }
}

export async function submitCleanUpData(
  eventId: string,
  categoryId: string,
  totalWeight: number,
  totalBags: number,
  submittedBy: string
): Promise<void> {
  try {
    await prisma.cleanUpData.create({
      data: {
        eventId,
        categoryId,
        totalWeight,
        totalBags,
        submittedBy,
        submissionDate: new Date(),
      },
    });
    revalidatePath("/check-in");
  } catch (error) {
    console.error("Error submitting cleanup data:", error);
    throw new Error("Failed to submit cleanup data");
  }
}
