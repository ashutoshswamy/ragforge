import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { SESSION_COOKIE } from "@/lib/auth-server";

const EXPIRES_IN = 5 * 24 * 60 * 60 * 1000; // ponytail: 5 days, no "remember me" toggle requested

// POST /api/auth/session — exchange a Firebase ID token for an httpOnly session cookie
export async function POST(request: Request) {
  const { idToken } = await request.json();
  if (!idToken) {
    return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
  }

  try {
    await adminAuth.verifyIdToken(idToken);
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: EXPIRES_IN });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: EXPIRES_IN / 1000,
      path: "/",
    });

    return NextResponse.json({ status: "ok" });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

// DELETE /api/auth/session — sign out
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  return NextResponse.json({ status: "ok" });
}
