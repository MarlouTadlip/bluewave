"use client";
import { useActionState, useState } from "react";
import { updateUser as originalUpdateUser } from "../(dashboard)/dashboard/profile/page";

const updateUser = async (
  state: {
    success: boolean;
    message: string;
    user?: { fullName: string; email: string; phoneNumber: string };
  } | null,
  formData?: FormData
) => {
  if (!formData) return null;
  const result = await originalUpdateUser(formData);
  return result;
};

export default function ProfileForm({
  user,
}: {
  user: { fullName: string; email: string; phoneNumber: string; role: string };
}) {
  const [formState, setFormState] = useState({
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
  });
  const [state, formAction] = useActionState<{
    success: boolean;
    message: string;
    user?: { fullName: string; email: string; phoneNumber: string };
  } | null>(updateUser, null);

  // Update form state on successful submission
  if (state?.success && state.user) {
    setFormState({
      fullName: state.user.fullName,
      email: state.user.email,
      phoneNumber: state.user.phoneNumber,
    });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form action={formAction} className="flex-1 space-y-4">
      {state && (
        <div
          className={`alert ${state.success ? "alert-success" : "alert-error"}`}
        >
          {state.message}
        </div>
      )}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Full Name</span>
        </label>
        <input
          type="text"
          name="fullName"
          className="input input-bordered w-full"
          value={formState.fullName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          name="email"
          className="input input-bordered w-full"
          value={formState.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Phone Number</span>
        </label>
        <input
          type="tel"
          name="phoneNumber"
          className="input input-bordered w-full"
          value={formState.phoneNumber}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Role</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={user.role}
          disabled
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Save Changes
      </button>
    </form>
  );
}
