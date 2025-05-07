"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createSponsor(
  eventId: string,
  formData: FormData
): Promise<void> {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const image = formData.get("image") as string;
    const amount = parseFloat(formData.get("amount") as string);

    // Validate email ends with .com
    if (!email.endsWith(".com")) {
      throw new Error("Email must end with .com");
    }

    // Validate amount
    if (isNaN(amount) || amount < 0) {
      throw new Error("Amount must be a non-negative number");
    }

    // Create new sponsor
    const sponsor = await prisma.sponsor.create({
      data: {
        name,
        email,
        phoneNumber,
        image: image || "",
      },
    });

    // Link sponsor to event with amount
    await prisma.eventSponsor.create({
      data: {
        eventId,
        sponsorId: sponsor.sponsorId,
        amount,
      },
    });

    revalidatePath("/sponsors");
  } catch (error) {
    console.error("Error creating sponsor:", error);
    throw new Error("Failed to create sponsor");
  }
}

export async function linkSponsorToEvent(
  eventId: string,
  formData: FormData
): Promise<void> {
  try {
    const sponsorId = formData.get("sponsorId") as string;
    const amount = parseFloat(formData.get("amount") as string);

    // Validate amount
    if (isNaN(amount) || amount < 0) {
      throw new Error("Amount must be a non-negative number");
    }

    // Check if the sponsor is already linked to the event
    const existingLink = await prisma.eventSponsor.findFirst({
      where: { eventId, sponsorId },
    });

    if (existingLink) {
      throw new Error("Sponsor is already assigned to this event");
    }

    await prisma.eventSponsor.create({
      data: {
        eventId,
        sponsorId,
        amount,
      },
    });
    revalidatePath("/sponsors");
  } catch (error) {
    console.error("Error linking sponsor to event:", error);
    throw new Error("Failed to link sponsor to event");
  }
}

export async function updateEventSponsor(
  eventSponsorId: string,
  formData: FormData
): Promise<void> {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const image = formData.get("image") as string;
    const amount = parseFloat(formData.get("amount") as string);

    // Validate email ends with .com
    if (!email.endsWith(".com")) {
      throw new Error("Email must end with .com");
    }

    // Validate amount
    if (isNaN(amount) || amount < 0) {
      throw new Error("Amount must be a non-negative number");
    }

    // Find the EventSponsor to get the sponsorId
    const eventSponsor = await prisma.eventSponsor.findUnique({
      where: { eventSponsorId },
      select: { sponsorId: true },
    });

    if (!eventSponsor) {
      throw new Error("EventSponsor not found");
    }

    // Update sponsor details
    await prisma.sponsor.update({
      where: { sponsorId: eventSponsor.sponsorId },
      data: {
        name,
        email,
        phoneNumber,
        image: image || "",
      },
    });

    // Update EventSponsor amount
    await prisma.eventSponsor.update({
      where: { eventSponsorId },
      data: { amount },
    });

    revalidatePath("/sponsors");
  } catch (error) {
    console.error("Error updating event sponsor:", error);
    throw new Error("Failed to update event sponsor");
  }
}

// New helper function to get available sponsors for an event
export async function getAvailableSponsorsForEvent(eventId: string) {
  try {
    // Get all sponsors
    const allSponsors = await prisma.sponsor.findMany({
      orderBy: { name: "asc" },
    });

    // Get sponsors already assigned to this event
    const eventSponsors = await prisma.eventSponsor.findMany({
      where: { eventId },
      select: { sponsorId: true },
    });

    // Create a set of already assigned sponsor IDs for quick lookup
    const assignedSponsorIds = new Set(eventSponsors.map((es) => es.sponsorId));

    // Filter out already assigned sponsors
    const availableSponsors = allSponsors.filter(
      (sponsor) => !assignedSponsorIds.has(sponsor.sponsorId)
    );

    return availableSponsors;
  } catch (error) {
    console.error("Error getting available sponsors:", error);
    throw new Error("Failed to get available sponsors");
  }
}
