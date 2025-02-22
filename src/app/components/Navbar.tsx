import React from 'react';
import ThemeSwitcher from '../context/themecontroller';
import Link from 'next/link';
import { House,Info,Users } from 'lucide-react'

const Navbar = ({ handleScroll }: { handleScroll: (id: string) => void }) => {
  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
            <li><button onClick={() => handleScroll("home")}><House/>Home</button></li>
            <li><button onClick={() => handleScroll("about")}><Info/>About</button></li>
            <li><button onClick={() => handleScroll("team")}><Users/>Team</button></li>
          </ul>
        </div>
        <img src='/favicon.png' alt='logo' className="hidden lg:block h-10 w-auto ml-2" />
        <a className="btn btn-ghost text-xl">BlueWave</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><button onClick={() => handleScroll("home")}><House/>Home</button></li>
          <li><button onClick={() => handleScroll("about")}><Info/>About</button></li>
          <li><button onClick={() => handleScroll("team")}><Users/>Team</button></li>
        </ul>
      </div>
      <div className="navbar-end">
        <ThemeSwitcher />
        <Link href="/login" className="btn btn-primary mr-2 ml-5">Login</Link>
        <Link href="/register" className="btn btn-secondary">Register</Link>
      </div>
    </div>
  );
};

export default Navbar;
