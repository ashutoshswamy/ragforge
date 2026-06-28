"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import Logo from "@/components/ui/Logo";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ─── Terminal Preview ─── */
function TerminalPreview() {
  const lines = [
    { text: "$ ragforge init --docs ./research/", color: "var(--text)" },
    { text: "✓ Parsed 3 documents (247 pages)", color: "var(--success)" },
    { text: "✓ Generated 1,842 chunks", color: "var(--success)" },
    { text: "✓ Embedded via Gemini (512-dim)", color: "var(--success)" },
    { text: "✓ Vector index ready", color: "var(--accent)" },
    { text: "", color: "" },
    { text: '$ ask "What are the key findings?"', color: "var(--text)" },
    { text: "⟳ Retrieving top-4 chunks...", color: "var(--text-muted)" },
    { text: "⟳ Generating answer...", color: "var(--text-muted)" },
    { text: "→ Based on Section 3.2 of paper.pdf...", color: "var(--accent)" },
  ];

  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const items = ref.current?.querySelectorAll(".term-line");
    if (!items) return;
    gsap.from(items, {
      opacity: 0,
      x: -10,
      duration: 0.4,
      stagger: 0.12,
      ease: "power2.out",
      delay: 1,
    });
  }, { scope: ref });

  return (
    <div
      ref={ref}
      className="relative w-full rounded overflow-hidden scanlines"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Terminal header */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)" }}
      >
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--error)" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#F59E0B" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--success)" }} />
        </div>
        <span className="text-[10px] uppercase tracking-widest ml-2" style={{ color: "var(--text-dim)" }}>
          ragforge — terminal
        </span>
      </div>
      {/* Terminal body */}
      <div className="p-4 space-y-1.5">
        {lines.map((line, i) => (
          <div
            key={i}
            className="term-line text-[11px] sm:text-xs leading-relaxed"
            style={{ color: line.color || "transparent", minHeight: "1rem" }}
          >
            {line.text}
          </div>
        ))}
        <div className="term-line cursor-blink text-[11px] sm:text-xs" style={{ color: "var(--text-muted)" }}>
          &nbsp;
        </div>
      </div>
    </div>
  );
}

/* ─── Pipeline Step Card ─── */
const PIPELINE_STEPS = [
  {
    num: "01", label: "UPLOAD", desc: "PDF, TXT, DOCX",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
    ),
  },
  {
    num: "02", label: "CHUNK", desc: "Split & embed",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    num: "03", label: "INDEX", desc: "Vector store",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
  },
  {
    num: "04", label: "CHAT", desc: "Ask anything",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
];

