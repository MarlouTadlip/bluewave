import { Calendar, Clock, Trash2, MapPin, Users } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/features/users/actions/session";
import { JSX } from "react";

import ExportForm from "./ExportForm";
// Server action to export event statistics as CSV

export default async function StatisticsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  // Validate session
  const session = (await getSession()) as { userId: string } | null;
  if (!session?.userId) {
    return (
      <div className="text-center text-error">
        Please log in to view statistics.
      </div>
    );
  }

  // Fetch user data
  const user = await prisma.user.findUnique({
    where: { userId: session?.userId || "" },
    select: {
      userId: true,
      fullName: true,
      role: true,
      participations: {
        include: { event: { include: { location: true } } },
      },
      cleanUpData: {
        include: { category: true },
      },
      events: {
        include: {
          location: true,
          Participation: true,
          cleanUpData: { include: { category: true } },
        },
      },
    },
  });

  if (!user) {
    return <div className="text-center text-error">User not found.</div>;
  }

  // Fetch events for dropdown based on role
  let eventsRaw;
  if (user.role === "VOLUNTEER") {
    eventsRaw = await prisma.event.findMany({
      where: {
        Participation: {
          some: { userId: user.userId, checkOutTime: { not: null } },
        },
      },
      select: { eventId: true, title: true },
      orderBy: { startDate: "desc" },
    });
  } else if (user.role === "ORGANIZER") {
    eventsRaw = await prisma.event.findMany({
      where: { organizerId: user.userId },
      select: { eventId: true, title: true },
      orderBy: { startDate: "desc" },
    });
  } else {
    eventsRaw = await prisma.event.findMany({
      select: { eventId: true, title: true },
      orderBy: { startDate: "desc" },
    });
  }

  // Serialize events to plain objects
  const events = eventsRaw.map((event) => ({
    eventId: event.eventId,
    title: event.title,
  }));

  // Validate searchParams
  const currentYear = new Date().getFullYear();
  const year =
    parseInt(searchParams.year || currentYear.toString()) || currentYear;
  const validYears = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const finalYear = validYears.includes(year) ? year : currentYear;
  const wasteSortBy =
    searchParams.wasteSortBy === "category" ? "category" : "weight";
  const wasteSortOrder = searchParams.wasteSortOrder === "asc" ? "asc" : "desc";
  const monthSortBy =
    searchParams.monthSortBy === "events" ? "events" : "month";
  const monthSortOrder =
    searchParams.monthSortOrder === "desc" ? "desc" : "asc";
  const error = searchParams.error;

  // Prepare UI components
  const title = `${user.fullName}'s Statistics`;
  const subtitle =
    user.role === "VOLUNTEER"
      ? "Your contributions to BlueWave."
      : user.role === "ORGANIZER"
      ? "Impact of your organized events."
      : "System-wide BlueWave statistics.";

  let statsContent: JSX.Element;

  if (user.role === "VOLUNTEER") {
    // Calculate volunteer stats
    const eventsAttended = user.participations.filter(
      (p) => p.checkOutTime
    ).length;
    const totalHours = user.participations
      .filter((p) => p.checkInTime && p.checkOutTime)
      .reduce(
        (sum, p) =>
          sum +
          (p.checkOutTime!.getTime() - p.checkInTime!.getTime()) /
            (1000 * 60 * 60),
        0
      );
    const totalWaste = user.cleanUpData
      .reduce((sum, c) => sum + c.totalWeight, 0)
      .toFixed(2);
    const uniqueLocations = [
      ...new Set(
        user.participations
          .filter((p) => p.event.location.isActive)
          .map((p) => p.event.location.name)
      ),
    ].length;

    // Waste by category
    const wasteByCategory = user.cleanUpData.reduce((acc, data) => {
      acc[data.category.name] =
        (acc[data.category.name] || 0) + data.totalWeight;
      return acc;
    }, {} as Record<string, number>);
    const wasteStats = Object.entries(wasteByCategory).map(
      ([category, weight]) => ({
        category,
        weight: weight.toFixed(2),
        percentage:
          parseFloat(totalWaste) > 0
            ? ((weight / parseFloat(totalWaste)) * 100).toFixed(0)
            : "0",
      })
    );
    wasteStats.sort((a, b) =>
      wasteSortBy === "category"
        ? wasteSortOrder === "asc"
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category)
        : wasteSortOrder === "asc"
        ? parseFloat(a.weight) - parseFloat(b.weight)
        : parseFloat(b.weight) - parseFloat(a.weight)
    );

    // Monthly participation
    const monthlyParticipation = user.participations
      .filter(
        (p) =>
          p.checkOutTime &&
          p.event.startDate &&
          p.event.startDate.getFullYear() === finalYear
      )
      .reduce((acc, p) => {
        const month = p.event.startDate!.getMonth() + 1;
        const monthYear = `${finalYear}-${month}`;
        acc[monthYear] = (acc[monthYear] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    const monthlyStats = Array.from({ length: 12 }, (_, i) => {
      const monthYear = `${finalYear}-${i + 1}`;
      return {
        month: new Date(finalYear, i, 1).toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        }),
        events: monthlyParticipation[monthYear] || 0,
      };
    });
    monthlyStats.sort((a, b) =>
      monthSortBy === "month"
        ? monthSortOrder === "asc"
          ? new Date(a.month).getTime() - new Date(b.month).getTime()
          : new Date(b.month).getTime() - new Date(a.month).getTime()
        : monthSortOrder === "asc"
        ? a.events - b.events
        : b.events - a.events
    );

    statsContent = (
      <>
        <div className="flex justify-end mb-4">
          <ExportForm user={user} events={events} />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Calendar className="h-8 w-8" />
              </div>
              <div className="stat-title">Events Attended</div>
              <div className="stat-value">{eventsAttended}</div>
            </div>
          </div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Clock className="h-8 w-8" />
              </div>
              <div className="stat-title">Volunteer Hours</div>
              <div className="stat-value">{totalHours.toFixed(1)}</div>
            </div>
          </div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Trash2 className="h-8 w-8" />
              </div>
              <div className="stat-title">Waste Collected</div>
              <div className="stat-value">{totalWaste} kg</div>
            </div>
          </div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <MapPin className="h-8 w-8" />
              </div>
              <div className="stat-title">Locations Visited</div>
              <div className="stat-value">{uniqueLocations}</div>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl mt-6">
          <div className="card-body">
            <h2 className="card-title">Waste by Category</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>
                      <a
                        href={`?year=${finalYear}&wasteSortBy=category&wasteSortOrder=${
                          wasteSortBy === "category" && wasteSortOrder === "asc"
                            ? "desc"
                            : "asc"
                        }&monthSortBy=${monthSortBy}&monthSortOrder=${monthSortOrder}`}
                      >
                        Category{" "}
                        {wasteSortBy === "category" &&
                          (wasteSortOrder === "asc" ? "↑" : "↓")}
                      </a>
                    </th>
                    <th>
                      <a
                        href={`?year=${finalYear}&wasteSortBy=weight&wasteSortOrder=${
                          wasteSortBy === "weight" && wasteSortOrder === "asc"
                            ? "desc"
                            : "asc"
                        }&monthSortBy=${monthSortBy}&monthSortOrder=${monthSortOrder}`}
                      >
                        Weight (kg){" "}
                        {wasteSortBy === "weight" &&
                          (wasteSortOrder === "asc" ? "↑" : "↓")}
                      </a>
                    </th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {wasteStats.length > 0 ? (
                    wasteStats.map((stat) => (
                      <tr key={stat.category}>
                        <td>{stat.category}</td>
                        <td>{stat.weight}</td>
                        <td>{stat.percentage}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center">
                        No waste data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl mt-6">
          <div className="card-body">
            <div className="flex justify-between">
              <h2 className="card-title">Monthly Participation</h2>
              <div className="dropdown">
                <label tabIndex={0} className="btn btn-sm btn-outline">
                  Year: {finalYear}
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  {validYears.map((y) => (
                    <li key={y}>
                      <a
                        href={`?year=${y}&wasteSortBy=${wasteSortBy}&wasteSortOrder=${wasteSortOrder}&monthSortBy=${monthSortBy}&monthSortOrder=${monthSortOrder}`}
                      >
                        {y}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>
                      <a
                        href={`?year=${finalYear}&wasteSortBy=${wasteSortBy}&wasteSortOrder=${wasteSortOrder}&monthSortBy=month&monthSortOrder=${
                          monthSortBy === "month" && monthSortOrder === "asc"
                            ? "desc"
                            : "asc"
                        }`}
                      >
                        Month{" "}
                        {monthSortBy === "month" &&
                          (monthSortOrder === "asc" ? "↑" : "↓")}
                      </a>
                    </th>
                    <th>
                      <a
                        href={`?year=${finalYear}&wasteSortBy=${wasteSortBy}&wasteSortOrder=${wasteSortOrder}&monthSortBy=events&monthSortOrder=${
                          monthSortBy === "events" && monthSortOrder === "asc"
                            ? "desc"
                            : "asc"
                        }`}
                      >
                        Events{" "}
                        {monthSortBy === "events" &&
                          (monthSortOrder === "asc" ? "↑" : "↓")}
                      </a>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyStats.map((stat, i) => (
                    <tr key={i}>
                      <td>{stat.month}</td>
                      <td>{stat.events}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  } else if (user.role === "ORGANIZER") {
    // Calculate organizer stats
    const totalEvents = user.events.length;
    const totalVolunteers = [
      ...new Set(
        user.events.flatMap((e) => e.Participation.map((p) => p.userId))
      ),
    ].length;
    const totalWaste = user.events
      .flatMap((e) => e.cleanUpData)
      .reduce((sum, c) => sum + c.totalWeight, 0)
      .toFixed(2);
    const uniqueLocations = [
      ...new Set(
        user.events
          .filter((e) => e.location.isActive)
          .map((e) => e.location.name)
      ),
    ].length;

    // Waste by category
    const wasteByCategory = user.events
      .flatMap((e) => e.cleanUpData)
      .reduce((acc, data) => {
        acc[data.category.name] =
          (acc[data.category.name] || 0) + data.totalWeight;
        return acc;
      }, {} as Record<string, number>);
    const wasteStats = Object.entries(wasteByCategory).map(
      ([category, weight]) => ({
        category,
        weight: weight.toFixed(2),
        percentage:
          parseFloat(totalWaste) > 0
            ? ((weight / parseFloat(totalWaste)) * 100).toFixed(0)
            : "0",
      })
    );
    wasteStats.sort((a, b) =>
      wasteSortBy === "category"
        ? wasteSortOrder === "asc"
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category)
        : wasteSortOrder === "asc"
        ? parseFloat(a.weight) - parseFloat(b.weight)
        : parseFloat(b.weight) - parseFloat(a.weight)
    );

    // Monthly events
    const monthlyEvents = user.events
      .filter((e) => e.startDate && e.startDate.getFullYear() === finalYear)
      .reduce((acc, e) => {
        const month = e.startDate!.getMonth() + 1;
        const monthYear = `${finalYear}-${month}`;
        acc[monthYear] = (acc[monthYear] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    const monthlyStats = Array.from({ length: 12 }, (_, i) => {
      const monthYear = `${finalYear}-${i + 1}`;
      return {
        month: new Date(finalYear, i, 1).toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        }),
        events: monthlyEvents[monthYear] || 0,
      };
    });
    monthlyStats.sort((a, b) =>
      monthSortBy === "month"
        ? monthSortOrder === "asc"
          ? new Date(a.month).getTime() - new Date(b.month).getTime()
          : new Date(b.month).getTime() - new Date(a.month).getTime()
        : monthSortOrder === "asc"
        ? a.events - b.events
        : b.events - a.events
    );

    statsContent = (
      <>
        <div className="flex justify-end mb-4">
          <ExportForm user={user} events={events} />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Calendar className="h-8 w-8" />
              </div>
              <div className="stat-title">Events Organized</div>
              <div className="stat-value">{totalEvents}</div>
            </div>
          </div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Users className="h-8 w-8" />
              </div>
              <div className="stat-title">Volunteers</div>
              <div className="stat-value">{totalVolunteers}</div>
            </div>
          </div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Trash2 className="h-8 w-8" />
              </div>
              <div className="stat-title">Waste Collected</div>
              <div className="stat-value">{totalWaste} kg</div>
            </div>
          </div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <MapPin className="h-8 w-8" />
              </div>
              <div className="stat-title">Locations Used</div>
              <div className="stat-value">{uniqueLocations}</div>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl mt-6">
          <div className="card-body">
            <h2 className="card-title">Waste by Category</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>
                      <a
                        href={`?year=${finalYear}&wasteSortBy=category&wasteSortOrder=${
                          wasteSortBy === "category" && wasteSortOrder === "asc"
                            ? "desc"
                            : "asc"
                        }&monthSortBy=${monthSortBy}&monthSortOrder=${monthSortOrder}`}
                      >
                        Category{" "}
                        {wasteSortBy === "category" &&
                          (wasteSortOrder === "asc" ? "↑" : "↓")}
                      </a>
                    </th>
                    <th>
                      <a
                        href={`?year=${finalYear}&wasteSortBy=weight&wasteSortOrder=${
                          wasteSortBy === "weight" && wasteSortOrder === "asc"
                            ? "desc"
                            : "asc"
                        }&monthSortBy=${monthSortBy}&monthSortOrder=${monthSortOrder}`}
                      >
                        Weight (kg){" "}
                        {wasteSortBy === "weight" &&
                          (wasteSortOrder === "asc" ? "↑" : "↓")}
                      </a>
                    </th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {wasteStats.length > 0 ? (
                    wasteStats.map((stat) => (
                      <tr key={stat.category}>
                        <td>{stat.category}</td>
                        <td>{stat.weight}</td>
                        <td>{stat.percentage}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center">
                        No waste data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl mt-6">
          <div className="card-body">
            <div className="flex justify-between">
              <h2 className="card-title">Monthly Events</h2>
              <div className="dropdown">
                <label tabIndex={0} className="btn btn-sm btn-outline">
                  Year: {finalYear}
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  {validYears.map((y) => (
                    <li key={y}>
                      <a
                        href={`?year=${y}&wasteSortBy=${wasteSortBy}&wasteSortOrder=${wasteSortOrder}&monthSortBy=${monthSortBy}&monthSortOrder=${monthSortOrder}`}
                      >
                        {y}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>
                      <a
                        href={`?year=${finalYear}&wasteSortBy=${wasteSortBy}&wasteSortOrder=${wasteSortOrder}&monthSortBy=month&monthSortOrder=${
                          monthSortBy === "month" && monthSortOrder === "asc"
                            ? "desc"
                            : "asc"
                        }`}
                      >
                        Month{" "}
                        {monthSortBy === "month" &&
                          (monthSortOrder === "asc" ? "↑" : "↓")}
                      </a>
                    </th>
                    <th>
                      <a
                        href={`?year=${finalYear}&wasteSortBy=${wasteSortBy}&wasteSortOrder=${wasteSortOrder}&monthSortBy=events&monthSortOrder=${
                          monthSortBy === "events" && monthSortOrder === "asc"
                            ? "desc"
                            : "asc"
                        }`}
                      >
                        Events{" "}
                        {monthSortBy === "events" &&
                          (monthSortOrder === "asc" ? "↑" : "↓")}
                      </a>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyStats.map((stat, i) => (
                    <tr key={i}>
                      <td>{stat.month}</td>
                      <td>{stat.events}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    // Calculate admin stats
    const totalUsers = await prisma.user.count({
      where: { isSuspended: false },
    });
    const totalEvents = await prisma.event.count();
    const totalVolunteerHours = await prisma.participation
      .findMany({
        where: { checkInTime: { not: null }, checkOutTime: { not: null } },
        include: { user: { select: { isSuspended: true } } },
      })
      .then((ps) =>
        ps
          .filter((p) => !p.user.isSuspended)
          .reduce(
            (sum, p) =>
              sum +
              (p.checkOutTime!.getTime() - p.checkInTime!.getTime()) /
                (1000 * 60 * 60),
            0
          )
      );
    const totalWaste = await prisma.cleanUpData
      .findMany({ include: { User: { select: { isSuspended: true } } } })
      .then((ds) =>
        ds
          .filter((d) => !d.User.isSuspended)
          .reduce((sum, c) => sum + c.totalWeight, 0)
          .toFixed(2)
      );
    const uniqueLocations = await prisma.location.count({
      where: { isActive: true },
    });

    // Waste by category
    const wasteByCategory = await prisma.cleanUpData
      .findMany({
        include: { category: true, User: { select: { isSuspended: true } } },
      })
      .then((ds) =>
        ds
          .filter((d) => !d.User.isSuspended)
          .reduce((acc, d) => {
            acc[d.category.name] = (acc[d.category.name] || 0) + d.totalWeight;
            return acc;
          }, {} as Record<string, number>)
      );
    const wasteStats = Object.entries(wasteByCategory).map(
      ([category, weight]) => ({
        category,
        weight: weight.toFixed(2),
        percentage:
          parseFloat(totalWaste) > 0
            ? ((weight / parseFloat(totalWaste)) * 100).toFixed(0)
            : "0",
      })
    );
    wasteStats.sort((a, b) =>
      wasteSortBy === "category"
        ? wasteSortOrder === "asc"
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category)
        : wasteSortOrder === "asc"
        ? parseFloat(a.weight) - parseFloat(b.weight)
        : parseFloat(b.weight) - parseFloat(a.weight)
    );

    // Monthly events
    const monthlyEvents = await prisma.event
      .findMany({
        where: {
          startDate: {
            gte: new Date(finalYear, 0, 1),
            lte: new Date(finalYear, 11, 31),
          },
        },
        select: { startDate: true },
      })
      .then((es) =>
        es.reduce((acc, e) => {
          const month = e.startDate!.getMonth() + 1;
          const monthYear = `${finalYear}-${month}`;
          acc[monthYear] = (acc[monthYear] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      );
    const monthlyStats = Array.from({ length: 12 }, (_, i) => {
      const monthYear = `${finalYear}-${i + 1}`;
      return {
        month: new Date(finalYear, i, 1).toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        }),
        events: monthlyEvents[monthYear] || 0,
      };
    });
    monthlyStats.sort((a, b) =>
      monthSortBy === "month"
        ? monthSortOrder === "asc"
          ? new Date(a.month).getTime() - new Date(b.month).getTime()
          : new Date(b.month).getTime() - new Date(a.month).getTime()
        : monthSortOrder === "asc"
        ? a.events - b.events
        : b.events - a.events
    );

    statsContent = (
      <>
        <div className="flex justify-end mb-4">
          <ExportForm user={user} events={events} />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Users className="h-8 w-8" />
              </div>
              <div className="stat-title">Total Users</div>
              <div className="stat-value">{totalUsers}</div>
            </div>
          </div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Calendar className="h-8 w-8" />
              </div>
              <div className="stat-title">Total Events</div>
              <div className="stat-value">{totalEvents}</div>
            </div>
          </div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Clock className="h-8 w-8" />
              </div>
              <div className="stat-title">Volunteer Hours</div>
              <div className="stat-value">{totalVolunteerHours.toFixed(1)}</div>
            </div>
          </div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <MapPin className="h-8 w-8" />
              </div>
              <div className="stat-title">Locations</div>
              <div className="stat-value">{uniqueLocations}</div>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl mt-6">
          <div className="card-body">
            <h2 className="card-title">Waste by Category</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>
                      <a
                        href={`?year=${finalYear}&wasteSortBy=category&wasteSortOrder=${
                          wasteSortBy === "category" && wasteSortOrder === "asc"
                            ? "desc"
                            : "asc"
                        }&monthSortBy=${monthSortBy}&monthSortOrder=${monthSortOrder}`}
                      >
                        Category{" "}
                        {wasteSortBy === "category" &&
                          (wasteSortOrder === "asc" ? "↑" : "↓")}
                      </a>
                    </th>
                    <th>
                      <a
                        href={`?year=${finalYear}&wasteSortBy=weight&wasteSortOrder=${
                          wasteSortBy === "weight" && wasteSortOrder === "asc"
                            ? "desc"
                            : "asc"
                        }&monthSortBy=${monthSortBy}&monthSortOrder=${monthSortOrder}`}
                      >
                        Weight (kg){" "}
                        {wasteSortBy === "weight" &&
                          (wasteSortOrder === "asc" ? "↑" : "↓")}
                      </a>
                    </th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {wasteStats.length > 0 ? (
                    wasteStats.map((stat) => (
                      <tr key={stat.category}>
                        <td>{stat.category}</td>
                        <td>{stat.weight}</td>
                        <td>{stat.percentage}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center">
                        No waste data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl mt-6">
          <div className="card-body">
            <div className="flex justify-between">
              <h2 className="card-title">Monthly Events</h2>
              <div className="dropdown">
                <label tabIndex={0} className="btn btn-sm btn-outline">
                  Year: {finalYear}
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  {validYears.map((y) => (
                    <li key={y}>
                      <a
                        href={`?year=${y}&wasteSortBy=${wasteSortBy}&wasteSortOrder=${wasteSortOrder}&monthSortBy=${monthSortBy}&monthSortOrder=${monthSortOrder}`}
                      >
                        {y}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>
                      <a
                        href={`?year=${finalYear}&wasteSortBy=${wasteSortBy}&wasteSortOrder=${wasteSortOrder}&monthSortBy=month&monthSortOrder=${
                          monthSortBy === "month" && monthSortOrder === "asc"
                            ? "desc"
                            : "asc"
                        }`}
                      >
                        Month{" "}
                        {monthSortBy === "month" &&
                          (monthSortOrder === "asc" ? "↑" : "↓")}
                      </a>
                    </th>
                    <th>
                      <a
                        href={`?year=${finalYear}&wasteSortBy=${wasteSortBy}&wasteSortOrder=${wasteSortOrder}&monthSortBy=events&monthSortOrder=${
                          monthSortBy === "events" && monthSortOrder === "asc"
                            ? "desc"
                            : "asc"
                        }`}
                      >
                        Events{" "}
                        {monthSortBy === "events" &&
                          (monthSortOrder === "asc" ? "↑" : "↓")}
                      </a>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyStats.map((stat, i) => (
                    <tr key={i}>
                      <td>{stat.month}</td>
                      <td>{stat.events}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="container mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">{title}</h1>
        <p className="text-base-content/70">{subtitle}</p>
        {error && (
          <div className="alert alert-error mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
      {statsContent}
    </div>
  );
}
