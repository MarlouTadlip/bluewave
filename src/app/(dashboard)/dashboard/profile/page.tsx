import { Calendar, MapPin, Award } from "lucide-react";
import ProfileImage from "@/features/users/components/profileimage";
export default function page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-gray-500">View and edit your personal information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card bg-base-100 shadow-xl md:col-span-2">
          <div className="card-body">
            <h2 className="card-title">Personal Information</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center gap-4">
                <div className="avatar">
                  <div className="w-32 h-32 rounded-full">
                    <img src="/placeholder-user.jpg" alt="User" />
                  </div>
                </div>
                <button className="btn btn-primary">Change Photo</button>
                <ProfileImage />
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">First Name</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      defaultValue="John"
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Last Name</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      defaultValue="Doe"
                    />
                  </div>
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    className="input input-bordered w-full"
                    defaultValue="john.doe@example.com"
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    className="input input-bordered w-full"
                    defaultValue="+63 912 345 6789"
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Address</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    defaultValue="123 Main St, Cebu City"
                  />
                </div>
                <button className="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Volunteer Information</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span>Volunteer Since</span>
                </div>
                <span className="font-medium">January 2025</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-gray-500" />
                  <span>Volunteer Level</span>
                </div>
                <span className="font-medium">Level 3 (Eco Warrior)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span>Preferred Locations</span>
                </div>
                <div className="flex gap-2">
                  <span className="badge badge-outline">Mactan</span>
                  <span className="badge badge-outline">Cordova</span>
                </div>
              </div>
              <div className="pt-4">
                <label className="label">
                  <span className="label-text">Bio</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full min-h-[100px]"
                  defaultValue="Passionate about protecting Cebu's coastline and marine life. I enjoy participating in beach cleanups and mangrove restoration activities."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Preferences</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="label">
                  <span className="label-text">
                    Cleanup Activity Preferences
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox"
                        defaultChecked
                      />
                      <span className="label-text">Beach Cleanup</span>
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox"
                        defaultChecked
                      />
                      <span className="label-text">Mangrove Restoration</span>
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox"
                        defaultChecked
                      />
                      <span className="label-text">Coastal Cleanup</span>
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input type="checkbox" className="checkbox" />
                      <span className="label-text">River Cleanup</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="label">
                  <span className="label-text">Notification Preferences</span>
                </label>
                <div className="space-y-2">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Email Notifications</span>
                      <input
                        type="checkbox"
                        className="toggle"
                        defaultChecked
                      />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">SMS Notifications</span>
                      <input
                        type="checkbox"
                        className="toggle"
                        defaultChecked
                      />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Event Reminders</span>
                      <input
                        type="checkbox"
                        className="toggle"
                        defaultChecked
                      />
                    </label>
                  </div>
                </div>
              </div>
              <button className="btn btn-primary w-full">
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
