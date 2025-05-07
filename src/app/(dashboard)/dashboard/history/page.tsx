import { getSession } from "@/features/users/actions/session";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function VolunteerHistoryPage() {
  const session = await getSession();
  if (!session || typeof session.userId !== "string") {
    redirect("/login");
  }

  const userId = session.userId;
  const user = await prisma.user.findUnique({
    where: { userId },
    select: { fullName: true, role: true, isSuspended: true },
  });

  if (!user || user.isSuspended) {
    return (
      <div className="space-y-6 p-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Volunteer History
        </h1>
        <p className="text-red-500">
          {user?.isSuspended
            ? "Your account is suspended. Contact an admin for assistance."
            : "User not found."}
        </p>
      </div>
    );
  }

  const participations = await prisma.participation.findMany({
    where: { userId },
    include: {
      event: {
        include: {
          location: true,
        },
      },
    },
    orderBy: { event: { startDate: "desc" } },
  });

  const cleanupData = await prisma.cleanUpData.findMany({
    where: { submittedBy: userId },
    include: {
      event: true,
      category: true,
    },
    orderBy: { submissionDate: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Volunteer History
        </h1>
        <p className="text-gray-500">
          View your past volunteer events and cleanup contributions,{" "}
          {user.fullName}.
        </p>
      </div>

      {/* Event Participation Section */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Event Participation</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Event Title</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                </tr>
              </thead>
              <tbody>
                {participations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-500">
                      No event participations found.
                    </td>
                  </tr>
                ) : (
                  participations.map((participation) => (
                    <tr key={participation.participationId}>
                      <td>{participation.event.title}</td>
                      <td>{participation.event.location.name}</td>
                      <td>
                        {participation.event.startDate?.toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        ) || "-"}
                      </td>
                      <td>
                        {participation.checkInTime
                          ? participation.checkInTime.toLocaleTimeString(
                              "en-US"
                            )
                          : "-"}
                      </td>
                      <td>
                        {participation.checkOutTime
                          ? participation.checkOutTime.toLocaleTimeString(
                              "en-US"
                            )
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cleanup Contributions Section */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Cleanup Contributions</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Event Title</th>
                  <th>Category</th>
                  <th>Total Weight (kg)</th>
                  <th>Total Bags</th>
                  <th>Submission Date</th>
                </tr>
              </thead>
              <tbody>
                {cleanupData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-500">
                      No cleanup contributions found.
                    </td>
                  </tr>
                ) : (
                  cleanupData.map((data) => (
                    <tr key={data.cleanupId}>
                      <td>{data.event.title}</td>
                      <td>{data.category.name}</td>
                      <td>{data.totalWeight}</td>
                      <td>{data.totalBags}</td>
                      <td>
                        {data.submissionDate.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
