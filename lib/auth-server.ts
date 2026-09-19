import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";

export const SESSION_COOKIE = "session";

export async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie);
    return decoded.uid;
  } catch {
    return null;
  }
}
