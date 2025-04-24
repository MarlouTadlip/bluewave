"use client";
import { createUser } from "@/features/users/actions/users";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Page = () => {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const handleSubmit = async (formData: FormData) => {
    const result = await createUser(formData);
    if (result) {
      setMessage(result.message);
      setSuccess(result.success);
    }
  };

  useEffect(() => {
    if (message) {
      Swal.fire({
        icon: success ? "success" : "error",
        title: success ? "Success" : "Oops...",
        text: message,
        confirmButtonColor: success ? "#3085d6" : "#d33",
      }).then(() => {
        setMessage("");
        setSuccess(false);
      });
    }
  }, [message, success]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm md:max-w-lg shadow-lg bg-base-100 p-8">
        <h2 className="text-3xl font-bold text-center text-base-content mb-6">
          Sign Up
        </h2>

        <form action={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-base-content">Full Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="input input-bordered"
              name="name"
              required
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-base-content">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered"
              name="email"
              required
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-base-content">
                Contact Number
              </span>
            </label>
            <input
              type="number"
              placeholder="Enter your contact number"
              className="input input-bordered"
              name="phone"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered"
                name="password"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">
                  Confirm Password
                </span>
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="input input-bordered"
                name="confirmpass"
                required
              />
            </div>
          </div>

          <button className="btn btn-primary w-full mt-6">Sign Up</button>
        </form>

        <div className="divider text-base-content">or</div>

        <button className="btn btn-outline w-full mb-2">
          <svg
            className="w-5 h-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
          >
            <path
              fill="#4285F4"
              d="M24 9.5c3.15 0 5.91 1.11 8.08 2.95l6.01-6.01C33.92 3.15 29.18 1 24 1 14.72 1 6.93 6.58 3 14.14l7.38 5.7C12.07 14.7 17.54 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.15 24.33c0-1.56-.14-3.06-.4-4.53H24v9.08h12.64c-.6 3.2-2.24 5.91-4.72 7.71l7.38 5.7C43.11 37.92 46.15 31.85 46.15 24.33z"
            />
          </svg>
          Sign up with Google
        </button>

        <p className="text-sm text-center mt-4 text-base-content">
          Already have an account?{" "}
          <Link href="/login" className="text-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;
