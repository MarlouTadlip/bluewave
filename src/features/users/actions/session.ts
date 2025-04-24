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
  const sessionId = cookieStore.get("session");
  if (!sessionId) return null;

  const userId = await redis.get(`session:${sessionId}`);
  return userId ? { userId } : null;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session");
  if (sessionId) {
    await redis.del(`session:${sessionId}`);
    cookieStore.set("session", "", { expires: new Date(0) }); // Clear cookie
  }
}
