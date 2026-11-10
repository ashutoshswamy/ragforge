import { FileText, Quote, Sparkles } from "lucide-react";
import ChatBubble from "./ChatBubble";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

function DocChip({ ext, name, size }: { ext: string; name: string; size: string }) {
  return (
    <div className="card flex items-center gap-3 pl-3 pr-5 py-2.5" style={{ borderRadius: "var(--r-tile)", boxShadow: "var(--shadow-lift)" }}>
      <span
        className="flex items-center justify-center w-9 h-9 text-[11px] font-bold shrink-0"
        style={{ background: "var(--accent-dim)", color: "var(--accent-text)", borderRadius: 10, fontFamily: "var(--font-heading)" }}
      >
        {ext}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium truncate">{name}</span>
        <span className="block text-xs tabular" style={{ color: "var(--text-muted)" }}>{size}</span>
      </span>
    </div>
  );
}

// Hero scene: documents go in, a cited answer comes out, and the evidence is one glance away.
// Real components with sample content, no fake screenshots.
export default function ChatPreview() {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto lg:mr-4 lg:mt-20 lg:mb-14">
      <div
        className="absolute inset-0 translate-x-4 translate-y-5 rotate-3 pointer-events-none"
        style={{ background: "var(--accent-dim)", borderRadius: "var(--r-card)" }}
        aria-hidden="true"
      />

      {/* Chat */}
      <div
        className="card relative overflow-hidden"
        style={{ boxShadow: "var(--shadow-lift)" }}
        role="img"
        aria-label="Example: documents uploaded, a question about a refund policy, and an answer that cites its source file"
      >
        <div className="flex items-center gap-3 px-6 h-14" style={{ borderBottom: "1px solid var(--border)" }}>
          <span className="flex items-center justify-center w-7 h-7" style={{ background: "var(--accent-dim)", color: "var(--accent-text)", borderRadius: 9 }}>
            <Sparkles size={14} />
          </span>
          <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-heading)" }}>Policy handbook</span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
            <FileText size={13} /> 2 files
          </span>
        </div>
        <div className="flex flex-col gap-6 p-6 pb-10 md:pb-24">
          <div className="rise" style={d(800)}>
            <ChatBubble message={{ role: "user", content: "What changed in the refund policy this year?" }} />
          </div>
          <div className="rise" style={d(1500)}>
            <ChatBubble
              message={{
                role: "assistant",
                content: "Refunds now run for **30 days** instead of 14, and the restocking fee no longer applies to opened items.",
                sources: ["refund-policy-2026.pdf", "faq-draft.docx"],
              }}
            />
          </div>
        </div>
      </div>

      {/* Documents going in: perched on the card edge, md+ only so phones keep one clean card */}
      <div className="hidden md:flex gap-3 absolute -top-14 left-6 z-10 rise" style={d(300)} aria-hidden="true">
        <div className="w-52" style={{ transform: "rotate(-3deg)" }}><DocChip ext="PDF" name="refund-policy-2026.pdf" size="184 KB" /></div>
        <div className="w-44 mt-2" style={{ transform: "rotate(2deg)" }}><DocChip ext="DOC" name="faq-draft.docx" size="42 KB" /></div>
      </div>

      {/* Evidence behind the answer */}
      <div
        className="hidden md:block card absolute -bottom-6 -right-8 w-72 p-4 z-10 rise"
        style={{ ...d(2300), boxShadow: "var(--shadow-lift)", borderRadius: "var(--r-tile)" }}
        aria-hidden="true"
      >
        <p className="flex items-center gap-2 text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>
          <FileText size={13} /> refund-policy-2026.pdf
        </p>
        <p className="text-sm leading-relaxed flex gap-2">
          <Quote size={14} className="shrink-0 mt-0.5" style={{ color: "var(--text-dim)" }} />
          <span>
            The return window is extended from 14 days to{" "}
            <mark className="px-1 rounded" style={{ background: "var(--accent-glow-strong)", color: "var(--text)" }}>30 days</mark>.
          </span>
        </p>
      </div>
    </div>
  );
}
