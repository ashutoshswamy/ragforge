"use client";

import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { ChatMessage } from "@/types";
import SourceChip from "./SourceChip";

gsap.registerPlugin(useGSAP);

interface ChatBubbleProps {
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(ref.current, {
      opacity: 0,
      y: 12,
      duration: 0.3,
      ease: "power2.out",
    });
  }, { scope: ref });

  return (
    <div
      ref={ref}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-[92%] sm:max-w-[85%] lg:max-w-[75%] flex flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
        {/* Role label */}
        <span
          className="text-[10px] uppercase tracking-widest px-1"
          style={{
            color: isUser ? "var(--text-dim)" : "var(--accent-dim)",
            fontFamily: "var(--font-body)",
          }}
        >
          {isUser ? "you" : "ragforge"}
        </span>

        {/* Message bubble */}
        <div
          className="px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm leading-relaxed rounded"
          style={{
            background: isUser ? "var(--surface-elevated)" : "var(--surface)",
            border: `1px solid ${isUser ? "var(--border-active)" : "var(--border)"}`,
            color: "var(--text)",
            fontFamily: "var(--font-body)",
            borderLeft: isUser ? undefined : "2px solid var(--accent-dim)",
            wordBreak: "break-word",
          }}
        >
          {isUser ? (
            <span style={{ whiteSpace: "pre-wrap" }}>{message.content}</span>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => (
                  <strong style={{ color: "var(--accent)", fontWeight: 600 }}>{children}</strong>
                ),
                ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
                li: ({ children }) => <li>{children}</li>,
                h1: ({ children }) => (
                  <h1 className="text-base font-bold mb-2" style={{ color: "var(--accent)" }}>{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-sm font-bold mb-2" style={{ color: "var(--accent)" }}>{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--accent-dim)" }}>{children}</h3>
                ),
                code: ({ children }) => (
                  <code
                    className="px-1 py-0.5 rounded text-xs"
                    style={{ background: "var(--surface-elevated)", border: "1px solid var(--border)", color: "var(--accent)" }}
                  >
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre
                    className="p-2 sm:p-3 rounded text-[10px] sm:text-xs overflow-x-auto mb-2 max-w-full"
                    style={{ background: "var(--surface-elevated)", border: "1px solid var(--border)" }}
                  >
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote
                    className="pl-3 italic my-2"
                    style={{ borderLeft: "2px solid var(--accent-dim)", color: "var(--text-muted)" }}
                  >
                    {children}
                  </blockquote>
                ),
                hr: () => <hr style={{ borderColor: "var(--border)" }} className="my-2" />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {/* Sources */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-1">
            {message.sources.map((source) => (
              <SourceChip key={source} source={source} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
