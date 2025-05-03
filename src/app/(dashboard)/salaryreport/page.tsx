"use client";

import { useState, useEffect } from "react";

interface User {
  userId: string;
  employeeId?: string;
  fullName: string;
  dailyRate: number;
}

export default function SalaryReport() {
  const [users, setUsers] = useState<User[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [message, setMessage] = useState("");

  // Fetch organizers on mount
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setMessage("Failed to load organizers");
      }
    }
    fetchUsers();
  }, []);

  const handleFileUpload = async () => {
    if (!file) {
      setMessage("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.text(); // Handle non-JSON responses
        throw new Error(
          `HTTP error! status: ${res.status}, details: ${errorData}`
        );
      }

      const data = await res.json();
      setMessage(data.message || data.error || "Attendance processed");
    } catch (error) {
      console.error("Error uploading attendance:", error);
      setMessage(
        `Failed to upload attendance: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleCalculateSalary = async () => {
    try {
      const res = await fetch("/api/salary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month: parseInt(month), year: parseInt(year) }),
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(
          `HTTP error! status: ${res.status}, details: ${errorData}`
        );
      }

      const data = await res.json();
      setMessage(data.error || "Salaries calculated successfully");
    } catch (error) {
      console.error("Error calculating salaries:", error);
      setMessage(
        `Failed to calculate salaries: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Salary Management (Organizers)
      </h1>

      <div className="mb-4">
        <h2 className="text-xl mb-2">Upload Attendance</h2>
        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-2"
        />
        <button
          onClick={handleFileUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-xl mb-2">Calculate Salaries</h2>
        <input
          type="number"
          placeholder="Month (1-12)"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={handleCalculateSalary}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Calculate
        </button>
      </div>

      {message && <p className="mt-4">{message}</p>}

      <div>
        <h2 className="text-xl mb-2">Organizers</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Employee ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Daily Rate</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId}>
                <td className="border p-2">{user.employeeId || "N/A"}</td>
                <td className="border p-2">{user.fullName}</td>
                <td className="border p-2">{user.dailyRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
