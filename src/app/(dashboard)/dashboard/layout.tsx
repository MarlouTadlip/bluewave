"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Home, Calendar, BarChart3, Clock, User, Menu, ChevronLeft, Bell, LogOut } from "lucide-react"
import type { UserRole } from "@/types"
import ThemeSwitcher from "../../context/themecontroller"

const getSidebarItems = (role: UserRole) => {
  const baseItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: User, label: "My Profile", href: "/dashboard/profile" },
  ]

  switch (role) {
    case "VOLUNTEER":
      return [
        ...baseItems,
        { icon: Calendar, label: "Upcoming Events", href: "/dashboard/upcoming-events" },
        { icon: Clock, label: "Participation History", href: "/dashboard/history" },
        { icon: BarChart3, label: "My Impact", href: "/dashboard/impact" },
      ]
    case "ORGANIZER":
      return [
        ...baseItems,
        { icon: Calendar, label: "Event Management", href: "/dashboard/events" },
        { icon: Clock, label: "Check-in/out", href: "/dashboard/checkin" },
        { icon: BarChart3, label: "Performance Metrics", href: "/dashboard/metrics" },
      ]
    case "ADMIN":
      return [
        ...baseItems,
        { icon: BarChart3, label: "System Statistics", href: "/dashboard/statistics" },
        { icon: Calendar, label: "Events Overview", href: "/dashboard/events" },
        { icon: User, label: "User Management", href: "/dashboard/users" },
      ]
    default:
      return baseItems
  }
}

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole?: UserRole // In a real app, this would come from auth context
}

export default function DashboardLayout({ children, userRole = "VOLUNTEER" }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const sidebarItems = getSidebarItems(userRole)

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="drawer-toggle"
        type="checkbox"
        className="drawer-toggle"
        checked={sidebarOpen}
        onChange={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="drawer-content flex flex-col min-h-screen bg-base-200">
        {/* Navbar */}
        <div className="navbar bg-base-100 border-b sticky top-0 z-30">
          <div className="flex-none lg:hidden">
            <label htmlFor="drawer-toggle" className="btn btn-square btn-ghost">
              <Menu className="h-5 w-5" />
            </label>
          </div>
          <div className="flex-1"></div>

          <div className="flex-none gap-2">
            <ThemeSwitcher/>

            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <Bell className="h-5 w-5" />
                  <span className="badge badge-xs badge-primary indicator-item"></span>
                </div>
              </label>
              <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-80 bg-base-100 shadow">
                <div className="card-body">
                  <h3 className="font-medium">Notifications</h3>
                  <p className="text-sm text-base-content/70">You have 3 unread messages.</p>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-3 p-2 hover:bg-base-200 rounded-lg">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-10">
                          <span>JD</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">New Event Update</p>
                        <p className="text-xs text-base-content/70">Mactan Beach Cleanup is at 90% capacity.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src="/placeholder-user.jpg" alt="User" />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link href="/dashboard/profile" className="justify-between">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link href="/logout" className="text-error">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>

      <div className="drawer-side z-40">
        <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
        <div className="menu p-4 w-64 h-full bg-base-100 text-base-content border-r">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b">
            <Link href="/dashboard" className="flex items-center gap-2">
            <Image src='/favicon.png' alt='logo' width={32} height={32} />
              <span className="text-xl font-bold">BlueWave</span>
            </Link>
            <button className="btn btn-sm btn-ghost ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>

          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    pathname === item.href ? "bg-primary text-primary-content" : "hover:bg-base-200"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

