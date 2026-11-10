"use client";

import { X } from "lucide-react";

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

function getExt(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "PDF";
  if (ext === "docx" || ext === "doc") return "DOC";
  return "TXT";
}

export default function FileCard({ name, size, onRemove }: FileCardProps) {
  return (
    <div
      className="rise flex items-center gap-4 px-4 py-3 card"
      style={{ borderRadius: "var(--r-tile)", boxShadow: "none" }}
    >
      <div
        className="flex items-center justify-center w-11 h-11 text-xs font-bold shrink-0"
        style={{
          background: "var(--accent-dim)",
          color: "var(--accent-text)",
          borderRadius: 12,
          fontFamily: "var(--font-heading)",
        }}
      >
        {getExt(name)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        <p className="text-xs tabular" style={{ color: "var(--text-muted)" }}>{formatSize(size)}</p>
      </div>
      <button
        onClick={onRemove}
        className="btn btn-ghost btn-icon shrink-0"
        aria-label={`Remove ${name}`}
      >
        <X size={16} />
      </button>
    </div>
  );
}
