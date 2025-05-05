"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { hashPassword, generateSalt } from "@/features/users/auth/hashPassword";

export async function createUser(formData: FormData): Promise<void> {
  try {
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const role = formData.get("role") as string;
    const password = formData.get("password") as string;

    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);

    await prisma.user.create({
      data: {
        fullName,
        email,
        phoneNumber,
        role,
        passwordHash,
        salt,
        profile_image: "/default-profile.png",
      },
    });
    revalidatePath("/dashboard/users");
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}

export async function updateUser(
  userId: string,
  formData: FormData
): Promise<void> {
  try {
    const fullName = formData.get("fullName") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const role = formData.get("role") as string;

    await prisma.user.update({
      where: { userId },
      data: {
        fullName,
        phoneNumber,
        role,
      },
    });
    revalidatePath("/dashboard/users");
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
}

export async function toggleUserSuspension(
  userId: string,
  suspend: boolean
): Promise<void> {
  try {
    await prisma.user.update({
      where: { userId },
      data: { isSuspended: suspend },
    });
    revalidatePath("/dashboard/users");
  } catch (error) {
    console.error("Error toggling user suspension:", error);
    throw new Error("Failed to toggle user suspension");
  }
}
