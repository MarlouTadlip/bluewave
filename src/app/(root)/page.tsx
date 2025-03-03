"use client";
import React from "react";
import Wave from "react-wavify";
import Link from "next/link";
import { motion } from "motion/react";

export default function Home() {
  return (
    <div>
      {/* Hero Section - Stats on Right with Wave Background */}
      <div id="home" className="relative min-h-screen bg-base-200 flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 px-6 lg:px-16 max-w-7xl mx-auto z-10">
        
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
          <div className="text-center lg:text-left max-w-lg">
            <h1 className="mb-5 text-4xl md:text-5xl font-bold text-base-content">
              Protect Cebu’s Coastline – One Cleanup at a Time
            </h1>
            <p className="mb-5 text-lg text-base-content">
              Join us in making Cebu’s shores cleaner and healthier for future generations. 
              Be the wave of change today!
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link href="/register"><button className="btn btn-primary w-full sm:w-auto">Volunteer Now</button></Link>
              <button className="btn btn-secondary w-full sm:w-auto">Donate</button>
            </div>
          </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.4,
                scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
            }}
          >
          <div className="stats shadow-lg w-full lg:w-auto bg-base-300 rounded-lg">
            <div className="stat">
              <div className="stat-title text-base-content">Total Volunteers</div>
              <div className="stat-value text-primary">5,200+</div>
              <div className="stat-desc">Since 2022</div>
            </div>
            <div className="stat">
              <div className="stat-title text-base-content">Cleanups Organized</div>
              <div className="stat-value text-secondary">85+</div>
              <div className="stat-desc">Across Cebu</div>
            </div>
            <div className="stat">
              <div className="stat-title text-base-content">Trash Collected</div>
              <div className="stat-value text-accent">12,500 kg</div>
              <div className="stat-desc">And counting!</div>
            </div>
          </div>
          </motion.div>
        </div>
        
        {/* Wave Background */}
        <div className="absolute bottom-0 left-0 w-full -mb-2">
          <Wave
            fill="#3B82F6" /* Blue with transparency */
            paused={false}
            options={{
              height: 10,
              amplitude: 30,
              speed: 0.25,
              points: 5,
            }}
          />
        </div>
      </div>
      <section id="about" className="py-16 px-6 text-center bg-[#3B82F6]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-white">About Us</h2>
          <p className="text-lg text-white">
            BlueWave Cebu is dedicated to preserving our beautiful coastline through community-driven cleanups.
            We believe in action, education, and sustainable efforts to keep our beaches clean for future generations.
          </p>
        </div>
        <div className="flex justify-center items-center mt-10">
          <div className="w-full max-w-3xl aspect-w-16 aspect-h-9">
          <iframe width="800" height="500" src="https://www.youtube.com/embed/10jYvPEGtt0" title="34,080,191 Pounds of Trash Removed From Beaches, Rivers and The Ocean!!" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-16 px-6 text-center bg-base-300">
        <h2 className="text-4xl font-bold mb-8 text-base-content">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="card bg-base-100 shadow-lg p-6">
            <img src="team1.jpg" alt="Team Member" className="rounded-full w-24 h-24 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-base-content">Marlou Sama</h3>
            <p className="text-gray-500">Founder</p>
          </div>
          <div className="card bg-base-100 shadow-lg p-6">
            <img src="team2.jpg" alt="Team Member" className="rounded-full w-24 h-24 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-base-content">Marlou Sama</h3>
            <p className="text-gray-500">Project Manager</p>
          </div>
          <div className="card bg-base-100 shadow-lg p-6">
            <img src="team3.jpg" alt="Team Member" className="rounded-full w-24 h-24 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-base-content">Marlou Sama</h3>
            <p className="text-gray-500">Volunteer Coordinator</p>
          </div>
        </div>
      </section>
    </div>
  );
}
