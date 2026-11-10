"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles } from "lucide-react";
import type { ChatMessage } from "@/types";
import SourceChip from "./SourceChip";

export default function ChatBubble({ message, pending = false }: { message: ChatMessage; pending?: boolean }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="rise flex justify-end">
        <div
          className="max-w-[88%] sm:max-w-[75%] px-5 py-3 text-[15px] leading-relaxed"
          style={{
            background: "var(--accent)",
            color: "var(--accent-ink)",
            borderRadius: "22px 22px 6px 22px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="rise flex gap-3">
      <span
        className="flex items-center justify-center w-8 h-8 shrink-0 mt-1"
        style={{ background: "var(--accent-dim)", color: "var(--accent-text)", borderRadius: 10 }}
        aria-hidden="true"
      >
        <Sparkles size={16} />
      </span>
      <div className="flex flex-col gap-3 min-w-0 max-w-[92%] sm:max-w-[85%]">
        <div className="text-[15px] leading-relaxed" style={{ wordBreak: "break-word" }}>
          {pending && !message.content ? (
            <span className="flex items-center gap-1.5 h-7" aria-label="Thinking">
              <span className="typing-dot" />
              <span className="typing-dot" style={{ animationDelay: "0.15s" }} />
              <span className="typing-dot" style={{ animationDelay: "0.3s" }} />
            </span>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong style={{ fontWeight: 650 }}>{children}</strong>,
                a: ({ children, href }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4" style={{ color: "var(--accent-text)" }}>
                    {children}
                  </a>
                ),
                ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1.5 marker:text-[var(--text-dim)]">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1.5 marker:text-[var(--text-dim)]">{children}</ol>,
                h1: ({ children }) => <h1 className="text-xl mb-2 mt-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg mb-2 mt-4">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base mb-1.5 mt-3">{children}</h3>,
                code: ({ children }) => (
                  <code className="px-1.5 py-0.5 text-[13px]" style={{ background: "var(--surface-elevated)", borderRadius: 6 }}>
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="p-4 text-[13px] overflow-x-auto mb-3 max-w-full" style={{ background: "var(--surface-elevated)", borderRadius: "var(--r-tile)" }}>
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="pl-4 my-3" style={{ borderLeft: "3px solid var(--accent)", color: "var(--text-muted)" }}>
                    {children}
                  </blockquote>
                ),
                hr: () => <hr className="my-4" style={{ borderColor: "var(--border)" }} />,
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-3">
                    <table className="text-sm w-full">{children}</table>
                  </div>
                ),
                th: ({ children }) => <th className="text-left px-3 py-2 font-semibold" style={{ borderBottom: "1px solid var(--border-active)" }}>{children}</th>,
                td: ({ children }) => <td className="px-3 py-2" style={{ borderBottom: "1px solid var(--border)" }}>{children}</td>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
        {message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.sources.map((s) => <SourceChip key={s} source={s} />)}
          </div>
        )}
      </div>
    </div>
  );
}
