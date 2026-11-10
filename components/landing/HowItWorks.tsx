"use client";

import { useEffect, useRef, useState } from "react";
import { MessagesSquare, SlidersHorizontal, UploadCloud } from "lucide-react";
import FileCard from "@/components/ui/FileCard";
import ChatBubble from "@/components/ui/ChatBubble";

/* Previews use the real app components with sample content. */
const MODELS = ["3.6 Flash", "3.8 Flash", "3.5 Flash Lite"];
const SAMPLE_FILES = [
  { name: "refund-policy-2026.pdf", size: 188_416 },
  { name: "faq-draft.docx", size: 43_008 },
];

function Upload() {
  const [files, setFiles] = useState(SAMPLE_FILES);
  return (
    <div className="flex flex-col gap-3">
      {files.map((f) => (
        <FileCard key={f.name} name={f.name} size={f.size} onRemove={() => setFiles((p) => p.filter((x) => x.name !== f.name))} />
      ))}
      {files.length === 0 && (
        <button onClick={() => setFiles(SAMPLE_FILES)} className="btn btn-ghost btn-sm self-start">
          Add the samples back
        </button>
      )}
    </div>
  );
}

function Configure() {
  const [model, setModel] = useState(MODELS[0]);
  const [topK, setTopK] = useState(4);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Model">
        {MODELS.map((m) => {
          const on = m === model;
          return (
            <button
              key={m}
              role="radio"
              aria-checked={on}
              onClick={() => setModel(m)}
              className="px-4 h-9 text-sm font-semibold cursor-pointer transition-colors duration-200"
              style={{
                borderRadius: 999,
                background: on ? "var(--accent)" : "var(--surface)",
                color: on ? "var(--accent-ink)" : "var(--text)",
                border: `1px solid ${on ? "var(--accent)" : "var(--border-active)"}`,
              }}
            >
              {m}
            </button>
          );
        })}
      </div>
      <div>
        <div className="flex justify-between text-sm font-medium mb-2.5">
          <label htmlFor="how-topk">Passages sent to the model</label>
          <span className="tabular font-bold" style={{ color: "var(--accent-text)" }}>{topK}</span>
        </div>
        <input
          id="how-topk" type="range" min={1} max={10} value={topK}
          style={{ "--pct": `${((topK - 1) / 9) * 100}%` } as React.CSSProperties}
          onChange={(e) => setTopK(parseInt(e.target.value))}
        />
      </div>
    </div>
  );
}

function Chat() {
  return (
    <div className="flex flex-col gap-5">
      <ChatBubble message={{ role: "user", content: "Which file mentions restocking fees?" }} />
      <ChatBubble message={{ role: "assistant", content: "The FAQ draft says restocking fees are **waived for opened items**.", sources: ["faq-draft.docx"] }} />
    </div>
  );
}

const STEPS = [
  { verb: "Upload", icon: UploadCloud, text: "Drop in PDFs, Word files or plain text. Parsing happens on the server.", Preview: Upload },
  { verb: "Configure", icon: SlidersHorizontal, text: "Pick a Gemini model and how many passages to retrieve.", Preview: Configure },
  { verb: "Chat", icon: MessagesSquare, text: "Ask questions. Answers stream in and name their files.", Preview: Chat },
];

// Scroll storytelling: the step crossing the middle of the viewport becomes active,
// and the sticky stage on the right swaps to that step's live preview.
export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const ActivePreview = STEPS[active].Preview;
  const ActiveIcon = STEPS[active].icon;

  return (
    <section id="how-it-works" className="py-24 sm:py-32" style={{ background: "var(--accent-dim)" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <h2 className="text-4xl sm:text-5xl max-w-2xl">Three steps. About a minute.</h2>
        <p className="mt-5 text-lg max-w-md" style={{ color: "var(--text-muted)" }}>
          No servers to run and no vector store to configure.
        </p>

        <div className="mt-10 lg:mt-6 grid lg:grid-cols-2 gap-x-16">
          {/* Steps */}
          <ol>
            {STEPS.map(({ verb, text, Preview }, i) => {
              const on = i === active;
              return (
                <li
                  key={verb}
                  data-i={i}
                  ref={(el) => { stepRefs.current[i] = el; }}
                  className="py-8 lg:py-0 lg:min-h-[62vh] flex flex-col justify-center"
                >
                  <h3
                    className={`text-6xl sm:text-7xl xl:text-[6.5rem] transition-all duration-500 max-lg:!text-[color:var(--text)] ${on ? "lg:translate-x-0" : "lg:-translate-x-2"}`}
                    style={{
                      letterSpacing: "-0.045em",
                      color: on ? "var(--text)" : "color-mix(in srgb, var(--text) 28%, transparent)",
                    }}
                  >
                    {verb}
                  </h3>
                  <p
                    className="mt-4 text-lg max-w-sm transition-opacity duration-500 max-lg:!opacity-100"
                    style={{ color: "var(--text-muted)", opacity: on ? 1 : 0.55 }}
                  >
                    {text}
                  </p>
                  {/* Phones: preview sits inline, no sticky stage */}
                  <div className="lg:hidden mt-7 card p-4 sm:p-5">
                    <Preview />
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Sticky stage (lg+) */}
          <div className="hidden lg:block">
            <div className="sticky top-28 pt-4">
              <div className="card p-8 min-h-[320px] flex flex-col" style={{ boxShadow: "var(--shadow-lift)" }}>
                <div className="flex items-center gap-3 mb-7">
                  <span
                    key={`i${active}`}
                    className="rise flex items-center justify-center w-11 h-11"
                    style={{ background: "var(--accent)", color: "var(--accent-ink)", borderRadius: 14, "--d": "0ms" } as React.CSSProperties}
                  >
                    <ActiveIcon size={22} strokeWidth={1.9} />
                  </span>
                  <span className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}>
                    {STEPS[active].verb}
                  </span>
                </div>
                <div key={active} className="rise flex-1" style={{ "--d": "0ms" } as React.CSSProperties} aria-live="polite">
                  <ActivePreview />
                </div>
              </div>
              <div className="flex gap-2 mt-6" aria-hidden="true">
                {STEPS.map((_, i) => (
                  <span
                    key={i}
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{ width: i === active ? 40 : 12, background: i <= active ? "var(--accent)" : "var(--border-active)" }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
