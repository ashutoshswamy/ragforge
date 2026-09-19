import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { SESSION_COOKIE } from "@/lib/auth-server";

const PROTECTED_PREFIXES = ["/pipeline", "/pipelines"];
const AUTH_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;

function buildCsp(nonce: string): string {
  // style-src needs 'unsafe-inline': the UI is built entirely on inline style={{}} objects,
  // and CSP has no nonce mechanism for style attributes (only for <style> elements).
  return [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: https://lh3.googleusercontent.com https://avatars.githubusercontent.com`,
    `font-src 'self'`,
    `connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com${AUTH_DOMAIN ? ` https://${AUTH_DOMAIN}` : ""}`,
    `frame-src 'self'${AUTH_DOMAIN ? ` https://${AUTH_DOMAIN}` : ""}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`,
  ].join("; ");
}

export async function proxy(request: NextRequest) {
  const nonce = randomUUID();
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (isProtected) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
    let authorized = false;

    if (sessionCookie) {
      try {
        await adminAuth.verifySessionCookie(sessionCookie);
        authorized = true;
      } catch {
        // fall through to redirect
      }
    }

    if (!authorized) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest)$).*)"],
};
