"use client";

import { useState, useEffect, useRef } from "react";
import { sileo } from "sileo";
import { ArrowLeft, ArrowRight, ExternalLink, Eye, EyeOff } from "lucide-react";
import { usePipelineStore } from "@/store/pipeline";
import type { GeminiModel, PipelineConfig } from "@/types";

const BUILD_LOG = [
  "Parsing uploaded documents",
  "Splitting text into chunks",
  "Generating embeddings with Gemini",
  "Storing vectors",
  "Building the index",
];

const MODELS: { id: GeminiModel; label: string; note: string }[] = [
  { id: "gemini-3.8-flash", label: "3.8 Flash", note: "Newest" },
  { id: "gemini-3.6-flash", label: "3.6 Flash", note: "Stable" },
  { id: "gemini-3.5-flash-lite", label: "3.5 Flash Lite", note: "Fastest" },
  { id: "gemini-3.1-flash-lite", label: "3.1 Flash Lite", note: "Lightest" },
];

const SLIDERS = [
  { label: "Chunk size", hint: "Characters per chunk", min: 256, max: 2048, step: 64, key: "chunkSize" },
  { label: "Overlap", hint: "Shared between chunks", min: 0, max: 256, step: 16, key: "chunkOverlap" },
  { label: "Top-K", hint: "Chunks sent to the model", min: 1, max: 10, step: 1, key: "topK" },
] as const satisfies readonly { label: string; hint: string; min: number; max: number; step: number; key: keyof PipelineConfig }[];

