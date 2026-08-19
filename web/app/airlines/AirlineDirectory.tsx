"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export type DirectoryRow = {
  code: string;
  airline: string;
  slug: string;
  label: string;
  cls: string;
};

export default function AirlineDirectory({ rows }: { rows: DirectoryRow[] }) {
  const [q, setQ] = useState("");

  // The ?q= deep link (used by the SearchAction schema) is read after mount so the page itself
  // stays fully static; the first paint is the unfiltered directory either way.
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q");
    if (initial) setQ(initial);
  }, []);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return rows;
    return rows.filter(
      (r) => r.airline.toLowerCase().includes(n) || r.code.toLowerCase() === n
    );
  }, [q, rows]);

  return (
    <div>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search 235 airlines, e.g. Emirates or QR"
        aria-label="Search airlines"
        className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg-raised)] px-4 py-3 text-[var(--ink)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
      />
      <ul className="mt-6 grid gap-2 sm:grid-cols-2">
        {filtered.map((r) => (
          <li key={r.code} className="min-w-0">
            <Link
              href={`/airlines/${r.slug}/`}
              className="card flex items-center justify-between gap-3 px-4 py-3 text-[var(--ink)] hover:border-[var(--accent)] hover:no-underline"
            >
              <span className="min-w-0 truncate font-medium">{r.airline}</span>
              <span className={`v v-${r.cls} shrink-0`}>{r.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      {!filtered.length ? (
        <p className="mt-6 text-[var(--muted)]">
          No airline matches "{q}". If it flies and we missed it, tell us.
        </p>
      ) : null}
    </div>
  );
}
