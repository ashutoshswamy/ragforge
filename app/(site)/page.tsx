"use client";

import Link from "next/link";
import {
  ArrowRight, Check, Globe, Minus, UploadCloud,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import SiteHeader from "@/components/ui/SiteHeader";
import { Wordmark } from "@/components/ui/Logo";
import Reveal from "@/components/ui/Reveal";
import ChatPreview from "@/components/ui/ChatPreview";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import FAQ from "@/components/landing/FAQ";

const DIY = ["Stand up a vector database", "Write a parser for every format", "Wire up an embedding job", "Build auth and per-user storage", "Design a chat UI with citations"];
const FORGE = ["Vector storage is already running", "PDF, DOCX and TXT out of the box", "Embeddings generated for you", "Sign in with Google or GitHub", "Streaming chat with source chips"];

const SOCIALS = [
  {
    href: "https://github.com/ashutoshswamy", label: "GitHub",
    path: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z",
  },
  {
    href: "https://twitter.com/ashutoshswamy_", label: "X",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    href: "https://linkedin.com/in/ashutoshswamy", label: "LinkedIn",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const signedIn = !!user;
  const cta = signedIn ? "/pipeline" : "/sign-up";
  const ctaLabel = signedIn ? "Open the builder" : "Start building";

  return (
    <div className="flex flex-col min-h-dvh">
      <SiteHeader
        links={
          <>
            <a href="#how-it-works" className="navlink">How it works</a>
            <a href="#features" className="navlink">Features</a>
            <a href="#compare" className="navlink">Why RAGForge</a>
          </>
        }
        actions={signedIn ? <Link href="/pipelines" className="btn btn-ghost btn-sm">My pipelines</Link> : undefined}
      />

      <main>
        {/* Hero: split, asymmetric. Fits the first viewport. */}
        <section className="wash relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 sm:pt-16 pb-24 lg:pb-16 lg:min-h-[calc(100dvh-68px)] grid lg:grid-cols-[1.3fr_1fr] gap-16 lg:gap-10 items-center">
            <div>
              <h1 className="rise text-[2.75rem] sm:text-6xl lg:text-[4.2rem] xl:text-[4.6rem]" style={{ "--d": "0ms" } as React.CSSProperties}>
                <span className="lg:whitespace-nowrap">Ask your documents</span>{" "}
                <span style={{ color: "var(--accent-text)" }}>anything.</span>
              </h1>
              <p className="rise mt-7 text-lg sm:text-xl max-w-xl" style={{ color: "var(--text-muted)", "--d": "120ms" } as React.CSSProperties}>
                Upload PDFs, Word files or text. RAGForge indexes them and answers with Gemini, citing the file each answer came from.
              </p>
              <div className="rise mt-10 flex flex-col sm:flex-row gap-3" style={{ "--d": "240ms" } as React.CSSProperties}>
                <Link href={cta} className="btn btn-primary">
                  {ctaLabel} <ArrowRight size={18} />
                </Link>
                <a href="#how-it-works" className="btn btn-ghost">See how it works</a>
              </div>
            </div>
            <ChatPreview />
          </div>
        </section>

        <HowItWorks />

        <Features />

        {/* Compare: duo */}
        <section id="compare" className="max-w-6xl mx-auto px-5 sm:px-8 pb-24 sm:pb-32">
          <Reveal>
            <h2 className="text-4xl sm:text-5xl max-w-xl">Skip the plumbing.</h2>
          </Reveal>
          <div className="mt-12 grid md:grid-cols-[1fr_1.15fr] gap-5 items-stretch">
            <Reveal>
              <div className="h-full p-8 sm:p-10" style={{ background: "var(--surface-elevated)", borderRadius: "var(--r-card)" }}>
                <h3 className="text-2xl" style={{ color: "var(--text-muted)" }}>Build it yourself</h3>
                <ul className="mt-7 flex flex-col gap-4">
                  {DIY.map((t) => (
                    <li key={t} className="flex items-start gap-3" style={{ color: "var(--text-muted)" }}>
                      <Minus size={18} className="mt-1 shrink-0" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="card h-full p-8 sm:p-10" style={{ borderColor: "var(--accent)", borderWidth: 2 }}>
                <h3 className="text-2xl" style={{ color: "var(--accent-text)" }}>With RAGForge</h3>
                <ul className="mt-7 flex flex-col gap-4">
                  {FORGE.map((t) => (
                    <li key={t} className="flex items-start gap-3 font-medium">
                      <span className="mt-0.5 flex items-center justify-center w-6 h-6 shrink-0 rounded-full" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}>
                        <Check size={14} strokeWidth={3} />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Closing CTA: the first step of the product, as the doorway */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-24 sm:pb-32">
          <Reveal>
            <div
              className="relative overflow-hidden px-7 sm:px-14 py-12 sm:py-16 grid lg:grid-cols-[1.45fr_1fr] gap-10 lg:gap-12 items-center"
              style={{
                background:
                  "radial-gradient(70% 90% at 100% 0%, color-mix(in srgb, var(--accent-ink) 18%, transparent), transparent 60%), var(--accent)",
                color: "var(--accent-ink)",
                borderRadius: "calc(var(--r-card) + 8px)",
              }}
            >
              <div>
                <h2 className="text-4xl sm:text-5xl lg:text-[3.4rem]" style={{ color: "inherit" }}>
                  Bring a Gemini key. Leave with answers.
                </h2>
                <p className="mt-5 text-lg max-w-md opacity-90">
                  Free to start. Sign in, upload a file and ask your first question in about a minute.
                </p>
                <Link
                  href={cta}
                  className="btn mt-9"
                  style={{ background: "var(--accent-ink)", color: "var(--accent)" }}
                >
                  {ctaLabel} <ArrowRight size={18} />
                </Link>
              </div>

              <Link
                href={cta}
                aria-label={ctaLabel}
                tabIndex={-1}
                className="group flex flex-col items-center justify-center gap-5 text-center px-6 py-12 transition-all duration-300 hover:-translate-y-1"
                style={{
                  border: "2px dashed color-mix(in srgb, var(--accent-ink) 45%, transparent)",
                  background: "color-mix(in srgb, var(--accent-ink) 9%, transparent)",
                  borderRadius: "var(--r-card)",
                }}
              >
                <span
                  className="flex items-center justify-center w-16 h-16 transition-transform duration-300 group-hover:-translate-y-1"
                  style={{ background: "var(--accent-ink)", color: "var(--accent)", borderRadius: 20 }}
                >
                  <UploadCloud size={30} strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}>
                    Drop your first file
                  </p>
                  <p className="mt-1 text-sm opacity-85">or click to browse</p>
                </div>
                <div className="flex gap-2">
                  {["PDF", "DOCX", "TXT"].map((f) => (
                    <span
                      key={f}
                      className="px-3 h-7 inline-flex items-center rounded-full text-xs font-semibold"
                      style={{ background: "color-mix(in srgb, var(--accent-ink) 16%, transparent)" }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </Link>
            </div>
          </Reveal>
        </section>
        <FAQ />
      </main>

      <footer className="mt-auto" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <Wordmark />
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Built by Ashutosh Swamy</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-0 text-sm" style={{ color: "var(--text-muted)" }}>
            <Link href="/chat-with-pdf" className="navlink">Chat with PDF</Link>
            <Link href="/rag-pipeline-builder" className="navlink">RAG builder</Link>
            <Link href="/privacy" className="navlink">Privacy</Link>
            <Link href="/terms" className="navlink">Terms</Link>
          </div>
          <div className="flex items-center gap-1">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="btn btn-ghost btn-icon border-transparent bg-transparent">
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
              </a>
            ))}
            <a href="https://ashutoshswamy.in" target="_blank" rel="noopener noreferrer" aria-label="Portfolio" className="btn btn-ghost btn-icon border-transparent bg-transparent">
              <Globe size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
