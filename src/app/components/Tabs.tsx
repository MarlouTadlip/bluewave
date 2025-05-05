"use client";
import { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, ChevronRight, Award, MapPin } from "lucide-react";

interface TabProps {
  upcomingEvents: {
    id: string;
    name: string;
    date: string;
    location: string;
  }[];
  participationHistory: {
    id: string;
    name: string;
    date: string;
    hours: number;
    trashCollected: string;
  }[];
  impactStats: { category: string; weight: string; percentage: string }[];
  achievements: { name: string; description: string }[];
}

export function Tabs({
  upcomingEvents,
  participationHistory,
  impactStats,
  achievements,
}: TabProps) {
  const [activeTab, setActiveTab] = useState("upcoming");

  return (
    <div>
      <div className="tabs tabs-boxed">
        <a
          className={`tab ${activeTab === "upcoming" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming Events
        </a>
        <a
          className={`tab ${activeTab === "history" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          Participation History
        </a>
        <a
          className={`tab ${activeTab === "impact" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("impact")}
        >
          My Impact
        </a>
      </div>

      {/* Upcoming Events */}
      <div className={`${activeTab === "upcoming" ? "block" : "hidden"} mt-6`}>
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Registered Events</h2>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                  >
                    <div className="avatar placeholder">
                      <div className="bg-primary text-primary-content rounded-full w-12">
                        <span>
                          <Calendar className="h-6 w-6" />
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{event.name}</h3>
                      <p className="text-sm text-base-content/70 flex items-center gap-1 mt-1">
                        <Calendar className="h-3.5 w-3.5" /> {event.date} •{" "}
                        <MapPin className="h-3.5 w-3.5" /> {event.location}
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/events/${event.id}`}
                      className="btn btn-sm btn-outline btn-primary"
                    >
                      View Details
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-base-content/70">
                  No upcoming events registered.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Participation History */}
      <div className={`${activeTab === "history" ? "block" : "hidden"} mt-6`}>
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Past Participation</h2>
            <div className="space-y-4">
              {participationHistory.length > 0 ? (
                participationHistory.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                  >
                    <div className="avatar placeholder">
                      <div className="bg-success text-success-content rounded-full w-12">
                        <span>
                          <Clock className="h-6 w-6" />
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{event.name}</h3>
                      <p className="text-sm text-base-content/70 flex items-center gap-1 mt-1">
                        <Calendar className="h-3.5 w-3.5" /> {event.date} •{" "}
                        <Clock className="h-3.5 w-3.5" /> {event.hours} hours
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-success">
                        {event.trashCollected}
                      </p>
                      <p className="text-xs text-base-content/70">
                        Trash collected
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-base-content/70">
                  No past participation recorded.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* My Impact */}
      <div className={`${activeTab === "impact" ? "block" : "hidden"} mt-6`}>
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Environmental Impact</h2>
            <div className="space-y-6">
              <div className="space-y-4">
                {impactStats.length > 0 ? (
                  impactStats.map((stat) => (
                    <div key={stat.category} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <div className="badge badge-primary badge-xs"></div>
                          {stat.category}
                        </span>
                        <span className="text-sm font-medium">
                          {stat.weight} kg
                        </span>
                      </div>
                      <progress
                        className="progress progress-primary w-full"
                        value={stat.percentage}
                        max="100"
                      ></progress>
                      <p className="text-xs text-base-content/70">
                        {stat.percentage}% of your total collection
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-base-content/70">
                    No cleanup data recorded.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {achievements.length > 0 ? (
                  achievements.map((achievement) => (
                    <div key={achievement.name} className="card bg-base-200">
                      <div className="card-body p-4 flex items-center gap-4">
                        <div className="avatar placeholder">
                          <div className="bg-primary text-primary-content rounded-full w-12">
                            <span>
                              <Award className="h-6 w-6" />
                            </span>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium">{achievement.name}</h3>
                          <p className="text-sm text-base-content/70">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-base-content/70">
                    No achievements earned yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
