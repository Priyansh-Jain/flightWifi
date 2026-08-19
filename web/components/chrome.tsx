import Link from "next/link";
import Image from "next/image";
import { GITHUB_URL, SITE_NAME } from "@/lib/site";
import { stats } from "@/lib/extension";

const NAV = [
  { href: "/airlines/", label: "Airlines" },
  { href: "/starlink/", label: "Starlink tracker" },
  { href: "/providers/", label: "Providers" },
  { href: "/aircraft/", label: "Aircraft" },
  { href: "/compare/", label: "Compare" },
  { href: "/blog/", label: "Blog" }
];

export function SiteNav() {
  return (
    <header className="nav-blur sticky top-0 z-40 border-b border-[var(--line)]">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-bold tracking-tight text-[var(--ink)] hover:no-underline">
          <Image src="/logo.png" alt="" width={26} height={26} priority />
          {SITE_NAME}
        </Link>
        <nav className="flex min-w-0 items-center gap-4 text-sm">
          <div className="hidden items-center gap-4 md:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="whitespace-nowrap text-[var(--muted)] hover:text-[var(--ink)] hover:no-underline">
                {n.label}
              </Link>
            ))}
          </div>
          {/* below md the same links scroll sideways rather than being dropped: showing only two of
              them left Compare, Providers, Aircraft and Blog unreachable from every phone */}
          <div className="nav-strip flex min-w-0 items-center gap-4 overflow-x-auto md:hidden">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="whitespace-nowrap text-[var(--muted)] hover:text-[var(--ink)] hover:no-underline"
              >
                {n.label}
              </Link>
            ))}
          </div>
          <Link
            href="/chrome-extension/"
            className="shrink-0 whitespace-nowrap rounded-full border border-[var(--line)] px-3 py-1 font-medium text-[var(--ink)] hover:no-underline"
          >
            Extension
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const s = stats();
  return (
    <footer className="mt-16 border-t border-[var(--line)]">
      <div className="mx-auto grid w-full max-w-5xl gap-8 px-5 py-12 text-sm sm:grid-cols-3">
        <div>
          <p className="font-bold">{SITE_NAME}</p>
          <p className="mt-2 text-[var(--muted)]">
            Wi-Fi verdicts for {s.airlines} airlines, sourced airline by airline from the carriers
            and their connectivity providers. Last verified {s.asOf}.
          </p>
        </div>
        <div className="grid gap-1.5">
          <p className="font-semibold">Data</p>
          <Link href="/airlines/">All airlines</Link>
          <Link href="/starlink/">Starlink tracker</Link>
          <Link href="/providers/">Providers</Link>
          <Link href="/aircraft/">Aircraft</Link>
          <a href="/data.json">Open data (JSON)</a>
          <Link href="/methodology/">Methodology</Link>
        </div>
        <div className="grid gap-1.5">
          <p className="font-semibold">Project</p>
          <Link href="/chrome-extension/">Chrome extension</Link>
          <Link href="/blog/">Blog</Link>
          <Link href="/about/">About</Link>
          <Link href="/privacy/">Privacy</Link>
          <a href={GITHUB_URL}>GitHub</a>
          <Link href="/contact/">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
