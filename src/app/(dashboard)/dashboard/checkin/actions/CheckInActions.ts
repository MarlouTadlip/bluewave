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
  participationId: string,
  eventId: string,
  userId: string
): Promise<void> {
  try {
    // Check if cleanup data exists for this volunteer
    const cleanupData = await prisma.cleanUpData.findFirst({
      where: {
        eventId,
        submittedBy: userId,
      },
    });

    if (!cleanupData) {
      throw new Error("Volunteer must submit cleanup data before checking out");
    }

    await prisma.participation.update({
      where: { participationId },
      data: { checkOutTime: new Date() },
    });
    revalidatePath("/check-in");
  } catch (error) {
    console.error("Error checking out volunteer:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to check out volunteer"
    );
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

export async function updateCleanUpData(
  cleanupId: string,
  categoryId: string,
  totalWeight: number,
  totalBags: number,
  submittedBy: string
): Promise<void> {
  try {
    await prisma.cleanUpData.update({
      where: { cleanupId },
      data: {
        categoryId,
        totalWeight,
        totalBags,
        submittedBy,
        submissionDate: new Date(),
      },
    });
    revalidatePath("/check-in");
  } catch (error) {
    console.error("Error updating cleanup data:", error);
    throw new Error("Failed to update cleanup data");
  }
}

export async function addCleanUpData(eventId: string, formData: FormData): Promise<void> {
  try {
    const categoryId = formData.get("categoryId") as string;
    const totalWeight = parseFloat(formData.get("totalWeight") as string);
    const totalBags = parseInt(formData.get("totalBags") as string);
    const submittedBy = formData.get("submittedBy") as string;
    await submitCleanUpData(eventId, categoryId, totalWeight, totalBags, submittedBy);
  } catch (error) {
    console.error("Error adding cleanup data:", error);
    throw new Error("Failed to add cleanup data");
  }
}

export async function editCleanUpData(cleanupId: string, formData: FormData): Promise<void> {
  try {
    const categoryId = formData.get("categoryId") as string;
    const totalWeight = parseFloat(formData.get("totalWeight") as string);
    const totalBags = parseInt(formData.get("totalBags") as string);
    const submittedBy = formData.get("submittedBy") as string;
    await updateCleanUpData(cleanupId, categoryId, totalWeight, totalBags, submittedBy);
  } catch (error) {
    console.error("Error editing cleanup data:", error);
    throw new Error("Failed to edit cleanup data");
  }
}