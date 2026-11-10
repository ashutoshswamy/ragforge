"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export type Mode = "system" | "light" | "dark";

const KEY = "ragforge-theme";

// Runs in <head> before paint so the stored theme never flashes. Must match apply() below.
export const THEME_INIT_SCRIPT = `try{var t=JSON.parse(localStorage.getItem("${KEY}")||"{}"),d=document.documentElement;if(t.mode==="light"||t.mode==="dark")d.dataset.mode=t.mode;}catch(e){}`;

interface ThemeValue {
  mode: Mode;
  resolved: "light" | "dark";
  setMode: (m: Mode) => void;
}

const ThemeContext = createContext<ThemeValue>({
  mode: "system",
  resolved: "light",
  setMode: () => {},
});

function apply(mode: Mode) {
  const d = document.documentElement;
  if (mode === "system") delete d.dataset.mode;
  else d.dataset.mode = mode;
  try {
    localStorage.setItem(KEY, JSON.stringify({ mode }));
  } catch {
    // Private mode: theme still applies for this session.
  }
}

// Tab icon can't read page CSS, so redraw the logo as an SVG in the live accent colours.
function syncFavicon() {
  const cs = getComputedStyle(document.documentElement);
  const bg = cs.getPropertyValue("--accent").trim();
  const fg = cs.getPropertyValue("--accent-ink").trim();
  if (!bg || !fg) return;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="10" fill="${bg}"/>` +
    `<path transform="translate(4 4)" fill="${fg}" stroke="${fg}" stroke-width="2" stroke-linejoin="round" d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>`;
  const href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  // Edit Next's icon links in place. Deleting them breaks React, which owns those nodes.
  const links = document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]');
  if (links.length === 0) {
    const link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]').forEach((l) => {
    l.setAttribute("type", "image/svg+xml");
    l.removeAttribute("sizes");
    if (l.getAttribute("href") !== href) l.setAttribute("href", href);
  });
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("system");
  const [systemDark, setSystemDark] = useState(false);

  // Read what the init script applied, after mount to keep hydration identical.
  /* eslint-disable react-hooks/set-state-in-effect -- intentional: reading the DOM after mount keeps SSR and first client render identical */
  useEffect(() => {
    const d = document.documentElement.dataset;
    if (d.mode === "light" || d.mode === "dark") setModeState(d.mode);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const setMode = useCallback((m: Mode) => { setModeState(m); apply(m); }, []);

  const pathname = usePathname();
  // Re-run on route changes too, since Next re-renders its static icon links.
  useEffect(() => {
    syncFavicon();
    // Next streams its static icon links in after hydration; restyle any that appear later.
    const mo = new MutationObserver(() => {
      const stale = Array.from(document.querySelectorAll('link[rel~="icon"]')).some((l) => !l.getAttribute("href")?.startsWith("data:"));
      if (stale) syncFavicon();
    });
    mo.observe(document.head, { childList: true });
    return () => mo.disconnect();
  }, [mode, systemDark, pathname]);

  const resolved = mode === "system" ? (systemDark ? "dark" : "light") : mode;

  return (
    <ThemeContext.Provider value={{ mode, resolved, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
