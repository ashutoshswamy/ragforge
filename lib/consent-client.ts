import { ANON_COOKIE, CONSENT_COOKIE, POLICY_VERSION } from "@/lib/consent";

const YEAR = 60 * 60 * 24 * 365;

function readCookie(name: string): string | null {
  const hit = document.cookie.split("; ").find((c) => c.startsWith(`${name}=`));
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : null;
}

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${YEAR}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
}

/** Stable random id for this browser; lets us tie a pre-login choice to the account later. */
export function getAnonId(): string {
  const existing = readCookie(ANON_COOKIE);
  if (existing) return existing;
  const id = crypto.randomUUID();
  writeCookie(ANON_COOKIE, id);
  return id;
}

/** Log ToS + Privacy Policy + 18+ for the signed-in user. Needs the session cookie, so call after establishSession. */
export async function recordAuthConsent() {
  const res = await fetch("/api/consent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "auth", terms: true, privacy: true, age18: true, anonId: getAnonId() }),
  });
  if (!res.ok) throw new Error("Could not record your consent. Try again.");
}

/** "all" | "essential" for the current policy version, null if undecided or stale. */
export function getCookieChoice(): "all" | "essential" | null {
  const [choice, version] = (readCookie(CONSENT_COOKIE) ?? "").split(":");
  if (version !== POLICY_VERSION) return null;
  return choice === "all" || choice === "essential" ? choice : null;
}

export function saveCookieChoice(choice: "all" | "essential") {
  writeCookie(CONSENT_COOKIE, `${choice}:${POLICY_VERSION}`);
}
