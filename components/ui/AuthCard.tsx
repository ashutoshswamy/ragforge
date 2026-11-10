"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sileo } from "sileo";
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider, type AuthProvider } from "firebase/auth";
import { Check } from "lucide-react";
import { auth } from "@/lib/firebase";
import { establishSession } from "@/lib/auth-context";
import { recordAuthConsent } from "@/lib/consent-client";
import { Wordmark } from "@/components/ui/Logo";
import ThemeMenu from "@/components/ui/ThemeMenu";
import ChatPreview from "@/components/ui/ChatPreview";
import { GoogleIcon, GithubIcon } from "@/components/ui/AuthIcons";

const COPY = {
  "sign-in": {
    title: "Welcome back",
    sub: "Sign in to open your pipelines.",
    swap: ["No account yet?", "Create one", "/sign-up"],
    done: "Signed in",
  },
  "sign-up": {
    title: "Create your account",
    sub: "Free to start. Bring your own Gemini key.",
    swap: ["Already have an account?", "Sign in", "/sign-in"],
    done: "Account ready",
  },
} as const;

const LINK = "font-semibold underline underline-offset-4";

function ConsentBox({
  id,
  inputRef,
  checked,
  invalid,
  onChange,
  children,
}: {
  id: string;
  inputRef: React.Ref<HTMLInputElement>;
  checked: boolean;
  invalid: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="relative mt-0.5 flex shrink-0">
        <input
          ref={inputRef}
          id={id}
          type="checkbox"
          className="check peer"
          checked={checked}
          aria-invalid={invalid}
          onChange={(e) => onChange(e.target.checked)}
        />
        <Check
          size={14}
          strokeWidth={3}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 m-auto opacity-0 peer-checked:opacity-100"
          style={{ color: "var(--accent-ink)" }}
        />
      </span>
      <label htmlFor={id} className="text-sm cursor-pointer" style={{ color: "var(--text)" }}>
        {children}
      </label>
    </div>
  );
}

export default function AuthCard({ mode }: { mode: keyof typeof COPY }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"google" | "github" | null>(null);
  const [agreed, setAgreed] = useState({ age: false, terms: false });
  const [showError, setShowError] = useState(false);
  const ageRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);
  const copy = COPY[mode];
  const ready = agreed.age && agreed.terms;

  const go = async (name: "google" | "github", provider: AuthProvider) => {
    if (!ready) {
      setShowError(true);
      (agreed.age ? termsRef : ageRef).current?.focus();
      return;
    }
    setLoading(name);
    try {
      const cred = await signInWithPopup(auth, provider);
      await establishSession(await cred.user.getIdToken());
      await recordAuthConsent();
      sileo.success({ title: copy.done, description: cred.user.email ?? undefined });
      router.push("/pipelines");
    } catch (err) {
      const code = (err as { code?: string }).code;
      // Closing the popup is not an error worth shouting about.
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        sileo.info({ title: "Sign in cancelled" });
      } else {
        sileo.error({ title: "Could not sign in", description: err instanceof Error ? err.message : "Try again." });
      }
      setLoading(null);
    }
  };

  return (
    <div className="min-h-dvh grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* Form */}
      <main className="flex flex-col wash">
        <div className="flex items-center justify-between px-6 pt-6 lg:px-16 xl:px-24">
          <Wordmark />
          <ThemeMenu />
        </div>
        <div className="flex-1 flex items-center px-6 py-12 lg:px-16 xl:px-24">
          <div className="rise w-full max-w-sm">
            <h1 className="text-4xl sm:text-5xl">{copy.title}</h1>
            <p className="mt-3 text-base" style={{ color: "var(--text-muted)" }}>{copy.sub}</p>

            <fieldset className="mt-10 flex flex-col gap-4" aria-describedby={showError && !ready ? "consent-error" : undefined}>
              <legend className="sr-only">Before you continue</legend>
              <ConsentBox
                id="consent-age"
                inputRef={ageRef}
                checked={agreed.age}
                invalid={showError && !agreed.age}
                onChange={(v) => setAgreed((a) => ({ ...a, age: v }))}
              >
                I am 18 years or older.
              </ConsentBox>
              <ConsentBox
                id="consent-terms"
                inputRef={termsRef}
                checked={agreed.terms}
                invalid={showError && !agreed.terms}
                onChange={(v) => setAgreed((a) => ({ ...a, terms: v }))}
              >
                I agree to the{" "}
                <Link href="/terms" target="_blank" rel="noopener" className={LINK} style={{ color: "var(--accent-text)" }}>
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" target="_blank" rel="noopener" className={LINK} style={{ color: "var(--accent-text)" }}>
                  Privacy Policy
                </Link>
                .
              </ConsentBox>
              {showError && !ready && (
                <p id="consent-error" role="alert" className="text-sm font-medium" style={{ color: "var(--error)" }}>
                  Tick both boxes to continue.
                </p>
              )}
            </fieldset>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => go("google", new GoogleAuthProvider())}
                disabled={loading !== null}
                className="btn btn-ghost w-full"
              >
                {loading === "google" ? <span className="spinner" /> : <GoogleIcon />}
                Continue with Google
              </button>
              <button
                type="button"
                onClick={() => go("github", new GithubAuthProvider())}
                disabled={loading !== null}
                className="btn btn-ghost w-full"
              >
                {loading === "github" ? <span className="spinner" /> : <GithubIcon />}
                Continue with GitHub
              </button>
            </div>

            <p className="mt-8 text-sm" style={{ color: "var(--text-muted)" }}>
              {copy.swap[0]}{" "}
              <Link href={copy.swap[2]} className={LINK} style={{ color: "var(--accent-text)" }}>
                {copy.swap[1]}
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Stage: the product answering with a citation, shown with the real chat components */}
      <aside
        className="hidden lg:flex flex-col justify-center gap-10 p-12 xl:p-16 overflow-hidden"
        style={{ background: "var(--surface-elevated)", borderLeft: "1px solid var(--border)" }}
      >
        <div className="rise max-w-md" style={{ ["--d" as string]: "150ms" }}>
          <p className="text-4xl xl:text-5xl font-bold" style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.03em", lineHeight: 1.05, textWrap: "balance" }}>
            Your documents already have the answers.
          </p>
          <p className="mt-5 text-lg" style={{ color: "var(--text-muted)" }}>
            Ask in plain language. Get replies that point to the page they came from.
          </p>
        </div>
        <ChatPreview />
      </aside>
    </div>
  );
}
