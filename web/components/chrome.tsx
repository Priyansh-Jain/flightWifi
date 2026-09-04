import Image from "next/image";
import Link from "next/link";
import { CHROME_STORE_URL, GITHUB_URL, SITE_NAME } from "@/lib/site";
import { HeaderNav } from "./HeaderNav";
import { stats } from "@/lib/extension";

export function SiteNav() {
  return <HeaderNav siteName={SITE_NAME} storeUrl={CHROME_STORE_URL} />;
}

const GROUPS: { title: string; items: { href: string; label: string; external?: boolean; plain?: boolean }[] }[] = [
  {
    title: "Data",
    items: [
      { href: "/airlines/", label: "Airlines" },
      { href: "/starlink/", label: "Starlink tracker" },
      { href: "/aircraft/", label: "Aircraft" },
      { href: "/providers/", label: "Providers" },
      { href: "/compare/", label: "Compare" }
    ]
  },
  {
    title: "Guides",
    items: [
      { href: "/calls/", label: "Video calls on board" },
      { href: "/no-wifi/", label: "Airlines without Wi-Fi" },
      { href: "/blog/", label: "Blog" },
      { href: "/methodology/", label: "Methodology" }
    ]
  },
  {
    title: "Open data",
    items: [
      { href: "/data.json", label: "Registry JSON", plain: true },
      { href: "/llms.txt", label: "llms.txt", plain: true },
      { href: GITHUB_URL, label: "GitHub", external: true }
    ]
  },
  {
    title: "Project",
    items: [
      { href: "/chrome-extension/", label: "Chrome extension" },
      { href: "/about/", label: "About" },
      { href: "/privacy/", label: "Privacy" },
      { href: "/contact/", label: "Contact" }
    ]
  }
];

export function ChromeMark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <path d="M21.17 8H12" />
      <path d="m3.95 6.06 4.59 7.94" />
      <path d="m10.88 21.94 4.58-7.94" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 8.5 8.5 3.5" />
      <path d="M4.5 3.5h4v4" />
    </svg>
  );
}

export function SiteFooter() {
  const s = stats();
  const year = new Date().getFullYear();
  return (
    <footer className="ftr relative isolate mt-16 overflow-hidden border-t border-[var(--line)]">
      <div className="ftr-glow pointer-events-none absolute inset-x-0 top-0 h-px" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-[1200px] px-5 pb-24 pt-16 sm:px-6 md:pb-28 md:pt-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,23rem)_1fr] lg:gap-16 xl:gap-24">
          <div>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center gap-2 font-bold tracking-tight text-[var(--ink)] hover:no-underline hover:opacity-80"
            >
              <Image src="/logo.png" alt="" width={24} height={24} />
              {SITE_NAME}
            </Link>
            <p className="mt-5 max-w-[34ch] text-sm text-[var(--muted)]">
              Wi-Fi verdicts for {s.airlines} airlines: the system on board, whether a video call
              works, and what it costs. Sourced from the airlines and their providers, last verified{" "}
              {s.asOf}.
            </p>
            <ul className="mt-8 flex items-center gap-2.5">
              <li>
                <a href={CHROME_STORE_URL} rel="noopener" aria-label="Chrome Web Store" className="ftr-icon">
                  <ChromeMark size={20} />
                </a>
              </li>
              <li>
                <a href={GITHUB_URL} rel="noopener" aria-label="GitHub" className="ftr-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.84c.85 0 1.71.11 2.51.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
                  </svg>
                </a>
              </li>
              <li>
                <Link href="/contact/" aria-label="Contact" className="ftr-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </Link>
              </li>
            </ul>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-4 sm:gap-x-6 lg:gap-x-8">
            {GROUPS.map((g) => (
              <div key={g.title}>
                <p className="ftr-h">{g.title}</p>
                <ul className="mt-3">
                  {g.items.map((it) => (
                    <li key={it.href}>
                      {it.external || it.plain ? (
                        <a href={it.href} rel={it.external ? "noopener" : undefined} className="ftr-link">
                          {it.label}
                          {it.external ? <Arrow /> : null}
                        </a>
                      ) : (
                        <Link href={it.href} className="ftr-link">
                          {it.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-14 border-t border-[var(--line)] pt-7 text-[11px] text-[var(--muted)] md:mt-16">
          <p>
            © {year} {SITE_NAME}
            <span className="mx-2">·</span>Independent, not affiliated with any airline or connectivity provider
            <span className="mx-2">·</span>Registry data CC BY 4.0
          </p>
        </div>
      </div>
      <p className="ftr-wordmark" aria-hidden="true">
        FLIGHTWIFI
      </p>
    </footer>
  );
}
