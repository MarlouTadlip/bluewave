"use server";
import { prisma } from "@/lib/db";

export async function getStats() {
  try {
    const [volunteerCount, eventCount, totalTrash] = await Promise.all([
      prisma.user.count({ where: { role: "VOLUNTEER" } }),
      prisma.event.count(),
      prisma.cleanUpData.aggregate({
        _sum: { totalWeight: true },
      }),
    ]);

    return {
      success: true,
      data: {
        volunteers: volunteerCount,
        cleanups: eventCount,
        trashCollected: totalTrash._sum.totalWeight || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { success: false, data: null };
  }
}

export async function getRecentEvents() {
  try {
    const events = await prisma.event.findMany({
      take: 6,
      orderBy: { startDate: "desc" },
      include: {
        location: true,
        Participation: true,
      },
    });

    // Map events to include Unsplash images and participant count
    const eventData = events.map((event, index) => ({
      id: event.eventId,
      title: event.title,
      description: event.description || "No description available.",
      participantCount: event.Participation.length,
      image: getUnsplashImage(index), // Assign unique Unsplash image
    }));

    return { success: true, data: eventData };
  } catch (error) {
    console.error("Error fetching recent events:", error);
    return { success: false, data: null };
  }
}

export async function getUpcomingEvents() {
  try {
    const events = await prisma.event.findMany({
      where: {
        OR: [{ startDate: { gte: new Date() } }, { startDate: null }],
      },
      take: 3,
      orderBy: { startDate: "asc" },
      include: {
        location: true,
        Participation: true,
      },
    });

    // Map events to include spots and formatted date
    const eventData = events.map((event) => ({
      id: event.eventId,
      title: event.title,
      date: event.startDate
        ? new Date(event.startDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "TBD",
      location: event.location.name,
      spots: Math.max(0, 50 - event.Participation.length), // Assume max 50 participants
    }));

    return { success: true, data: eventData };
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return { success: false, data: null };
  }
}

// Helper function to assign Unsplash images for events
function getUnsplashImage(index: number): string {
  const images = [
    "https://images.unsplash.com/photo-1611270418597-14086d8fgf95?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80", // Beach cleanup volunteers
    "https://images.unsplash.com/photo-1565803974275-dccd2f933cbb?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Coastal cleanup
    "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80", // Ocean conservation
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80", // Clean beach
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80", // Pristine shoreline
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80", // Beach restoration
  ];
  return images[index % images.length];
}
