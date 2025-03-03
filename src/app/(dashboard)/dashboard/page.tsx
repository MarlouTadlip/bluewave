"use client"
import { useState } from 'react';
import Head from 'next/head';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell 
} from 'recharts';
import { Calendar, MapPin, Users, Clock, Trash2, Compass, ChevronDown } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Sample data - would be fetched from API in a real application
  const eventData = [
    { name: 'Mactan Beach', volunteers: 45, trashCollected: 132 },
    { name: 'Punta Engaño', volunteers: 30, trashCollected: 87 },
    { name: 'Cordova Shore', volunteers: 60, trashCollected: 203 },
    { name: 'Talisay Coast', volunteers: 25, trashCollected: 65 },
    { name: 'Liloan Beach', volunteers: 35, trashCollected: 112 },
  ];
  
  const trashCategoryData = [
    { name: 'Plastics', value: 45 },
    { name: 'Fishing Gear', value: 20 },
    { name: 'Glass', value: 15 },
    { name: 'Metal', value: 10 },
    { name: 'Others', value: 10 },
  ];
  
  const monthlyData = [
    { month: 'Jan', events: 3, volunteers: 85, trashKg: 230 },
    { month: 'Feb', events: 4, volunteers: 120, trashKg: 315 },
    { month: 'Mar', events: 5, volunteers: 175, trashKg: 422 },
    { month: 'Apr', events: 3, volunteers: 95, trashKg: 265 },
    { month: 'May', events: 6, volunteers: 210, trashKg: 510 },
    { month: 'Jun', events: 5, volunteers: 185, trashKg: 440 },
  ];
  
  const upcomingEvents = [
    { id: 1, title: 'Mactan Cleanup Drive', location: 'Mactan Beach', date: '2025-03-05', registeredVolunteers: 32, maxVolunteers: 50 },
    { id: 2, title: 'Punta Engaño Restoration', location: 'Punta Engaño', date: '2025-03-12', registeredVolunteers: 24, maxVolunteers: 40 },
    { id: 3, title: 'Cordova Coastal Care', location: 'Cordova Shore', date: '2025-03-19', registeredVolunteers: 45, maxVolunteers: 60 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>BlueWave Cebu Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Navbar */}
      <div className="navbar bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="flex-1">
          <div className="flex items-center">
            <Compass className="w-6 h-6 mr-2" />
            <span className="text-xl font-bold">BlueWave Cebu</span>
          </div>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src="/api/placeholder/40/40" alt="User avatar" />
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 text-gray-800">
              <li><a>Profile</a></li>
              <li><a>Settings</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md h-screen pt-4 hidden lg:block">
          <ul className="menu p-4 text-gray-700">
            <li className={activeTab === 'dashboard' ? 'bg-blue-100 rounded-lg' : ''}>
              <a onClick={() => setActiveTab('dashboard')} className="flex items-center py-3">
                <span className="i-carbon-dashboard mr-3"></span>
                Dashboard
              </a>
            </li>
            <li className={activeTab === 'events' ? 'bg-blue-100 rounded-lg' : ''}>
              <a onClick={() => setActiveTab('events')} className="flex items-center py-3">
                <Calendar className="mr-3 w-5 h-5" />
                Events
              </a>
            </li>
            <li className={activeTab === 'locations' ? 'bg-blue-100 rounded-lg' : ''}>
              <a onClick={() => setActiveTab('locations')} className="flex items-center py-3">
                <MapPin className="mr-3 w-5 h-5" />
                Locations
              </a>
            </li>
            <li className={activeTab === 'volunteers' ? 'bg-blue-100 rounded-lg' : ''}>
              <a onClick={() => setActiveTab('volunteers')} className="flex items-center py-3">
                <Users className="mr-3 w-5 h-5" />
                Volunteers
              </a>
            </li>
            <li className={activeTab === 'reports' ? 'bg-blue-100 rounded-lg' : ''}>
              <a onClick={() => setActiveTab('reports')} className="flex items-center py-3">
                <Trash2 className="mr-3 w-5 h-5" />
                Cleanup Data
              </a>
            </li>
          </ul>
        </div>
        
        {/* Mobile sidebar */}
        <div className="drawer lg:hidden w-full">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label htmlFor="my-drawer" className="btn btn-ghost drawer-button m-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div> 
          <div className="drawer-side">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            <ul className="menu p-4 w-64 h-full bg-white text-gray-700">
              <li className={activeTab === 'dashboard' ? 'bg-blue-100 rounded-lg' : ''}>
                <a onClick={() => setActiveTab('dashboard')} className="flex items-center py-3">
                  <span className="i-carbon-dashboard mr-3"></span>
                  Dashboard
                </a>
              </li>
              <li className={activeTab === 'events' ? 'bg-blue-100 rounded-lg' : ''}>
                <a onClick={() => setActiveTab('events')} className="flex items-center py-3">
                  <Calendar className="mr-3 w-5 h-5" />
                  Events
                </a>
              </li>
              <li className={activeTab === 'locations' ? 'bg-blue-100 rounded-lg' : ''}>
                <a onClick={() => setActiveTab('locations')} className="flex items-center py-3">
                  <MapPin className="mr-3 w-5 h-5" />
                  Locations
                </a>
              </li>
              <li className={activeTab === 'volunteers' ? 'bg-blue-100 rounded-lg' : ''}>
                <a onClick={() => setActiveTab('volunteers')} className="flex items-center py-3">
                  <Users className="mr-3 w-5 h-5" />
                  Volunteers
                </a>
              </li>
              <li className={activeTab === 'reports' ? 'bg-blue-100 rounded-lg' : ''}>
                <a onClick={() => setActiveTab('reports')} className="flex items-center py-3">
                  <Trash2 className="mr-3 w-5 h-5" />
                  Cleanup Data
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex-1 p-6 lg:ml-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Coastal Cleanup Dashboard</h1>
            <p className="text-gray-600">BlueWave Cebus operation overview</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="stats shadow bg-white">
              <div className="stat">
                <div className="stat-figure text-blue-500">
                  <Calendar className="w-8 h-8" />
                </div>
                <div className="stat-title">Total Events</div>
                <div className="stat-value text-blue-500">42</div>
                <div className="stat-desc">Jan 1st - Mar 1st</div>
              </div>
            </div>
            
            <div className="stats shadow bg-white">
              <div className="stat">
                <div className="stat-figure text-green-500">
                  <Users className="w-8 h-8" />
                </div>
                <div className="stat-title">Volunteers</div>
                <div className="stat-value text-green-500">1,200</div>
                <div className="stat-desc">↗︎ 40 (3.3%)</div>
              </div>
            </div>
            
            <div className="stats shadow bg-white">
              <div className="stat">
                <div className="stat-figure text-orange-500">
                  <Trash2 className="w-8 h-8" />
                </div>
                <div className="stat-title">Trash Collected</div>
                <div className="stat-value text-orange-500">2.4t</div>
                <div className="stat-desc">↗︎ 300kg (14%)</div>
              </div>
            </div>
            
            <div className="stats shadow bg-white">
              <div className="stat">
                <div className="stat-figure text-purple-500">
                  <Clock className="w-8 h-8" />
                </div>
                <div className="stat-title">Volunteer Hours</div>
                <div className="stat-value text-purple-500">4.2k</div>
                <div className="stat-desc">Jan 1st - Mar 1st</div>
              </div>
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="card bg-white shadow-md">
              <div className="card-body">
                <h2 className="card-title text-gray-800">Events & Trash Collected</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={eventData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="volunteers" fill="#8884d8" name="Volunteers" />
                      <Bar yAxisId="right" dataKey="trashCollected" fill="#82ca9d" name="Trash (kg)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="card bg-white shadow-md">
              <div className="card-body">
                <h2 className="card-title text-gray-800">Types of Trash Collected</h2>
                <div className="h-64 flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={trashCategoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {trashCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card bg-white shadow-md mb-6">
            <div className="card-body">
              <h2 className="card-title text-gray-800">Monthly Progress</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="events" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="volunteers" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="trashKg" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Upcoming Events */}
          <div className="card bg-white shadow-md">
            <div className="card-body">
              <h2 className="card-title text-gray-800">Upcoming Cleanup Events</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Location</th>
                      <th>Date</th>
                      <th>Volunteers</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingEvents.map((event) => (
                      <tr key={event.id}>
                        <td>{event.title}</td>
                        <td>{event.location}</td>
                        <td>{new Date(event.date).toLocaleDateString()}</td>
                        <td>
                          <div className="flex items-center">
                            <progress 
                              className="progress progress-info w-24 mr-2" 
                              value={event.registeredVolunteers} 
                              max={event.maxVolunteers}
                            ></progress>
                            <span>{event.registeredVolunteers}/{event.maxVolunteers}</span>
                          </div>
                        </td>
                        <td>
                          <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-sm btn-ghost">
                              <ChevronDown />
                            </label>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                              <li><a>View Details</a></li>
                              <li><a>Edit Event</a></li>
                              <li><a>Manage Volunteers</a></li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-primary">View All Events</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}