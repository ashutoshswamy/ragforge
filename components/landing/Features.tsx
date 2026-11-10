"use client";

import { useState } from "react";
import { ArrowRight, FileText, Quote } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

/* Sample content, illustrative only. */
const CLAIMS = [
  {
    id: 1,
    text: "Refunds now run for 30 days instead of 14",
    file: "refund-policy-2026.pdf",
    where: "Page 3",
    before: "Effective January 1, the return window is extended from 14 days to ",
    hit: "30 days from the date of delivery",
    after: ".",
  },
  {
    id: 2,
    text: "Opened items no longer carry a restocking fee",
    file: "faq-draft.docx",
    where: "Returns section",
    before: "Restocking fees are ",
    hit: "waived for opened items",
    after: " returned within the window.",
  },
] as const;

const DOC_LENGTH = 4000;

function chunkBars(size: number, overlap: number) {
  const step = size - overlap;
  const bars: { start: number; len: number }[] = [];
  for (let s = 0; s < DOC_LENGTH; s += step) {
    bars.push({ start: s, len: Math.min(size, DOC_LENGTH - s) });
    if (s + size >= DOC_LENGTH) break;
  }
  return bars;
}

function Cell({ className = "", delay = 0, children }: { className?: string; delay?: number; children: React.ReactNode }) {
  return (
    <Reveal delay={delay} className={className}>
      {children}
    </Reveal>
  );
}

