"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePipelineStore } from "@/store/pipeline";
import ChatBubble from "@/components/ui/ChatBubble";
import type { ChatMessage } from "@/types";

async function saveMessages(pipelineId: string, messages: ChatMessage[]) {
  try {
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pipelineId, messages }),
    });
  } catch {
    // ponytail: silent fail — chat works without persistence
  }
}

export default function Step3Chat() {
  const { messages, addMessage, config, setConfig, pipelineId, reset } = usePipelineStore();
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const needsApiKey = !config.apiKey;

  useEffect(() => { setHistoryLoaded(false); }, [pipelineId]);

  useEffect(() => {
    if (!pipelineId || historyLoaded) return;
    const loadHistory = async () => {
      try {
        const res = await fetch(`/api/messages?pipelineId=${pipelineId}`);
        if (!res.ok) return;
        const data = await res.json();
        const history: ChatMessage[] = data.messages ?? [];
        if (history.length > 0) usePipelineStore.setState({ messages: history });
      } finally {
        setHistoryLoaded(true);
      }
    };
    loadHistory();
  }, [pipelineId, historyLoaded]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSend = useCallback(async () => {
    const question = input.trim();
    if (!question || isStreaming) return;

    setInput("");
    const userMsg: ChatMessage = { role: "user", content: question };
    addMessage(userMsg);
    setIsStreaming(true);

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pipelineId,
          apiKey: config.apiKey,
          question,
          config: { model: config.model, topK: config.topK, systemPrompt: config.systemPrompt },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Query failed");
      }

      const contentType = res.headers.get("Content-Type") || "";
      let assistantMsg: ChatMessage;

      if (contentType.includes("application/json")) {
        const data = await res.json();
        assistantMsg = { role: "assistant", content: data.answer, sources: data.sources };
        addMessage(assistantMsg);
      } else {
        const sourcesHeader = res.headers.get("X-Sources");
        const sources: string[] = sourcesHeader ? JSON.parse(sourcesHeader) : [];
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        if (reader) {
          addMessage({ role: "assistant", content: "", sources });
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            fullText += decoder.decode(value, { stream: true });
            usePipelineStore.setState((state) => {
              const msgs = [...state.messages];
              const last = msgs[msgs.length - 1];
              if (last?.role === "assistant") msgs[msgs.length - 1] = { ...last, content: fullText, sources };
              return { messages: msgs };
            });
          }
        }
        assistantMsg = { role: "assistant", content: fullText, sources };
      }

      if (pipelineId) saveMessages(pipelineId, [userMsg, assistantMsg!]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      addMessage({ role: "assistant", content: `Error: ${message}`, sources: [] });
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, pipelineId, config, addMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div
      className="flex flex-col w-full max-w-2xl mx-auto rounded overflow-hidden h-[calc(100dvh-240px)] sm:h-[calc(100dvh-210px)] lg:h-[calc(100dvh-180px)]"
      style={{ background: "var(--surface)", border: "1px solid var(--border)", minHeight: "320px" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ background: "var(--success)" }} />
          <span className="text-xs uppercase tracking-widest" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            Pipeline Active
          </span>
        </div>
        <button
          onClick={reset}
          className="px-3 py-1.5 text-[10px] uppercase tracking-widest transition-colors duration-200 cursor-pointer flex items-center gap-1.5"
          style={{ color: "var(--text-muted)", border: "1px solid var(--border)", fontFamily: "var(--font-body)", background: "transparent" }}
          onMouseEnter={(e) => { (e.currentTarget).style.borderColor = "var(--accent-dim)"; (e.currentTarget).style.color = "var(--accent)"; }}
          onMouseLeave={(e) => { (e.currentTarget).style.borderColor = "var(--border)"; (e.currentTarget).style.color = "var(--text-muted)"; }}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Pipeline
        </button>
      </div>

      {/* API Key prompt */}
      {needsApiKey && (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 p-6">
          <div className="flex flex-col items-center gap-2">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} style={{ color: "var(--accent)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <p className="text-sm font-bold tracking-wide" style={{ fontFamily: "var(--font-heading)" }}>
              API Key Required
            </p>
            <p className="text-xs text-center max-w-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
              Your Gemini API key is never stored. Enter it to resume chatting with this pipeline.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full max-w-sm">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && apiKeyInput.trim()) setConfig({ apiKey: apiKeyInput.trim() }); }}
              placeholder="Enter Gemini API key"
              className="flex-1 px-3 py-2 text-sm rounded-none outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "var(--font-body)" }}
              autoFocus
            />
            <button
              onClick={() => { if (apiKeyInput.trim()) setConfig({ apiKey: apiKeyInput.trim() }); }}
              disabled={!apiKeyInput.trim()}
              className="px-4 py-2 text-xs uppercase tracking-widest transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
              style={{
                background: apiKeyInput.trim() ? "var(--accent)" : "var(--border)",
                color: apiKeyInput.trim() ? "var(--bg)" : "var(--text-dim)",
                fontFamily: "var(--font-body)",
              }}
            >
              Connect
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      {!needsApiKey && (
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 flex flex-col gap-3 sm:gap-4">
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-50">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} style={{ color: "var(--text-dim)" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-xs" style={{ color: "var(--text-dim)", fontFamily: "var(--font-body)" }}>
                Ask a question about your documents
              </p>
            </div>
          )}
          {messages.map((msg, i) => <ChatBubble key={i} message={msg} />)}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input */}
      {!needsApiKey && (
        <div
          className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3"
          style={{ borderTop: "1px solid var(--border)", background: "var(--bg)" }}
        >
          <span
            className="text-xs flex-shrink-0"
            style={{ color: isStreaming ? "var(--text-dim)" : "var(--accent)", fontFamily: "var(--font-body)" }}
          >
            &gt;
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isStreaming ? "Generating response..." : "Ask a question..."}
            disabled={isStreaming}
            className="flex-1 py-2 px-0 text-sm bg-transparent border-none outline-none"
            style={{ color: "var(--text)", fontFamily: "var(--font-body)", background: "transparent" }}
          />
          <button
            onClick={handleSend}
            disabled={isStreaming || !input.trim()}
            className="flex-shrink-0 p-2 rounded transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
            style={{
              background: isStreaming || !input.trim() ? "transparent" : "var(--accent)",
              color: isStreaming || !input.trim() ? "var(--text-dim)" : "var(--bg)",
            }}
          >
            {isStreaming ? (
              <div
                className="w-4 h-4 rounded-full border-2"
                style={{ borderColor: "var(--text-dim)", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }}
              />
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
