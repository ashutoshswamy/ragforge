"use client";

import Link from "next/link";
import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import Logo from "@/components/ui/Logo";

/* ─── Animation Variants ─── */
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const lineReveal: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 1.2, ease: "easeOut" } },
};

/* ─── Section Wrapper with viewport trigger ─── */
function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─── Pipeline Flow Diagram ─── */
function PipelineFlow() {
  const steps = [
    {
      num: "01",
      label: "UPLOAD",
      desc: "PDF, TXT, DOCX",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      ),
    },
    {
      num: "02",
      label: "CHUNK",
      desc: "Split & embed",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
    },
    {
      num: "03",
      label: "INDEX",
      desc: "Vector store",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
        </svg>
      ),
    },
    {
      num: "04",
      label: "CHAT",
      desc: "Ask anything",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0 w-full max-w-3xl mx-auto">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center flex-1 w-full sm:w-auto">
          <motion.div
            variants={scaleIn}
            className="relative flex flex-col items-center gap-3 flex-1 px-3 py-5 corner-accents"
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
            <span
              className="text-[10px] tracking-[0.3em] uppercase"
              style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}
            >
              {step.num}
            </span>
            <span
              className="text-xs font-bold tracking-wider uppercase"
              style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}
            >
              {step.label}
            </span>
            <span
              className="text-[10px]"
              style={{ color: "var(--text-dim)", fontFamily: "var(--font-body)" }}
            >
              {step.desc}
            </span>
          </motion.div>
          {i < steps.length - 1 && (
            <>
              {/* Horizontal connector — desktop */}
              <motion.div
                variants={lineReveal}
                className="hidden sm:block w-6 h-px origin-left flex-shrink-0"
                style={{ background: "var(--accent-dim)" }}
              />
              {/* Vertical connector — mobile */}
              <motion.div
                variants={lineReveal}
                className="block sm:hidden w-px h-4 origin-top mx-auto flex-shrink-0"
                style={{ background: "var(--accent-dim)" }}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Feature Card ─── */
function FeatureCard({
  title,
  description,
  metric,
  metricLabel,
}: {
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="relative group p-6 corner-accents transition-colors duration-300"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
      whileHover={{
        borderColor: "rgba(245, 130, 10, 0.3)",
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h3
            className="text-sm font-bold uppercase tracking-wider"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {title}
          </h3>
          <div className="text-right">
            <span
              className="text-2xl font-extrabold tabular-nums"
              style={{ color: "var(--accent)", fontFamily: "var(--font-heading)" }}
            >
              {metric}
            </span>
            <p
              className="text-[9px] uppercase tracking-widest mt-0.5"
              style={{ color: "var(--text-dim)", fontFamily: "var(--font-body)" }}
            >
              {metricLabel}
            </p>
          </div>
        </div>
        <div className="h-px" style={{ background: "var(--border)" }} />
        <p
          className="text-xs leading-relaxed"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── App Preview — mimics real RAGForge chat UI ─── */
function AppPreview() {
  const messages = [
    { role: "user", text: "What were the key findings from the Q4 report?" },
    {
      role: "assistant",
      text: "Based on the Q4 report, the key findings include:\n\n1. Revenue grew 23% year-over-year, exceeding the projected target of 18%\n2. Customer retention improved to 94.2%, up from 89.7% in Q3\n3. The new onboarding flow reduced time-to-value by 40%",
      sources: ["q4-report.pdf", "metrics-summary.docx"],
    },
    { role: "user", text: "How does that compare to Q3?" },
    {
      role: "assistant",
      text: "Comparing Q4 to Q3:\n\n• Revenue: Q4 saw 23% growth vs Q3's 15% — an 8-point acceleration driven primarily by enterprise tier upgrades\n• Retention: 94.2% vs 89.7% — the 4.5-point jump correlates with the support restructuring completed mid-Q3",
      sources: ["q4-report.pdf", "q3-report.pdf"],
    },
  ];

  return (
    <motion.div
      variants={scaleIn}
      className="relative w-full max-w-2xl mx-auto rounded overflow-hidden"
      style={{ border: "1px solid var(--border)" }}
    >
      {/* Browser chrome */}
      <div
        className="flex items-center gap-3 px-4 py-2.5"
        style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#EF4444" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#F5820A" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#22C55E" }} />
        </div>
        <div
          className="flex-1 mx-4 px-3 py-1 rounded text-[10px] text-center"
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            color: "var(--text-dim)",
            fontFamily: "var(--font-body)",
          }}
        >
          RAGForge
        </div>
      </div>

      {/* App header mock */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded flex items-center justify-center"
            style={{ background: "var(--accent)" }}
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="var(--bg)">
              <path d="M13 3v7h7l-8 11v-7H5l8-11z" />
            </svg>
          </div>
          <span
            className="text-xs font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            RAG<span style={{ color: "var(--accent)" }}>Forge</span>
          </span>
        </div>
        {/* Mock stepper */}
        <div className="hidden sm:flex items-center gap-2">
          {["Upload", "Configure", "Chat"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && (
                <div className="w-4 h-px" style={{ background: i <= 2 ? "var(--accent-dim)" : "var(--border)" }} />
              )}
              <div
                className="flex items-center justify-center w-5 h-5 rounded-full text-[8px]"
                style={{
                  background: i === 2 ? "var(--accent)" : "var(--accent-dim)",
                  color: i === 2 ? "var(--bg)" : "var(--accent)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {i < 2 ? (
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  `0${i + 1}`
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="w-6 h-6 rounded-full" style={{ background: "var(--border)" }} />
      </div>

      {/* Chat area */}
      <div
        className="flex flex-col"
        style={{ background: "var(--surface)" }}
      >
        {/* Chat header */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--success)" }} />
            <span
              className="text-[9px] uppercase tracking-widest"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
            >
              Pipeline Active
            </span>
          </div>
          <span
            className="text-[9px] uppercase tracking-widest px-2 py-0.5"
            style={{
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
              fontFamily: "var(--font-body)",
            }}
          >
            + New Pipeline
          </span>
        </div>

        {/* Messages */}
        <div className="flex flex-col gap-3 p-4 sm:p-5 max-h-[320px] overflow-hidden">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.25, duration: 0.4 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className="max-w-[85%] px-3.5 py-2.5 rounded text-xs leading-relaxed"
                style={{
                  background: msg.role === "user" ? "var(--accent-dim)" : "var(--bg)",
                  border: `1px solid ${msg.role === "user" ? "var(--accent-dim)" : "var(--border)"}`,
                  color: msg.role === "user" ? "var(--accent)" : "var(--text-muted)",
                  fontFamily: "var(--font-body)",
                  whiteSpace: "pre-line",
                }}
              >
                {msg.text}
                {msg.sources && (
                  <div className="flex gap-1.5 mt-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                    {msg.sources.map((s) => (
                      <span
                        key={s}
                        className="px-1.5 py-0.5 text-[9px] rounded"
                        style={{
                          background: "var(--surface)",
                          color: "var(--accent)",
                          border: "1px solid var(--accent-dim)",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input mock */}
        <div
          className="flex items-center gap-2 px-4 py-2.5"
          style={{ borderTop: "1px solid var(--border)", background: "var(--bg)" }}
        >
          <span
            className="text-xs"
            style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}
          >
            &gt;
          </span>
          <span
            className="flex-1 text-xs"
            style={{ color: "var(--text-dim)", fontFamily: "var(--font-body)" }}
          >
            Ask a question...
          </span>
          <div
            className="w-7 h-7 rounded flex items-center justify-center"
            style={{ background: "var(--accent)" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="var(--bg)" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════ */
/* ─── Main Page ─── */
/* ═══════════════════════════════════════════════ */

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <div className="relative flex flex-col min-h-screen overflow-x-hidden">
      {/* Background grid — full page */}
      <div className="fixed inset-0 grid-pattern opacity-[0.04] pointer-events-none z-0" />

      {/* ─── NAV ─── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-5 sm:px-8 py-3"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "rgba(14, 14, 14, 0.85)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <Logo size="sm" />
          <span
            className="text-base font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            RAG<span style={{ color: "var(--accent)" }}>Forge</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <Link
                href="/pipeline"
                className="hidden sm:inline-block px-4 py-1.5 text-[10px] uppercase tracking-widest transition-colors duration-200"
                style={{
                  color: "var(--bg)",
                  background: "var(--accent)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Dashboard
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-1.5 text-[10px] uppercase tracking-widest transition-colors duration-200"
                style={{
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-1.5 text-[10px] uppercase tracking-widest transition-colors duration-200"
                style={{
                  color: "var(--bg)",
                  background: "var(--accent)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <Section className="relative flex flex-col items-center pt-20 sm:pt-32 pb-16 sm:pb-24 px-5 sm:px-8">
        {/* Radial glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[700px] sm:h-[700px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, var(--accent-glow-strong) 0%, transparent 65%)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8 text-center max-w-3xl">
          {/* Status badge */}
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-2 px-4 py-1.5"
            style={{
              border: "1px solid var(--border)",
              background: "var(--surface)",
            }}
          >
            <span
              className="relative w-2 h-2 rounded-full"
              style={{ background: "var(--success)" }}
            >
              <span
                className="absolute inset-0 rounded-full animate-ping"
                style={{ background: "var(--success)", opacity: 0.4 }}
              />
            </span>
            <span
              className="text-[10px] uppercase tracking-[0.25em]"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
            >
              Now with persistent pipelines & auth
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Build RAG pipelines
            <br />
            <span style={{ color: "var(--accent)" }}>in minutes</span>
          </motion.h1>

          {/* Accent line */}
          <motion.div
            variants={lineReveal}
            className="w-32 sm:w-48 h-px origin-left"
            style={{ background: "var(--accent)" }}
          />

          {/* Subheading */}
          <motion.p
            variants={fadeUp}
            className="text-sm sm:text-base leading-relaxed max-w-xl"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Upload your documents. Configure chunking, embeddings, and retrieval.
            Chat with your data — powered by Google Gemini. No infrastructure to manage.
          </motion.p>

          {/* CTA row */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <Link
              href={isSignedIn ? "/pipeline" : "/sign-up"}
              className="group relative inline-flex items-center gap-3 px-7 py-3.5 text-xs font-medium uppercase tracking-widest transition-all duration-300"
              style={{
                background: "var(--accent)",
                color: "var(--bg)",
                fontFamily: "var(--font-body)",
              }}
            >
              <span className="relative z-10">
                {isSignedIn ? "Open Dashboard" : "Start Building — Free"}
              </span>
              <svg
                className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: "0 0 30px var(--accent-glow-strong), 0 0 60px var(--accent-glow)" }}
              />
            </Link>
            <a
              href="#how-it-works"
              className="px-6 py-3.5 text-xs uppercase tracking-widest transition-colors duration-200"
              style={{
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
                fontFamily: "var(--font-body)",
              }}
            >
              See How It Works
            </a>
          </motion.div>

        </div>
      </Section>

      {/* ─── DIVIDER ─── */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, var(--accent-dim), transparent)" }} />

      {/* ─── HOW IT WORKS ─── */}
      <Section id="how-it-works" className="py-20 sm:py-28 px-5 sm:px-8">
        <div className="flex flex-col items-center gap-12 sm:gap-16">
          <div className="text-center flex flex-col items-center gap-4">
            <motion.span
              variants={fadeUp}
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}
            >
              How It Works
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-2xl sm:text-4xl font-extrabold tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Four steps to your own RAG pipeline
            </motion.h2>
            <motion.div
              variants={lineReveal}
              className="w-24 h-px origin-center"
              style={{ background: "var(--accent-dim)" }}
            />
          </div>

          <PipelineFlow />

          <AppPreview />
        </div>
      </Section>

      {/* ─── DIVIDER ─── */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, var(--border), transparent)" }} />

      {/* ─── FEATURES ─── */}
      <Section className="py-20 sm:py-28 px-5 sm:px-8">
        <div className="flex flex-col items-center gap-12 sm:gap-16 max-w-4xl mx-auto">
          <div className="text-center flex flex-col items-center gap-4">
            <motion.span
              variants={fadeUp}
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}
            >
              Features
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-2xl sm:text-4xl font-extrabold tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Everything you need, nothing you don&apos;t
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            <FeatureCard
              title="Multi-Format Ingest"
              description="Upload PDFs, DOCX, and plain text. Documents are parsed, chunked with configurable overlap, and embedded using Gemini's latest embedding model."
              metric="3"
              metricLabel="file formats"
            />
            <FeatureCard
              title="Persistent Pipelines"
              description="Your pipelines are saved to Supabase. Come back anytime, load a pipeline, and continue chatting where you left off. Full history preserved."
              metric="∞"
              metricLabel="sessions"
            />
            <FeatureCard
              title="Vector Search"
              description="Embeddings stored in Supabase pgvector with IVFFlat indexing. Cosine similarity retrieval finds the most relevant chunks for every query."
              metric="768"
              metricLabel="dimensions"
            />
            <FeatureCard
              title="Streaming Responses"
              description="Gemini responses stream in real-time. See answers appear token-by-token with source attribution showing exactly which documents were referenced."
              metric="<1s"
              metricLabel="first token"
            />
            <FeatureCard
              title="Configurable Pipeline"
              description="Tune chunk size, overlap, top-K retrieval, model selection, and system prompts. Every parameter is adjustable to match your use case."
              metric="6"
              metricLabel="parameters"
            />
            <FeatureCard
              title="Secure by Default"
              description="Clerk authentication protects every route. Your Gemini API key is used per-request and never stored. Each pipeline is scoped to your account."
              metric="0"
              metricLabel="keys stored"
            />
          </div>
        </div>
      </Section>

      {/* ─── DIVIDER ─── */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, var(--border), transparent)" }} />

      {/* ─── HOW IT COMPARES ─── */}
      <Section className="py-20 sm:py-28 px-5 sm:px-8">
        <div className="flex flex-col items-center gap-12 max-w-3xl mx-auto">
          <div className="text-center flex flex-col items-center gap-4">
            <motion.span
              variants={fadeUp}
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}
            >
              Why RAGForge
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-2xl sm:text-4xl font-extrabold tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Skip the boilerplate
            </motion.h2>
          </div>

          <motion.div
            variants={scaleIn}
            className="w-full overflow-x-auto"
            style={{ border: "1px solid var(--border)" }}
          >
            <table className="w-full text-xs min-w-[400px]" style={{ fontFamily: "var(--font-body)" }}>
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
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td className="px-4 sm:px-5 py-3" style={{ color: "var(--text-muted)" }}>{label}</td>
                    <td className="text-center px-4 sm:px-5 py-3" style={{ color: "var(--text-dim)" }}>{diy}</td>
                    <td className="text-center px-4 sm:px-5 py-3 font-medium" style={{ color: "var(--accent)" }}>{forge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </Section>

      {/* ─── DIVIDER ─── */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, var(--accent-dim), transparent)" }} />

      {/* ─── FINAL CTA ─── */}
      <Section className="relative py-24 sm:py-32 px-5 sm:px-8">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          <motion.div variants={fadeUp}>
            <Logo size="lg" />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Ready to <span style={{ color: "var(--accent)" }}>forge</span>?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-sm max-w-md leading-relaxed"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Create your account, bring your Gemini API key, and start chatting with your documents in minutes.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link
              href={isSignedIn ? "/pipeline" : "/sign-up"}
              className="group relative inline-flex items-center gap-3 px-8 py-4 text-xs font-medium uppercase tracking-widest transition-all duration-300"
              style={{
                background: "var(--accent)",
                color: "var(--bg)",
                fontFamily: "var(--font-body)",
              }}
            >
              <span className="relative z-10">
                {isSignedIn ? "Go to Dashboard" : "Get Started — Free"}
              </span>
              <svg
                className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: "0 0 30px var(--accent-glow-strong), 0 0 60px var(--accent-glow)" }}
              />
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* ─── FOOTER ─── */}
      <footer
        className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 sm:px-8 py-5"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2.5">
          <Logo size="sm" />
          <span
            className="text-sm font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            RAG<span style={{ color: "var(--accent)" }}>Forge</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span
            className="text-[10px] uppercase tracking-widest"
            style={{ color: "var(--text-dim)", fontFamily: "var(--font-body)" }}
          >
            Built by Ashutosh Swamy
          </span>
          <span style={{ color: "var(--border)" }}>|</span>
          <Link
            href="/privacy"
            className="text-[10px] uppercase tracking-widest transition-colors duration-200 hover:opacity-80"
            style={{ color: "var(--text-dim)", fontFamily: "var(--font-body)" }}
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-[10px] uppercase tracking-widest transition-colors duration-200 hover:opacity-80"
            style={{ color: "var(--text-dim)", fontFamily: "var(--font-body)" }}
          >
            Terms
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/ashutoshswamy"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
            aria-label="GitHub"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/ashutoshswamy"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
            aria-label="LinkedIn"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href="https://twitter.com/ashutoshswamy_"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
            aria-label="Twitter / X"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}
