"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sileo } from "sileo";
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider, type AuthProvider } from "firebase/auth";
import { FileText, Quote, Zap } from "lucide-react";
import { auth } from "@/lib/firebase";
import { establishSession } from "@/lib/auth-context";
import { Wordmark } from "@/components/ui/Logo";
import ThemeMenu from "@/components/ui/ThemeMenu";
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

export default function AuthCard({ mode }: { mode: keyof typeof COPY }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"google" | "github" | null>(null);
  const copy = COPY[mode];

  const go = async (name: "google" | "github", provider: AuthProvider) => {
    setLoading(name);
    try {
      const cred = await signInWithPopup(auth, provider);
      await establishSession(await cred.user.getIdToken());
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
    <div className="min-h-dvh grid lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <aside
        className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
      >
        <div
          className="absolute -right-24 -bottom-24 w-[28rem] h-[28rem] rounded-full pointer-events-none"
          style={{ background: "color-mix(in srgb, var(--accent-ink) 12%, transparent)" }}
        />
        <div
          className="absolute right-24 bottom-40 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: "color-mix(in srgb, var(--accent-ink) 10%, transparent)" }}
        />
        <Link href="/" className="relative inline-flex items-center gap-2.5" aria-label="RAGForge home">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl" style={{ background: "var(--accent-ink)", color: "var(--accent)" }}>
            <Zap size={18} strokeWidth={2.4} fill="currentColor" />
          </span>
          <span className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.03em" }}>RAGForge</span>
        </Link>

        <div className="relative max-w-md">
          <Quote size={36} strokeWidth={1.5} className="mb-6 opacity-70" />
          <p className="text-4xl xl:text-5xl font-bold" style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
            Your documents already have the answers.
          </p>
          <p className="mt-6 text-lg opacity-85">Ask in plain language. Get replies that point to the page they came from.</p>
          <div className="mt-8 flex items-center gap-2 text-sm font-medium opacity-90">
            <FileText size={16} /> PDF, DOCX and TXT supported
          </div>
        </div>
      </aside>

      {/* Form */}
      <main className="flex flex-col wash">
        <div className="flex items-center justify-between px-6 pt-6">
          <div className="lg:hidden"><Wordmark /></div>
          <div className="ml-auto"><ThemeMenu /></div>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="rise w-full max-w-sm">
            <h1 className="text-4xl sm:text-5xl">{copy.title}</h1>
            <p className="mt-3 text-base" style={{ color: "var(--text-muted)" }}>{copy.sub}</p>

            <div className="mt-10 flex flex-col gap-3">
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
              <Link href={copy.swap[2]} className="font-semibold underline underline-offset-4" style={{ color: "var(--accent-text)" }}>
                {copy.swap[1]}
              </Link>
            </p>
            <p className="mt-6 text-xs" style={{ color: "var(--text-dim)" }}>
              By continuing you agree to the <Link href="/terms" className="underline underline-offset-2">Terms</Link> and{" "}
              <Link href="/privacy" className="underline underline-offset-2">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
