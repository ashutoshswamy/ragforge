"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function SignInPage() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".auth-item", {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.12,
      ease: "power3.out",
    });
  }, { scope: ref });

  return (
    <div ref={ref} className="relative flex min-h-screen items-center justify-center noise-bg overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 grid-pattern opacity-30"
        style={{ maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)" }}
      />

      {/* Ambient glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[600px] h-[250px] sm:h-[400px] rounded-full blur-[80px] sm:blur-[120px] pointer-events-none"
        style={{ background: "var(--accent-glow)" }}
      />

      {/* Corner brackets */}
      <div className="absolute top-6 left-6 w-12 h-12 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: "var(--accent-dim)" }} />
        <div className="absolute top-0 left-0 h-full w-[2px]" style={{ background: "var(--accent-dim)" }} />
      </div>
      <div className="absolute bottom-6 right-6 w-12 h-12 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full h-[2px]" style={{ background: "var(--accent-dim)" }} />
        <div className="absolute bottom-0 right-0 h-full w-[2px]" style={{ background: "var(--accent-dim)" }} />
      </div>

      {/* Scan line — CSS animation */}
      <div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ top: "30%", background: "var(--accent)", animation: "scan-pulse 4s ease-in-out infinite" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4">
        <div className="auth-item flex flex-col items-center gap-4">
          <Link href="/" className="flex items-center gap-3 no-underline group">
            <Logo size="md" className="transition-transform duration-300 group-hover:scale-110" />
            <span className="text-2xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}>
              RAG<span style={{ color: "var(--accent)" }}>Forge</span>
            </span>
          </Link>
        </div>

        <div className="auth-item w-32 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--accent-dim), transparent)" }} />

        <div className="auth-item flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
          <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            Authentication Required
          </span>
        </div>

        <div className="auth-item">
          <SignIn />
        </div>

        <div className="auth-item flex items-center gap-3 mt-2">
          <div className="w-6 h-px" style={{ background: "var(--border)" }} />
          <span className="text-[9px] uppercase tracking-[0.2em]" style={{ color: "var(--text-dim)", fontFamily: "var(--font-body)" }}>
            Secure Access
          </span>
          <div className="w-6 h-px" style={{ background: "var(--border)" }} />
        </div>
      </div>
    </div>
  );
}
