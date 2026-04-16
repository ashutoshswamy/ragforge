"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
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
    config,
    setConfig,
    parsedDocs,
    isIngesting,
    setIsIngesting,
    setStep,
    pipelineName,
    setPipelineName,
    setPipelineId,
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
    if (!config.apiKey) {
      setError("API key is required");
      return;
    }

    setError(null);
    setIsIngesting(true);
    setTerminalOutput([]);
    setChunkCount(null);

    for (let i = 0; i < TERMINAL_LINES.length; i++) {
      await new Promise((r) => setTimeout(r, 400 + Math.random() * 300));
      setTerminalOutput((prev) => [...prev, TERMINAL_LINES[i]]);
    }

    try {
      // Step 1: Create pipeline record in Supabase
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
      if (!createRes.ok) {
        throw new Error(createData.error || "Failed to create pipeline");
      }

      const pipelineId: string = createData.pipeline.id;
      setPipelineId(pipelineId);

      // Step 2: Ingest documents
      const ingestRes = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pipelineId,
          apiKey: config.apiKey,
          docs: parsedDocs,
          config: {
            chunkSize: config.chunkSize,
            chunkOverlap: config.chunkOverlap,
          },
        }),
      });

      const ingestData = await ingestRes.json();
      if (!ingestRes.ok) {
        throw new Error(ingestData.error || "Ingest failed");
      }

      setChunkCount(ingestData.chunks);
      setTerminalOutput((prev) => [
        ...prev,
        `Pipeline built successfully — ${ingestData.chunks} chunks indexed.`,
      ]);

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

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl mx-auto">
      {/* Pipeline Name */}
      <div className="flex flex-col gap-2">
        <label
          className="text-[10px] uppercase tracking-widest"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
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
          <label
            className="text-[10px] uppercase tracking-widest"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
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
        <label
          className="text-[10px] uppercase tracking-widest"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          Model
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(["gemini-2.5-flash", "gemini-2.5-pro", "gemini-3-flash-preview", "gemini-3-pro-preview"] as GeminiModel[]).map(
            (model) => {
              const labels: Record<string, string> = {
                "gemini-2.5-flash": "2.5 Flash",
                "gemini-2.5-pro": "2.5 Pro",
                "gemini-3-flash-preview": "3 Flash",
                "gemini-3-pro-preview": "3 Pro",
              };
              return (
                <button
                  key={model}
                  onClick={() => setConfig({ model })}
                  disabled={isIngesting}
                  className="px-4 py-2.5 text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                  style={{
                    background:
                      config.model === model
                        ? "var(--accent-dim)"
                        : "var(--surface)",
                    color:
                      config.model === model
                        ? "var(--accent)"
                        : "var(--text-muted)",
                    border: `1px solid ${config.model === model ? "var(--accent-dim)" : "var(--border)"}`,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {labels[model]}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-baseline">
            <label
              className="text-[10px] uppercase tracking-widest"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
            >
              Chunk Size
            </label>
            <span className="text-xs tabular-nums" style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}>
              {config.chunkSize}
            </span>
          </div>
          <input
            type="range"
            min={256}
            max={2048}
            step={64}
            value={config.chunkSize}
            onChange={(e) => setConfig({ chunkSize: parseInt(e.target.value) })}
            disabled={isIngesting}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-baseline">
            <label
              className="text-[10px] uppercase tracking-widest"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
            >
              Overlap
            </label>
            <span className="text-xs tabular-nums" style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}>
              {config.chunkOverlap}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={256}
            step={16}
            value={config.chunkOverlap}
            onChange={(e) => setConfig({ chunkOverlap: parseInt(e.target.value) })}
            disabled={isIngesting}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-baseline">
            <label
              className="text-[10px] uppercase tracking-widest"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
            >
              Top-K
            </label>
            <span className="text-xs tabular-nums" style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}>
              {config.topK}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={config.topK}
            onChange={(e) => setConfig({ topK: parseInt(e.target.value) })}
            disabled={isIngesting}
          />
        </div>
      </div>

      {/* System Prompt */}
      <div className="flex flex-col gap-2">
        <label
          className="text-[10px] uppercase tracking-widest"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
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
          style={{
            background: "#0A0A0A",
            border: "1px solid var(--border)",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          <div
            className="px-3 py-1.5 text-[10px] uppercase tracking-widest"
            style={{
              background: "var(--surface)",
              color: "var(--text-dim)",
              fontFamily: "var(--font-body)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            terminal
          </div>
          <div className="p-4 flex flex-col gap-1.5">
            {terminalOutput.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xs flex gap-2"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <span style={{ color: "var(--accent)" }}>$</span>
                <span
                  style={{
                    color: line.startsWith("ERROR")
                      ? "var(--error)"
                      : line.includes("successfully")
                        ? "var(--success)"
                        : "var(--text-muted)",
                  }}
                >
                  {line}
                </span>
              </motion.div>
            ))}
            {isIngesting && (
              <span
                className="cursor-blink text-xs"
                style={{ fontFamily: "var(--font-body)" }}
              />
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center">
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

        <motion.button
          onClick={handleIngest}
          disabled={isIngesting || !config.apiKey}
          className="relative px-8 py-3 text-xs uppercase tracking-widest font-medium transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
          style={{
            background:
              isIngesting || !config.apiKey ? "var(--surface)" : "var(--accent)",
            color:
              isIngesting || !config.apiKey ? "var(--text-dim)" : "var(--bg)",
            border: `1px solid ${isIngesting || !config.apiKey ? "var(--border)" : "var(--accent)"}`,
            fontFamily: "var(--font-body)",
            opacity: isIngesting || !config.apiKey ? 0.5 : 1,
          }}
          whileHover={!isIngesting && config.apiKey ? { scale: 1.02 } : {}}
          whileTap={!isIngesting && config.apiKey ? { scale: 0.98 } : {}}
        >
          {isIngesting ? (
            <span className="flex items-center gap-2">
              <motion.span
                className="inline-block w-3 h-3 rounded-full border-2"
                style={{
                  borderColor: "var(--text-dim)",
                  borderTopColor: "transparent",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
              Building...
            </span>
          ) : (
            "Build Pipeline"
          )}
        </motion.button>
      </div>

      {chunkCount !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-xs py-2"
          style={{ color: "var(--success)", fontFamily: "var(--font-body)" }}
        >
          {chunkCount} chunks indexed successfully
        </motion.div>
      )}
    </div>
  );
}
