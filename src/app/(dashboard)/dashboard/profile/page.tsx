"use server";
import { Calendar, MapPin } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/features/users/actions/session";
import Image from "next/image";
import ProfileImageUpload from "../../../components/ProfileImageUpload";
import ProfileForm from "../../../components/ProfileForm";
import { Prisma } from "@prisma/client";

export async function updateUser(formData: FormData) {
  const session = await getSession();
  if (!session || !session.userId) {
    return { success: false, message: "Unauthorized" };
  }

  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const phoneNumber = formData.get("phoneNumber") as string;

  if (!fullName || !email || !phoneNumber) {
    return { success: false, message: "All fields are required" };
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: { email, userId: { not: session.userId } },
    });
    if (existingUser) {
      return { success: false, message: "Email is already in use" };
    }

    await prisma.user.update({
      where: { userId: session.userId as string },
      data: {
        fullName,
        email,
        phoneNumber,
      },
    });

    return { success: true, message: "Profile updated successfully" };
  } catch {
    return { success: false, message: "Failed to update profile" };
  }
}

export default async function ProfilePage() {
  const session = await getSession();
  if (!session || !session.userId) {
    return <div>Please log in to view your profile.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { userId: session.userId as string },
    include: {
      events: {
        include: { location: true },
      },
      participations: {
        include: {
          event: { include: { location: true } },
        },
      },
    },
  });

  if (!user) {
    return <div>User not found.</div>;
  }

  type UserWithRelations = Prisma.UserGetPayload<{
    include: {
      events: { include: { location: true } };
      participations: { include: { event: { include: { location: true } } } };
    };
  }>;

  const locations: string[] = [
    ...new Set(
      (user as UserWithRelations).participations
        .map((p) => p.event.location.name)
        .filter((name): name is string => Boolean(name))
    ),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          My Profile
        </h1>
        <p className="text-gray-500">View and edit your personal information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card bg-base-100 shadow-xl md:col-span-2">
          <div className="card-body">
            <h2 className="card-title">Personal Information</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center gap-4">
                <div className="avatar">
                  <Image
                    src={user.profile_image || "/profile.png"}
                    alt={user.fullName}
                    width={128}
                    height={128}
                    className="rounded-full"
                  />
                </div>
                <ProfileImageUpload userId={user.userId} />
              </div>
              <ProfileForm user={user} />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Volunteer Information</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span>Volunteer Since</span>
                </div>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span>Participated Locations</span>
                </div>
                <div className="flex gap-2">
                  {locations.length > 0 ? (
                    locations.map((loc) => (
                      <span key={loc} className="badge badge-outline">
                        {loc}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">None</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
