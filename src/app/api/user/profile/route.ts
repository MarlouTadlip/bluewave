import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/features/users/actions/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { userId: session.userId as string },
      select: { profile_image: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ profileImage: user.profile_image || null });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch profile image" },
      { status: 500 }
    );
  }
}
