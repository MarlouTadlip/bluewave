"use client"

import { useState, useEffect } from "react"
import ThemeSwitcher from "../context/themecontroller"
import Link from "next/link"
import { Home, Info, Users, Menu, X, Calendar, ImageIcon, MessageSquareQuote, ChevronDown } from "lucide-react"

const Navbar = ({ handleScroll }: { handleScroll: (id: string) => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [scrolled, setScrolled] = useState(false)

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Close mobile menu when clicking a link
  const handleNavClick = (id: string) => {
    handleScroll(id)
    setActiveSection(id)
    setIsMenuOpen(false)
  }

  // Track scroll position to change navbar style and detect active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY

      // Change navbar style when scrolled
      if (scrollPosition > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }

      // Detect active section based on scroll position
      const sections = ["home", "about", "impact", "events", "team", "testimonials"]

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          // If the top of the section is near the top of the viewport
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Navigation items
  const navItems = [
    { id: "home", label: "Home", icon: <Home className="w-4 h-4" /> },
    { id: "about", label: "About", icon: <Info className="w-4 h-4" /> },
    { id: "impact", label: "Impact", icon: <ImageIcon className="w-4 h-4" /> },
    { id: "events", label: "Events", icon: <Calendar className="w-4 h-4" /> },
    { id: "team", label: "Team", icon: <Users className="w-4 h-4" /> },
    { id: "testimonials", label: "Testimonials", icon: <MessageSquareQuote className="w-4 h-4" /> },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled ? "bg-base-100/95 backdrop-blur-md shadow-md" : "bg-base-100/80 backdrop-blur-sm"
      }`}
    >
      <div className="navbar container mx-auto px-4 py-2">
        {/* Navbar Start */}
        <div className="navbar-start">
          <div className="lg:hidden">
            <button onClick={toggleMenu} className="btn btn-ghost btn-circle" aria-label="Toggle menu">
              {isMenuOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <img src="/favicon.png" alt="BlueWave Cebu logo" className="h-10 w-auto hidden lg:block" />
            <span className="text-primary">BlueWave</span>
            <span className="text-base-content font-normal text-sm hidden md:inline-block">Cebu</span>
          </Link>
        </div>

        {/* Navbar Center - Desktop Navigation */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal">
            {navItems.map((item) => (
              <li key={item.id} className="px-1">
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition duration-300 ${
                    activeSection === item.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-base-200 hover:text-primary"
                  }`}
                  aria-current={activeSection === item.id ? "page" : undefined}
                >
                  {item.icon} {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Navbar End */}
        <div className="navbar-end flex items-center gap-3">
          <ThemeSwitcher />
          <div className="hidden sm:flex gap-2">
            <Link href="/login" className="btn btn-sm btn-outline btn-primary">
              Login
            </Link>
            <Link href="/register" className="btn btn-sm btn-primary">
              Register
            </Link>
          </div>
          <div className="dropdown dropdown-end sm:hidden">
            <div tabIndex={0} role="button" className="btn btn-sm btn-primary">
              Account <ChevronDown size={16} />
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-36 mt-2">
              <li>
                <Link href="/login">Login</Link>
              </li>
              <li>
                <Link href="/register">Register</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Slide Down */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="bg-base-100 shadow-inner border-t">
          <ul className="menu menu-md p-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 ${
                    activeSection === item.id ? "bg-primary/10 text-primary font-medium" : ""
                  }`}
                  aria-current={activeSection === item.id ? "page" : undefined}
                >
                  {item.icon} {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Navbar

