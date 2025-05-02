"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SalaryCalculator() {
  const router = useRouter();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/salary/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, year }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Calculation failed");

      router.push(`/salary-reports/${month}/${year}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl p-6 max-w-md mx-auto">
      <h2 className="card-title mb-4">Calculate Salary</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          className="select select-bordered w-full"
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
          disabled={loading}
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <select
          className="select select-bordered w-full"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          disabled={loading}
        >
          {[...Array(5)].map((_, i) => {
            const y = new Date().getFullYear() - 2 + i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>
        <button
          type="submit"
          className={`btn btn-success w-full ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          Calculate
        </button>
      </form>
      {error && <div className="alert alert-error mt-4">{error}</div>}
    </div>
  );
}
