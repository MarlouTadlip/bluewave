"use server";
import { redis } from "../../../lib/redis";
import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_EXPIRATION = 60 * 60 * 24 * 7; // 1 week

export async function createSession(userId: string) {
  const sessionId = crypto.randomBytes(16).toString("hex"); // Generate session ID
  await redis.set(`session:${sessionId}`, userId, { ex: SESSION_EXPIRATION }); // Store session in Redis

  const cookieStore = await cookies(); // ✅ Await cookies()
  cookieStore.set("session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(Date.now() + SESSION_EXPIRATION * 1000),
  });

  return sessionId;
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  console.log("Session cookie retrieved:", sessionCookie);

  if (!sessionCookie || !sessionCookie.value) {
    console.log("No session cookie or value found");
    return null;
  }

  const sessionId = sessionCookie.value;
  console.log("Session ID from cookie:", sessionId);

  const userId = await redis.get(`session:${sessionId}`);
  console.log("User ID from Redis for sessionId:", sessionId, "is:", userId);

  if (!userId) {
    console.log("No userId found in Redis for sessionId:", sessionId);
    return null;
  }

  return { userId };
}

export async function destroySession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session");
  if (sessionId) {
    await redis.del(`session:${sessionId}`);
    cookieStore.set("session", "", { expires: new Date(0) }); // Clear cookie
  }
}
