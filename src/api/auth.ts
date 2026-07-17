import { createHmac, randomUUID } from "node:crypto";
import { getCookie, setCookie } from "@tanstack/react-start/server";

const SESSION_COOKIE = "ditto_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function getSessionSecret(): string {
  return process.env.SESSION_SECRET ?? "dev-secret-change-me-in-production";
}

function signUserId(userId: string): string {
  const sig = createHmac("sha256", getSessionSecret())
    .update(userId)
    .digest("hex")
    .slice(0, 16);
  return `${userId}.${sig}`;
}

function verifySessionToken(token: string): string | null {
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex <= 0) return null;

  const userId = token.slice(0, dotIndex);
  const sig = token.slice(dotIndex + 1);
  const expected = createHmac("sha256", getSessionSecret())
    .update(userId)
    .digest("hex")
    .slice(0, 16);

  return sig === expected ? userId : null;
}

export function getOrCreateUserId(): string {
  const existing = getCookie(SESSION_COOKIE);
  if (existing) {
    const userId = verifySessionToken(existing);
    if (userId) return userId;
  }

  const userId = randomUUID();
  setCookie(SESSION_COOKIE, signUserId(userId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  return userId;
}

export function ensureSession(): { userId: string } {
  return { userId: getOrCreateUserId() };
}