export default function Features() {
  const [active, setActive] = useState<1 | 2>(1);
  const [size, setSize] = useState(512);
  const [overlap, setOverlap] = useState(64);
  const bars = chunkBars(size, overlap);

  return (
    <section id="features" className="max-w-6xl mx-auto px-5 sm:px-8 pt-24 sm:pt-32 pb-24 sm:pb-32">
      <Reveal>
        <h2 className="text-4xl sm:text-5xl max-w-2xl">Built for answers you can check.</h2>
        <p className="mt-5 text-lg max-w-2xl" style={{ color: "var(--text-muted)" }}>
          Every claim points back to the passage it came from. Click one to see it.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* A: the proof, interactive */}
        <Cell className="md:col-span-8 md:row-span-2">
          <div className="card h-full p-6 sm:p-9 flex flex-col gap-7">
            <div>
              <p className="text-sm font-medium mb-3" style={{ color: "var(--text-muted)" }}>
                Q: What changed in the refund policy this year?
              </p>
              <p className="text-2xl sm:text-3xl leading-snug" style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.025em" }}>
                {CLAIMS.map((c, i) => {
                  const on = c.id === active;
                  return (
                    <span key={c.id}>
                      <span
                        role="button"
                        tabIndex={0}
                        aria-pressed={on}
                        onClick={() => setActive(c.id)}
                        onMouseEnter={() => setActive(c.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(c.id); }
                        }}
                        className="cursor-pointer transition-colors duration-200 rounded-md px-1 -mx-1"
                        style={{
                          background: on ? "var(--accent-dim)" : "transparent",
                          boxShadow: on ? "inset 0 -3px 0 var(--accent)" : "inset 0 -3px 0 var(--border-active)",
                          boxDecorationBreak: "clone",
                          WebkitBoxDecorationBreak: "clone",
                        }}
                      >
                        {c.text}.
                        <sup className="ml-0.5 text-xs font-semibold" style={{ color: "var(--accent-text)", fontFamily: "var(--font-body)" }}>
                          {c.id}
                        </sup>
                      </span>
                      {i < CLAIMS.length - 1 ? " " : ""}
                    </span>
                  );
                })}
              </p>
            </div>

            <ul className="flex flex-col gap-3 mt-auto" aria-live="polite">
              {CLAIMS.map((c) => {
                const on = c.id === active;
                return (
                  <li key={c.id} className="tile overflow-hidden transition-colors duration-300" style={{ background: on ? "var(--surface-elevated)" : "transparent", boxShadow: on ? "none" : "inset 0 0 0 1px var(--border)" }}>
                    <button
                      type="button"
                      onClick={() => setActive(c.id)}
                      className="w-full flex items-center gap-3 px-5 py-3.5 text-left text-sm font-medium cursor-pointer"
                      aria-expanded={on}
                    >
                      <span className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0" style={{ background: on ? "var(--accent)" : "var(--surface-elevated)", color: on ? "var(--accent-ink)" : "var(--text-muted)" }}>
                        {c.id}
                      </span>
                      <FileText size={16} className="shrink-0" style={{ color: "var(--text-muted)" }} />
                      <span className="truncate">{c.file}</span>
                      <span className="ml-auto shrink-0" style={{ color: "var(--text-dim)" }}>{c.where}</span>
                    </button>
                    <div className="grid transition-[grid-template-rows] duration-500 ease-[var(--ease)]" style={{ gridTemplateRows: on ? "1fr" : "0fr" }}>
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 pt-1 text-base sm:text-lg leading-relaxed flex gap-3">
                          <Quote size={18} className="shrink-0 mt-1" style={{ color: "var(--text-dim)" }} />
                          <span>
                            {c.before}
                            <mark className="px-1 rounded" style={{ background: "var(--accent-glow-strong)", color: "var(--text)" }}>{c.hit}</mark>
                            {c.after}
                          </span>
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Cell>

        {/* B: embeddings, shown as meaning-matching */}
        <Cell className="md:col-span-4" delay={80}>
          <div
            className="h-full p-7 sm:p-8 flex flex-col gap-6"
            style={{ background: "var(--accent)", color: "var(--accent-ink)", borderRadius: "var(--r-card)" }}
          >
            <h3 className="text-2xl" style={{ color: "inherit" }}>Matches meaning, not keywords</h3>
            <ul className="flex flex-col gap-3 text-[15px]">
              {[
                ["money back", "refund"],
                ["send it back", "return window"],
              ].map(([ask, found]) => (
                <li key={ask} className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full whitespace-nowrap" style={{ background: "color-mix(in srgb, var(--accent-ink) 16%, transparent)" }}>{ask}</span>
                  <ArrowRight size={16} aria-label="finds" className="opacity-70 shrink-0" />
                  <span className="px-3 py-1 rounded-full font-semibold whitespace-nowrap" style={{ background: "var(--accent-ink)", color: "var(--accent)" }}>{found}</span>
                </li>
              ))}
            </ul>
            <p className="text-[15px] opacity-90 mt-auto">Gemini embeddings turn every passage into a vector, so questions find the right text.</p>
          </div>
        </Cell>

        {/* C: streaming */}
        <Cell className="md:col-span-4" delay={140}>
          <div className="card h-full p-7 sm:p-8 flex flex-col justify-between gap-8">
            <p className="text-xl leading-snug caret" style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}>
              Answers start appearing the moment Gemini begins writing
            </p>
            <div>
              <h3 className="text-2xl">Streaming replies</h3>
              <p className="mt-2 text-[15px]" style={{ color: "var(--text-muted)" }}>No waiting for the full response.</p>
            </div>
          </div>
        </Cell>

        {/* D: chunking, live */}
        <Cell className="md:col-span-7">
          <div className="card h-full p-6 sm:p-9 flex flex-col gap-6" style={{ background: "var(--accent-dim)", borderColor: "transparent", boxShadow: "none" }}>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h3 className="text-2xl">Tunable chunking</h3>
                <p className="mt-2 text-[15px]" style={{ color: "var(--text-muted)" }}>Drag to see how a 4,000 character file gets split.</p>
              </div>
              <p className="text-right shrink-0">
                <span className="block text-5xl font-bold tabular leading-none" style={{ fontFamily: "var(--font-heading)", color: "var(--accent-text)" }}>
                  {bars.length}
                </span>
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>chunks</span>
              </p>
            </div>

            <div className="flex flex-col gap-1.5" role="img" aria-label={`${bars.length} chunks of ${size} characters with ${overlap} overlap`}>
              {[0, 1].map((lane) => (
                <div key={lane} className="relative h-4 rounded-full" style={{ background: "color-mix(in srgb, var(--surface) 55%, transparent)" }}>
                  {bars.map((b, i) =>
                    i % 2 === lane ? (
                      <span
                        key={i}
                        className="absolute top-0 h-full rounded-full transition-all duration-300"
                        style={{
                          left: `${(b.start / DOC_LENGTH) * 100}%`,
                          width: `calc(${(b.len / DOC_LENGTH) * 100}% - 2px)`,
                          background: lane === 0 ? "var(--accent)" : "var(--accent-text)",
                          opacity: lane === 0 ? 1 : 0.7,
                        }}
                      />
                    ) : null
                  )}
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <div className="flex justify-between text-sm font-medium mb-2.5">
                  <label htmlFor="demo-size">Chunk size</label>
                  <span className="tabular" style={{ color: "var(--accent-text)" }}>{size}</span>
                </div>
                <input
                  id="demo-size" type="range" min={256} max={1024} step={64} value={size}
                  style={{ "--pct": `${((size - 256) / (1024 - 256)) * 100}%` } as React.CSSProperties}
                  onChange={(e) => setSize(parseInt(e.target.value))}
                />
              </div>
              <div>
                <div className="flex justify-between text-sm font-medium mb-2.5">
                  <label htmlFor="demo-overlap">Overlap</label>
                  <span className="tabular" style={{ color: "var(--accent-text)" }}>{overlap}</span>
                </div>
                <input
                  id="demo-overlap" type="range" min={0} max={128} step={16} value={overlap}
                  style={{ "--pct": `${(overlap / 128) * 100}%` } as React.CSSProperties}
                  onChange={(e) => setOverlap(parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        </Cell>

        {/* E: system prompt */}
        <Cell className="md:col-span-5" delay={80}>
          <div className="card h-full p-7 sm:p-9 flex flex-col justify-between gap-8">
            <p className="text-lg sm:text-xl leading-relaxed" style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.015em" }}>
              &ldquo;You are a careful analyst. Answer only from the context and say when it is missing.&rdquo;
            </p>
            <div>
              <h3 className="text-2xl">Your own prompt</h3>
              <p className="mt-2 text-[15px]" style={{ color: "var(--text-muted)" }}>Set the tone, persona and format per pipeline.</p>
            </div>
          </div>
        </Cell>
      </div>
    </section>
  );
}
