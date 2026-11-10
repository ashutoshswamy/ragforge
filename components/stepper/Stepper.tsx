"use client";

import { Check } from "lucide-react";

interface StepperProps {
  currentStep: 1 | 2 | 3;
  onStepClick?: (step: 1 | 2 | 3) => void;
}

const STEPS = [
  { num: 1, label: "Upload" },
  { num: 2, label: "Configure" },
  { num: 3, label: "Chat" },
] as const;

export default function Stepper({ currentStep, onStepClick }: StepperProps) {
  return (
    <ol className="flex items-center w-full max-w-md mx-auto" aria-label="Progress">
      {STEPS.map((step, i) => {
        const active = step.num === currentStep;
        const done = step.num < currentStep;
        return (
          <li key={step.num} className="flex items-center flex-1 last:flex-none">
            <button
              type="button"
              disabled={!done}
              onClick={() => onStepClick?.(step.num)}
              aria-current={active ? "step" : undefined}
              className="flex items-center gap-2.5 disabled:cursor-default cursor-pointer"
            >
              <span
                className="flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold transition-all duration-300"
                style={{
                  background: active ? "var(--accent)" : done ? "var(--accent-dim)" : "var(--surface)",
                  color: active ? "var(--accent-ink)" : done ? "var(--accent-text)" : "var(--text-dim)",
                  border: `1px solid ${active ? "var(--accent)" : done ? "transparent" : "var(--border-active)"}`,
                  boxShadow: active ? "0 0 0 5px var(--accent-glow)" : "none",
                }}
              >
                {done ? <Check size={16} strokeWidth={2.6} /> : step.num}
              </span>
              <span
                className="hidden sm:inline text-sm font-medium transition-colors duration-300"
                style={{ color: active ? "var(--text)" : "var(--text-muted)" }}
              >
                {step.label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <span
                className="flex-1 h-0.5 mx-3 rounded-full transition-colors duration-500"
                style={{ background: done ? "var(--accent)" : "var(--border)" }}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
