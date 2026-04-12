"use client";

import { motion } from "framer-motion";
import type { ChatMessage } from "@/types";
import SourceChip from "./SourceChip";

interface ChatBubbleProps {
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[92%] sm:max-w-[80%] flex flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}
      >
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
          className="px-4 py-3 text-sm leading-relaxed rounded"
          style={{
            background: isUser ? "var(--surface-elevated)" : "var(--surface)",
            border: `1px solid ${isUser ? "var(--border-active)" : "var(--border)"}`,
            color: "var(--text)",
            fontFamily: "var(--font-body)",
            borderLeft: isUser
              ? undefined
              : "2px solid var(--accent-dim)",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {message.content}
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
    </motion.div>
  );
}
