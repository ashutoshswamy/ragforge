"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, UserButton } from "@clerk/nextjs";
import { usePipelineStore } from "@/store/pipeline";
import Stepper from "@/components/stepper/Stepper";
import Step1Upload from "@/components/steps/Step1Upload";
import Step2Configure from "@/components/steps/Step2Configure";
import Step3Chat from "@/components/steps/Step3Chat";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

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
  const { currentStep, pipelineId, setStep } = usePipelineStore();
  const { user } = useUser();
  const prevStep = useRef(currentStep);

  const direction = currentStep >= prevStep.current ? 1 : -1;
  prevStep.current = currentStep;

  const handleStepClick = (step: 1 | 2 | 3) => {
    if (step < currentStep) {
      setStep(step);
    }
  };

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

        <div className="flex items-center gap-3 sm:gap-4">
          {pipelineId && (
            <div
              className="hidden sm:block text-[10px] uppercase tracking-widest"
              style={{
                color: "var(--text-dim)",
                fontFamily: "var(--font-body)",
              }}
            >
              Pipeline: {pipelineId.slice(0, 8)}
            </div>
          )}
          <Link
            href="/pipelines"
            className="px-3 py-1.5 text-[10px] uppercase tracking-widest transition-colors duration-200 flex items-center gap-1.5"
            style={{
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
              fontFamily: "var(--font-body)",
            }}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            My Pipelines
          </Link>
          <div className="flex items-center gap-2">
            {user && (
              <span
                className="hidden sm:block text-xs"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
              >
                {user.primaryEmailAddress?.emailAddress}
              </span>
            )}
            <UserButton />
          </div>
        </div>
      </header>

      {/* Stepper */}
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <Stepper currentStep={currentStep} onStepClick={handleStepClick} />
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
