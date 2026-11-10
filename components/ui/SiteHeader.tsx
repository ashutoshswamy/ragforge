"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Wordmark } from "./Logo";
import UserMenu from "./UserMenu";
import ThemeMenu from "./ThemeMenu";

// Shared top bar. `links` sit in the middle on desktop, `actions` sit next to the account area.
export default function SiteHeader({
  links,
  actions,
  maxWidth = "max-w-6xl",
}: {
  links?: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: string;
}) {
  const { user, loading } = useAuth();

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: "color-mix(in srgb, var(--bg) 80%, transparent)",
        backdropFilter: "blur(16px) saturate(160%)",
        WebkitBackdropFilter: "blur(16px) saturate(160%)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className={`${maxWidth} mx-auto flex items-center justify-between h-[68px] px-4 sm:px-8`}>
        <Wordmark />
        {links && <nav className="hidden md:flex items-center gap-8">{links}</nav>}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {actions}
          <ThemeMenu />
          {!loading && !user && (
            <>
              <Link href="/sign-in" className="navlink hidden sm:inline-flex items-center px-2">Sign in</Link>
              <Link href="/sign-up" className="btn btn-primary btn-sm max-[400px]:!px-3">Get started</Link>
            </>
          )}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
