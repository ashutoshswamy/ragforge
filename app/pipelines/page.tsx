"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { usePipelineStore } from "@/store/pipeline";
import type { Pipeline } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function PipelinesPage() {
  const { user } = useUser();
  const router = useRouter();
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const { setPipelineId, setConfig, setPipelineName } = usePipelineStore();

  useEffect(() => {
    fetchPipelines();
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

  const handleLoad = (pipeline: Pipeline) => {
    setPipelineId(pipeline.id);
    setPipelineName(pipeline.name);
    setConfig(pipeline.config);
    usePipelineStore.setState({ messages: [], currentStep: 3 });
    router.push("/pipeline");
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleting(id);
    try {
      const res = await fetch(`/api/pipelines?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setPipelines((prev) => prev.filter((p) => p.id !== id));
      }
    } finally {
      setDeleting(null);
    }
  };

  const handleNewPipeline = () => {
    usePipelineStore.getState().reset();
    router.push("/pipeline");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <header
        className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight no-underline group"
          style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}
        >
          <Logo size="sm" className="transition-transform duration-300 group-hover:scale-110" />
          <span>
            RAG<span style={{ color: "var(--accent)" }}>Forge</span>
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={handleNewPipeline}
            className="px-4 py-2 text-[10px] uppercase tracking-widest transition-colors duration-200 cursor-pointer flex items-center gap-1.5"
            style={{
              color: "var(--bg)",
              background: "var(--accent)",
              fontFamily: "var(--font-body)",
            }}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Pipeline
          </button>
          <div className="flex items-center gap-2">
            {user && (
              <span
                className="hidden sm:block text-xs"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
              >
                {user.primaryEmailAddress?.emailAddress}
              </span>
            )}
            <UserButton />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-8 py-8 sm:py-12 max-w-5xl mx-auto w-full">
        {/* Page title */}
        <div className="flex flex-col gap-2 mb-8 sm:mb-12">
          <h1
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Your Pipelines
          </h1>
          <p
            className="text-xs"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Load a saved pipeline to continue chatting, or create a new one.
          </p>
          <div
            className="w-16 h-px mt-2"
            style={{ background: "var(--accent-dim)" }}
          />
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <motion.div
              className="w-6 h-6 rounded-full border-2"
              style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}

        {/* Empty state */}
        {!loading && pipelines.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-5"
          >
            <div
              className="w-16 h-16 flex items-center justify-center rounded"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <svg
                className="w-7 h-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
                style={{ color: "var(--text-dim)" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <p
              className="text-sm"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
            >
              No pipelines yet
            </p>
            <button
              onClick={handleNewPipeline}
              className="px-6 py-3 text-xs uppercase tracking-widest cursor-pointer transition-all duration-200"
              style={{
                color: "var(--bg)",
                background: "var(--accent)",
                fontFamily: "var(--font-body)",
              }}
            >
              Create Your First Pipeline
            </button>
          </motion.div>
        )}

        {/* Pipeline grid */}
        {!loading && pipelines.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {pipelines.map((pipeline, i) => (
                <motion.div
                  key={pipeline.id}
                  layout
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleLoad(pipeline)}
                  className="relative group cursor-pointer corner-accents transition-colors duration-200"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                  }}
                  whileHover={{ borderColor: "rgba(245, 130, 10, 0.3)" }}
                >
                  {/* Card header */}
                  <div
                    className="flex items-center justify-between px-5 py-3"
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: "var(--accent)" }}
                      />
                      <span
                        className="text-[10px] uppercase tracking-widest"
                        style={{ color: "var(--text-dim)", fontFamily: "var(--font-body)" }}
                      >
                        Pipeline
                      </span>
                    </div>
                    <span
                      className="text-[10px] tabular-nums"
                      style={{ color: "var(--text-dim)", fontFamily: "var(--font-body)" }}
                    >
                      {pipeline.id.slice(0, 8)}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col gap-4 p-5">
                    <h3
                      className="text-sm font-bold tracking-wide truncate"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {pipeline.name}
                    </h3>

                    {/* Stats row */}
                    <div className="flex gap-4">
                      <div className="flex flex-col">
                        <span
                          className="text-lg font-extrabold tabular-nums"
                          style={{ color: "var(--accent)", fontFamily: "var(--font-heading)" }}
                        >
                          {pipeline.chunk_count ?? 0}
                        </span>
                        <span
                          className="text-[9px] uppercase tracking-widest"
                          style={{ color: "var(--text-dim)", fontFamily: "var(--font-body)" }}
                        >
                          Chunks
                        </span>
                      </div>
                      {pipeline.config && (
                        <div className="flex flex-col">
                          <span
                            className="text-lg font-extrabold tabular-nums"
                            style={{ color: "var(--text-muted)", fontFamily: "var(--font-heading)" }}
                          >
                            {pipeline.config?.topK ?? 4}
                          </span>
                          <span
                            className="text-[9px] uppercase tracking-widest"
                            style={{ color: "var(--text-dim)", fontFamily: "var(--font-body)" }}
                          >
                            Top-K
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Meta row */}
                    <div
                      className="flex items-center justify-between pt-3"
                      style={{ borderTop: "1px solid var(--border)" }}
                    >
                      <span
                        className="text-[10px]"
                        style={{ color: "var(--text-dim)", fontFamily: "var(--font-body)" }}
                      >
                        {new Date(pipeline.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>

                      <div className="flex items-center gap-2">
                        {/* Open button */}
                        <span
                          className="text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}
                        >
                          Open &rarr;
                        </span>

                        {/* Delete button */}
                        <button
                          onClick={(e) => handleDelete(e, pipeline.id)}
                          disabled={deleting === pipeline.id}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer p-1"
                          style={{ color: "var(--error)" }}
                        >
                          {deleting === pipeline.id ? (
                            <motion.div
                              className="w-3 h-3 rounded-full border"
                              style={{ borderColor: "var(--error)", borderTopColor: "transparent" }}
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            />
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Bottom accent */}
      <div
        className="h-px"
        style={{ background: "linear-gradient(90deg, transparent, var(--accent-dim), transparent)" }}
      />
    </div>
  );
}
