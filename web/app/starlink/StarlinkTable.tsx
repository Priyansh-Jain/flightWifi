"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import type { StarlinkTableRow } from "@/lib/derive";

type StatusId = "flying" | "announced" | "all";
type CostId = "any" | "free" | "free_with_account" | "paid";
type CoverId = "any" | "whole" | "partial";
type SortId = "coverage" | "updated" | "cost" | "az";
type Test = (r: StarlinkTableRow) => boolean;

// The line between a passenger aircraft carrying Starlink today and a signed contract with nothing
// in the air is the reason this page exists, so it is the primary control, it defaults to what is
// flying, and every row repeats the answer as a coloured status instead of relying on which section
// the reader scrolled past.
const STATUS: { id: StatusId; label: string; dot: string | null; test: Test }[] = [
  { id: "flying", label: "Flying today", dot: "fast", test: (r) => r.status === "flying" },
  { id: "announced", label: "Announced", dot: "part", test: (r) => r.status === "announced" },
  { id: "all", label: "All", dot: null, test: () => true }
];

// Behind "which airlines have Starlink" sits "can I get it on my flight", and two things decide
// that: whether it costs anything, and whether every aircraft has it or only the converted tails.
// Coverage only means something for a fleet that is flying it, so that group hides on Announced.
const COST: { id: CostId; label: string; test: Test }[] = [
  { id: "any", label: "Any cost", test: () => true },
  { id: "free", label: "Free", test: (r) => r.access === "free" },
  { id: "free_with_account", label: "Free with account", test: (r) => r.access === "free_with_account" },
  { id: "paid", label: "Paid", test: (r) => r.access === "paid" }
];

const COVER: { id: CoverId; label: string; test: Test }[] = [
  { id: "any", label: "Any coverage", test: () => true },
  { id: "whole", label: "Whole fleet", test: (r) => r.status === "flying" && r.fleetwide },
  { id: "partial", label: "Partial rollout", test: (r) => r.status === "flying" && !r.fleetwide }
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
  const [status, setStatus] = useState<StatusId>("flying");
  const [cost, setCost] = useState<CostId>("any");
  const [cover, setCover] = useState<CoverId>("any");
  const [sort, setSort] = useState<SortId>("coverage");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const statusTest = STATUS.find((s) => s.id === status)!.test;
  const costTest = COST.find((c) => c.id === cost)!.test;
  const coverTest = status === "announced" ? COVER[0].test : COVER.find((c) => c.id === cover)!.test;

  const statusCounts = useMemo(() => {
    const out = {} as Record<StatusId, number>;
    for (const s of STATUS) out[s.id] = rows.filter(s.test).length;
    return out;
  }, [rows]);

  // Refinement counts answer "how many of the ones I am looking at", so they are taken inside the
  // current status, and each group is counted with the other group applied.
  const costCounts = useMemo(() => {
    const out = {} as Record<CostId, number>;
    for (const c of COST) out[c.id] = rows.filter((r) => statusTest(r) && coverTest(r) && c.test(r)).length;
    return out;
  }, [rows, statusTest, coverTest]);

  const coverCounts = useMemo(() => {
    const out = {} as Record<CoverId, number>;
    for (const c of COVER) out[c.id] = rows.filter((r) => statusTest(r) && costTest(r) && c.test(r)).length;
    return out;
  }, [rows, statusTest, costTest]);

  // Every row stays in the document and non-matching ones are hidden, rather than filtered out of
  // the list. The page is statically exported with "Flying today" selected, and dropping the
  // announced rows from the markup would drop 21 airline links from the page a crawler sees.
  const sorted = useMemo(() => [...rows].sort(SORTS.find((s) => s.id === sort)!.cmp), [rows, sort]);

  const visible = useMemo(() => {
    const n = q.trim().toLowerCase();
    const out = new Set<string>();
    for (const r of rows) {
      if (!statusTest(r) || !costTest(r) || !coverTest(r)) continue;
      if (n && !r.airline.toLowerCase().includes(n) && r.code.toLowerCase() !== n) continue;
      out.add(r.code);
    }
    return out;
  }, [rows, q, statusTest, costTest, coverTest]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    inputRef.current?.blur();
    listRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  const pickStatus = (id: StatusId) => {
    setStatus(id);
    if (id === "announced") setCover("any");
  };

  const summary = [
    `${visible.size} ${visible.size === 1 ? "airline" : "airlines"}`,
    STATUS.find((s) => s.id === status)!.label,
    cost !== "any" ? COST.find((c) => c.id === cost)!.label : null,
    status !== "announced" && cover !== "any" ? COVER.find((c) => c.id === cover)!.label : null,
    q.trim() ? `matching “${q.trim()}”` : null
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div>
      <div className="seg-wrap">
        <div className="seg" role="group" aria-label="Starlink status">
          {STATUS.map((s) => (
            <button key={s.id} type="button" className="seg-btn" aria-pressed={status === s.id} onClick={() => pickStatus(s.id)}>
              {s.dot ? <span className={`seg-dot dot-${s.dot}`} aria-hidden="true" /> : null}
              {s.label}
              <span className="seg-n">{statusCounts[s.id]}</span>
            </button>
          ))}
        </div>
        <p className="text-sm text-[var(--muted)]" aria-live="polite">
          {summary}
        </p>
      </div>

      <div className="refine" role="group" aria-label="Filter by cost">
        <span className="refine-lbl">Cost</span>
        {COST.map((c) => (
          <button key={c.id} type="button" className="fltr" aria-pressed={cost === c.id} onClick={() => setCost(c.id)}>
            {c.label}
            <span className="fltr-n">{costCounts[c.id]}</span>
          </button>
        ))}
      </div>
      {status !== "announced" ? (
        <div className="refine" role="group" aria-label="Filter by fleet coverage">
          <span className="refine-lbl">Coverage</span>
          {COVER.map((c) => (
            <button key={c.id} type="button" className="fltr" aria-pressed={cover === c.id} onClick={() => setCover(c.id)}>
              {c.label}
              <span className="fltr-n">{coverCounts[c.id]}</span>
            </button>
          ))}
        </div>
      ) : null}

      <form onSubmit={onSearch} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
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
        <label className="sort-ctl inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--line)] px-3.5 py-[7px] text-[0.8125rem]">
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
      </form>

      <div className="sl-head" aria-hidden="true">
        <span>Airline</span>
        <span>Starlink</span>
        <span>Aircraft coverage</span>
        <span>Wi-Fi</span>
        <span>Cost</span>
      </div>
      <ul ref={listRef} className="mt-4 min-[900px]:mt-1">
        {sorted.map((r) => (
          <li key={r.code} hidden={!visible.has(r.code)}>
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
      {!visible.size ? (
        <p className="mt-6 text-[var(--muted)]">
          No Starlink airline matches that. If one is flying it and we missed it, <Link href="/contact/">tell us</Link>.
        </p>
      ) : null}
    </div>
  );
}
