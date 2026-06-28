"use client";

import { useState, useEffect, useRef } from "react";
import { usePipelineStore } from "@/store/pipeline";
import type { GeminiModel } from "@/types";

const TERMINAL_LINES = [
  "Initializing RAGForge pipeline...",
  "Parsing uploaded documents...",
  "Splitting text into chunks...",
  "Generating embeddings via Gemini...",
  "Storing vectors in Supabase...",
  "Building vector index...",
];

export default function Step2Configure() {
  const {
    config, setConfig, parsedDocs, isIngesting, setIsIngesting,
    setStep, pipelineName, setPipelineName, setPipelineId,
  } = usePipelineStore();

  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [chunkCount, setChunkCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const handleIngest = async () => {
    if (!config.apiKey) { setError("API key is required"); return; }

    setError(null);
    setIsIngesting(true);
    setTerminalOutput([]);
    setChunkCount(null);

    for (let i = 0; i < TERMINAL_LINES.length; i++) {
      await new Promise((r) => setTimeout(r, 400 + Math.random() * 300));
      setTerminalOutput((prev) => [...prev, TERMINAL_LINES[i]]);
    }

    try {
      const createRes = await fetch("/api/pipelines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: pipelineName,
          config: {
            apiKey: config.apiKey,
            model: config.model,
            chunkSize: config.chunkSize,
            chunkOverlap: config.chunkOverlap,
            topK: config.topK,
            systemPrompt: config.systemPrompt,
          },
        }),
      });

      const createData = await createRes.json();
      if (!createRes.ok) throw new Error(createData.error || "Failed to create pipeline");

      const pipelineId: string = createData.pipeline.id;
      setPipelineId(pipelineId);

      const ingestRes = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pipelineId,
          apiKey: config.apiKey,
          docs: parsedDocs,
          config: { chunkSize: config.chunkSize, chunkOverlap: config.chunkOverlap },
        }),
      });

      const ingestData = await ingestRes.json();
      if (!ingestRes.ok) throw new Error(ingestData.error || "Ingest failed");

      setChunkCount(ingestData.chunks);
      setTerminalOutput((prev) => [...prev, `Pipeline built successfully — ${ingestData.chunks} chunks indexed.`]);

      await new Promise((r) => setTimeout(r, 1200));
      setIsIngesting(false);
      setStep(3);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setTerminalOutput((prev) => [...prev, `ERROR: ${message}`]);
      setIsIngesting(false);
    }
  };

  const canBuild = !isIngesting && !!config.apiKey;

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl mx-auto">
      {/* Pipeline Name */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
          Pipeline Name
        </label>
        <input
          type="text"
          value={pipelineName}
          onChange={(e) => setPipelineName(e.target.value)}
          placeholder="My Pipeline..."
          className="px-4 py-3"
          disabled={isIngesting}
        />
      </div>

      {/* API Key */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            Gemini API Key
          </label>
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-wide no-underline transition-colors duration-200"
            style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}
          >
            Get API key &rarr;
          </a>
        </div>
        <input
          type="password"
          value={config.apiKey}
          onChange={(e) => setConfig({ apiKey: e.target.value })}
          placeholder="Enter your API key..."
          className="px-4 py-3"
          disabled={isIngesting}
        />
      </div>

      {/* Model selector */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
          Model
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(["gemini-2.5-flash", "gemini-2.5-pro", "gemini-3-flash-preview", "gemini-3.1-flash-lite", "gemini-3.5-flash"] as GeminiModel[]).map((model) => {
            const labels: Record<string, string> = {
              "gemini-2.5-flash": "2.5 Flash",
              "gemini-2.5-pro": "2.5 Pro",
              "gemini-3-flash-preview": "3 Flash",
              "gemini-3.1-flash-lite": "3.1 Flash Lite",
              "gemini-3.5-flash": "3.5 Flash",
            };
            const isSelected = config.model === model;
            return (
              <button
                key={model}
                onClick={() => setConfig({ model })}
                disabled={isIngesting}
                className="px-4 py-2.5 text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                style={{
                  background: isSelected ? "var(--accent-dim)" : "var(--surface)",
                  color: isSelected ? "var(--accent)" : "var(--text-muted)",
                  border: `1px solid ${isSelected ? "var(--accent-dim)" : "var(--border)"}`,
                  fontFamily: "var(--font-body)",
                }}
              >
                {labels[model]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Chunk Size", min: 256, max: 2048, step: 64, key: "chunkSize" as const },
          { label: "Overlap", min: 0, max: 256, step: 16, key: "chunkOverlap" as const },
          { label: "Top-K", min: 1, max: 10, step: 1, key: "topK" as const },
        ].map(({ label, min, max, step, key }) => (
          <div key={key} className="flex flex-col gap-2">
            <div className="flex justify-between items-baseline">
              <label className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                {label}
              </label>
              <span className="text-xs tabular-nums" style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}>
                {config[key]}
              </span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={config[key]}
              onChange={(e) => setConfig({ [key]: parseInt(e.target.value) })}
              disabled={isIngesting}
            />
          </div>
        ))}
      </div>

      {/* System Prompt */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
          System Prompt
        </label>
        <textarea
          value={config.systemPrompt}
          onChange={(e) => setConfig({ systemPrompt: e.target.value })}
          rows={3}
          className="px-4 py-3 resize-none"
          disabled={isIngesting}
        />
      </div>

      {/* Error */}
      {error && (
        <p
          className="text-xs px-3 py-2 rounded"
          style={{
            color: "var(--error)",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            fontFamily: "var(--font-body)",
          }}
        >
          {error}
        </p>
      )}

      {/* Terminal output */}
      {(isIngesting || terminalOutput.length > 0) && (
        <div
          ref={terminalRef}
          className="relative rounded overflow-hidden scanlines"
          style={{ background: "#0A0A0A", border: "1px solid var(--border)", maxHeight: "clamp(140px, 33vh, 240px)", overflowY: "auto" }}
        >
          <div
            className="px-3 py-1.5 text-[10px] uppercase tracking-widest"
            style={{ background: "var(--surface)", color: "var(--text-dim)", fontFamily: "var(--font-body)", borderBottom: "1px solid var(--border)" }}
          >
            terminal
          </div>
          <div className="p-4 flex flex-col gap-1.5">
            {terminalOutput.map((line, i) => (
              <div
                key={i}
                className="text-xs flex gap-2 animate-term-line"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <span style={{ color: "var(--accent)" }}>$</span>
                <span style={{ color: line.startsWith("ERROR") ? "var(--error)" : line.includes("successfully") ? "var(--success)" : "var(--text-muted)" }}>
                  {line}
                </span>
              </div>
            ))}
            {isIngesting && (
              <span className="cursor-blink text-xs" style={{ fontFamily: "var(--font-body)" }} />
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
        <button
          onClick={() => setStep(1)}
          disabled={isIngesting}
          className="px-6 py-2.5 text-xs uppercase tracking-widest transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
            fontFamily: "var(--font-body)",
            background: "transparent",
          }}
        >
          &larr; Back
        </button>

        <button
          onClick={handleIngest}
          disabled={!canBuild}
          className="relative px-8 py-3 text-xs uppercase tracking-widest font-medium transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
          style={{
            background: canBuild ? "var(--accent)" : "var(--surface)",
            color: canBuild ? "var(--bg)" : "var(--text-dim)",
            border: `1px solid ${canBuild ? "var(--accent)" : "var(--border)"}`,
            fontFamily: "var(--font-body)",
            opacity: canBuild ? 1 : 0.5,
          }}
          onMouseEnter={(e) => { if (canBuild) (e.currentTarget).style.boxShadow = "0 0 20px var(--accent-glow)"; }}
          onMouseLeave={(e) => { (e.currentTarget).style.boxShadow = "none"; }}
        >
          {isIngesting ? (
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full border-2"
                style={{ borderColor: "var(--text-dim)", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }}
              />
              Building...
            </span>
          ) : (
            "Build Pipeline"
          )}
        </button>
      </div>

      {chunkCount !== null && (
        <div className="text-center text-xs py-2" style={{ color: "var(--success)", fontFamily: "var(--font-body)" }}>
          {chunkCount} chunks indexed successfully
        </div>
      )}
    </div>
  );
}
