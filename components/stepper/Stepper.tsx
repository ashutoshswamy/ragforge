"use client";

import { motion } from "framer-motion";

interface StepperProps {
  currentStep: 1 | 2 | 3;
}

const STEPS = [
  { num: 1, label: "Upload" },
  { num: 2, label: "Configure" },
  { num: 3, label: "Chat" },
] as const;

export default function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-md mx-auto">
      {STEPS.map((step, i) => {
        const isActive = step.num === currentStep;
        const isCompleted = step.num < currentStep;

        return (
          <div key={step.num} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2">
              {/* Step circle */}
              <div className="relative">
                <motion.div
                  className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-[10px] sm:text-xs font-medium transition-colors duration-300"
                  style={{
                    background: isActive
                      ? "var(--accent)"
                      : isCompleted
                        ? "var(--accent-dim)"
                        : "var(--surface)",
                    color: isActive
                      ? "var(--bg)"
                      : isCompleted
                        ? "var(--accent)"
                        : "var(--text-muted)",
                    border: `1px solid ${
                      isActive
                        ? "var(--accent)"
                        : isCompleted
                          ? "var(--accent-dim)"
                          : "var(--border)"
                    }`,
                    fontFamily: "var(--font-body)",
                  }}
                  animate={
                    isActive
                      ? {
                          boxShadow: [
                            "0 0 0px rgba(245,130,10,0)",
                            "0 0 20px rgba(245,130,10,0.3)",
                            "0 0 0px rgba(245,130,10,0)",
                          ],
                        }
                      : { boxShadow: "none" }
                  }
                  transition={
                    isActive
                      ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      : {}
                  }
                >
                  {isCompleted ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    `0${step.num}`
                  )}
                </motion.div>
              </div>

              {/* Label */}
              <span
                className="text-[10px] uppercase tracking-widest"
                style={{
                  color: isActive
                    ? "var(--accent)"
                    : isCompleted
                      ? "var(--text-muted)"
                      : "var(--text-dim)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div
                className="flex-1 h-px mx-2 sm:mx-4 mt-[-18px] sm:mt-[-20px]"
                style={{
                  background:
                    step.num < currentStep
                      ? "var(--accent-dim)"
                      : "var(--border)",
                  transition: "background 0.3s",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
