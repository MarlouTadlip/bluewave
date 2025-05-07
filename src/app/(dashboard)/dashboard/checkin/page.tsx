"use server";

import React from "react";
import { prisma } from "@/lib/db";
import { getSession } from "@/features/users/actions/session";
import { redirect } from "next/navigation";
import { CheckCircle, LogOut, PlusCircle, Edit } from "lucide-react";
import {
  checkInVolunteer,
  checkOutVolunteer,
  addCleanUpData,
  editCleanUpData,
} from "./actions/CheckInActions";

export default async function CheckInPage() {
  const session = await getSession();
  if (!session || typeof session.userId !== "string") {
    redirect("/login");
  }

  const userId = session.userId;
  const user = await prisma.user.findUnique({
    where: { userId },
    select: { role: true },
  });

  if (!user || user.role === "VOLUNTEER") {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Check-In Volunteers
        </h1>
        <p className="text-red-500">
          Access denied. Only organizers can access this page. Your role:{" "}
          {user?.role || "Unknown"}
        </p>
      </div>
    );
  }

  const events = await prisma.event.findMany({
    where: { organizerId: userId },
    include: {
      location: true,
      Participation: { include: { user: true } },
      cleanUpData: { include: { category: true, User: true } },
    },
    orderBy: { startDate: "desc" },
  });

  const categories = await prisma.category.findMany();

  if (events.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Check-In Volunteers
        </h1>
        <p className="text-gray-500">
          No events found. Create an event to start checking in volunteers.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Check-In Volunteers
        </h1>
        <p className="text-gray-500">
          Manage volunteer check-ins, check-outs, and cleanup data for your
          events
        </p>
      </div>

      {events.map((event) => (
        <div key={event.eventId} className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">{event.title}</h2>
            <p className="text-gray-500">
              {event.location.name} |{" "}
              {event.startDate?.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>

            {/* Volunteer Check-In Table */}
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Volunteer</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {event.Participation.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-gray-500">
                        No volunteers registered for this event.
                      </td>
                    </tr>
                  ) : (
                    event.Participation.map((participation) => {
                      // Check if cleanup data exists for this volunteer
                      const hasCleanupData = event.cleanUpData.some(
                        (data) => data.submittedBy === participation.userId
                      );

                      return (
                        <tr key={participation.participationId}>
                          <td>{participation.user.fullName}</td>
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
                          <td>
                            <div className="flex gap-2">
                              {!participation.checkInTime && (
                                <form
                                  action={checkInVolunteer.bind(
                                    null,
                                    participation.participationId
                                  )}
                                >
                                  <button
                                    type="submit"
                                    className="btn btn-primary btn-sm"
                                  >
                                    <CheckCircle className="h-4 w-4" /> Check In
                                  </button>
                                </form>
                              )}
                              {participation.checkInTime &&
                                !participation.checkOutTime && (
                                  <form
                                    action={checkOutVolunteer.bind(
                                      null,
                                      participation.participationId,
                                      event.eventId,
                                      participation.userId
                                    )}
                                  >
                                    <button
                                      type="submit"
                                      className="btn btn-secondary btn-sm"
                                      disabled={!hasCleanupData}
                                      title={
                                        !hasCleanupData
                                          ? "Volunteer must submit cleanup data before checking out"
                                          : ""
                                      }
                                    >
                                      <LogOut className="h-4 w-4" /> Check Out
                                    </button>
                                  </form>
                                )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Cleanup Data Section */}
            <div className="mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Cleanup Data</h3>
                <label
                  htmlFor={`cleanup-modal-${event.eventId}`}
                  className="btn btn-primary btn-sm"
                >
                  <PlusCircle className="h-4 w-4" /> Add Cleanup Data
                </label>
              </div>

              {/* Cleanup Data Table */}
              <div className="overflow-x-auto mt-4">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Total Weight (kg)</th>
                      <th>Total Bags</th>
                      <th>Submitted By</th>
                      <th>Submission Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {event.cleanUpData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center text-gray-500">
                          No cleanup data recorded for this event.
                        </td>
                      </tr>
                    ) : (
                      event.cleanUpData.map((data) => (
                        <tr key={data.cleanupId}>
                          <td>{data.category.name}</td>
                          <td>{data.totalWeight}</td>
                          <td>{data.totalBags}</td>
                          <td>{data.User.fullName}</td>
                          <td>
                            {data.submissionDate.toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td>
                            <label
                              htmlFor={`edit-cleanup-modal-${data.cleanupId}`}
                              className="btn btn-ghost btn-sm"
                            >
                              <Edit className="h-4 w-4" /> Edit
                            </label>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Modal for Adding Cleanup Data */}
              <input
                type="checkbox"
                id={`cleanup-modal-${event.eventId}`}
                className="modal-toggle"
              />
              <div className="modal">
                <div className="modal-box">
                  <h3 className="font-bold text-lg">Add Cleanup Data</h3>
                  <form action={addCleanUpData.bind(null, event.eventId)}>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Category</span>
                      </label>
                      <select
                        name="categoryId"
                        className="select select-bordered w-full"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option
                            key={category.categoryId}
                            value={category.categoryId}
                          >
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Submitted By</span>
                      </label>
                      <select
                        name="submittedBy"
                        className="select select-bordered w-full"
                        required
                      >
                        <option value="">Select a volunteer</option>
                        {event.Participation.map((participation) => (
                          <option
                            key={participation.userId}
                            value={participation.userId}
                          >
                            {participation.user.fullName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Total Weight (kg)</span>
                      </label>
                      <input
                        type="number"
                        name="totalWeight"
                        step="0.01"
                        min="1"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Total Bags</span>
                      </label>
                      <input
                        type="number"
                        name="totalBags"
                        min="1"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                    <div className="modal-action">
                      <button type="submit" className="btn btn-primary">
                        Submit
                      </button>
                      <label
                        htmlFor={`cleanup-modal-${event.eventId}`}
                        className="btn"
                      >
                        Cancel
                      </label>
                    </div>
                  </form>
                </div>
              </div>

              {/* Modal for Editing Cleanup Data */}
              {event.cleanUpData.map((data) => (
                <div key={data.cleanupId}>
                  <input
                    type="checkbox"
                    id={`edit-cleanup-modal-${data.cleanupId}`}
                    className="modal-toggle"
                  />
                  <div className="modal">
                    <div className="modal-box">
                      <h3 className="font-bold text-lg">Edit Cleanup Data</h3>
                      <form action={editCleanUpData.bind(null, data.cleanupId)}>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Category</span>
                          </label>
                          <select
                            name="categoryId"
                            className="select select-bordered w-full"
                            defaultValue={data.categoryId}
                            required
                          >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                              <option
                                key={category.categoryId}
                                value={category.categoryId}
                              >
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Submitted By</span>
                          </label>
                          <select
                            name="submittedBy"
                            className="select select-bordered w-full"
                            defaultValue={data.submittedBy}
                            required
                          >
                            <option value="">Select a volunteer</option>
                            {event.Participation.map((participation) => (
                              <option
                                key={participation.userId}
                                value={participation.userId}
                              >
                                {participation.user.fullName}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">
                              Total Weight (kg)
                            </span>
                          </label>
                          <input
                            type="number"
                            name="totalWeight"
                            step="0.01"
                            min="1"
                            defaultValue={data.totalWeight}
                            className="input input-bordered w-full"
                            required
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Total Bags</span>
                          </label>
                          <input
                            type="number"
                            name="totalBags"
                            min="1"
                            defaultValue={data.totalBags}
                            className="input input-bordered w-full"
                            required
                          />
                        </div>
                        <div className="modal-action">
                          <button type="submit" className="btn btn-primary">
                            Update
                          </button>
                          <label
                            htmlFor={`edit-cleanup-modal-${data.cleanupId}`}
                            className="btn"
                          >
                            Cancel
                          </label>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
