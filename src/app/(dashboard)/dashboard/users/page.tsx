import React from "react";
import { prisma } from "@/lib/db";
import { getSession } from "@/features/users/actions/session";
import { redirect } from "next/navigation";
import { UserPlus, Edit, UserX, UserCheck } from "lucide-react";
import {
  createUser,
  updateUser,
  toggleUserSuspension,
} from "./actions/userActions";

export default async function UsersPage({
  searchParams,
}: {
  searchParams?: { error?: string; success?: string };
}) {
  const session = await getSession();
  if (!session || typeof session.userId !== "string") {
    redirect("/login");
  }

  const userId = session.userId;
  const user = await prisma.user.findUnique({
    where: { userId },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          User Management
        </h1>
        <p className="text-red-500">
          Access denied. Only admins can access this page. Your role:{" "}
          {user?.role || "Unknown"}
        </p>
      </div>
    );
  }

  const users = await prisma.user.findMany({
    select: {
      userId: true,
      fullName: true,
      email: true,
      phoneNumber: true,
      role: true,
      createdAt: true,
      isSuspended: true,
    },
    where: { isSuspended: false },
    orderBy: { createdAt: "desc" },
  });

  const suspendedUsers = await prisma.user.findMany({
    select: {
      userId: true,
      fullName: true,
      email: true,
      phoneNumber: true,
      role: true,
      createdAt: true,
      isSuspended: true,
    },
    where: { isSuspended: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          User Management
        </h1>
        <p className="text-gray-500">
          Manage users, including creating, editing, and suspending user
          accounts
        </p>
        {searchParams?.error && (
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
            <span>{searchParams.error}</span>
          </div>
        )}
        {searchParams?.success && (
          <div className="alert alert-success mt-4">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{searchParams.success}</span>
          </div>
        )}
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h2 className="card-title">Active Users</h2>
            <div className="flex gap-2">
              <label
                htmlFor="create-user-modal"
                className="btn btn-primary btn-sm"
              >
                <UserPlus className="h-4 w-4" /> Add User
              </label>
              <label
                htmlFor="suspended-users-modal"
                className="btn btn-outline btn-sm"
              >
                View Suspended Users
              </label>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-500">
                      No active users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.userId}>
                      <td>{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>{user.phoneNumber}</td>
                      <td>{user.role}</td>
                      <td>
                        <span className="badge badge-success">Active</span>
                      </td>
                      <td>
                        {user.createdAt.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <label
                            htmlFor={`edit-user-modal-${user.userId}`}
                            className="btn btn-secondary btn-sm"
                          >
                            <Edit className="h-4 w-4" /> Edit
                          </label>
                          <label
                            htmlFor={`suspend-user-modal-${user.userId}`}
                            className="btn btn-error btn-sm"
                          >
                            <UserX className="h-4 w-4" /> Suspend
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      <input type="checkbox" id="create-user-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create New User</h3>
          <div id="email-error-alert" className="alert alert-error hidden mt-4">
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
            <span>Invalid Email Format</span>
          </div>
          <form id="create-user-form" action={createUser}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
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
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$"
                title="Invalid email format. Must end with .com"
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
                <span className="label-text">Role</span>
              </label>
              <select
                name="role"
                className="select select-bordered w-full"
                required
              >
                <option value="VOLUNTEER">Volunteer</option>
                <option value="ORGANIZER">Organizer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Create
              </button>
              <label htmlFor="create-user-modal" className="btn">
                Cancel
              </label>
            </div>
          </form>
        </div>
      </div>

      {/* Client-side script for email validation */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.getElementById('create-user-form').addEventListener('submit', function(event) {
              const emailInput = this.querySelector('input[name="email"]');
              const email = emailInput.value.toLowerCase();
              const errorAlert = document.getElementById('email-error-alert');
              
              if (!email.endsWith('.com')) {
                event.preventDefault();
                errorAlert.classList.remove('hidden');
                setTimeout(() => {
                  errorAlert.classList.add('hidden');
                }, 3000); // Hide alert after 3 seconds
              } else {
                errorAlert.classList.add('hidden');
              }
            });
          `,
        }}
      />

      {/* Edit User Modals */}
      {users.map((user) => (
        <React.Fragment key={user.userId}>
          <input
            type="checkbox"
            id={`edit-user-modal-${user.userId}`}
            className="modal-toggle"
          />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Edit User: {user.fullName}</h3>
              <form action={updateUser.bind(null, user.userId)}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    defaultValue={user.fullName}
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
                    defaultValue={user.phoneNumber}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Role</span>
                  </label>
                  <select
                    name="role"
                    className="select select-bordered w-full"
                    defaultValue={user.role}
                    required
                  >
                    <option value="VOLUNTEER">Volunteer</option>
                    <option value="ORGANIZER">Organizer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="modal-action">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                  <label
                    htmlFor={`edit-user-modal-${user.userId}`}
                    className="btn"
                  >
                    Cancel
                  </label>
                </div>
              </form>
            </div>
          </div>
        </React.Fragment>
      ))}

      {/* Suspend User Modals */}
      {users.map((user) => (
        <React.Fragment key={user.userId}>
          <input
            type="checkbox"
            id={`suspend-user-modal-${user.userId}`}
            className="modal-toggle"
          />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">
                Suspend User: {user.fullName}
              </h3>
              <p className="py-4">
                Are you sure you want to suspend this user? They will lose
                access to the system until reinstated.
              </p>
              <form action={toggleUserSuspension.bind(null, user.userId, true)}>
                <div className="modal-action">
                  <button type="submit" className="btn btn-error">
                    Suspend
                  </button>
                  <label
                    htmlFor={`suspend-user-modal-${user.userId}`}
                    className="btn"
                  >
                    Cancel
                  </label>
                </div>
              </form>
            </div>
          </div>
        </React.Fragment>
      ))}

      {/* Suspended Users Modal */}
      <input
        type="checkbox"
        id="suspended-users-modal"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box max-w-4xl">
          <h3 className="font-bold text-lg">Suspended Users</h3>
          <div className="overflow-x-auto mt-4">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {suspendedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-500">
                      No suspended users found.
                    </td>
                  </tr>
                ) : (
                  suspendedUsers.map((user) => (
                    <tr key={user.userId}>
                      <td>{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>{user.phoneNumber}</td>
                      <td>{user.role}</td>
                      <td>
                        <span className="badge badge-error">Suspended</span>
                      </td>
                      <td>
                        {user.createdAt.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td>
                        <label
                          htmlFor={`reinstate-user-modal-${user.userId}`}
                          className="btn btn-success btn-sm"
                        >
                          <UserCheck className="h-4 w-4" /> Reinstate
                        </label>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="modal-action">
            <label htmlFor="suspended-users-modal" className="btn">
              Close
            </label>
          </div>
        </div>
      </div>

      {/* Reinstate User Modals */}
      {suspendedUsers.map((user) => (
        <React.Fragment key={user.userId}>
          <input
            type="checkbox"
            id={`reinstate-user-modal-${user.userId}`}
            className="modal-toggle"
          />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">
                Reinstate User: {user.fullName}
              </h3>
              <p className="py-4">
                Are you sure you want to reinstate this user? They will regain
                access to the system.
              </p>
              <form
                action={toggleUserSuspension.bind(null, user.userId, false)}
              >
                <div className="modal-action">
                  <button type="submit" className="btn btn-success">
                    Reinstate
                  </button>
                  <label
                    htmlFor={`reinstate-user-modal-${user.userId}`}
                    className="btn"
                  >
                    Cancel
                  </label>
                </div>
              </form>
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
