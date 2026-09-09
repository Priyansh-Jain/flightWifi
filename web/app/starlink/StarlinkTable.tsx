"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import type { StarlinkTableRow } from "@/lib/derive";

type FilterId = "all" | "flying" | "announced";
type SortId = "coverage" | "updated" | "cost" | "az";

const FILTERS: { id: FilterId; label: string; test: (r: StarlinkTableRow) => boolean }[] = [
  { id: "all", label: "All", test: () => true },
  { id: "flying", label: "Flying", test: (r) => r.status === "flying" },
  { id: "announced", label: "Announced", test: (r) => r.status === "announced" }
];

const STATUS_RANK: Record<string, number> = { flying: 0, announced: 1 };
const COST_RANK: Record<string, number> = { free: 0, free_with_account: 1, paid: 2, unannounced: 3 };

const byName = (a: StarlinkTableRow, b: StarlinkTableRow) => a.airline.localeCompare(b.airline);
const byStatus = (a: StarlinkTableRow, b: StarlinkTableRow) => STATUS_RANK[a.status] - STATUS_RANK[b.status];

// Whole-fleet carriers outrank a measured percentage, a measured percentage outranks a rollout with
// no published count, and announced deals sit last. Nothing here guesses a number.
function coverageScore(r: StarlinkTableRow): number {
  if (r.status !== "flying") return -2;
  if (r.fleetwide) return 101;
  if (r.pct !== null) return r.pct;
  return -1;
}

const SORTS: { id: SortId; label: string; cmp: (a: StarlinkTableRow, b: StarlinkTableRow) => number }[] = [
  { id: "coverage", label: "Coverage", cmp: (a, b) => coverageScore(b) - coverageScore(a) || byName(a, b) },
  { id: "updated", label: "Recently updated", cmp: (a, b) => b.updated.localeCompare(a.updated) || byStatus(a, b) || byName(a, b) },
  {
    id: "cost",
    label: "Cheapest first",
    cmp: (a, b) => byStatus(a, b) || (COST_RANK[a.access] ?? 4) - (COST_RANK[b.access] ?? 4) || coverageScore(b) - coverageScore(a) || byName(a, b)
  },
  { id: "az", label: "A to Z", cmp: byName }
];

const SORT_NOTE: Record<SortId, string> = {
  coverage: "Whole fleets first, then the highest published share of the fleet, then rollouts with no published count, then announced deals.",
  updated: "Most recent dated change first, from the airline's own milestones in the registry.",
  cost: "Flying airlines first: free for everyone, then free with a free account, then paid. Announced deals follow in the same order.",
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

function Coverage({ r }: { r: StarlinkTableRow }) {
  if (r.status === "announced") {
    return (
      <span className="sl-cov">
        <span className="sl-cov-line">
          <span className="sl-cov-num">Not flying yet</span>
        </span>
        <span className="sl-cov-scope">{r.detail}</span>
      </span>
    );
  }
  if (r.fleetwide) {
    return (
      <span className="sl-cov">
        <span className="sl-cov-line">
          <span className="sl-cov-num">Whole fleet</span>
        </span>
        <span className="sl-bar" aria-hidden="true">
          <span className="sl-fill is-done" style={{ width: "100%" }} />
        </span>
      </span>
    );
  }
  if (r.progress && r.pct !== null) {
    const p = r.progress;
    const count = typeof p.done === "number" && typeof p.of === "number" ? `${p.done} of ${p.of}` : typeof p.done === "number" ? `${p.done} aircraft` : null;
    return (
      <span className="sl-cov">
        <span className="sl-cov-line">
          <span className="sl-cov-num">
            {r.pct}%{count ? ` · ${count}` : ""}
          </span>
          <span className="sl-cov-scope">{p.scope}</span>
        </span>
        <span className="sl-bar" aria-hidden="true">
          <span className={`sl-fill${r.pct >= 100 ? " is-done" : ""}${p.basis === "tracker" ? " is-tracker" : ""}`} style={{ width: `${r.pct}%` }} />
        </span>
      </span>
    );
  }
  return (
    <span className="sl-cov">
      <span className="sl-cov-line">
        <span className="sl-cov-num">Rolling out</span>
      </span>
      <span className="sl-cov-scope">{r.detail}</span>
    </span>
  );
}

export default function StarlinkTable({ rows }: { rows: StarlinkTableRow[] }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const [sort, setSort] = useState<SortId>("coverage");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const counts = useMemo(() => {
    const out = {} as Record<FilterId, number>;
    for (const f of FILTERS) out[f.id] = rows.filter(f.test).length;
    return out;
  }, [rows]);

  const shown = useMemo(() => {
    const n = q.trim().toLowerCase();
    const test = FILTERS.find((f) => f.id === filter)!.test;
    const out = rows.filter((r) => test(r) && (!n || r.airline.toLowerCase().includes(n) || r.code.toLowerCase() === n));
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
        <label htmlFor="sl-q" className="sr-only">
          Search Starlink airlines
        </label>
        <input
          id="sl-q"
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${rows.length} Starlink airlines, e.g. Qatar or UA`}
          className="fld w-full min-w-0 rounded-xl border border-[var(--line)] bg-[var(--bg-raised)] px-4 py-3 text-[var(--ink)] placeholder:text-[var(--muted)] sm:flex-1"
        />
        <button type="submit" className="btn-cta inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold">
          <SearchIcon />
          Search
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2 sm:justify-end">
        <p className="order-last mt-1 w-full text-sm text-[var(--muted)] sm:order-none sm:mt-0 sm:me-auto sm:w-auto" aria-live="polite">
          {shown.length} {shown.length === 1 ? "airline" : "airlines"}
          {filter !== "all" ? ` · ${FILTERS.find((f) => f.id === filter)!.label}` : ""}
          {q.trim() ? ` · matching “${q.trim()}”` : ""}
        </p>
        <div className="flex flex-wrap gap-2 sm:justify-end" role="group" aria-label="Filter Starlink airlines">
          {FILTERS.map((f) => (
            <button key={f.id} type="button" onClick={() => setFilter(f.id)} aria-pressed={filter === f.id} className="fltr">
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

      <div className="sl-head" aria-hidden="true">
        <span>Airline</span>
        <span>Starlink</span>
        <span>Aircraft coverage</span>
        <span>Wi-Fi</span>
        <span>Cost</span>
      </div>
      <ul ref={listRef} className="mt-4 min-[900px]:mt-1">
        {shown.map((r) => (
          <li key={r.code}>
            <Link href={`/airlines/${r.slug}/`} className="sl-row">
              <span className="sl-name">{r.airline}</span>
              <span className="sl-meta">
                <span className="sl-status">
                  <span className={`star-badge star-${r.status}`}>{r.status === "flying" ? "Flying" : "Announced"}</span>
                </span>
                <Coverage r={r} />
                <span className="sl-verdict">
                  <span className={`v v-${r.wifiCls}`}>{r.wifiLabel}</span>
                  {r.status === "announced" ? <span className="ms-2 text-[var(--muted)]">today</span> : null}
                </span>
                <span className="sl-cost">{r.status === "announced" ? `${r.cost} at launch` : r.cost}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {!shown.length ? (
        <p className="mt-6 text-[var(--muted)]">
          No Starlink airline matches that. If one is flying it and we missed it, <Link href="/contact/">tell us</Link>.
        </p>
      ) : null}
    </div>
  );
}
