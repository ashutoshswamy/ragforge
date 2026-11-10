"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  if (!user) return null;

  const initial = (user.email ?? "?").charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer overflow-hidden transition-transform duration-200 hover:scale-105"
        style={{ background: "var(--accent-dim)", color: "var(--accent-text)", border: "1px solid var(--border)" }}
      >
        {user.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          initial
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="card absolute right-0 top-full mt-3 w-64 overflow-hidden p-1.5"
          style={{ animation: "dropdown-in 0.18s var(--ease) both", boxShadow: "var(--shadow-lift)", borderRadius: "var(--r-tile)" }}
        >
          <div className="px-3 py-2.5">
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>Signed in as</p>
            <p className="text-sm font-medium truncate">{user.email}</p>
          </div>
          <button
            role="menuitem"
            onClick={signOut}
            className="w-full flex items-center gap-2 text-left px-3 py-2.5 text-sm font-medium cursor-pointer rounded-xl transition-colors duration-150 hover:bg-[var(--surface-elevated)]"
            style={{ color: "var(--error)" }}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
