"use client";

interface SourceChipProps {
  source: string;
}

export default function SourceChip({ source }: SourceChipProps) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded"
      style={{
        background: "var(--accent-dim)",
        color: "var(--accent)",
        fontFamily: "var(--font-body)",
        border: "1px solid var(--accent-dim)",
      }}
    >
      <svg
        className="w-3 h-3 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      {source}
    </span>
  );
}
