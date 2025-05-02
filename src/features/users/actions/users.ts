"use server";

import { prisma } from "../../../lib/db";
import { generateSalt, hashPassword } from "../auth/hashPassword";
import { createSession } from "./session";

export const createUser = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmpass = formData.get("confirmpass") as string;
  const phone = formData.get("phone") as string;
  const salt = generateSalt();

  if (!name || !email || !password || !confirmpass || !phone) {
    return { success: false, message: "All fields are required" };
  }

  if (password !== confirmpass) {
    return { success: false, message: "Passwords do not match" };
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (existingUser) {
    return { success: false, message: "Email is already registered" };
  }

  const hashedPassword = hashPassword(password, salt);

  await prisma.user.create({
    data: {
      fullName: name,
      email: email,
      passwordHash: hashedPassword as unknown as string,
      salt: salt,
      phoneNumber: phone,
      profile_image: "",
    },
  });

  return { success: true, message: "User successfully Created" };
};

export const loginUser = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, message: "Input empty fields" };
  }
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    return { success: false, message: "Invalid email/password" };
  }
  const hashedPassword = hashPassword(password, user.salt);

  const findUser = await prisma.user.findFirst({
    where: {
      email: email,
      passwordHash: hashedPassword,
    },
  });

  if (!findUser) {
    return { success: false, message: "Invalid email/password" };
  }
  await createSession(findUser.userId);
  return { success: true, message: "Login Successful" };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateProfileImage = async (url: string, id: string) => {
  await prisma.user.update({
    where: {
      userId: id,
    },
    data: {
      profile_image: url,
    },
  });
};
