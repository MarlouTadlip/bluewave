"use server";
import React from "react";
import { prisma } from "@/lib/db";
import { getSession } from "@/features/users/actions/session";
import { Trash2 } from "lucide-react";

export default async function ImpactPage() {
  // Check session for authenticated user
  const session = await getSession();
  if (!session || !session.userId) {
    return <div>Please log in to view your impact.</div>;
  }

  const userId = session.userId as string;

  // Call the stored procedure to get total waste collected by the user
  let totalWaste = 0;
  try {
    const totalWasteResult = await prisma.$queryRaw<
      { total_waste: number }[]
    >`SELECT get_user_total_waste(${userId}) AS total_waste;`;
    totalWaste = totalWasteResult[0]?.total_waste || 0;
  } catch (error) {
    console.error("Error calling stored procedure:", error);
    return <div>Error loading impact data. Please try again later.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          My Impact
        </h1>
        <p className="text-gray-500">
          See the difference you&apos;ve made with BlueWave
        </p>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Your Contribution</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-gray-500" />
              <span>Total Waste Collected</span>
            </div>
            <span className="font-medium">{totalWaste.toFixed(2)} kg</span>
          </div>
        </div>
      </div>
    </div>
  );
}
