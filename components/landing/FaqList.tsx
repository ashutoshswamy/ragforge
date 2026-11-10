"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

// Answers stay in the DOM when closed (collapsed with a 0fr grid row), so the text remains readable to crawlers and screen readers' find-in-page.
export default function FaqList({ items }: { items: readonly { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="card overflow-hidden" style={{ borderRadius: "var(--r-card)" }}>
      {items.map((f, i) => {
        const on = open === i;
        return (
          <div key={f.q} style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}>
            <h3 className="m-0">
              <button
                type="button"
                id={`faq-q-${i}`}
                aria-expanded={on}
                aria-controls={`faq-a-${i}`}
                onClick={() => setOpen(on ? null : i)}
                className="w-full flex items-center justify-between gap-5 px-6 sm:px-8 py-6 text-left cursor-pointer transition-colors duration-200 hover:bg-[var(--surface-elevated)] focus-visible:bg-[var(--surface-elevated)]"
                style={{ borderRadius: 0 }}
              >
                <span
                  className="text-xl sm:text-2xl transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.2,
                    color: on ? "var(--text)" : "color-mix(in srgb, var(--text) 78%, transparent)",
                  }}
                >
                  {f.q}
                </span>
                <span
                  aria-hidden="true"
                  className="flex items-center justify-center w-9 h-9 shrink-0 rounded-full transition-all duration-300"
                  style={{
                    background: on ? "var(--accent)" : "var(--surface-elevated)",
                    color: on ? "var(--accent-ink)" : "var(--text-muted)",
                    transform: on ? "rotate(45deg)" : "none",
                  }}
                >
                  <Plus size={18} strokeWidth={2.2} />
                </span>
              </button>
            </h3>
            <div
              id={`faq-a-${i}`}
              role="region"
              aria-labelledby={`faq-q-${i}`}
              className="grid transition-[grid-template-rows] duration-500 ease-[var(--ease)] motion-reduce:transition-none"
              style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p
                  className="px-6 sm:px-8 pb-7 max-w-2xl text-base sm:text-lg leading-relaxed transition-opacity duration-500 motion-reduce:transition-none"
                  style={{ color: "var(--text-muted)", opacity: on ? 1 : 0 }}
                >
                  {f.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