function PipelineFlow() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(ref.current?.querySelectorAll(".flow-step") ?? [], {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.12,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 80%",
      },
    });
    gsap.from(ref.current?.querySelectorAll(".flow-connector") ?? [], {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 0.6,
      stagger: 0.12,
      delay: 0.4,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 80%",
      },
    });
  }, { scope: ref });

  return (
    <div ref={ref} className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0 w-full max-w-3xl mx-auto">
      {PIPELINE_STEPS.map((step, i) => (
        <div key={step.num} className="flex sm:flex-col items-center flex-1">
          <div
            className="flow-step relative flex flex-col items-center gap-3 flex-1 w-full px-3 py-5 corner-accents transition-colors duration-300"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              className="flex items-center justify-center w-10 h-10 rounded"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            >
              <span style={{ color: "var(--accent)" }}>{step.icon}</span>
            </div>
            <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}>
              {step.num}
            </span>
            <span className="text-xs font-bold tracking-wider uppercase" style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}>
              {step.label}
            </span>
            <span className="text-[10px]" style={{ color: "var(--text-dim)", fontFamily: "var(--font-body)" }}>
              {step.desc}
            </span>
          </div>
          {i < PIPELINE_STEPS.length - 1 && (
            <>
              <div className="flow-connector hidden sm:block w-6 h-px flex-shrink-0" style={{ background: "var(--accent-dim)" }} />
              <div className="flow-connector block sm:hidden w-px h-4 mx-auto flex-shrink-0" style={{ background: "var(--accent-dim)", transformOrigin: "top center" }} />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Feature Card ─── */
function FeatureCard({ title, description, metric, metricLabel, icon }: {
  title: string; description: string; metric: string; metricLabel: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="feature-card group relative flex flex-col gap-5 p-6 corner-accents transition-all duration-300 cursor-default"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(245, 130, 10, 0.35)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px var(--accent-glow)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center w-10 h-10 rounded transition-colors duration-300"
        style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--accent)" }}
      >
        {icon}
      </div>

      {/* Title + desc */}
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="text-sm font-bold tracking-wide" style={{ fontFamily: "var(--font-heading)" }}>
          {title}
        </h3>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
          {description}
        </p>
      </div>

      {/* Metric */}
      <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid var(--border)" }}>
        <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-dim)", fontFamily: "var(--font-body)" }}>
          {metricLabel}
        </span>
        <span className="text-lg font-extrabold tabular-nums" style={{ color: "var(--accent)", fontFamily: "var(--font-heading)" }}>
          {metric}
        </span>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function HomePage() {
  const { isSignedIn } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const compareRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  /* Hero entrance timeline */
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero-badge", { opacity: 0, y: 12, duration: 0.4 })
      .from(".hero-title-line", { opacity: 0, y: 44, duration: 0.65, stagger: 0.1 }, "-=0.15")
      .from(".hero-subtitle", { opacity: 0, y: 20, duration: 0.5 }, "-=0.25")
      .from(".hero-cta-row", { opacity: 0, y: 16, duration: 0.5 }, "-=0.25")
      .from(".hero-stats", { opacity: 0, y: 12, duration: 0.45 }, "-=0.2")
      .from(".hero-terminal", { opacity: 0, x: 36, duration: 0.7, ease: "power2.out" }, "-=0.55");
  }, { scope: heroRef });

  /* Refresh ScrollTrigger after paint — fixes Next.js layout timing */
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => clearTimeout(id);
  }, []);

  /* Feature cards scroll reveal */
  useGSAP(() => {
    if (!featuresRef.current) return;
    const cards = featuresRef.current.querySelectorAll(".feature-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 32 },
      {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out",
        scrollTrigger: { trigger: featuresRef.current, start: "top 85%", once: true },
      }
    );
  }, { dependencies: [] });

  /* Comparison table reveal */
  useGSAP(() => {
    if (!compareRef.current) return;
    const rows = compareRef.current.querySelectorAll(".compare-row");
    gsap.fromTo(
      rows,
      { opacity: 0, x: -20 },
      {
        opacity: 1, x: 0, duration: 0.4, stagger: 0.07, ease: "power2.out",
        scrollTrigger: { trigger: compareRef.current, start: "top 85%", once: true },
      }
    );
  }, { dependencies: [] });

  /* CTA reveal */
  useGSAP(() => {
    if (!ctaRef.current) return;
    gsap.fromTo(
      ctaRef.current.querySelectorAll(".cta-content > *"),
      { opacity: 0, y: 24 },
      {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: ctaRef.current, start: "top 85%", once: true },
      }
    );
  }, { dependencies: [] });

  return (
    <div className="flex flex-col min-h-screen">
      {/* ─── NAV ─── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-5 sm:px-8 py-4"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "rgba(14, 14, 14, 0.85)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 no-underline group"
          style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}
        >
          <Logo size="sm" className="transition-transform duration-300 group-hover:scale-110" />
          <span className="text-lg font-bold tracking-tight">
            RAG<span style={{ color: "var(--accent)" }}>Forge</span>
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          {isSignedIn ? (
            <>
              <Link
                href="/pipelines"
                className="hidden sm:block text-xs uppercase tracking-widest transition-colors duration-200"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                My Pipelines
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-xs uppercase tracking-widest transition-colors duration-200"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-xs uppercase tracking-widest font-medium transition-all duration-200"
                style={{
                  background: "var(--accent)",
                  color: "var(--bg)",
                  fontFamily: "var(--font-body)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 20px var(--accent-glow-strong)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section
        ref={heroRef}
        className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[85vh] px-5 sm:px-8 py-20 sm:py-28 overflow-hidden"
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 grid-pattern opacity-30 pointer-events-none"
          style={{ maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)" }}
        />
        {/* Accent glow orb */}
        <div
          className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)", filter: "blur(40px)" }}
        />

        {/* Left: Copy */}
        <div className="relative z-10 flex flex-col gap-7">
          {/* Badge */}
          <div
            className="hero-badge inline-flex items-center gap-2 self-start px-3 py-1.5"
            style={{
              border: "1px solid var(--accent-dim)",
              background: "rgba(245,130,10,0.07)",
              fontFamily: "var(--font-body)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--accent)" }} />
            <span className="text-[10px] uppercase tracking-[0.25em]" style={{ color: "var(--accent)" }}>
              Gemini 2.5 · RAG Pipeline
            </span>
          </div>

          {/* Headline */}
          <div className="flex flex-col gap-0 overflow-hidden">
            <h1
              className="hero-title-line text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight leading-[1.0]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Chat with your
            </h1>
            <h1
              className="hero-title-line text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight leading-[1.0]"
              style={{ fontFamily: "var(--font-heading)", color: "var(--accent)" }}
            >
              documents
            </h1>
            <h1
              className="hero-title-line text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight leading-[1.0]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              instantly.
            </h1>
          </div>

          <p
            className="hero-subtitle text-sm sm:text-base leading-[1.7] max-w-[420px]"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Upload PDFs, Word docs, or text files. RAGForge chunks, embeds, and indexes
            everything — then lets you query it all with Gemini. No backend needed.
          </p>

          {/* CTAs */}
          <div className="hero-cta-row flex flex-col sm:flex-row items-start gap-3">
            <Link
              href={isSignedIn ? "/pipeline" : "/sign-up"}
              className="group relative inline-flex items-center gap-3 px-7 py-4 text-xs font-medium uppercase tracking-widest transition-all duration-300"
              style={{
                background: "var(--accent)",
                color: "var(--bg)",
                fontFamily: "var(--font-body)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 30px var(--accent-glow-strong)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <span>{isSignedIn ? "Open Dashboard" : "Start Building — Free"}</span>
              <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-7 py-4 text-xs uppercase tracking-widest transition-all duration-200"
              style={{
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
                fontFamily: "var(--font-body)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-dim)";
                (e.currentTarget as HTMLElement).style.color = "var(--text)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
              }}
            >
              How it works
            </a>
          </div>

          {/* Stats row */}
          <div className="hero-stats flex items-center gap-0 pt-1">
            {[
              { val: "3", label: "File formats" },
              { val: "< 1min", label: "First query" },
              { val: "0", label: "Infrastructure" },
            ].map((s, i) => (
              <div
                key={s.label}
                className="flex flex-col gap-1 px-5 first:pl-0"
                style={{ borderLeft: i > 0 ? "1px solid var(--border)" : "none" }}
              >
                <span className="text-xl font-extrabold tabular-nums leading-none" style={{ color: "var(--accent)", fontFamily: "var(--font-heading)" }}>
                  {s.val}
                </span>
                <span className="text-[9px] uppercase tracking-widest" style={{ color: "var(--text-dim)", fontFamily: "var(--font-body)" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Terminal */}
        <div className="hero-terminal relative z-10 hidden lg:block">
          <TerminalPreview />
        </div>
      </section>

      {/* ─── DIVIDER ─── */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, var(--border), transparent)" }} />

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-20 sm:py-28 px-5 sm:px-8">
        <div className="flex flex-col items-center gap-12 max-w-4xl mx-auto">
          <div className="text-center flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-px" style={{ background: "var(--accent)" }} />
              <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}>
                The Pipeline
              </span>
              <div className="w-6 h-px" style={{ background: "var(--accent)" }} />
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Four steps to intelligence
            </h2>
          </div>
          <PipelineFlow />
        </div>
      </section>

      {/* ─── DIVIDER ─── */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, var(--border), transparent)" }} />

      {/* ─── FEATURES ─── */}
      <section ref={featuresRef} className="py-20 sm:py-28 px-5 sm:px-8">
        <div className="flex flex-col items-center gap-12 max-w-5xl mx-auto">
          <div className="text-center flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-px" style={{ background: "var(--accent)" }} />
              <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}>
                Capabilities
              </span>
              <div className="w-6 h-px" style={{ background: "var(--accent)" }} />
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Everything you need
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 w-full">
            <FeatureCard
              title="Gemini Embeddings"
              description="State-of-the-art vector embeddings via Gemini. Documents become semantically searchable in seconds."
              metric="768-dim"
              metricLabel="Embedding size"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              }
            />
            <FeatureCard
              title="Smart Chunking"
              description="Recursive character splitter with configurable size and overlap. Context preserved across chunk boundaries."
              metric="2K"
              metricLabel="Max chunk size"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              }
            />
            <FeatureCard
              title="Streaming Answers"
              description="Responses stream token-by-token from Gemini Flash or Pro. See answers form in real time, no waiting."
              metric="< 1s"
              metricLabel="Time to first token"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              }
            />
            <FeatureCard
              title="Source Attribution"
              description="Every answer cites exactly which document chunks it came from. Full transparency, no hallucination hiding."
              metric="Top-K"
              metricLabel="Configurable retrieval"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
            <FeatureCard
              title="Multi-format Parsing"
              description="Drop PDFs, Word docs, or plain text. Parser handles everything server-side — just drag and drop."
              metric="3"
              metricLabel="Supported formats"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              }
            />
            <FeatureCard
              title="Custom System Prompt"
              description="Override the system prompt to control tone, persona, and format. Your pipeline behaves exactly as you define."
              metric="∞"
              metricLabel="Custom personas"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* ─── DIVIDER ─── */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, var(--border), transparent)" }} />

      {/* ─── COMPARISON ─── */}
      <section ref={compareRef} className="py-20 sm:py-28 px-5 sm:px-8">
        <div className="flex flex-col items-center gap-12 max-w-3xl mx-auto">
          <div className="text-center flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-px" style={{ background: "var(--accent)" }} />
              <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}>
                Why RAGForge
              </span>
              <div className="w-6 h-px" style={{ background: "var(--accent)" }} />
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Skip the boilerplate
            </h2>
          </div>
          <div className="w-full overflow-x-auto" style={{ border: "1px solid var(--border)" }}>
            <table className="w-full text-xs min-w-[280px] sm:min-w-[400px]" style={{ fontFamily: "var(--font-body)" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
                  <th className="text-left px-4 sm:px-5 py-3 uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>&nbsp;</th>
                  <th className="text-center px-4 sm:px-5 py-3 uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>DIY Setup</th>
                  <th className="text-center px-4 sm:px-5 py-3 uppercase tracking-widest" style={{ color: "var(--accent)" }}>RAGForge</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Vector DB setup", "Hours", "Built-in"],
                  ["Document parsing", "Write your own", "Drag & drop"],
                  ["Embedding pipeline", "Custom code", "Automatic"],
                  ["Auth & multi-user", "Integrate yourself", "Clerk included"],
                  ["Chat with sources", "Build from scratch", "Ready to use"],
                  ["Time to first query", "Days", "Minutes"],
                ].map(([label, diy, forge], i) => (
                  <tr
                    key={i}
                    className="compare-row transition-colors duration-150"
                    style={{ borderBottom: "1px solid var(--border)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-4 sm:px-5 py-3" style={{ color: "var(--text-muted)" }}>{label}</td>
                    <td className="text-center px-4 sm:px-5 py-3" style={{ color: "var(--text-dim)" }}>{diy}</td>
                    <td className="text-center px-4 sm:px-5 py-3 font-medium" style={{ color: "var(--accent)" }}>{forge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── DIVIDER ─── */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, var(--accent-dim), transparent)" }} />

      {/* ─── FINAL CTA ─── */}
      <section ref={ctaRef} className="relative py-24 sm:py-32 px-5 sm:px-8 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)", filter: "blur(20px)" }}
        />
        <div className="cta-content relative z-10 flex flex-col items-center gap-6 text-center">
          <Logo size="lg" />
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Ready to <span style={{ color: "var(--accent)" }}>forge</span>?
          </h2>
          <p className="text-sm max-w-md leading-relaxed" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            Bring your Gemini API key and start chatting with your documents in minutes.
            No backend, no infrastructure, no waiting.
          </p>
          <Link
            href={isSignedIn ? "/pipeline" : "/sign-up"}
            className="group inline-flex items-center gap-3 px-8 py-4 text-xs font-medium uppercase tracking-widest transition-all duration-300"
            style={{
              background: "var(--accent)",
              color: "var(--bg)",
              fontFamily: "var(--font-body)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 40px var(--accent-glow-strong), 0 0 80px var(--accent-glow)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            <span>{isSignedIn ? "Go to Dashboard" : "Get Started — Free"}</span>
            <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 sm:px-8 py-5"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2.5">
          <Logo size="sm" />
          <span className="text-sm font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            RAG<span style={{ color: "var(--accent)" }}>Forge</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-dim)", fontFamily: "var(--font-body)" }}>
            Built by Ashutosh Swamy
          </span>
          <span style={{ color: "var(--border)" }}>|</span>
          <Link href="/privacy" className="text-[10px] uppercase tracking-widest transition-opacity duration-200 hover:opacity-80" style={{ color: "var(--text-dim)", fontFamily: "var(--font-body)" }}>
            Privacy
          </Link>
          <Link href="/terms" className="text-[10px] uppercase tracking-widest transition-opacity duration-200 hover:opacity-80" style={{ color: "var(--text-dim)", fontFamily: "var(--font-body)" }}>
            Terms
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {[
            {
              href: "https://github.com/ashutoshswamy", label: "GitHub",
              icon: <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />,
            },
            {
              href: "https://twitter.com/ashutoshswamy_", label: "Twitter",
              icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />,
            },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity duration-200 hover:opacity-80"
              style={{ color: "var(--text-muted)" }}
              aria-label={s.label}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">{s.icon}</svg>
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
