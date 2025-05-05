"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { joinEvent } from "@/features/events/actions/events";

interface TabProps {
  allEvents: {
    id: string;
    title: string;
    date: string;
    location: string;
    isRegistered: boolean;
  }[];
  upcomingEvents: {
    id: string;
    title: string;
    date: string;
    location: string;
  }[];
  pastEvents: {
    id: string;
    title: string;
    date: string;
    location: string;
    hours: number;
    wasteCollected: string;
  }[];
  userRole: string;
  userId: string;
}

export function Tabs({
  allEvents,
  upcomingEvents,
  pastEvents,
  userRole,
  userId,
}: TabProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [message, setMessage] = useState<{
    success: boolean;
    text: string;
  } | null>(null);

  const handleJoinEvent = async (eventId: string) => {
    startTransition(async () => {
      const result = await joinEvent(eventId, userId);
      setMessage({ success: result.success, text: result.message });
      if (result.success) {
        router.refresh(); // Refresh to update event registration status
      }
      setTimeout(() => setMessage(null), 3000); // Clear message after 3s
    });
  };

  return (
    <div>
      {message && (
        <div
          className={`alert ${
            message.success ? "alert-success" : "alert-error"
          } mb-4`}
        >
          {message.text}
        </div>
      )}

      <div className="tabs tabs-boxed mb-6">
        <a
          className={`tab ${activeTab === "all" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All Events
        </a>
        <a
          className={`tab ${activeTab === "upcoming" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming Events
        </a>
        <a
          className={`tab ${activeTab === "past" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("past")}
        >
          Past Events
        </a>
      </div>

      {/* All Events */}
      <div className={`${activeTab === "all" ? "block" : "hidden"}`}>
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">All Events</h2>
            {allEvents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Date</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allEvents.map((event) => (
                      <tr key={event.id} className="hover">
                        <td>{event.title}</td>
                        <td>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-4 w-4" /> {event.date}
                          </span>
                        </td>
                        <td>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-4 w-4" /> {event.location}
                          </span>
                        </td>
                        <td>
                          {event.isRegistered ? (
                            <span className="badge badge-success">
                              Registered
                            </span>
                          ) : (
                            <span className="badge badge-outline">
                              Not Registered
                            </span>
                          )}
                        </td>
                        <td className="flex gap-2">
                          <Link
                            href={`/dashboard/events/${event.id}`}
                            className="btn btn-sm btn-outline btn-primary"
                          >
                            View Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                          {userRole === "VOLUNTEER" && !event.isRegistered && (
                            <button
                              onClick={() => handleJoinEvent(event.id)}
                              className="btn btn-sm btn-accent"
                              disabled={isPending}
                            >
                              <UserPlus className="h-4 w-4" /> Join Event
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-base-content/70">No events available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className={`${activeTab === "upcoming" ? "block" : "hidden"}`}>
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Upcoming Events</h2>
            {upcomingEvents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Date</th>
                      <th>Location</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingEvents.map((event) => (
                      <tr key={event.id} className="hover">
                        <td>{event.title}</td>
                        <td>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-4 w-4" /> {event.date}
                          </span>
                        </td>
                        <td>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-4 w-4" /> {event.location}
                          </span>
                        </td>
                        <td>
                          <Link
                            href={`/dashboard/events/${event.id}`}
                            className="btn btn-sm btn-outline btn-primary"
                          >
                            View Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-base-content/70">
                No upcoming events registered. Join an event today!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Past Events */}
      <div className={`${activeTab === "past" ? "block" : "hidden"}`}>
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Past Events</h2>
            {pastEvents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Date</th>
                      <th>Location</th>
                      <th>Hours</th>
                      <th>Waste Collected</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastEvents.map((event) => (
                      <tr key={event.id} className="hover">
                        <td>{event.title}</td>
                        <td>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-4 w-4" /> {event.date}
                          </span>
                        </td>
                        <td>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-4 w-4" /> {event.location}
                          </span>
                        </td>
                        <td>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-4 w-4" /> {event.hours} hrs
                          </span>
                        </td>
                        <td>
                          <span className="inline-flex items-center gap-1">
                            <Trash2 className="h-4 w-4" />{" "}
                            {event.wasteCollected}
                          </span>
                        </td>
                        <td>
                          <Link
                            href={`/dashboard/events/${event.id}`}
                            className="btn btn-sm btn-outline btn-primary"
                          >
                            View Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-base-content/70">
                No past events recorded. Participate in an event!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
