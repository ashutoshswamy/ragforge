"use client";

import { Zap } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  shape?: "hexagon" | "square";
}

export default function Logo({ className = "", size = "md", shape = "hexagon" }: LogoProps) {
  const sizes = {
    sm: { container: "w-8 h-8", icon: 16 },
    md: { container: "w-12 h-12", icon: 24 },
    lg: { container: "w-16 h-16", icon: 32 },
  };

  const currentSize = sizes[size];

  return (
    <div className={`relative flex items-center justify-center ${currentSize.container} ${className}`}>
      {/* Glow */}
      <div className="absolute inset-0 rounded-full blur-xl opacity-50" style={{ background: "var(--accent)" }} />

      {/* Shape */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {shape === "hexagon" ? (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_var(--accent-glow-strong)]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 5L93.3 30V70L50 95L6.7 70V30L50 5Z" fill="var(--surface-elevated)" stroke="var(--accent)" strokeWidth="4" />
          </svg>
        ) : (
          <div className="w-full h-full rounded-xl border-2 bg-[var(--surface-elevated)]" style={{ borderColor: "var(--accent)" }} />
        )}
      </div>

      {/* Icon */}
      <div className="relative z-10">
        <Zap size={currentSize.icon} fill="var(--accent)" className="text-[var(--accent)] drop-shadow-[0_0_5px_var(--accent)]" />
      </div>
    </div>
  );
}
