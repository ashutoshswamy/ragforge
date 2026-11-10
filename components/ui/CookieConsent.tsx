"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { getAnonId, getCookieChoice, saveCookieChoice } from "@/lib/consent-client";

// Non-modal: the page stays usable while the choice is pending.
export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Cookie lives in the browser only, so the check must wait for mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (getCookieChoice() === null) setOpen(true);
  }, []);

  if (!open) return null;

  const choose = (choice: "all" | "essential") => {
    const anonId = getAnonId();
    saveCookieChoice(choice);
    setOpen(false);
    // Fire and forget: a failed log must never block the visitor.
    fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "cookies", choice, anonId }),
      keepalive: true,
    }).catch(() => {});
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-body"
      className="fixed z-40 inset-x-4 bottom-4 sm:inset-x-auto sm:left-6 sm:bottom-6 sm:w-[24rem] rise"
      style={{ ["--d" as string]: "600ms", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="card p-5" style={{ boxShadow: "var(--shadow-lift)" }}>
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-9 h-9 shrink-0"
            style={{ background: "var(--accent-dim)", color: "var(--accent-text)", borderRadius: 12 }}
            aria-hidden="true"
          >
            <Cookie size={18} strokeWidth={1.75} />
          </span>
          <h2 id="cookie-title" className="text-lg">Cookies on RAGForge</h2>
        </div>
        <p id="cookie-body" className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
          Essential cookies keep you signed in and remember your theme. Optional cookies help us see what to improve.{" "}
          <Link href="/privacy" className="font-semibold underline underline-offset-4" style={{ color: "var(--accent-text)" }}>
            Privacy Policy
          </Link>
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button type="button" onClick={() => choose("essential")} className="btn btn-ghost btn-sm">
            Essential only
          </button>
          <button type="button" onClick={() => choose("all")} className="btn btn-primary btn-sm">
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
