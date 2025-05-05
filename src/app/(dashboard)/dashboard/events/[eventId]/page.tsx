"use server";
import { prisma } from "@/lib/db";
import { getSession } from "@/features/users/actions/session";
import { notFound } from "next/navigation";
import { Calendar, MapPin, User, FileText } from "lucide-react";
import Link from "next/link";

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const session = await getSession();
  if (!session || !session.userId) {
    return (
      <div className="text-center text-red-500 p-6">
        Please log in to view event details.
      </div>
    );
  }

  // Await params to resolve the Promise
  const { eventId } = await params;

  const event = await prisma.event.findUnique({
    where: { eventId },
    include: {
      location: true,
      organizer: {
        select: { fullName: true },
      },
    },
  });

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          {event.title}
        </h1>
        <p className="text-base-content/70">
          Details for the BlueWave cleanup event.
        </p>
      </div>

      <div className="card bg-base-100 shadow-lg max-w-2xl mx-auto">
        <div className="card-body">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-semibold">Description</h2>
                <p className="text-base-content/70">
                  {event.description || "No description available."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-semibold">Date</h2>
                <p className="text-base-content/70">
                  {event.startDate
                    ? new Date(event.startDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "TBD"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-semibold">Location</h2>
                <p className="text-base-content/70">{event.location.name}</p>
                <p className="text-base-content/70 text-sm">
                  ({event.location.latitude}, {event.location.longitude})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-semibold">Organizer</h2>
                <p className="text-base-content/70">
                  {event.organizer.fullName}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Link
              href="/dashboard/events"
              className="btn btn-outline btn-primary"
            >
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
