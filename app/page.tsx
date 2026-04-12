"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const lineReveal: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.2, ease: "easeOut", delay: 0.6 },
  },
};

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Radial glow behind hero */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--accent-glow-strong) 0%, transparent 70%)",
        }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-5 sm:gap-8 px-4 sm:px-6 text-center max-w-2xl"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Tag */}
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full border"
          style={{
            borderColor: "var(--border)",
            background: "var(--surface)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "var(--accent)" }}
          />
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Retrieval-Augmented Generation
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeUp}
          className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight leading-none"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          RAG
          <span style={{ color: "var(--accent)" }}>Forge</span>
        </motion.h1>

        {/* Accent line */}
        <motion.div
          variants={lineReveal}
          className="w-48 h-px origin-left"
          style={{ background: "var(--accent)" }}
        />

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="text-base sm:text-lg leading-relaxed max-w-lg"
          style={{
            color: "var(--text-muted)",
            fontFamily: "var(--font-body)",
          }}
        >
          Upload your documents. Configure the pipeline.
          <br />
          Chat with your data — powered by Gemini.
        </motion.p>

        {/* CTA */}
        <motion.div variants={fadeUp}>
          <Link
            href="/pipeline"
            className="group relative inline-flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-medium uppercase tracking-widest transition-all duration-300"
            style={{
              background: "var(--accent)",
              color: "var(--bg)",
              fontFamily: "var(--font-body)",
            }}
          >
            <span className="relative z-10">Build Pipeline</span>
            <svg
              className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            {/* Hover glow */}
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                boxShadow:
                  "0 0 30px var(--accent-glow-strong), 0 0 60px var(--accent-glow)",
              }}
            />
          </Link>
        </motion.div>

        {/* Pipeline steps preview */}
        <motion.div
          variants={fadeUp}
          className="hidden sm:flex items-center gap-4 mt-4"
          style={{
            color: "var(--text-dim)",
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
          }}
        >
          {["01 UPLOAD", "02 CONFIGURE", "03 CHAT"].map((step, i) => (
            <div key={step} className="flex items-center gap-4">
              {i > 0 && (
                <div
                  className="w-8 h-px"
                  style={{ background: "var(--border)" }}
                />
              )}
              <span className="uppercase tracking-widest">{step}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-0 left-0 right-0 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-5 py-3 sm:py-4 px-4"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <span
          className="text-[10px] uppercase tracking-widest"
          style={{ color: "var(--text-dim)", fontFamily: "var(--font-body)" }}
        >
          Built by Ashutosh Swamy
        </span>
        <span className="hidden sm:inline" style={{ color: "var(--border)" }}>|</span>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/ashutoshswamy"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200"
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
            className="transition-colors duration-200"
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
            className="transition-colors duration-200"
            style={{ color: "var(--text-muted)" }}
            aria-label="Twitter / X"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </motion.footer>
    </div>
  );
}
