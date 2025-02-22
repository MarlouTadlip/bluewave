import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
     <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-lg bg-base-100 p-8">
        <h2 className="text-3xl font-bold text-center text-base-content mb-6">Login</h2>
        
        <form>
          {/* Username/Email Field */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-base-content">Email</span>
            </label>
            <input type="email" placeholder="Enter your email" className="input input-bordered" required />
          </div>

          {/* Password Field */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-base-content">Password</span>
            </label>
            <input type="password" placeholder="Enter your password" className="input input-bordered" required />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center mb-4">
            <label className="label cursor-pointer">
              <input type="checkbox" className="checkbox checkbox-primary" />
              <span className="ml-2 text-sm text-base-content">Remember me</span>
            </label>
            <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
          </div>

          {/* Login Button */}
          <button className="btn btn-primary w-full">Login</button>
        </form>

        {/* Divider */}
        <div className="divider text-base-content">or</div>

        {/* Social Login Buttons */}
        <button className="btn btn-outline w-full mb-2">
          <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M24 9.5c3.15 0 5.91 1.11 8.08 2.95l6.01-6.01C33.92 3.15 29.18 1 24 1 14.72 1 6.93 6.58 3 14.14l7.38 5.7C12.07 14.7 17.54 9.5 24 9.5z" />
            <path fill="#34A853" d="M46.15 24.33c0-1.56-.14-3.06-.4-4.53H24v9.08h12.64c-.6 3.2-2.24 5.91-4.72 7.71l7.38 5.7C43.11 37.92 46.15 31.85 46.15 24.33z" />
          </svg>
          Continue with Google
        </button>

        {/* Sign Up Link */}
        <p className="text-sm text-center mt-4 text-base-content">
          Don&apos;t have an account? <Link href='/register'>Sign up</Link>
        </p>
      </div>
    </div>
  )
}

export default page
