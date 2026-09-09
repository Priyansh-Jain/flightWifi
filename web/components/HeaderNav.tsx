"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BlogSearchButton } from "./BlogSearch";

const NAV = [
  { href: "/airlines/", label: "Airlines" },
  { href: "/starlink/", label: "Starlink" },
  { href: "/compare/", label: "Compare" },
  { href: "/blog/", label: "Blog" }
];

export function HeaderNav({ siteName, storeUrl }: { siteName: string; storeUrl: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const active = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));
  const onBlog = pathname === "/blog" || pathname.startsWith("/blog/");

  return (
    <header className="sticky top-0 z-40">
      <div className={`hdr pointer-events-none absolute inset-0 border-b border-transparent ${scrolled || open ? "hdr-on" : ""}`} aria-hidden="true" />
      <div className="relative mx-auto grid h-16 w-full max-w-[1200px] grid-cols-[1fr_auto] items-center gap-3 px-5 sm:px-6 md:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Link
          href="/"
          className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md text-[17px] font-bold tracking-tight text-[var(--ink)] hover:no-underline hover:opacity-80"
        >
          <Image src="/logo.png" alt="" width={32} height={32} priority />
          {siteName}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex md:justify-self-center">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active(n.href) ? "page" : undefined}
              className={`hdr-link whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors hover:no-underline ${
                active(n.href) ? "text-[var(--ink)]" : "text-[var(--muted)] hover:bg-[var(--ink)]/[0.06] hover:text-[var(--ink)]"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2">
          {onBlog ? <BlogSearchButton /> : null}
          <a
            href={storeUrl}
            rel="noopener"
            className="hdr-cta hidden h-9 shrink-0 items-center rounded-full px-4 text-xs font-bold uppercase tracking-wide hover:no-underline md:inline-flex"
          >
            Get the extension
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-11 items-center justify-center rounded-full border border-[var(--line)] text-[var(--ink)] transition-colors hover:border-[var(--accent)] md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {open ? (
                <>
                  <path d="M3 3l12 12" />
                  <path d="M15 3 3 15" />
                </>
              ) : (
                <>
                  <path d="M2 4.5h14" />
                  <path d="M2 9h14" />
                  <path d="M2 13.5h14" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="site-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-[var(--line)] bg-[var(--bg)] md:hidden"
      >
        <nav aria-label="Primary" className="mx-auto grid w-full max-w-[1200px] gap-1 px-5 py-4 sm:px-6">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active(n.href) ? "page" : undefined}
              className={`rounded-lg px-3 py-3 text-base font-medium hover:no-underline ${
                active(n.href) ? "bg-[var(--ink)]/[0.06] text-[var(--ink)]" : "text-[var(--ink)]"
              }`}
            >
              {n.label}
            </Link>
          ))}
          <a
            href={storeUrl}
            rel="noopener"
            className="hdr-cta mt-2 inline-flex h-11 items-center justify-center rounded-full px-4 text-xs font-bold uppercase tracking-wide hover:no-underline"
          >
            Get the extension
          </a>
        </nav>
      </div>
    </header>
  );
}
