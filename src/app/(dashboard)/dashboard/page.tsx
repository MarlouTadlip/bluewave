import {
  Calendar,
  Clock,
  ChevronRight,
  Award,
  Trash2,
  MapPin,
  User,
} from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          My Dashboard
        </h1>
        <p className="text-base-content/70">
          Welcome back! Here&apos;s an overview of your BlueWave activities.
        </p>
      </div>

      {/* User Profile Summary */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body p-0">
          <div className="bg-gradient-to-r from-primary to-secondary h-24 relative">
            <div className="absolute -bottom-12 left-6">
              <div className="avatar">
                <div className="w-24 h-24 rounded-full ring ring-base-100 ring-offset-base-100 ring-offset-2">
                  <User size={100} />
                </div>
              </div>
            </div>
          </div>
          <div className="pt-16 pb-6 px-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <div className="space-y-1 flex-1">
                <h2 className="text-2xl font-bold">John Doe</h2>
                <p className="text-base-content/70">
                  Volunteer since January 2025
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <div className="badge badge-primary">Beach Cleanup</div>
                  <div className="badge badge-secondary">Coastal Cleanup</div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <button className="btn btn-primary">Edit Profile</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Statistics */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Calendar className="h-8 w-8" />
            </div>
            <div className="stat-title">Events Attended</div>
            <div className="stat-value">12</div>
            <div className="stat-desc text-success">+2 from last month</div>
          </div>
        </div>

        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <Clock className="h-8 w-8" />
            </div>
            <div className="stat-title">Volunteer Hours</div>
            <div className="stat-value">36 hrs</div>
            <div className="stat-desc text-success">+6 hrs from last month</div>
          </div>
        </div>
      </div>

      <div className="tabs tabs-boxed">
        <a className="tab tab-active">Upcoming Events</a>
        <a className="tab">Participation History</a>
        <a className="tab">My Impact</a>
      </div>

      {/* Upcoming Events Tab Content */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Registered Events</h2>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
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
                  href={`/dashboard/events/${index}`}
                  className="btn btn-sm btn-outline btn-primary"
                >
                  View Details
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Participation History Tab Content (Hidden by default) */}
      <div className="hidden">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Past Participation</h2>
            <div className="space-y-4">
              {participationHistory.map((event, index) => (
                <div
                  key={index}
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
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* My Impact Tab Content (Hidden by default) */}
      <div className="hidden">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Environmental Impact</h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <div className="badge badge-primary badge-xs"></div>
                      Plastic Waste
                    </span>
                    <span className="text-sm font-medium">25 kg</span>
                  </div>
                  <progress
                    className="progress progress-primary w-full"
                    value="55"
                    max="100"
                  ></progress>
                  <p className="text-xs text-base-content/70">
                    55% of your total collection
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <div className="badge badge-success badge-xs"></div>
                      Metal Waste
                    </span>
                    <span className="text-sm font-medium">10 kg</span>
                  </div>
                  <progress
                    className="progress progress-success w-full"
                    value="22"
                    max="100"
                  ></progress>
                  <p className="text-xs text-base-content/70">
                    22% of your total collection
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <div className="badge badge-secondary badge-xs"></div>
                      Glass
                    </span>
                    <span className="text-sm font-medium">5 kg</span>
                  </div>
                  <progress
                    className="progress progress-secondary w-full"
                    value="11"
                    max="100"
                  ></progress>
                  <p className="text-xs text-base-content/70">
                    11% of your total collection
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <div className="badge badge-warning badge-xs"></div>
                      Other Waste
                    </span>
                    <span className="text-sm font-medium">5 kg</span>
                  </div>
                  <progress
                    className="progress progress-warning w-full"
                    value="11"
                    max="100"
                  ></progress>
                  <p className="text-xs text-base-content/70">
                    11% of your total collection
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="card bg-base-200">
                  <div className="card-body p-4 flex items-center gap-4">
                    <div className="avatar placeholder">
                      <div className="bg-primary text-primary-content rounded-full w-12">
                        <span>
                          <Award className="h-6 w-6" />
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">Beach Protector</h3>
                      <p className="text-sm text-base-content/70">
                        Collected 25kg+ of beach waste
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card bg-base-200">
                  <div className="card-body p-4 flex items-center gap-4">
                    <div className="avatar placeholder">
                      <div className="bg-success text-success-content rounded-full w-12">
                        <span>
                          <Trash2 className="h-6 w-6" />
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">Waste Warrior</h3>
                      <p className="text-sm text-base-content/70">
                        Participated in 10+ cleanup events
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const upcomingEvents = [
  {
    name: "Mactan Beach Cleanup",
    date: "March 15, 2025",
    location: "Mactan Newtown Beach",
  },
  {
    name: "Talisay Coastal Cleanup",
    date: "March 22, 2025",
    location: "Talisay City Boardwalk",
  },
];

const participationHistory = [
  {
    name: "Talisay Coastal Cleanup",
    date: "February 15, 2025",
    hours: 3,
    trashCollected: "15 kg",
  },
  {
    name: "Liloan Beach Cleanup",
    date: "January 28, 2025",
    hours: 4,
    trashCollected: "18 kg",
  },
  {
    name: "Mactan Beach Cleanup",
    date: "January 10, 2025",
    hours: 3,
    trashCollected: "12 kg",
  },
];
