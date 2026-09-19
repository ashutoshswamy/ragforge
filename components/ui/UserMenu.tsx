"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const initial = (user.email ?? "?").charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer overflow-hidden"
        style={{ background: "var(--accent-dim)", color: "var(--accent)", fontFamily: "var(--font-body)" }}
      >
        {user.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
        ) : (
          initial
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-48 z-50 rounded overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", animation: "dropdown-in 0.15s ease-out both" }}
        >
          <div
            className="px-3 py-2 text-[10px] truncate"
            style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border)", fontFamily: "var(--font-body)" }}
          >
            {user.email}
          </div>
          <button
            onClick={signOut}
            className="w-full text-left px-3 py-2 text-xs cursor-pointer transition-colors duration-150"
            style={{ color: "var(--error)", fontFamily: "var(--font-body)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
