"use client";

import { SignUp } from "@clerk/nextjs";

import { motion } from "framer-motion";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const lineExpand = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { delay: 0.3, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center noise-bg overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 grid-pattern opacity-30"
        style={{ maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)" }}
      />

      {/* Ambient accent glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "var(--accent-glow)" }}
      />

      {/* Decorative corner brackets — top left */}
      <div className="absolute top-6 left-6 w-12 h-12 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: "var(--accent-dim)" }} />
        <div className="absolute top-0 left-0 h-full w-[2px]" style={{ background: "var(--accent-dim)" }} />
      </div>

      {/* Decorative corner brackets — bottom right */}
      <div className="absolute bottom-6 right-6 w-12 h-12 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full h-[2px]" style={{ background: "var(--accent-dim)" }} />
        <div className="absolute bottom-0 right-0 h-full w-[2px]" style={{ background: "var(--accent-dim)" }} />
      </div>

      {/* Horizontal scan line — decorative */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ top: "25%", background: "var(--accent)" }}
      />

      {/* Main content */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center gap-8 px-4 py-8"
      >
        {/* Logo + branding */}
        <motion.div custom={0} variants={fadeUp} className="flex flex-col items-center gap-4">
          <Link href="/" className="flex items-center gap-3 no-underline group">
            <Logo size="md" className="transition-transform duration-300 group-hover:scale-110" />
            <span
              className="text-2xl font-extrabold tracking-tight"
              style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}
            >
              RAG<span style={{ color: "var(--accent)" }}>Forge</span>
            </span>
          </Link>
        </motion.div>

        {/* Divider line */}
        <motion.div
          variants={lineExpand}
          initial="hidden"
          animate="visible"
          className="w-32 h-px origin-center"
          style={{ background: "linear-gradient(90deg, transparent, var(--accent-dim), transparent)" }}
        />

        {/* Status label */}
        <motion.div
          custom={1}
          variants={fadeUp}
          className="flex items-center gap-2"
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--success)" }}
          />
          <span
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Initialize New Account
          </span>
        </motion.div>

        {/* Clerk Sign Up */}
        <motion.div custom={2} variants={fadeUp}>
          <SignUp />
        </motion.div>

        {/* Bottom tag */}
        <motion.div
          custom={3}
          variants={fadeUp}
          className="flex items-center gap-3 mt-2"
        >
          <div className="w-6 h-px" style={{ background: "var(--border)" }} />
          <span
            className="text-[9px] uppercase tracking-[0.2em]"
            style={{ color: "var(--text-dim)", fontFamily: "var(--font-body)" }}
          >
            Build Your Pipeline
          </span>
          <div className="w-6 h-px" style={{ background: "var(--border)" }} />
        </motion.div>
      </motion.div>
    </div>
  );
}
