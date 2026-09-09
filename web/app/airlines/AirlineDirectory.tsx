"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { DirectoryRow } from "@/lib/derive";

type FilterId = "all" | "starlink" | "free" | "calls" | "none";

const FILTERS: { id: FilterId; label: string; test: (r: DirectoryRow) => boolean }[] = [
  { id: "all", label: "All", test: () => true },
  { id: "starlink", label: "Starlink", test: (r) => r.starlink === "flying" },
  // "Free" means free for every passenger. A free tier in front of a paid one is a different offer
  // and is left out rather than folded in.
  { id: "free", label: "Free", test: (r) => r.cost === "Free" },
  { id: "calls", label: "Video calls", test: (r) => r.calls },
  { id: "none", label: "No Wi-Fi", test: (r) => r.cls === "none" }
];

// Best first is the default because 126 of the airlines have no internet at all: alphabetical order
// buries every carrier worth choosing.
const RANK: Record<string, number> = { fast: 0, ok: 1, part: 2, unknown: 3, none: 4 };
const COST_RANK: Record<string, number> = { Free: 0, "Free tier, then paid": 1, Paid: 2 };
const STAR_RANK: Record<string, number> = { flying: 0, announced: 1 };

type SortId = "best" | "starlink" | "free" | "az";

const byName = (a: DirectoryRow, b: DirectoryRow) => a.airline.localeCompare(b.airline);
const byRank = (a: DirectoryRow, b: DirectoryRow) => (RANK[a.cls] ?? 5) - (RANK[b.cls] ?? 5);

const SORTS: { id: SortId; label: string; cmp: (a: DirectoryRow, b: DirectoryRow) => number }[] = [
  {
    id: "best",
    label: "Best Wi-Fi",
    cmp: (a, b) => byRank(a, b) || Number(b.calls) - Number(a.calls) || byName(a, b)
  },
  {
    id: "starlink",
    label: "Starlink first",
    cmp: (a, b) =>
      (STAR_RANK[a.starlink ?? ""] ?? 2) - (STAR_RANK[b.starlink ?? ""] ?? 2) || byRank(a, b) || byName(a, b)
  },
  {
    id: "free",
    label: "Cheapest first",
    cmp: (a, b) => (COST_RANK[a.cost ?? ""] ?? 3) - (COST_RANK[b.cost ?? ""] ?? 3) || byRank(a, b) || byName(a, b)
  },
  { id: "az", label: "A to Z", cmp: byName }
];

// Naming a sort "best" without saying what best means leaves the reader guessing why one carrier
// outranks another, so the rule is printed rather than implied.
const SORT_NOTE: Record<SortId, string> = {
  best: "Video-call capable fleets first, then browsing-capable, then part-fitted fleets, then no Wi-Fi.",
  starlink: "Airlines already flying Starlink passengers first, then those that have only announced it.",
  free: "Free for every passenger first, then a free tier in front of a paid plan, then paid only.",
  az: "Alphabetical by airline name."
};

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
      <circle cx="7" cy="7" r="4.6" />
      <path d="m10.6 10.6 3.4 3.4" />
    </svg>
  );
}

export default function AirlineDirectory({ rows }: { rows: DirectoryRow[] }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const [sort, setSort] = useState<SortId>("best");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // The ?q= deep link (used by the SearchAction schema) is read after mount so the page itself
  // stays fully static; the first paint is the unfiltered directory either way.
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q");
    if (initial) setQ(initial);
  }, []);

  const counts = useMemo(() => {
    const out = {} as Record<FilterId, number>;
    for (const f of FILTERS) out[f.id] = rows.filter(f.test).length;
    return out;
  }, [rows]);

  const shown = useMemo(() => {
    const n = q.trim().toLowerCase();
    const test = FILTERS.find((f) => f.id === filter)!.test;
    const out = rows.filter(
      (r) => test(r) && (!n || r.airline.toLowerCase().includes(n) || r.code.toLowerCase() === n)
    );
    out.sort(SORTS.find((s) => s.id === sort)!.cmp);
    return out;
  }, [rows, q, filter, sort]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    inputRef.current?.blur();
    listRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  return (
    <div>
      <form onSubmit={onSearch} className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label htmlFor="dir-q" className="sr-only">
          Search airlines
        </label>
        <input
          id="dir-q"
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${rows.length} airlines, e.g. Emirates or QR`}
          className="fld w-full min-w-0 rounded-xl border border-[var(--line)] bg-[var(--bg-raised)] px-4 py-3 text-[var(--ink)] placeholder:text-[var(--muted)] sm:flex-1"
        />
        <button
          type="submit"
          className="btn-cta inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold"
        >
          <SearchIcon />
          Search
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2 sm:justify-end">
        <p
          className="order-last mt-1 w-full text-sm text-[var(--muted)] sm:order-none sm:mt-0 sm:me-auto sm:w-auto"
          aria-live="polite"
        >
          {shown.length} {shown.length === 1 ? "airline" : "airlines"}
          {filter !== "all" ? ` · ${FILTERS.find((f) => f.id === filter)!.label}` : ""}
          {q.trim() ? ` · matching “${q.trim()}”` : ""}
        </p>
        <div className="flex flex-wrap gap-2 sm:justify-end" role="group" aria-label="Filter airlines">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className="fltr"
            >
              {f.label}
              <span className="fltr-n">{counts[f.id]}</span>
            </button>
          ))}
        </div>
        <label className="sort-ctl ms-1 inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--line)] px-3.5 py-[7px] text-[0.8125rem]">
          <span className="text-[var(--muted)]">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortId)}
            className="cursor-pointer border-0 bg-transparent text-[0.8125rem] font-medium text-[var(--ink)] outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <span className="info-wrap">
            <button type="button" className="info-btn" aria-label={`How ${SORTS.find((s) => s.id === sort)!.label} orders the list`}>
              i
            </button>
            <span role="tooltip" className="info-bub">
              {SORT_NOTE[sort]}
            </span>
          </span>
        </label>
      </div>

      <div className="dir-head" aria-hidden="true">
        <span>Airline</span>
        <span>Wi-Fi</span>
        <span>Starlink</span>
        <span>Best for</span>
        <span>Cost</span>
      </div>
      <ul ref={listRef} className="mt-4 min-[900px]:mt-1">
        {shown.map((r) => (
          <li key={r.code}>
            <Link href={`/airlines/${r.slug}/`} className="dir-row">
              <span className="dir-name">{r.airline}</span>
              <span className="dir-meta">
                <span className="dir-verdict">
                  <span className={`v v-${r.cls}`}>{r.label}</span>
                </span>
                <span className="dir-star">
                  {r.starlink ? (
                    <span className={`star-badge star-${r.starlink}`}>
                      {r.starlink === "flying" ? "Flying" : "Announced"}
                    </span>
                  ) : (
                    <span className="text-[var(--muted)]">—</span>
                  )}
                </span>
                <span className="dir-best">{r.bestFor}</span>
                <span className="dir-cost">{r.cost ?? "—"}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {!shown.length ? (
        <p className="mt-6 text-[var(--muted)]">
          No airline matches that. If it flies and we missed it, <Link href="/contact/">tell us</Link>.
        </p>
      ) : null}
    </div>
  );
}
