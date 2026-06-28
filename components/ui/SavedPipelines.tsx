"use client";

import { useState, useEffect, useRef } from "react";
import { usePipelineStore } from "@/store/pipeline";
import type { Pipeline } from "@/types";

export default function SavedPipelines() {
  const [open, setOpen] = useState(false);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const { setPipelineId, setConfig, setPipelineName } = usePipelineStore();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchPipelines = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pipelines");
      if (res.ok) {
        const data = await res.json();
        setPipelines(data.pipelines ?? []);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen((prev) => !prev);
    if (!open) fetchPipelines();
  };

  const handleLoad = (pipeline: Pipeline) => {
    setPipelineId(pipeline.id);
    setPipelineName(pipeline.name);
    setConfig(pipeline.config);
    usePipelineStore.setState({ messages: [], currentStep: 3 });
    setOpen(false);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleting(id);
    try {
      await fetch(`/api/pipelines?id=${id}`, { method: "DELETE" });
      setPipelines((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="px-3 py-1.5 text-[10px] uppercase tracking-widest transition-colors duration-200 cursor-pointer flex items-center gap-1.5"
        style={{
          color: "var(--text-muted)",
          border: "1px solid var(--border)",
          fontFamily: "var(--font-body)",
          background: open ? "var(--surface)" : "transparent",
        }}
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        My Pipelines
      </button>

      {/* Dropdown — CSS transition instead of framer */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-72 z-50 rounded overflow-hidden"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            animation: "dropdown-in 0.15s ease-out both",
          }}
        >
          <div
            className="px-3 py-2 text-[10px] uppercase tracking-widest"
            style={{ borderBottom: "1px solid var(--border)", color: "var(--text-dim)", fontFamily: "var(--font-body)" }}
          >
            Saved Pipelines
          </div>

          {loading ? (
            <div className="px-4 py-6 text-center text-xs" style={{ color: "var(--text-dim)", fontFamily: "var(--font-body)" }}>
              Loading...
            </div>
          ) : pipelines.length === 0 ? (
            <div className="px-4 py-6 text-center text-xs" style={{ color: "var(--text-dim)", fontFamily: "var(--font-body)" }}>
              No saved pipelines yet
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              {pipelines.map((pipeline) => (
                <div
                  key={pipeline.id}
                  onClick={() => handleLoad(pipeline)}
                  className="flex items-center justify-between px-4 py-3 cursor-pointer transition-colors duration-150 group"
                  style={{ borderBottom: "1px solid var(--border)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-xs truncate" style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}>
                      {pipeline.name}
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--text-dim)", fontFamily: "var(--font-body)" }}>
                      {pipeline.chunk_count ?? 0} chunks · {new Date(pipeline.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, pipeline.id)}
                    disabled={deleting === pipeline.id}
                    className="ml-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer p-1"
                    style={{ color: "var(--error)" }}
                  >
                    {deleting === pipeline.id ? (
                      <div
                        className="w-3 h-3 rounded-full border"
                        style={{ borderColor: "var(--error)", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }}
                      />
                    ) : (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
