"use server";
import { Calendar, Clock, Users, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { getSession } from "@/features/users/actions/session";
import { Tabs } from "../../components/Tabs";

export default async function UserDashboard() {
  const session = (await getSession()) as { userId: string } | null;
  if (!session || !session.userId) {
    return <div>Please log in to view your dashboard.</div>;
  }

  // Fetch user data with role
  const user = await prisma.user.findUnique({
    where: { userId: session.userId },
    select: {
      userId: true,
      fullName: true,
      profile_image: true,
      role: true,
      createdAt: true,
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
    return <div>User not found.</div>;
  }

  // Common profile data
  const profileData = {
    fullName: user.fullName,
    profileImage: user.profile_image || "/profile.png",
    joinedDate: new Date(user.createdAt).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
  };

  // Role-based content
  if (user.role === "VOLUNTEER") {
    // Volunteer-specific data
    const upcomingEvents = user.participations
      .filter((p) => {
        if (!p.event.startDate) return false;
        return !p.checkOutTime && new Date(p.event.startDate) >= new Date();
      })
      .map((p) => ({
        id: p.event.eventId,
        name: p.event.title, // Changed from title to name
        date: p.event.startDate
          ? new Date(p.event.startDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
          : "Date TBD",
        location: p.event.location.name,
      }));

    const participationHistory = user.participations
      .filter((p) => p.checkOutTime)
      .map((p) => {
        const hours =
          p.checkOutTime && p.checkInTime
            ? Math.round(
                (p.checkOutTime.getTime() - p.checkInTime.getTime()) /
                  (1000 * 60 * 60)
              )
            : 0;
        return {
          id: p.event.eventId,
          name: p.event.title, // Changed from title to name
          date: p.event.startDate
            ? new Date(p.event.startDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "Date TBD",
          hours,
          trashCollected:
            user.cleanUpData
              .filter((c) => c.eventId === p.eventId)
              .reduce((sum, c) => sum + c.totalWeight, 0)
              .toFixed(2) + " kg", // Changed from wasteCollected to trashCollected
        };
      });

    const impactByCategory = user.cleanUpData.reduce((acc, data) => {
      const category = data.category.name;
      acc[category] = (acc[category] || 0) + data.totalWeight;
      return acc;
    }, {} as Record<string, number>);
    const totalWeight = Object.values(impactByCategory).reduce(
      (sum, weight) => sum + weight,
      0
    );
    const impactStats = Object.entries(impactByCategory).map(
      ([category, weight]) => ({
        category,
        weight: weight.toFixed(2),
        percentage:
          totalWeight > 0 ? ((weight / totalWeight) * 100).toFixed(0) : "0",
      })
    );

    const achievements = [];
    if (totalWeight >= 25) {
      achievements.push({
        name: "Beach Protector",
        description: "Collected 25kg+ of beach waste",
      });
    }
    if (participationHistory.length >= 10) {
      achievements.push({
        name: "Waste Warrior",
        description: "Participated in 10+ cleanup events",
      });
    }

    const eventsAttended = participationHistory.length;
    const totalHours = participationHistory.reduce(
      (sum, p) => sum + p.hours,
      0
    );

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            My Dashboard
          </h1>
          <p className="text-base-content/70">
            Welcome back, {user.fullName}! Here&apos;s your volunteer activity
            overview.
          </p>
        </div>

        {/* Volunteer Profile Summary */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-0">
            <div className="bg-gradient-to-r from-primary to-secondary h-24 relative">
              <div className="absolute -bottom-12 left-6">
                <div className="avatar">
                  <div className="w-24 h-24 rounded-full ring ring-base-100 ring-offset-base-100 ring-offset-2">
                    <Image
                      src={profileData.profileImage}
                      alt={profileData.fullName}
                      width={96}
                      height={96}
                      className="rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-16 pb-6 px-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="space-y-1 flex-1">
                  <h2 className="text-2xl font-bold">{profileData.fullName}</h2>
                  <p className="text-base-content/70">
                    Volunteer since {profileData.joinedDate}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {user.participations.slice(0, 2).map((p) => (
                      <div key={p.eventId} className="badge badge-primary">
                        {p.event.title}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Link href="/dashboard/profile" className="btn btn-primary">
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Volunteer Statistics */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Calendar className="h-8 w-8" />
              </div>
              <div className="stat-title">Events Attended</div>
              <div className="stat-value">{eventsAttended}</div>
              <div className="stat-desc text-success">
                {eventsAttended > 0
                  ? `+${eventsAttended} this year`
                  : "Get started!"}
              </div>
            </div>
          </div>

          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <Clock className="h-8 w-8" />
              </div>
              <div className="stat-title">Volunteer Hours</div>
              <div className="stat-value">{totalHours} hrs</div>
              <div className="stat-desc text-success">
                {totalHours > 0
                  ? `+${totalHours} hrs this year`
                  : "Get started!"}
              </div>
            </div>
          </div>
        </div>

        {/* Volunteer Events and Impact (Tabs) */}
        <Tabs
          upcomingEvents={upcomingEvents}
          participationHistory={participationHistory}
          impactStats={impactStats}
          achievements={achievements}
        />
      </div>
    );
  }

  if (user.role === "ORGANIZER") {
    // Fetch organizer-specific data
    const organizedEvents = await prisma.event.findMany({
      where: { organizerId: user.userId },
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
      name: event.title,
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

    const totalEventsOrganized = organizedEvents.length;
    const totalVolunteersManaged = organizedEvents.reduce(
      (sum, event) => sum + event.Participation.length,
      0
    );

    // Volunteer stats for organizers

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Organizer Dashboard
          </h1>
          <p className="text-base-content/70">
            Welcome back, {user.fullName}! Manage your events and volunteers.
          </p>
        </div>

        {/* Organizer Profile Summary */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-0">
            <div className="bg-gradient-to-r from-primary to-secondary h-24 relative">
              <div className="absolute -bottom-12 left-6">
                <div className="avatar">
                  <div className="w-24 h-24 rounded-full ring ring-base-100 ring-offset-base-100 ring-offset-2">
                    <Image
                      src={profileData.profileImage}
                      alt={profileData.fullName}
                      width={96}
                      height={96}
                      className="rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-16 pb-6 px-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="space-y-1 flex-1">
                  <h2 className="text-2xl font-bold">{profileData.fullName}</h2>
                  <p className="text-base-content/70">
                    Organizer since {profileData.joinedDate}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {organizedEvents.slice(0, 2).map((e) => (
                      <div key={e.eventId} className="badge badge-primary">
                        {e.title}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Link href="/dashboard/profile" className="btn btn-primary">
                    Edit Profile
                  </Link>
                  <Link href="/dashboard/checkin" className="btn btn-secondary">
                    Manage Check-Ins
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Organizer Statistics */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Calendar className="h-8 w-8" />
              </div>
              <div className="stat-title">Events Organized</div>
              <div className="stat-value">{totalEventsOrganized}</div>
              <div className="stat-desc text-success">
                {totalEventsOrganized > 0
                  ? `+${totalEventsOrganized} this year`
                  : "Create an event!"}
              </div>
            </div>
          </div>

          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <Users className="h-8 w-8" />
              </div>
              <div className="stat-title">Volunteers Managed</div>
              <div className="stat-value">{totalVolunteersManaged}</div>
              <div className="stat-desc text-success">
                {totalVolunteersManaged > 0
                  ? `+${totalVolunteersManaged} this year`
                  : "Get started!"}
              </div>
            </div>
          </div>
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
                      <th>Event</th>
                      <th>Date</th>
                      <th>Location</th>
                      <th>Volunteers (Checked In/Total)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventStats.map((event) => (
                      <tr key={event.id}>
                        <td>{event.name}</td>
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

  if (user.role === "ADMIN") {
    // Admin-specific data
    const totalUsers = await prisma.user.count();
    const totalEvents = await prisma.event.count();
    const totalWaste = await prisma.cleanUpData.aggregate({
      _sum: { totalWeight: true },
    });
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { userId: true, fullName: true, email: true, role: true },
    });
    const recentEvents = await prisma.event.findMany({
      take: 5,
      orderBy: { startDate: "desc" },
      include: { location: true },
    });

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Admin Dashboard
          </h1>
          <p className="text-base-content/70">
            Welcome back, {user.fullName}! Manage the BlueWave platform.
          </p>
        </div>

        {/* Admin Profile Summary */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-0">
            <div className="bg-gradient-to-r from-primary to-secondary h-24 relative">
              <div className="absolute -bottom-12 left-6">
                <div className="avatar">
                  <div className="w-24 h-24 rounded-full ring ring-base-100 ring-offset-base-100 ring-offset-2">
                    <Image
                      src={profileData.profileImage}
                      alt={profileData.fullName}
                      width={96}
                      height={96}
                      className="rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-16 pb-6 px-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="space-y-1 flex-1">
                  <h2 className="text-2xl font-bold">{profileData.fullName}</h2>
                  <p className="text-base-content/70">
                    Admin since {profileData.joinedDate}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Link href="/dashboard/profile" className="btn btn-primary">
                    Edit Profile
                  </Link>
                  <Link href="/admin/users" className="btn btn-secondary">
                    Manage Users
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Statistics */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Users className="h-8 w-8" />
              </div>
              <div className="stat-title">Total Users</div>
              <div className="stat-value">{totalUsers}</div>
              <div className="stat-desc text-success">
                {totalUsers > 0 ? `+${totalUsers} registered` : "No users yet"}
              </div>
            </div>
          </div>

          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-figure text-secondary">
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

        {/* Recent Users */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Recent Users</h2>
            {recentUsers.length === 0 ? (
              <p className="text-gray-500">No users registered yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((u) => (
                      <tr key={u.userId}>
                        <td>{u.fullName}</td>
                        <td>{u.email}</td>
                        <td>{u.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Recent Events */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Recent Events</h2>
            {recentEvents.length === 0 ? (
              <p className="text-gray-500">No events created yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Date</th>
                      <th>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEvents.map((e) => (
                      <tr key={e.eventId}>
                        <td>{e.title}</td>
                        <td>
                          {e.startDate
                            ? new Date(e.startDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
                            : "Date TBD"}
                        </td>
                        <td>{e.location.name}</td>
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

  return <div>Invalid role.</div>;
}
