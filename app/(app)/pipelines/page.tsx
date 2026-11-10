"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sileo } from "sileo";
import { ArrowUpRight, Layers, Plus, Trash2 } from "lucide-react";
import SiteHeader from "@/components/ui/SiteHeader";
import { usePipelineStore } from "@/store/pipeline";
import type { Pipeline } from "@/types";

export default function PipelinesPage() {
  const router = useRouter();
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const { setPipelineId, setConfig, setPipelineName } = usePipelineStore();

  useEffect(() => { fetchPipelines(); }, []);

  const fetchPipelines = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pipelines");
      if (!res.ok) throw new Error("Could not load your pipelines");
      const data = await res.json();
      setPipelines(data.pipelines ?? []);
    } catch (err) {
      sileo.error({ title: "Load failed", description: err instanceof Error ? err.message : "Try refreshing." });
    } finally {
      setLoading(false);
    }
  };

  const handleLoad = (pipeline: Pipeline) => {
    setPipelineId(pipeline.id);
    setPipelineName(pipeline.name);
    // Pipelines saved with a retired model fall back to the current default.
    const known = ["gemini-3.1-flash-lite", "gemini-3.5-flash-lite", "gemini-3.6-flash", "gemini-3.8-flash"];
    setConfig(known.includes(pipeline.config.model) ? pipeline.config : { ...pipeline.config, model: "gemini-3.6-flash" });
    usePipelineStore.setState({ messages: [], currentStep: 3 });
    router.push("/pipeline");
  };

  const handleDelete = async (e: React.MouseEvent, pipeline: Pipeline) => {
    e.stopPropagation();
    setDeleting(pipeline.id);
    try {
      const res = await fetch(`/api/pipelines?id=${pipeline.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("The server refused to delete it");
      setPipelines((prev) => prev.filter((p) => p.id !== pipeline.id));
      sileo.success({ title: "Pipeline deleted", description: pipeline.name });
    } catch (err) {
      sileo.error({ title: "Delete failed", description: err instanceof Error ? err.message : "Try again." });
    } finally {
      setDeleting(null);
    }
  };

  const handleNewPipeline = () => {
    usePipelineStore.getState().reset();
    router.push("/pipeline");
  };

  return (
    <div className="flex flex-col min-h-dvh wash">
      <SiteHeader
        actions={
          <button onClick={handleNewPipeline} className="btn btn-primary btn-sm max-[480px]:!px-0 max-[480px]:w-[38px]" aria-label="New pipeline">
            <Plus size={16} /> <span className="max-[480px]:sr-only">New pipeline</span>
          </button>
        }
      />

      <main className="flex-1 w-full max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <div className="rise mb-10 sm:mb-14">
          <h1 className="text-4xl sm:text-6xl">Your pipelines</h1>
          <p className="mt-4 text-base sm:text-lg max-w-xl" style={{ color: "var(--text-muted)" }}>
            Open a saved pipeline to keep chatting, or build a new one.
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" aria-busy="true" aria-label="Loading pipelines">
            {[0, 1, 2].map((i) => <div key={i} className="skeleton h-52" style={{ borderRadius: "var(--r-card)" }} />)}
          </div>
        )}

        {!loading && pipelines.length === 0 && (
          <div className="card rise flex flex-col items-center text-center gap-5 px-6 py-16">
            <span className="flex items-center justify-center w-16 h-16" style={{ background: "var(--accent-dim)", color: "var(--accent-text)", borderRadius: 20 }}>
              <Layers size={28} strokeWidth={1.8} />
            </span>
            <div>
              <h2 className="text-2xl">No pipelines yet</h2>
              <p className="text-sm mt-2 max-w-sm" style={{ color: "var(--text-muted)" }}>
                Upload a few documents and you will be chatting with them in about a minute.
              </p>
            </div>
            <button onClick={handleNewPipeline} className="btn btn-primary">
              <Plus size={18} /> Create your first pipeline
            </button>
          </div>
        )}

        {!loading && pipelines.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pipelines.map((pipeline, i) => (
              <div
                key={pipeline.id}
                role="link"
                tabIndex={0}
                onClick={() => handleLoad(pipeline)}
                onKeyDown={(e) => { if (e.key === "Enter" && e.target === e.currentTarget) handleLoad(pipeline); }}
                className="card rise group flex flex-col justify-between gap-8 p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:[box-shadow:var(--shadow-lift)]"
                style={{ "--d": `${i * 60}ms` } as React.CSSProperties}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl leading-tight line-clamp-2">{pipeline.name}</h3>
                  <ArrowUpRight size={20} className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: "var(--accent-text)" }} />
                </div>

                <div className="flex items-end justify-between gap-4">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-3xl font-bold tabular" style={{ fontFamily: "var(--font-heading)", color: "var(--accent-text)" }}>
                        {pipeline.chunk_count ?? 0}
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>chunks</p>
                    </div>
                    {pipeline.config && (
                      <div>
                        <p className="text-3xl font-bold tabular" style={{ fontFamily: "var(--font-heading)" }}>
                          {pipeline.config.topK ?? 4}
                        </p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>top-K</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: "var(--text-dim)" }}>
                      {new Date(pipeline.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <button
                      onClick={(e) => handleDelete(e, pipeline)}
                      disabled={deleting === pipeline.id}
                      className="btn btn-ghost btn-danger btn-icon"
                      aria-label={`Delete ${pipeline.name}`}
                    >
                      {deleting === pipeline.id ? <span className="spinner" /> : <Trash2 size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
