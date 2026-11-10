import { Zap } from "lucide-react";
import Link from "next/link";

const SIZES = { sm: [32, 20], md: [44, 28], lg: [64, 40] } as const;

export default function Logo({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: keyof typeof SIZES;
}) {
  const [box, icon] = SIZES[size];
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{
        width: box,
        height: box,
        borderRadius: box * 0.32,
        background: "var(--accent)",
        color: "var(--accent-ink)",
        boxShadow: "0 8px 20px -8px var(--accent-glow-strong)",
      }}
      aria-hidden="true"
    >
      <Zap size={icon} strokeWidth={2.4} fill="currentColor" />
    </span>
  );
}

export function Wordmark({ size = "sm", href = "/" }: { size?: keyof typeof SIZES; href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5 min-h-11" aria-label="RAGForge home">
      <Logo size={size} />
      <span
        className="text-xl font-bold"
        style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.03em" }}
      >
        RAGForge
      </span>
    </Link>
  );
}
