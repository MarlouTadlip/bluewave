"use server";
import { Plus, Calendar, Trash2 } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSession } from "@/features/users/actions/session";
import { Tabs } from "./Tabs";

export default async function EventsPage() {
  const session = (await getSession()) as { userId: string | null };
  if (!session || !session.userId) {
    return (
      <div className="text-center text-red-500">
        Please log in to view events.
      </div>
    );
  }

  // Fetch user data (role and participations)
  const user = await prisma.user.findUnique({
    where: { userId: session.userId },
    select: {
      userId: true,
      fullName: true,
      role: true,
      participations: {
        include: {
          event: {
            include: {
              location: true,
            },
          },
        },
      },
      cleanUpData: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!user) {
    return <div className="text-center text-red-500">User not found.</div>;
  }

  // Role-based content
  if (user.role === "VOLUNTEER") {
    // Fetch all events
    const allEvents = await prisma.event.findMany({
      include: {
        location: true,
        Participation: {
          select: {
            userId: true,
          },
        },
      },
    });

    // Process all events
    const allEventsData = allEvents.map((event) => ({
      id: event.eventId,
      title: event.title,
      date: event.startDate
        ? new Date(event.startDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "Date TBD",
      location: event.location.name,
      isRegistered: event.Participation.some(
        (p) => p.userId === session.userId
      ),
    }));

    // Process upcoming events (user's registered, future events)
    const upcomingEvents = user.participations
      .filter((p) => {
        if (!p.event.startDate) return true; // Include null startDate
        return !p.checkOutTime && new Date(p.event.startDate) >= new Date();
      })
      .map((p) => ({
        id: p.event.eventId,
        title: p.event.title,
        date: p.event.startDate
          ? new Date(p.event.startDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
          : "Date TBD",
        location: p.event.location.name,
      }));

    // Process past events (user's completed events)
    const pastEvents = user.participations
      .filter((p) => p.checkOutTime)
      .map((p) => {
        const hours =
          p.checkOutTime && p.checkInTime
            ? Math.round(
                (p.checkOutTime.getTime() - p.checkInTime.getTime()) /
                  (1000 * 60 * 60)
              )
            : 0;
        const wasteCollected = user.cleanUpData
          .filter((c) => c.eventId === p.eventId)
          .reduce((sum, c) => sum + c.totalWeight, 0)
          .toFixed(2);
        return {
          id: p.event.eventId,
          title: p.event.title,
          date: p.event.startDate
            ? new Date(p.event.startDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "Date TBD",
          location: p.event.location.name,
          hours,
          wasteCollected: wasteCollected + " kg",
        };
      });

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              My Events
            </h1>
            <p className="text-base-content/70">
              Explore and join BlueWave cleanup events, {user.fullName}.
            </p>
          </div>
        </div>

        {/* Tabs for All, Upcoming, and Past Events */}
        <Tabs
          allEvents={allEventsData}
          upcomingEvents={upcomingEvents}
          pastEvents={pastEvents}
          userRole={user.role}
          userId={session.userId}
        />
      </div>
    );
  }

  if (user.role === "ORGANIZER") {
    // Fetch organized events
    const organizedEvents = await prisma.event.findMany({
      where: { organizerId: session.userId },
      include: {
        location: true,
        Participation: {
          include: { user: true },
        },
      },
      orderBy: { startDate: "desc" },
    });

    const eventStats = organizedEvents.map((event) => ({
      id: event.eventId,
      title: event.title,
      date: event.startDate
        ? new Date(event.startDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "Date TBD",
      location: event.location.name,
      volunteersCheckedIn: event.Participation.filter((p) => p.checkInTime)
        .length,
      totalVolunteers: event.Participation.length,
    }));

    // Volunteer-specific data (if organizer also volunteers)
    const allEvents = await prisma.event.findMany({
      include: {
        location: true,
        Participation: {
          select: {
            userId: true,
          },
        },
      },
    });

    const allEventsData = allEvents.map((event) => ({
      id: event.eventId,
      title: event.title,
      date: event.startDate
        ? new Date(event.startDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "Date TBD",
      location: event.location.name,
      isRegistered: event.Participation.some(
        (p) => p.userId === session.userId
      ),
    }));

    const upcomingEvents = user.participations
      .filter((p) => {
        if (!p.event.startDate) return true;
        return !p.checkOutTime && new Date(p.event.startDate) >= new Date();
      })
      .map((p) => ({
        id: p.event.eventId,
        title: p.event.title,
        date: p.event.startDate
          ? new Date(p.event.startDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
          : "Date TBD",
        location: p.event.location.name,
      }));

    const pastEvents = user.participations
      .filter((p) => p.checkOutTime)
      .map((p) => {
        const hours =
          p.checkOutTime && p.checkInTime
            ? Math.round(
                (p.checkOutTime.getTime() - p.checkInTime.getTime()) /
                  (1000 * 60 * 60)
              )
            : 0;
        const wasteCollected = user.cleanUpData
          .filter((c) => c.eventId === p.eventId)
          .reduce((sum, c) => sum + c.totalWeight, 0)
          .toFixed(2);
        return {
          id: p.event.eventId,
          title: p.event.title,
          date: p.event.startDate
            ? new Date(p.event.startDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "Date TBD",
          location: p.event.location.name,
          hours,
          wasteCollected: wasteCollected + " kg",
        };
      });

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              Organizer Events
            </h1>
            <p className="text-base-content/70">
              Manage your BlueWave cleanup events, {user.fullName}.
            </p>
          </div>
          <Link href="/dashboard/events/new" className="btn btn-primary">
            <Plus className="h-5 w-5" /> Add Event
          </Link>
        </div>

        {/* Organized Events */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Your Organized Events</h2>
            {eventStats.length === 0 ? (
              <p className="text-gray-500">No events organized yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Date</th>
                      <th>Location</th>
                      <th>Volunteers (Checked In/Total)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventStats.map((event) => (
                      <tr key={event.id} className="hover">
                        <td>{event.title}</td>
                        <td>{event.date}</td>
                        <td>{event.location}</td>
                        <td>
                          {event.volunteersCheckedIn}/{event.totalVolunteers}
                        </td>
                        <td>
                          <Link
                            href={`/dashboard/checkin`}
                            className="btn btn-sm btn-primary"
                          >
                            Manage Check-Ins
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Volunteer Activity (if any) */}
        {(upcomingEvents.length > 0 || pastEvents.length > 0) && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Your Volunteer Activity</h2>
              <Tabs
                allEvents={allEventsData}
                upcomingEvents={upcomingEvents}
                pastEvents={pastEvents}
                userRole={user.role}
                userId={session.userId}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (user.role === "ADMIN") {
    // Fetch all events
    const allEvents = await prisma.event.findMany({
      include: {
        location: true,
        Participation: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: { startDate: "desc" },
    });

    const eventStats = allEvents.map((event) => ({
      id: event.eventId,
      title: event.title,
      date: event.startDate
        ? new Date(event.startDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "Date TBD",
      location: event.location.name,
      volunteersCheckedIn: event.Participation.filter((p) => p.userId).length,
      totalVolunteers: event.Participation.length,
    }));

    // System stats
    const totalEvents = await prisma.event.count();
    const totalWaste = await prisma.cleanUpData.aggregate({
      _sum: { totalWeight: true },
    });

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              Admin Events
            </h1>
            <p className="text-base-content/70">
              Oversee all BlueWave cleanup events, {user.fullName}.
            </p>
          </div>
          <Link href="/dashboard/events/new" className="btn btn-primary">
            <Plus className="h-5 w-5" /> Add Event
          </Link>
        </div>

        {/* System Stats */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Calendar className="h-8 w-8" />
              </div>
              <div className="stat-title">Total Events</div>
              <div className="stat-value">{totalEvents}</div>
              <div className="stat-desc text-success">
                {totalEvents > 0
                  ? `+${totalEvents} organized`
                  : "No events yet"}
              </div>
            </div>
          </div>

          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Trash2 className="h-8 w-8" />
              </div>
              <div className="stat-title">Total Waste Collected</div>
              <div className="stat-value">
                {(totalWaste._sum.totalWeight || 0).toFixed(2)} kg
              </div>
              <div className="stat-desc text-success">
                {totalWaste._sum.totalWeight
                  ? `+${totalWaste._sum.totalWeight.toFixed(2)} kg`
                  : "No waste collected"}
              </div>
            </div>
          </div>
        </div>

        {/* All Events */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">All Events</h2>
            {eventStats.length === 0 ? (
              <p className="text-gray-500">No events created yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Date</th>
                      <th>Location</th>
                      <th>Volunteers (Checked In/Total)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventStats.map((event) => (
                      <tr key={event.id} className="hover">
                        <td>{event.title}</td>
                        <td>{event.date}</td>
                        <td>{event.location}</td>
                        <td>
                          {event.volunteersCheckedIn}/{event.totalVolunteers}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <div className="text-center text-red-500">Invalid role.</div>;
}
