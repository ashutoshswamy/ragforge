import { FileText } from "lucide-react";
import ChatBubble from "./ChatBubble";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

// Provenance scene: a question, the page it was answered from, the answer on top.
// The highlight sweeps across the evidence once, then the answer lands. Real components, sample content.
export default function AuthStage({ title, sub }: { title: string; sub: string }) {
  return (
    <aside
      className="hidden lg:flex flex-col justify-between gap-12 overflow-hidden px-12 py-14 xl:px-20"
      style={{ background: "var(--surface-elevated)", borderLeft: "1px solid var(--border)" }}
    >
      <div className="rise max-w-lg" style={d(100)}>
        <p
          className="text-4xl xl:text-5xl font-bold"
          style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.03em", lineHeight: 1.05, textWrap: "balance" }}
        >
          {title}
        </p>
        <p className="mt-5 text-lg" style={{ color: "var(--text-muted)" }}>{sub}</p>
      </div>

      <div
        className="w-full max-w-xl self-end"
        role="img"
        aria-label="Example: a question about a refund policy, the passage in the source PDF that answers it, and the cited answer"
      >
        <div className="rise" style={d(500)}>
          <ChatBubble message={{ role: "user", content: "What changed in the refund policy this year?" }} />
        </div>

        <div className="card mt-6 overflow-hidden rise" style={{ ...d(900), boxShadow: "var(--shadow-lift)" }} aria-hidden="true">
          <div className="flex items-center gap-2 px-6 h-12 text-xs font-medium" style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}>
            <FileText size={14} /> refund-policy-2026.pdf
            <span className="ml-auto tabular">Page 4</span>
          </div>
          <div className="px-6 pt-5 pb-14 text-[15px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
            <p>
              Customers may return unopened goods for a full refund. Refunds are issued to the original method of payment
              within five business days of receipt.
            </p>
            <p className="mt-4" style={{ color: "var(--text)" }}>
              The return window is extended from 14 days to <mark className="sweep">30 days</mark>, and the restocking
              fee no longer applies to opened items.
            </p>
            <p className="mt-4">Gift purchases follow the same window, counted from the date of delivery.</p>
          </div>
        </div>

        <div className="relative -mt-11 ml-8 xl:ml-14 rise" style={d(2300)}>
          <div className="card p-5" style={{ boxShadow: "var(--shadow-lift)" }}>
            <ChatBubble
              message={{
                role: "assistant",
                content: "Refunds now run for **30 days** instead of 14, and the restocking fee no longer applies to opened items.",
                sources: ["refund-policy-2026.pdf"],
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
