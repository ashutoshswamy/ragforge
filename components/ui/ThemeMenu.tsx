"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type Mode } from "@/lib/theme";

const OPTIONS: { id: Mode; label: string; hint: string; icon: typeof Sun }[] = [
  { id: "light", label: "Light", hint: "Bright surfaces", icon: Sun },
  { id: "dark", label: "Dark", hint: "Easy on the eyes", icon: Moon },
  { id: "system", label: "System", hint: "Match your device", icon: Monitor },
];

export default function ThemeMenu() {
  const { mode, resolved, setMode } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const TriggerIcon = resolved === "dark" ? Moon : Sun;

  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    // Move focus to the selected option so arrow keys work straight away.
    const items = ref.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]');
    items?.[Math.max(0, OPTIONS.findIndex((o) => o.id === mode))]?.focus();
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, mode]);

  const onMenuKey = (e: React.KeyboardEvent) => {
    const items = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') ?? []);
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "Escape") { e.preventDefault(); close(true); }
    else if (e.key === "ArrowDown") { e.preventDefault(); items[(i + 1) % items.length]?.focus(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); items[(i - 1 + items.length) % items.length]?.focus(); }
    else if (e.key === "Tab") setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Theme"
        className="btn btn-ghost btn-sm !px-3 gap-1.5 max-sm:!w-[38px] max-sm:justify-center max-sm:!px-0"
      >
        <TriggerIcon size={16} />
        <ChevronDown size={14} className="hidden sm:block transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "none" }} />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Theme"
          onKeyDown={onMenuKey}
          className="card absolute right-0 top-full mt-3 w-60 p-1.5 z-50"
          style={{ animation: "dropdown-in 0.18s var(--ease) both", boxShadow: "var(--shadow-lift)", borderRadius: "var(--r-tile)" }}
        >
          <p className="px-3 pt-2 pb-1.5 text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Theme</p>
          {OPTIONS.map(({ id, label, hint, icon: Icon }) => {
            const active = mode === id;
            return (
              <button
                key={id}
                role="menuitemradio"
                aria-checked={active}
                onClick={() => { setMode(id); close(true); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left cursor-pointer rounded-xl transition-colors duration-150 hover:bg-[var(--surface-elevated)] focus-visible:bg-[var(--surface-elevated)]"
              >
                <span
                  className="flex items-center justify-center w-8 h-8 shrink-0"
                  style={{
                    borderRadius: 10,
                    background: active ? "var(--accent-dim)" : "var(--surface-elevated)",
                    color: active ? "var(--accent-text)" : "var(--text-muted)",
                  }}
                >
                  <Icon size={16} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium">{label}</span>
                  <span className="block text-xs" style={{ color: "var(--text-muted)" }}>{hint}</span>
                </span>
                {active && <Check size={16} style={{ color: "var(--accent-text)" }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
