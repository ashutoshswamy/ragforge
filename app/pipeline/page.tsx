"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";
import { v4 as uuidv4 } from "uuid";
import { usePipelineStore } from "@/store/pipeline";
import Stepper from "@/components/stepper/Stepper";
import Step1Upload from "@/components/steps/Step1Upload";
import Step2Configure from "@/components/steps/Step2Configure";
import Step3Chat from "@/components/steps/Step3Chat";
import Link from "next/link";

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 60 : -60,
    opacity: 0,
  }),
};

export default function PipelinePage() {
  const { currentStep, sessionId } = usePipelineStore();

  // Generate sessionId once on mount
  useEffect(() => {
    if (!sessionId) {
      usePipelineStore.setState({ sessionId: uuidv4() });
    }
  }, [sessionId]);

  // Track step direction for animation
  const direction = 1; // Always forward feels natural

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <header
        className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight no-underline group"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--text)",
          }}
        >
          <Logo size="sm" className="transition-transform duration-300 group-hover:scale-110" />
          <span>
            RAG<span style={{ color: "var(--accent)" }}>Forge</span>
          </span>
        </Link>

        <div
          className="text-[10px] uppercase tracking-widest"
          style={{
            color: "var(--text-dim)",
            fontFamily: "var(--font-body)",
          }}
        >
          Session: {sessionId ? sessionId.slice(0, 8) : "..."}
        </div>
      </header>

      {/* Stepper */}
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <Stepper currentStep={currentStep} />
      </div>

      {/* Step content */}
      <div className="flex-1 px-4 sm:px-6 pb-6 sm:pb-8 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "tween", duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
              opacity: { duration: 0.25 },
            }}
            className="h-full"
          >
            {currentStep === 1 && <Step1Upload />}
            {currentStep === 2 && <Step2Configure />}
            {currentStep === 3 && <Step3Chat />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom accent */}
      <div
        className="h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--accent-dim), transparent)",
        }}
      />
    </div>
  );
}
