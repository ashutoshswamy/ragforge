"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { usePipelineStore } from "@/store/pipeline";
import ChatBubble from "@/components/ui/ChatBubble";

export default function Step3Chat() {
  const { messages, addMessage, config, sessionId, reset } =
    usePipelineStore();
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || isStreaming) return;

    setInput("");
    addMessage({ role: "user", content: question });
    setIsStreaming(true);

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          sessionId,
          question,
          config: {
            model: config.model,
            topK: config.topK,
            systemPrompt: config.systemPrompt,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Query failed");
      }

      // Check if response is JSON (no context found) or stream
      const contentType = res.headers.get("Content-Type") || "";

      if (contentType.includes("application/json")) {
        const data = await res.json();
        addMessage({
          role: "assistant",
          content: data.answer,
          sources: data.sources,
        });
      } else {
        // Streaming response
        const sourcesHeader = res.headers.get("X-Sources");
        const sources: string[] = sourcesHeader
          ? JSON.parse(sourcesHeader)
          : [];

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        if (reader) {
          // Add placeholder message
          addMessage({ role: "assistant", content: "", sources });

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            fullText += chunk;

            // Update the last message with accumulated text
            usePipelineStore.setState((state) => {
              const msgs = [...state.messages];
              const lastMsg = msgs[msgs.length - 1];
              if (lastMsg && lastMsg.role === "assistant") {
                msgs[msgs.length - 1] = {
                  ...lastMsg,
                  content: fullText,
                  sources,
                };
              }
              return { messages: msgs };
            });
          }
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      addMessage({
        role: "assistant",
        content: `Error: ${message}`,
        sources: [],
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div
      className="flex flex-col w-full max-w-2xl mx-auto rounded overflow-hidden"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        height: "calc(100vh - 220px)",
        minHeight: "350px",
        maxHeight: "calc(100dvh - 180px)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--bg)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: "var(--success)" }}
          />
          <span
            className="text-xs uppercase tracking-widest"
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
            }}
          >
            Pipeline Active
          </span>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-[10px] uppercase tracking-widest transition-colors duration-200 cursor-pointer"
          style={{
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
            fontFamily: "var(--font-body)",
            background: "transparent",
          }}
        >
          Reset Pipeline
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-5 flex flex-col gap-3 sm:gap-4">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-50">
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
              style={{ color: "var(--text-dim)" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p
              className="text-xs"
              style={{
                color: "var(--text-dim)",
                fontFamily: "var(--font-body)",
              }}
            >
              Ask a question about your documents
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatBubble key={i} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3"
        style={{
          borderTop: "1px solid var(--border)",
          background: "var(--bg)",
        }}
      >
        <span
          className="text-xs flex-shrink-0"
          style={{
            color: isStreaming ? "var(--text-dim)" : "var(--accent)",
            fontFamily: "var(--font-body)",
          }}
        >
          &gt;
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isStreaming ? "Generating response..." : "Ask a question..."
          }
          disabled={isStreaming}
          className="flex-1 py-2 px-0 text-sm bg-transparent border-none outline-none"
          style={{
            color: "var(--text)",
            fontFamily: "var(--font-body)",
            background: "transparent",
          }}
        />
        <motion.button
          onClick={handleSend}
          disabled={isStreaming || !input.trim()}
          className="flex-shrink-0 p-2 rounded transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
          style={{
            background:
              isStreaming || !input.trim()
                ? "transparent"
                : "var(--accent)",
            color:
              isStreaming || !input.trim()
                ? "var(--text-dim)"
                : "var(--bg)",
          }}
          whileHover={
            !isStreaming && input.trim() ? { scale: 1.05 } : {}
          }
          whileTap={
            !isStreaming && input.trim() ? { scale: 0.95 } : {}
          }
        >
          {isStreaming ? (
            <motion.div
              className="w-4 h-4 rounded-full border-2"
              style={{
                borderColor: "var(--text-dim)",
                borderTopColor: "transparent",
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ) : (
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
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          )}
        </motion.button>
      </div>
    </div>
  );
}
