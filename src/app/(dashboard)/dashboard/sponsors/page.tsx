"use server";

import React from "react";
import { prisma } from "@/lib/db";
import { getSession } from "@/features/users/actions/session";
import { redirect } from "next/navigation";
import { PlusCircle, Edit } from "lucide-react";
import {
  createSponsor,
  linkSponsorToEvent,
  updateEventSponsor,
} from "./actions/SponsorActions";

export default async function SponsorsPage() {
  const session = await getSession();
  if (!session || typeof session.userId !== "string") {
    redirect("/login");
  }

  const userId = session.userId;
  const user = await prisma.user.findUnique({
    where: { userId },
    select: { role: true },
  });

  if (!user || user.role !== "ORGANIZER") {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Manage Sponsors
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
      EventSponsor: { include: { sponsor: true } },
    },
    orderBy: { startDate: "desc" },
  });

  const sponsors = await prisma.sponsor.findMany({
    orderBy: { name: "asc" },
  });

  if (events.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Manage Sponsors
        </h1>
        <p className="text-gray-500">
          No events found. Create an event to start managing sponsors.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Manage Sponsors
        </h1>
        <p className="text-gray-500">
          Manage sponsor details and assignments for your events
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

            {/* Sponsor Table */}
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Logo</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Amount (PHP)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {event.EventSponsor.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-gray-500">
                        No sponsors assigned to this event.
                      </td>
                    </tr>
                  ) : (
                    event.EventSponsor.map((eventSponsor) => (
                      <tr key={eventSponsor.eventSponsorId}>
                        <td>
                          {eventSponsor.sponsor.image ? (
                            <img
                              src={eventSponsor.sponsor.image}
                              alt={`${eventSponsor.sponsor.name} logo`}
                              className="w-12 h-12 object-contain rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded">
                              <span className="text-gray-500">No Logo</span>
                            </div>
                          )}
                        </td>
                        <td>{eventSponsor.sponsor.name}</td>
                        <td>{eventSponsor.sponsor.email}</td>
                        <td>{eventSponsor.sponsor.phoneNumber}</td>
                        <td>{eventSponsor.amount.toFixed(2)}</td>
                        <td>
                          <label
                            htmlFor={`edit-sponsor-modal-${eventSponsor.eventSponsorId}`}
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

            {/* Add Sponsor Section */}
            <div className="mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Sponsors</h3>
                <div className="flex gap-2">
                  <label
                    htmlFor={`add-sponsor-modal-${event.eventId}`}
                    className="btn btn-primary btn-sm"
                  >
                    <PlusCircle className="h-4 w-4" /> Add Existing Sponsor
                  </label>
                  <label
                    htmlFor={`create-sponsor-modal-${event.eventId}`}
                    className="btn btn-primary btn-sm"
                  >
                    <PlusCircle className="h-4 w-4" /> Create New Sponsor
                  </label>
                </div>
              </div>

              {/* Modal for Adding Existing Sponsor */}
              <input
                type="checkbox"
                id={`add-sponsor-modal-${event.eventId}`}
                className="modal-toggle"
              />
              <div className="modal">
                <div className="modal-box">
                  <h3 className="font-bold text-lg">Add Existing Sponsor</h3>
                  <form action={linkSponsorToEvent.bind(null, event.eventId)}>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Sponsor</span>
                      </label>
                      <select
                        name="sponsorId"
                        className="select select-bordered w-full"
                        required
                      >
                        <option value="">Select a sponsor</option>
                        {sponsors.map((sponsor) => (
                          <option
                            key={sponsor.sponsorId}
                            value={sponsor.sponsorId}
                          >
                            {sponsor.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">
                          Contribution Amount (USD)
                        </span>
                      </label>
                      <input
                        type="number"
                        name="amount"
                        step="0.01"
                        min="0"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                    <div className="modal-action">
                      <button type="submit" className="btn btn-primary">
                        Add
                      </button>
                      <label
                        htmlFor={`add-sponsor-modal-${event.eventId}`}
                        className="btn"
                      >
                        Cancel
                      </label>
                    </div>
                  </form>
                </div>
              </div>

              {/* Modal for Creating New Sponsor */}
              <input
                type="checkbox"
                id={`create-sponsor-modal-${event.eventId}`}
                className="modal-toggle"
              />
              <div className="modal">
                <div className="modal-box">
                  <h3 className="font-bold text-lg">Create New Sponsor</h3>
                  <form action={createSponsor.bind(null, event.eventId)}>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Sponsor Name</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Phone Number</span>
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Image URL</span>
                      </label>
                      <input
                        type="url"
                        name="image"
                        className="input input-bordered w-full"
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">
                          Contribution Amount (USD)
                        </span>
                      </label>
                      <input
                        type="number"
                        name="amount"
                        step="0.01"
                        min="0"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                    <div className="modal-action">
                      <button type="submit" className="btn btn-primary">
                        Create and Add
                      </button>
                      <label
                        htmlFor={`create-sponsor-modal-${event.eventId}`}
                        className="btn"
                      >
                        Cancel
                      </label>
                    </div>
                  </form>
                </div>
              </div>

              {/* Modal for Editing EventSponsor */}
              {event.EventSponsor.map((eventSponsor) => (
                <div key={eventSponsor.eventSponsorId}>
                  <input
                    type="checkbox"
                    id={`edit-sponsor-modal-${eventSponsor.eventSponsorId}`}
                    className="modal-toggle"
                  />
                  <div className="modal">
                    <div className="modal-box">
                      <h3 className="font-bold text-lg">Edit Sponsor</h3>
                      <form
                        action={updateEventSponsor.bind(
                          null,
                          eventSponsor.eventSponsorId
                        )}
                      >
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Sponsor Name</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            defaultValue={eventSponsor.sponsor.name}
                            className="input input-bordered w-full"
                            required
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Email</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            defaultValue={eventSponsor.sponsor.email}
                            className="input input-bordered w-full"
                            required
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Phone Number</span>
                          </label>
                          <input
                            type="tel"
                            name="phoneNumber"
                            defaultValue={eventSponsor.sponsor.phoneNumber}
                            className="input input-bordered w-full"
                            required
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Image URL</span>
                          </label>
                          <input
                            type="url"
                            name="image"
                            defaultValue={eventSponsor.sponsor.image}
                            className="input input-bordered w-full"
                            placeholder="https://example.com/logo.png"
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">
                              Contribution Amount (USD)
                            </span>
                          </label>
                          <input
                            type="number"
                            name="amount"
                            step="0.01"
                            min="0"
                            defaultValue={eventSponsor.amount}
                            className="input input-bordered w-full"
                            required
                          />
                        </div>
                        <div className="modal-action">
                          <button type="submit" className="btn btn-primary">
                            Update
                          </button>
                          <label
                            htmlFor={`edit-sponsor-modal-${eventSponsor.eventSponsorId}`}
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
