"use client";
import { useState, useEffect } from "react";
import Wave from "react-wavify";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Calendar,
  MapPin,
  ArrowRight,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import Image from "next/image";
import {
  getStats,
  getRecentEvents,
  getUpcomingEvents,
} from "../../app/actions";

interface Stats {
  volunteers: number;
  cleanups: number;
  trashCollected: number;
}

interface Event {
  id: string;
  title: string;
  description?: string;
  date?: string;
  location?: string;
  spots?: number;
  participantCount?: number;
  image?: string;
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [statsResult, recentEventsResult, upcomingEventsResult] =
          await Promise.all([
            getStats(),
            getRecentEvents(),
            getUpcomingEvents(),
          ]);

        if (statsResult.success && statsResult.data) {
          setStats(statsResult.data);
        }
        if (recentEventsResult.success && recentEventsResult.data) {
          setRecentEvents(recentEventsResult.data);
        }
        if (upcomingEventsResult.success && upcomingEventsResult.data) {
          setUpcomingEvents(upcomingEventsResult.data);
        }
      } catch (error) {
        console.error("Error fetching landing page data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Fallback static data for stats
  const fallbackStats: Stats = {
    volunteers: 5200,
    cleanups: 85,
    trashCollected: 12500,
  };

  // Fallback static data for recent events
  const fallbackRecentEvents: Event[] = [
    {
      id: "1",
      title: "Cleanup at Mactan Shore",
      description:
        "Over 50 volunteers collected 250kg of trash, restoring this beautiful beach.",
      image:
        "https://images.unsplash.com/photo-1587570277863-0827f721894d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "2",
      title: "Talisay Beach Cleanup",
      description: "Community effort to clean Talisay's coastline.",
      image:
        "https://images.unsplash.com/photo-1565803974275-dccd2f933cbb?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "3",
      title: "Cordova Mangrove Restoration",
      description: "Volunteers restored mangrove areas in Cordova.",
      image:
        "https://images.unsplash.com/photo-1717432417447-3df97d318a75?q=80&w=2016&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  // Fallback static data for upcoming events
  const fallbackUpcomingEvents: Event[] = [
    {
      id: "1",
      title: "Mactan Island Cleanup",
      date: "June 15, 2025",
      location: "Mactan Newtown Beach",
      spots: 30,
    },
    {
      id: "2",
      title: "Cordova Mangrove Cleanup",
      date: "June 22, 2025",
      location: "Cordova Mangrove Forest",
      spots: 15,
    },
    {
      id: "3",
      title: "Talisay Coastal Cleanup",
      date: "July 5, 2025",
      location: "Talisay City Beach",
      spots: 25,
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <div
        id="home"
        className="relative min-h-screen bg-base-200 flex flex-col justify-center overflow-hidden -mt-20"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 px-6 lg:px-16 max-w-7xl mx-auto z-10 py-20 lg:py-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left max-w-lg"
          >
            <div className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-base-300 text-primary border border-primary/20">
              Join the Movement
            </div>
            <h1 className="mb-5 text-4xl md:text-5xl font-bold text-base-content leading-tight">
              Protect Cebu&apos;s Coastline – One Cleanup at a Time
            </h1>
            <p className="mb-6 text-lg text-base-content/80">
              Join us in making Cebu&apos;s shores cleaner and healthier for
              future generations. Be the wave of change today!
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link href="/register">
                <button className="btn btn-primary w-full sm:w-auto">
                  Volunteer Now
                </button>
              </Link>
              <button className="btn btn-secondary w-full sm:w-auto">
                Donate
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full lg:w-auto"
          >
            <div className="stats shadow-xl bg-base-100 rounded-xl border border-base-300">
              <div className="stat p-6">
                <div className="stat-title">Total Volunteers</div>
                {isLoading ? (
                  <div className="skeleton h-8 w-24"></div>
                ) : (
                  <div className="stat-value text-primary">
                    {(stats || fallbackStats).volunteers.toLocaleString()}+
                  </div>
                )}
                <div className="stat-desc">Since 2022</div>
              </div>
              <div className="stat p-6 border-l border-base-300">
                <div className="stat-title">Cleanups Organized</div>
                {isLoading ? (
                  <div className="skeleton h-8 w-24"></div>
                ) : (
                  <div className="stat-value text-secondary">
                    {(stats || fallbackStats).cleanups.toLocaleString()}+
                  </div>
                )}
                <div className="stat-desc">Across Cebu</div>
              </div>
              <div className="stat p-6 border-l border-base-300">
                <div className="stat-title">Trash Collected</div>
                {isLoading ? (
                  <div className="skeleton h-8 w-24"></div>
                ) : (
                  <div className="stat-value text-accent">
                    {(stats || fallbackStats).trashCollected.toLocaleString()}{" "}
                    kg
                  </div>
                )}
                <div className="stat-desc">And counting!</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <Wave
            fill="var(--primary-color, #3B82F6)"
            paused={false}
            options={{
              height: 20,
              amplitude: 35,
              speed: 0.2,
              points: 5,
            }}
          />
          <div className="absolute bottom-0 left-0 w-full -mb-5">
            <Wave
              fill="var(--primary-color-transparent, rgba(59, 130, 246, 0.5))"
              paused={false}
              options={{
                height: 15,
                amplitude: 30,
                speed: 0.3,
                points: 3,
              }}
            />
          </div>
        </div>
      </div>

      {/* About Section */}
      <section
        id="about"
        className="py-20 px-6 bg-[#3B82F6] text-primary-content relative overflow-hidden -mt-2"
      >
        <div className="absolute top-0 right-0 opacity-10">
          <svg width="400" height="400" viewBox="0 0 200 200">
            <path
              fill="currentColor"
              d="M42.7,-76.4C53.2,-67.8,58.8,-52.6,65.5,-38.7C72.2,-24.8,80,-12.4,79.8,-0.1C79.6,12.2,71.3,24.3,62.9,35.5C54.5,46.7,45.9,56.8,34.6,64.8C23.3,72.8,9.1,78.7,-4.5,79.5C-18.2,80.3,-36.4,76,-48.4,66.4C-60.4,56.8,-66.3,41.9,-70.4,27.2C-74.5,12.5,-76.9,-2,-73.8,-15.2C-70.7,-28.4,-62.2,-40.3,-51.1,-49.2C-40,-58.1,-26.3,-64,-12.1,-69.2C2.1,-74.5,16.8,-79.1,30.1,-79.1C43.5,-79.1,55.5,-74.5,42.7,-76.4Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-left"
            >
              <div className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-primary-focus text-primary-content border border-primary-content/20">
                Our Mission
              </div>
              <h2 className="text-4xl font-bold mb-6 leading-tight">
                About BlueWave Cebu
              </h2>
              <p className="text-lg opacity-90 mb-6">
                BlueWave Cebu is dedicated to preserving our beautiful coastline
                through community-driven cleanups. We believe in action,
                education, and sustainable efforts to keep our beaches clean for
                future generations.
              </p>
              <p className="text-lg opacity-90 mb-8">
                Since 2022, we&apos;ve mobilized thousands of volunteers across
                Cebu to remove tons of waste from our shores, protecting marine
                life and creating cleaner spaces for everyone to enjoy.
              </p>
              <Link href="/about">
                <button className="btn bg-base-100 text-primary hover:bg-base-200">
                  Learn More About Us <ArrowRight size={18} className="ml-2" />
                </button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="rounded-xl overflow-hidden shadow-2xl"
            >
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/10jYvPEGtt0"
                  title="Beach Cleanup Initiative"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Gallery Section */}
      <section id="impact" className="py-20 px-6 bg-base-100">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-accent/10 text-accent border border-accent/20">
              Our Impact
            </div>
            <h2 className="text-4xl font-bold mb-4 text-base-content">
              Making a Difference
            </h2>
            <p className="text-lg text-base-content/70 max-w-3xl mx-auto">
              See the impact of our community efforts across Cebu&apos;s
              beautiful coastlines. Every cleanup brings us closer to a cleaner,
              healthier ocean.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(isLoading
              ? Array(6).fill(null)
              : recentEvents.length > 0
              ? recentEvents
              : fallbackRecentEvents
            ).map((event: Event | null, index: number) =>
              event ? (
                <motion.div
                  key={event.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card bg-base-100 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
                >
                  <figure className="relative h-64 overflow-hidden">
                    <Image
                      src={
                        event.image || "/placeholder.svg?height=400&width=600"
                      }
                      alt={event.title || "Beach cleanup"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title text-base-content">
                      {event.title}
                    </h3>
                    <p className="text-base-content/70">
                      {event.description ||
                        "Community effort to clean our shores."}
                    </p>
                    {event.participantCount !== undefined && (
                      <p className="text-base-content/70 mt-2">
                        {event.participantCount} volunteers participated
                      </p>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div key={index} className="card bg-base-100 shadow-lg">
                  <div className="skeleton h-64 w-full"></div>
                  <div className="card-body">
                    <div className="skeleton h-6 w-3/4"></div>
                    <div className="skeleton h-4 w-full mt-2"></div>
                    <div className="skeleton h-4 w-5/6 mt-1"></div>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="text-center mt-12">
            <Link href="/gallery">
              <button className="btn btn-accent">View Full Gallery</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section id="events" className="py-20 px-6 bg-base-200">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-secondary/10 text-secondary border border-secondary/20">
              Join Us
            </div>
            <h2 className="text-4xl font-bold mb-4 text-base-content">
              Upcoming Cleanups
            </h2>
            <p className="text-lg text-base-content/70 max-w-3xl mx-auto">
              Be part of the solution! Join our upcoming beach cleanup events
              and help make a difference.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(isLoading
              ? Array(3).fill(null)
              : upcomingEvents.length > 0
              ? upcomingEvents
              : fallbackUpcomingEvents
            ).map((event: Event | null, index: number) =>
              event ? (
                <motion.div
                  key={event.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-all duration-300"
                >
                  <div className="card-body">
                    <h3 className="card-title text-base-content">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 text-base-content/70 mt-2">
                      <Calendar size={18} className="text-secondary" />
                      <span>{event.date || "TBD"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-base-content/70 mt-1">
                      <MapPin size={18} className="text-secondary" />
                      <span>{event.location || "Location TBD"}</span>
                    </div>
                    <div className="badge badge-secondary mt-3 mb-2">
                      {event.spots !== undefined
                        ? `${event.spots} spots left`
                        : "Spots TBD"}
                    </div>
                    <div className="card-actions justify-end mt-2">
                      <Link href="/dashboard/events">
                        <button className="btn btn-secondary w-full">
                          Register Now
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div
                  key={index}
                  className="card bg-base-100 shadow-lg border border-base-300"
                >
                  <div className="card-body">
                    <div className="skeleton h-6 w-3/4"></div>
                    <div className="skeleton h-4 w-1/2 mt-2"></div>
                    <div className="skeleton h-4 w-2/3 mt-1"></div>
                    <div className="skeleton h-4 w-1/3 mt-3"></div>
                    <div className="skeleton h-10 w-full mt-2"></div>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="text-center mt-12">
            <Link href="/dashboard/events">
              <button className="btn btn-outline btn-secondary">
                View All Events <ArrowRight size={18} className="ml-2" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 px-6 bg-base-100">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
              Our People
            </div>
            <h2 className="text-4xl font-bold mb-4 text-base-content">
              Meet the Team
            </h2>
            <p className="text-lg text-base-content/70 max-w-3xl mx-auto">
              The passionate individuals behind BlueWave Cebu who are dedicated
              to making a difference.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Marlou",
                role: "Founder",
                bio: "Passionate environmentalist with 10+ years of experience in marine conservation.",
                color: "primary",
                image:
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
              },
              {
                name: "C",
                role: "Project Manager",
                bio: "Coordinates all cleanup operations and manages volunteer teams across Cebu.",
                color: "secondary",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
              },
              {
                name: "Tadlip",
                role: "Volunteer Coordinator",
                bio: "Responsible for recruiting, training, and organizing our amazing volunteers.",
                color: "accent",
                image:
                  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card bg-base-100 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <div className={`bg-${member.color} h-32 relative`}>
                  <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                    <div className="bg-base-100 p-2 rounded-full">
                      <Image
                        src={
                          member.image ||
                          "/placeholder.svg?height=100&width=100"
                        }
                        alt={member.name}
                        width={100}
                        height={100}
                        className="rounded-full"
                      />
                    </div>
                  </div>
                </div>
                <div className="card-body pt-20 text-center">
                  <h3 className="text-xl font-bold text-base-content">
                    {member.name}
                  </h3>
                  <p className={`text-${member.color} font-medium`}>
                    {member.role}
                  </p>
                  <p className="text-base-content/70 mt-2">{member.bio}</p>
                  <div className="flex justify-center gap-4 mt-4">
                    <a
                      href="#"
                      className="text-base-content/50 hover:text-primary transition-colors"
                    >
                      <Facebook size={20} />
                    </a>
                    <a
                      href="#"
                      className="text-base-content/50 hover:text-primary transition-colors"
                    >
                      <Instagram size={20} />
                    </a>
                    <a
                      href="#"
                      className="text-base-content/50 hover:text-primary transition-colors"
                    >
                      <Twitter size={20} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/team">
              <button className="btn btn-outline btn-primary">
                Meet the Full Team <ArrowRight size={18} className="ml-2" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 bg-base-200">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
              Testimonials
            </div>
            <h2 className="text-4xl font-bold mb-4 text-base-content">
              What Volunteers Say
            </h2>
            <p className="text-lg text-base-content/70 max-w-3xl mx-auto">
              Hear from the people who have joined our mission to protect
              Cebu&apos;s coastlines.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "Joining BlueWave Cebu was one of the most rewarding experiences. It's amazing to see the immediate impact we make on our beaches.",
                name: "Maria Santos",
                role: "Regular Volunteer",
              },
              {
                quote:
                  "The team is incredibly organized and passionate. Every cleanup feels like a community celebration while making a real difference.",
                name: "John Reyes",
                role: "First-time Volunteer",
              },
              {
                quote:
                  "As a local business owner, partnering with BlueWave has been great for team building while giving back to our beautiful Cebu.",
                name: "Anna Lim",
                role: "Business Partner",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card bg-base-100 shadow-lg border border-base-300"
              >
                <div className="card-body">
                  <div className="text-primary mb-4">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.3 5.8C9.8 6.6 8.4 7.7 7.3 9.2C6.2 10.7 5.7 12.2 5.7 13.7C5.7 15 6.1 16.1 7 17C7.9 17.9 9 18.3 10.3 18.3C11.6 18.3 12.7 17.9 13.6 17C14.5 16.1 14.9 15 14.9 13.7C14.9 12.4 14.5 11.3 13.6 10.4C12.7 9.5 11.6 9.1 10.3 9.1C10.1 9.1 9.8 9.1 9.6 9.2C10.1 8.1 11.3 7 13.1 6.1L11.3 5.8ZM20.3 5.8C18.8 6.6 17.4 7.7 16.3 9.2C15.2 10.7 14.7 12.2 14.7 13.7C14.7 15 15.1 16.1 16 17C16.9 17.9 18 18.3 19.3 18.3C20.6 18.3 21.7 17.9 22.6 17C23.5 16.1 23.9 15 23.9 13.7C23.9 12.4 23.5 11.3 22.6 10.4C21.7 9.5 20.6 9.1 19.3 9.1C19.1 9.1 18.8 9.1 18.6 9.2C19.1 8.1 20.3 7 22.1 6.1L20.3 5.8Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <p className="text-base-content/80 mb-6 italic">
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center">
                    <div className="bg-primary/10 rounded-full p-2 mr-4">
                      <User size={24} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base-content">
                        {testimonial.name}
                      </h4>
                      <p className="text-base-content/60 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary text-primary-content relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <svg width="600" height="600" viewBox="0 0 200 200">
            <path
              fill="currentColor"
              d="M42.7,-76.4C53.2,-67.8,58.8,-52.6,65.5,-38.7C72.2,-24.8,80,-12.4,79.8,-0.1C79.6,12.2,71.3,24.3,62.9,35.5C54.5,46.7,45.9,56.8,34.6,64.8C23.3,72.8,9.1,78.7,-4.5,79.5C-18.2,80.3,-36.4,76,-48.4,66.4C-60.4,56.8,-66.3,41.9,-70.4,27.2C-74.5,12.5,-76.9,-2,-73.8,-15.2C-70.7,-28.4,-62.2,-40.3,-51.1,-49.2C-40,-58.1,-26.3,-64,-12.1,-69.2C2.1,-74.5,16.8,-79.1,30.1,-79.1C43.5,-79.1,55.5,-74.5,42.7,-76.4Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Ready to Make Waves of Change?
          </h2>
          <p className="text-xl opacity-90 mb-10 max-w-3xl mx-auto">
            Join our community of ocean advocates and help protect Cebu&apos;s
            beautiful coastlines for generations to come.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <button className="btn btn-lg bg-base-100 text-primary hover:bg-base-200">
                Become a Volunteer
              </button>
            </Link>
            <button className="btn btn-lg btn-outline border-2 text-primary-content hover:bg-primary-focus">
              Support Our Mission
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
