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
import AuthStage from "@/components/ui/AuthStage";
import { GoogleIcon, GithubIcon } from "@/components/ui/AuthIcons";

const COPY = {
  "sign-in": {
    title: "Welcome back",
    sub: "Sign in to open your pipelines.",
    stage: ["Pick up where you left off.", "Your documents, your settings, and every answer with its source."],
    swap: ["No account yet?", "Create one", "/sign-up"],
    done: "Signed in",
  },
  "sign-up": {
    title: "Create your account",
    sub: "Free to start. Bring your own Gemini key.",
    stage: ["Your documents already have the answers.", "Ask in plain language. Get replies that point to the page they came from."],
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
    <div className="consent-row flex items-start gap-3 px-4 py-3.5" data-checked={checked}>
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
      <label htmlFor={id} className="min-w-0 text-sm cursor-pointer leading-snug" style={{ color: "var(--text)" }}>
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

  const gated = !ready;
  const providers = [
    { name: "google", Icon: GoogleIcon, label: "Continue with Google", make: () => new GoogleAuthProvider() },
    { name: "github", Icon: GithubIcon, label: "Continue with GitHub", make: () => new GithubAuthProvider() },
  ] as const;

  return (
    <div className="min-h-dvh grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <main className="flex flex-col wash">
        <div className="flex items-center justify-between px-6 pt-6 lg:px-14 xl:px-20">
          <Wordmark />
          <ThemeMenu />
        </div>

        <div className="flex-1 flex items-center px-6 py-12 lg:px-14 xl:px-20">
          <div className="rise w-full max-w-[26rem]">
            <h1 className="text-4xl sm:text-5xl">{copy.title}</h1>
            <p className="mt-3 text-base" style={{ color: "var(--text-muted)" }}>{copy.sub}</p>

            <fieldset
              className="consent mt-10"
              aria-describedby={showError && !ready ? "consent-error" : undefined}
            >
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
            </fieldset>
            {showError && !ready && (
              <p id="consent-error" role="alert" className="mt-3 text-sm font-medium" style={{ color: "var(--error)" }}>
                Tick both boxes to continue.
              </p>
            )}

            <div className="mt-5 flex flex-col gap-3">
              {providers.map(({ name, Icon, label, make }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => go(name, make())}
                  disabled={loading !== null}
                  aria-disabled={gated || undefined}
                  className="btn btn-ghost w-full h-12 gate"
                >
                  {loading === name ? <span className="spinner" /> : <Icon />}
                  {label}
                </button>
              ))}
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

      <AuthStage title={copy.stage[0]} sub={copy.stage[1]} />
    </div>
  );
}
