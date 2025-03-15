"use client"

import type React from "react"

import { loginUser } from "@/app/actions/users"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react"

const LoginPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Validate form
  const validateForm = () => {
    let valid = true
    const newErrors = { email: "", password: "" }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      valid = false
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const formDataObj = new FormData()
      formDataObj.append("email", formData.email)
      formDataObj.append("password", formData.password)

      const result = await loginUser(formDataObj)

      if (result) {
        setMessage(result.message)
        setSuccess(result.success)
      }
    } catch (error) {
      console.error("Login error:", error)
      setMessage("An unexpected error occurred. Please try again.")
      setSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle notification and redirect
  useEffect(() => {
    if (message) {
      Swal.fire({
        title: success ? "Success" : "Oops...",
        text: message,
        icon: success ? "success" : "error",
      }).then(() => {
        if (success) {
          router.push("/dashboard")
        }
      })
    }
  }, [message, success, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md shadow-xl bg-base-100 overflow-hidden">
        <div className="bg-primary text-primary-content p-6 text-center">
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="mt-2 opacity-90">Sign in to continue to BlueWave Cebu</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`input input-bordered w-full pl-10 ${errors.email ? "input-error" : ""}`}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" />
              </div>
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`input input-bordered w-full pl-10 ${errors.password ? "input-error" : ""}`}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.password}
                  </span>
                </label>
              )}
            </div>

            <div className="flex justify-between items-center">
              <label className="label cursor-pointer inline-flex items-center">
                <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" />
                <span className="ml-2 text-sm">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="divider text-base-content/60 my-6">or continue with</div>

          <div className="grid grid-cols-1 gap-3">
            <button className="btn btn-outline btn-neutral flex items-center justify-center gap-2">
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              Sign in with Google
            </button>
          </div>

          <p className="text-sm text-center mt-6 text-base-content/70">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

  