"use server";
import { prisma } from "@/lib/db";

export async function joinEvent(eventId: string, userId: string) {
  // Debug log to confirm server-side execution
  console.log("Executing joinEvent on server:", { eventId, userId });

  try {
    if (!prisma) {
      throw new Error("PrismaClient is not initialized");
    }

    const existingParticipation = await prisma.participation.findFirst({
      where: {
        userId,
        eventId,
      },
    });

    if (existingParticipation) {
      return {
        success: false,
        message: "You are already registered for this event.",
      };
    }

    await prisma.participation.create({
      data: {
        userId,
        eventId,
      },
    });

    return { success: true, message: "Successfully joined the event!" };
  } catch (error) {
    console.error("Error joining event:", error);
    return {
      success: false,
      message: "Failed to join the event. Please try again later.",
    };
  }
}
