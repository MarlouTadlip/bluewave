"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData): Promise<void> {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const iconURL = formData.get("iconURL") as string;

    await prisma.category.create({
      data: {
        name,
        description,
        iconURL,
        isActive: true,
      },
    });
    revalidatePath("/dashboard/settings");
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }
}

export async function updateCategory(
  categoryId: string,
  formData: FormData
): Promise<void> {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const iconURL = formData.get("iconURL") as string;

    await prisma.category.update({
      where: { categoryId },
      data: {
        name,
        description,
        iconURL,
      },
    });
    revalidatePath("/dashboard/settings");
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }
}

export async function toggleCategoryActive(
  categoryId: string,
  isActive: boolean
): Promise<void> {
  try {
    await prisma.category.update({
      where: { categoryId },
      data: { isActive },
    });
    revalidatePath("/dashboard/settings");
  } catch (error) {
    console.error("Error toggling category active status:", error);
    throw new Error("Failed to toggle category active status");
  }
}

export async function createLocation(formData: FormData): Promise<void> {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as string;
    const latitude = parseFloat(formData.get("latitude") as string);
    const longitude = parseFloat(formData.get("longitude") as string);

    await prisma.location.create({
      data: {
        name,
        description,
        image,
        latitude,
        longitude,
        isActive: true,
      },
    });
    revalidatePath("/dashboard/settings");
  } catch (error) {
    console.error("Error creating location:", error);
    throw new Error("Failed to create location");
  }
}

export async function updateLocation(
  locationId: string,
  formData: FormData
): Promise<void> {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as string;
    const latitude = parseFloat(formData.get("latitude") as string);
    const longitude = parseFloat(formData.get("longitude") as string);

    await prisma.location.update({
      where: { locationId },
      data: {
        name,
        description,
        image,
        latitude,
        longitude,
      },
    });
    revalidatePath("/dashboard/settings");
  } catch (error) {
    console.error("Error updating location:", error);
    throw new Error("Failed to update location");
  }
}

export async function toggleLocationActive(
  locationId: string,
  isActive: boolean
): Promise<void> {
  try {
    await prisma.location.update({
      where: { locationId },
      data: { isActive },
    });
    revalidatePath("/dashboard/settings");
  } catch (error) {
    console.error("Error toggling location active status:", error);
    throw new Error("Failed to toggle location active status");
  }
}
