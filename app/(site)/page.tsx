"use client";

import Link from "next/link";
import {
  ArrowRight, Check, Minus, UploadCloud,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import SiteHeader from "@/components/ui/SiteHeader";
import SiteFooter from "@/components/ui/SiteFooter";
import Reveal from "@/components/ui/Reveal";
import ChatPreview from "@/components/ui/ChatPreview";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import FAQ from "@/components/landing/FAQ";

const DIY = ["Stand up a vector database", "Write a parser for every format", "Wire up an embedding job", "Build auth and per-user storage", "Design a chat UI with citations"];
const FORGE = ["Vector storage is already running", "PDF, DOCX and TXT out of the box", "Embeddings generated for you", "Sign in with Google or GitHub", "Streaming chat with source chips"];

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

      <SiteFooter />
    </div>
  );
}
