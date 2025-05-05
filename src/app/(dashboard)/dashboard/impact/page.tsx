"use server";
import React from "react";
import { prisma } from "@/lib/db";
import { getSession } from "@/features/users/actions/session";

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    totalWaste = totalWasteResult[0]?.total_waste || 0;
  } catch (error) {
    console.error("Error calling stored procedure:", error);
    return <div>Error loading impact data. Please try again later.</div>;
  }

  return <div>MY IMPACT</div>;
}

// export default page