export default function Step2Configure() {
  const {
    config, setConfig, parsedDocs, isIngesting, setIsIngesting,
    setStep, pipelineName, setPipelineName, setPipelineId,
  } = usePipelineStore();

  const [log, setLog] = useState<string[]>([]);
  const [showKey, setShowKey] = useState(false);
  const [keyError, setKeyError] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [log]);

  const build = async () => {
    for (let i = 0; i < BUILD_LOG.length; i++) {
      await new Promise((r) => setTimeout(r, 350 + Math.random() * 250));
      setLog((prev) => [...prev, BUILD_LOG[i]]);
    }

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

    setLog((prev) => [...prev, `Done. ${ingestData.chunks} chunks indexed.`]);
    await new Promise((r) => setTimeout(r, 900));
    return ingestData.chunks as number;
  };

  const handleIngest = async () => {
    if (!config.apiKey) {
      setKeyError(true);
      sileo.warning({ title: "API key needed", description: "Add your Gemini API key to build the pipeline." });
      return;
    }
    setKeyError(false);
    setIsIngesting(true);
    setLog([]);

    try {
      await sileo.promise(build(), {
        loading: { title: "Building your pipeline", description: "Parsing, chunking and embedding." },
        success: (n) => ({ title: "Pipeline ready", description: `${n} chunks indexed. Ask away.` }),
        error: (err) => ({
          title: "Build failed",
          description: err instanceof Error ? err.message : "Something went wrong.",
        }),
      });
      setIsIngesting(false);
      setStep(3);
    } catch (err) {
      setLog((prev) => [...prev, `Error: ${err instanceof Error ? err.message : "Unknown error"}`]);
      setIsIngesting(false);
    }
  };

  const canBuild = !isIngesting;

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <div>
        <h1 className="text-4xl sm:text-5xl">Tune your pipeline</h1>
        <p className="mt-3 text-base" style={{ color: "var(--text-muted)" }}>
          Sensible defaults are set. Change anything you like, then build.
        </p>
      </div>

      <section className="card p-6 sm:p-8 flex flex-col gap-6">
        <div>
          <label htmlFor="name" className="label">Pipeline name</label>
          <input
            id="name"
            type="text"
            value={pipelineName}
            onChange={(e) => setPipelineName(e.target.value)}
            placeholder="Research papers"
            className="w-full px-4 h-12"
            disabled={isIngesting}
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="key" className="label">Gemini API key</label>
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium py-2 -my-1"
              style={{ color: "var(--accent-text)" }}
            >
              Get a key <ExternalLink size={13} />
            </a>
          </div>
          <div className="relative">
            <input
              id="key"
              type={showKey ? "text" : "password"}
              value={config.apiKey}
              onChange={(e) => { setConfig({ apiKey: e.target.value }); setKeyError(false); }}
              placeholder="Paste your key"
              className="w-full pl-4 pr-12 h-12"
              style={keyError ? { borderColor: "var(--error)" } : undefined}
              aria-invalid={keyError}
              aria-describedby="key-hint"
              disabled={isIngesting}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-icon border-transparent bg-transparent"
              aria-label={showKey ? "Hide key" : "Show key"}
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p id="key-hint" className="hint mt-2" style={keyError ? { color: "var(--error)" } : undefined}>
            {keyError ? "A key is required to build." : "Used for this request only. Never stored."}
          </p>
        </div>

        <fieldset disabled={isIngesting}>
          <legend className="label">Model</legend>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {MODELS.map((m) => {
              const selected = config.model === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setConfig({ model: m.id })}
                  aria-pressed={selected}
                  className="flex flex-col items-start gap-0.5 px-4 py-3 text-left cursor-pointer transition-all duration-200 disabled:cursor-not-allowed"
                  style={{
                    background: selected ? "var(--accent-dim)" : "var(--surface)",
                    border: `1.5px solid ${selected ? "var(--accent)" : "var(--border-active)"}`,
                    borderRadius: "var(--r-input)",
                  }}
                >
                  <span className="text-sm font-semibold" style={{ color: selected ? "var(--accent-text)" : "var(--text)" }}>{m.label}</span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{m.note}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      </section>

      <section className="card p-6 sm:p-8 flex flex-col gap-7">
        {SLIDERS.map(({ label, hint, min, max, step, key }) => {
          const value = config[key];
          const pct = ((value - min) / (max - min)) * 100;
          return (
            <div key={key}>
              <div className="flex items-baseline justify-between mb-3">
                <label htmlFor={key} className="label !mb-0">
                  {label} <span className="hint font-normal ml-1">{hint}</span>
                </label>
                <span className="text-lg font-bold tabular" style={{ fontFamily: "var(--font-heading)", color: "var(--accent-text)" }}>
                  {value}
                </span>
              </div>
              <input
                id={key}
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                style={{ "--pct": `${pct}%` } as React.CSSProperties}
                onChange={(e) => setConfig({ [key]: parseInt(e.target.value) })}
                disabled={isIngesting}
              />
            </div>
          );
        })}

        <div>
          <label htmlFor="sys" className="label">System prompt</label>
          <textarea
            id="sys"
            value={config.systemPrompt}
            onChange={(e) => setConfig({ systemPrompt: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 resize-none leading-relaxed"
            disabled={isIngesting}
          />
        </div>
      </section>

      {log.length > 0 && (
        <div
          ref={logRef}
          className="p-5 overflow-y-auto flex flex-col gap-2"
          style={{ background: "var(--surface-elevated)", borderRadius: "var(--r-tile)", maxHeight: 200 }}
          role="status"
          aria-live="polite"
        >
          {log.map((line, i) => {
            const isErr = line.startsWith("Error");
            const isDone = line.startsWith("Done");
            return (
              <p
                key={i}
                className="rise text-sm"
                style={{ color: isErr ? "var(--error)" : isDone ? "var(--success)" : "var(--text-muted)", fontWeight: isDone || isErr ? 600 : 400 }}
              >
                {line}
              </p>
            );
          })}
          {isIngesting && <span className="caret text-sm" aria-hidden="true">&nbsp;</span>}
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3">
        <button onClick={() => setStep(1)} disabled={isIngesting} className="btn btn-ghost">
          <ArrowLeft size={18} /> Back
        </button>
        <button onClick={handleIngest} disabled={!canBuild} className="btn btn-primary">
          {isIngesting ? (<><span className="spinner" /> Building</>) : (<>Build pipeline <ArrowRight size={18} /></>)}
        </button>
      </div>
    </div>
  );
}
