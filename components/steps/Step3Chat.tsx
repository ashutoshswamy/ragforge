"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { sileo } from "sileo";
import { ArrowUp, KeyRound, MessageSquareText, Plus } from "lucide-react";
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
    sileo.warning({ title: "Not saved", description: "This chat will not appear in your history." });
  }
}

export default function Step3Chat() {
  const { messages, addMessage, config, setConfig, pipelineId, pipelineName, reset } = usePipelineStore();
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
      usePipelineStore.setState((state) => {
        const last = state.messages[state.messages.length - 1];
        return last?.role === "assistant" && !last.content ? { messages: state.messages.slice(0, -1) } : {};
      });
      sileo.error({ title: "Answer failed", description: message });
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, pipelineId, config, addMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const connect = () => {
    const key = apiKeyInput.trim();
    if (!key) return;
    setConfig({ apiKey: key });
    sileo.success({ title: "Connected", description: "You can chat with this pipeline now." });
  };

  const handleReset = () => {
    reset();
    sileo.info({ title: "New pipeline", description: "Upload documents to start again." });
  };

  const lastMsg = messages[messages.length - 1];
  const waiting = isStreaming && lastMsg?.role === "user";

  return (
    <div
      className="card flex flex-col w-full max-w-3xl mx-auto overflow-hidden h-[calc(100dvh-220px)] sm:h-[calc(100dvh-200px)]"
      style={{ minHeight: 420 }}
    >
      <div className="flex items-center justify-between gap-3 px-5 sm:px-6 h-16 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="min-w-0">
          <p className="text-base font-bold truncate" style={{ fontFamily: "var(--font-heading)" }}>
            {pipelineName || "Your pipeline"}
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Ready to answer from your documents</p>
        </div>
        <button onClick={handleReset} className="btn btn-ghost btn-sm shrink-0">
          <Plus size={16} /> New
        </button>
      </div>

      {needsApiKey ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6 text-center">
          <span className="flex items-center justify-center w-14 h-14" style={{ background: "var(--accent-dim)", color: "var(--accent-text)", borderRadius: 18 }}>
            <KeyRound size={26} strokeWidth={1.8} />
          </span>
          <div>
            <h2 className="text-2xl">Add your API key</h2>
            <p className="text-sm mt-2 max-w-sm" style={{ color: "var(--text-muted)" }}>
              Your Gemini key is never stored. Paste it to keep chatting with this pipeline.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full max-w-md">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") connect(); }}
              placeholder="Paste your key"
              aria-label="Gemini API key"
              className="sm:flex-1 px-4 h-12"
              autoFocus
              autoComplete="off"
            />
            <button onClick={connect} disabled={!apiKeyInput.trim()} className="btn btn-primary h-12">
              Connect
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-6 flex flex-col gap-6">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
                <span className="flex items-center justify-center w-14 h-14" style={{ background: "var(--accent-dim)", color: "var(--accent-text)", borderRadius: 18 }}>
                  <MessageSquareText size={26} strokeWidth={1.8} />
                </span>
                <div>
                  <h2 className="text-2xl">Ask your first question</h2>
                  <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>Answers cite the files they came from.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {["Summarize these documents", "What are the key points?", "List any dates or deadlines"].map((q) => (
                    <button key={q} onClick={() => { setInput(q); inputRef.current?.focus(); }} className="btn btn-ghost btn-sm">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <ChatBubble key={i} message={msg} pending={isStreaming && i === messages.length - 1} />
              ))
            )}
            {waiting && <ChatBubble message={{ role: "assistant", content: "" }} pending />}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 sm:p-4 shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
            <div
              className="flex items-center gap-2 pl-5 pr-2 h-14 border border-[var(--border-active)] transition-[box-shadow,border-color] duration-200 focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_4px_var(--accent-glow)]"
              style={{ background: "var(--surface)", borderRadius: 999 }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isStreaming ? "Generating an answer" : "Ask about your documents"}
                aria-label="Your question"
                disabled={isStreaming}
                className="flex-1 min-w-0 h-full !border-0 !shadow-none !bg-transparent px-0"
              />
              <button
                onClick={handleSend}
                disabled={isStreaming || !input.trim()}
                className="btn btn-primary btn-icon !w-10 !h-10"
                aria-label="Send"
              >
                {isStreaming ? <span className="spinner" /> : <ArrowUp size={18} strokeWidth={2.6} />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
