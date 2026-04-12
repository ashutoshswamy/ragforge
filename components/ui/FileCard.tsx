"use client";

import { motion } from "framer-motion";

interface FileCardProps {
  name: string;
  size: number;
  onRemove: () => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "PDF";
  if (ext === "docx" || ext === "doc") return "DOC";
  return "TXT";
}

export default function FileCard({ name, size, onRemove }: FileCardProps) {
  const ext = getFileIcon(name);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, x: -10 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 px-4 py-3 rounded corner-accents"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      {/* File type badge */}
      <div
        className="flex items-center justify-center w-10 h-10 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0"
        style={{
          background: "var(--accent-dim)",
          color: "var(--accent)",
          fontFamily: "var(--font-body)",
        }}
      >
        {ext}
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm truncate"
          style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}
        >
          {name}
        </p>
        <p
          className="text-xs mt-0.5"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          {formatSize(size)}
        </p>
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="flex-shrink-0 p-1.5 rounded transition-colors duration-200 hover:opacity-80 cursor-pointer"
        style={{ color: "var(--text-muted)" }}
        aria-label={`Remove ${name}`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </motion.div>
  );
}
