import { getSession } from "@/features/users/actions/session";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewEventPage() {
  const session = await getSession();
  if (!session || !session.userId) {
    return (
      <div className="text-center text-red-500">
        Please log in to create an event.
      </div>
    );
  }

  // Check user role
  const user = await prisma.user.findUnique({
    where: { userId: session.userId as string },
    select: { role: true },
  });

  if (!user || !["ORGANIZER", "ADMIN"].includes(user.role)) {
    return (
      <div className="text-center text-red-500">
        You are not authorized to create events.
      </div>
    );
  }

  // Placeholder form
  async function createEvent(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const startDate = formData.get("startDate") as string;
    const locationId = formData.get("locationId") as string;

    // Validate startDate
    if (startDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to midnight for comparison
      const selectedDate = new Date(startDate);
      if (selectedDate < today) {
        redirect(
          `/dashboard/events/new?error=${encodeURIComponent(
            "Start date cannot be in the past"
          )}`
        );
      }
    }

    try {
      await prisma.event.create({
        data: {
          title,
          description,
          startDate: startDate ? new Date(startDate) : null,
          organizerId: session?.userId as string,
          locationId,
        },
      });
      redirect(
        `/dashboard/events?success=${encodeURIComponent(
          "Event created successfully"
        )}`
      );
    } catch (error) {
      redirect(
        `/dashboard/events/new?error=${encodeURIComponent(
          "Failed to create event: " + String(error)
        )}`
      );
    }
  }

  // Fetch locations for dropdown
  const locations = await prisma.location.findMany({
    select: {
      locationId: true,
      name: true,
    },
  });

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Create New Event
        </h1>
        <p className="text-base-content/70">
          Fill in the details to create a new cleanup event.
        </p>
      </div>

      <div className="card bg-base-100 shadow-lg max-w-2xl mx-auto">
        <div className="card-body">
          <form action={createEvent} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Event Title</span>
              </label>
              <input
                type="text"
                name="title"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                name="description"
                className="textarea textarea-bordered"
                required
              ></textarea>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Start Date (Optional)</span>
              </label>
              <input
                type="date"
                name="startDate"
                className="input input-bordered"
                min={today}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <select
                name="locationId"
                className="select select-bordered"
                required
              >
                <option value="">Select a location</option>
                {locations.map((loc) => (
                  <option key={loc.locationId} value={loc.locationId}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <button type="submit" className="btn btn-primary">
                Create Event
              </button>
              <Link href="/dashboard/events" className="btn btn-outline">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
