// Data layer for the MCP endpoint.
//
// The pages read the registry off disk through lib/extension.ts, which only works because they are
// rendered at build time. This route is dynamic, so it rebuilds the same bridge from the snapshot
// scripts/gen-mcp.mjs writes into the bundle. Same registry, same core.js verdict logic, no second
// implementation to keep in step.
import bridgeData from "./bridge.json";

export type Rule = { fleet?: string; types?: string; provider?: string; orbit?: string };

export type StarlinkFact = {
  status: "flying" | "announced" | "none";
  access: "free" | "free_with_account" | "paid" | "unannounced";
  progress?: {
    done?: number;
    of?: number;
    pct?: number;
    scope: string;
    as_of: string;
    basis: "airline" | "provider" | "trade" | "tracker";
    source?: string;
  };
  milestones?: { date: string; text: string; source?: string }[];
};

export type Entry = {
  airline: string;
  rules: Rule[];
  access?: string;
  confidence?: string;
  as_of?: string;
  sources?: string[];
  needs_verification?: boolean;
  starlink?: StarlinkFact;
};

type Verdict = {
  cls: string;
  key: string;
  label: string;
  why?: string;
  latency?: string | null;
  provider?: string | null;
  orbit?: string | null;
};

type Bridge = {
  verdictFor: (code: string, aircraftText: string, signal: string) => Verdict | null;
  fleetVerdict: (codes: string[]) => Verdict | null;
  accessPoints: (text: string, cost: unknown) => string[];
  costOf: (text: string) => string | null;
  classifyOrbit: (orbit?: string) => string;
  CALL_POLICY: Record<string, { calls: string; check?: boolean }>;
  CALL_POLICY_TEXT: Record<string, string>;
  CAPABILITY: Record<string, { good: string[]; bad: string[] }>;
  VERDICT_UI: Record<string, { cls: string; label: string; why: string; latency: string | null }>;
};

const snapshot = bridgeData as unknown as {
  compiled: string;
  as_of: string;
  registry: Record<string, Entry>;
  core: string;
};

export const REGISTRY: Record<string, Entry> = snapshot.registry;
export const AS_OF = snapshot.as_of;
export const COMPILED = snapshot.compiled;

let cached: Bridge | null = null;
function bridge(): Bridge {
  if (cached) return cached;
  const build = new Function(
    "WIFI_REGISTRY",
    `${snapshot.core}
    return { verdictFor, fleetVerdict, accessPoints, costOf, classifyOrbit, CALL_POLICY, CALL_POLICY_TEXT, CAPABILITY, VERDICT_UI };`
  );
  cached = build(REGISTRY) as Bridge;
  return cached;
}

export const DISCLAIMER =
  "Verdicts describe the connectivity system fitted to the aircraft, not the speed you will get in a full cabin. On a fleet mid-retrofit the aircraft decides, so confirm the aircraft type on your booking. Every claim is dated; re-check before you rely on it.";

/* ---------- resolving what the caller typed ---------- */

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/\b(airlines?|airways?|air ?ways|group|company|co)\b/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();

// Callers pass "QR", "Qatar", "Qatar Airways" or "qatar airways". Exact IATA first, because a
// two-letter code is unambiguous and some codes are also words. Then exact name, then a contained
// match, and only one candidate counts: "air" would otherwise match sixty carriers.
export function resolveAirline(q: string): { code: string; entry: Entry } | null {
  const raw = q.trim();
  if (!raw) return null;
  const upper = raw.toUpperCase();
  if (upper.length === 2 && REGISTRY[upper]) return { code: upper, entry: REGISTRY[upper] };

  const n = norm(raw);
  if (!n) return null;
  const all = Object.entries(REGISTRY);
  const exact = all.find(([, e]) => norm(e.airline) === n);
  if (exact) return { code: exact[0], entry: exact[1] };

  const starts = all.filter(([, e]) => norm(e.airline).startsWith(n));
  if (starts.length === 1) return { code: starts[0][0], entry: starts[0][1] };

  const contains = all.filter(([, e]) => norm(e.airline).includes(n));
  if (contains.length === 1) return { code: contains[0][0], entry: contains[0][1] };
  return null;
}

// Levenshtein, capped: a caller who types "quatar" should get Qatar back rather than nothing, and
// an unresolvable name should still leave the model something to retry with.
function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 3) return 99;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = row;
  }
  return prev[b.length];
}

export function airlineSuggestions(q: string, n = 6): string[] {
  const t = norm(q);
  if (!t) return [];
  const scored: { label: string; score: number }[] = [];
  for (const [code, e] of Object.entries(REGISTRY)) {
    const name = norm(e.airline);
    const label = `${e.airline} (${code})`;
    if (name.includes(t) || t.includes(name)) {
      scored.push({ label, score: 0 });
      continue;
    }
    const d = editDistance(t, name);
    // allow roughly one typo per four characters, so short names are not matched loosely
    if (d <= Math.max(1, Math.floor(t.length / 4))) scored.push({ label, score: d });
  }
  return scored
    .sort((a, b) => a.score - b.score || a.label.localeCompare(b.label))
    .slice(0, n)
    .map((x) => x.label);
}

/* ---------- shaping an answer ---------- */

// The registry stores a rollout as {done, of, pct, basis}. Both tools publish the same renamed
// shape, so it is built in one place: emitting the raw field names from one tool and the renamed
// ones from the other is exactly the mismatch the output schema rejects.
function normProgress(p: NonNullable<StarlinkFact["progress"]> | undefined) {
  if (!p) return null;
  return {
    aircraft_done: p.done ?? null,
    aircraft_total: p.of ?? null,
    percent: p.pct ?? (p.done && p.of ? Math.round((p.done / p.of) * 100) : null),
    scope: p.scope,
    counted_by: p.basis,
    as_of: p.as_of,
    source: p.source ?? null
  };
}

export function callsFor(code: string) {
  const b = bridge();
  const p = b.CALL_POLICY[code];
  if (!p) return null;
  return {
    policy: p.calls,
    stated: b.CALL_POLICY_TEXT[p.calls] ?? p.calls,
    from_airline_page: !p.check
  };
}

// One row per distinct rule, with the aircraft it covers written the way a booking prints them.
function ruleTypes(rule: Rule): string[] {
  if (!rule.types) return [];
  return rule.types
    .split("|")
    .map((t) => t.replace(/\[ -\]\?/g, " ").replace(/\\/g, "").trim())
    .filter(Boolean);
}

const FLEET_SCOPE: Record<string, string> = {
  all: "Whole fleet",
  widebody: "Widebodies",
  narrowbody: "Narrowbodies",
  most: "Most of the fleet",
  rollout: "Aircraft being fitted"
};

export function fleetBreakdown(code: string) {
  const entry = REGISTRY[code];
  const b = bridge();
  return entry.rules.map((rule) => {
    const types = ruleTypes(rule);
    const probe = types[0] ?? "";
    const v = b.verdictFor(code, probe, "nodata");
    return {
      aircraft: types.length ? types : null,
      scope: types.length
        ? types.join(", ")
        : rule.fleet === "all" && entry.rules.length > 1
          ? "Rest of fleet"
          : (FLEET_SCOPE[rule.fleet ?? ""] ?? "Rest of fleet"),
      verdict: v?.label ?? "Not verified",
      verdict_key: v?.key ?? "UNKNOWN",
      system: rule.provider ?? null,
      orbit: rule.orbit ?? null,
      latency: v?.latency ?? null
    };
  });
}

export function airlineAnswer(code: string, aircraft?: string) {
  const entry = REGISTRY[code];
  const b = bridge();
  const asked = (aircraft ?? "").trim();
  const v = asked ? b.verdictFor(code, asked, "nodata") : b.fleetVerdict([code]);
  const cost = entry.access ? b.costOf(entry.access) : null;
  const cap = v ? b.CAPABILITY[v.key] : null;
  const sl = entry.starlink && entry.starlink.status !== "none" ? entry.starlink : null;

  return {
    found: true,
    airline: entry.airline,
    iata: code,
    asked_aircraft: asked || null,
    answer_level: asked ? "aircraft-specific" : "whole fleet",
    verdict: v?.label ?? "Not verified",
    verdict_key: v?.key ?? "UNKNOWN",
    what_it_means: v?.why ?? null,
    good_for: cap?.good ?? [],
    not_for: cap?.bad ?? [],
    system: v?.provider ?? null,
    orbit: v?.orbit ?? null,
    latency: v?.latency ?? null,
    cost,
    access: entry.access ?? null,
    access_points: entry.access ? b.accessPoints(entry.access, cost) : [],
    video_calls: callsFor(code),
    starlink: sl
      ? {
          status: sl.status,
          cost_tier: sl.access,
          whole_fleet: sl.status === "flying" && entry.rules.every((r) => (r.orbit ?? "").trim() === "LEO"),
          progress: normProgress(sl.progress),
          latest_milestone: sl.milestones?.length ? sl.milestones[sl.milestones.length - 1] : null
        }
      : null,
    by_aircraft: fleetBreakdown(code),
    confidence: entry.confidence ?? "reported",
    verification_pending: Boolean(entry.needs_verification),
    last_verified: entry.as_of ?? null,
    sources: entry.sources ?? [],
    details_url: `https://flightwifi.app/airlines/${slugFor(code)}/`
  };
}

// Mirrors lib/slugs.ts: the airline name lowercased and hyphenated, with the IATA code appended
// only when two carriers would otherwise collide.
let slugs: Record<string, string> | null = null;
function slugFor(code: string): string {
  if (!slugs) {
    slugs = {};
    const counts: Record<string, number> = {};
    for (const [c, e] of Object.entries(REGISTRY)) {
      const base = e.airline
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      counts[base] = (counts[base] ?? 0) + 1;
      slugs[c] = base;
    }
    for (const [c, base] of Object.entries(slugs)) {
      if (counts[base] > 1) slugs[c] = `${base}-${c.toLowerCase()}`;
    }
  }
  return slugs[code] ?? code.toLowerCase();
}

/* ---------- collections ---------- */

export function starlinkAirlines(status?: "flying" | "announced") {
  const rows = [];
  for (const [code, entry] of Object.entries(REGISTRY)) {
    const sl = entry.starlink;
    if (!sl || sl.status === "none") continue;
    if (status && sl.status !== status) continue;
    rows.push({
      airline: entry.airline,
      iata: code,
      status: sl.status,
      cost_tier: sl.access,
      whole_fleet: sl.status === "flying" && entry.rules.every((r) => (r.orbit ?? "").trim() === "LEO"),
      progress: normProgress(sl.progress),
      latest_milestone: sl.milestones?.length ? sl.milestones[sl.milestones.length - 1] : null,
      details_url: `https://flightwifi.app/airlines/${slugFor(code)}/`
    });
  }
  const order = { flying: 0, announced: 1 } as Record<string, number>;
  return rows.sort((a, b) => order[a.status] - order[b.status] || a.airline.localeCompare(b.airline));
}

// The same aircraft type carries different internet depending on who operates it, which is the
// thing travellers get wrong most often, so this answers per operator rather than per type.
export function aircraftAnswer(type: string) {
  const b = bridge();
  const rows = [];
  for (const [code, entry] of Object.entries(REGISTRY)) {
    const hasTyped = entry.rules.some((r) => r.types);
    if (!hasTyped) continue;
    const v = b.verdictFor(code, type, "nodata");
    if (!v) continue;
    const matches = entry.rules.some((r) => {
      if (!r.types) return false;
      try {
        return new RegExp(r.types, "i").test(type);
      } catch {
        return false;
      }
    });
    if (!matches) continue;
    rows.push({
      airline: entry.airline,
      iata: code,
      verdict: v.label,
      verdict_key: v.key,
      system: v.provider ?? null,
      orbit: v.orbit ?? null,
      last_verified: entry.as_of ?? null,
      details_url: `https://flightwifi.app/airlines/${slugFor(code)}/`
    });
  }
  const RANK: Record<string, number> = { fast: 0, ok: 1, part: 2, unknown: 3, none: 4 };
  return rows.sort(
    (a, b2) =>
      (RANK[verdictClass(a.verdict_key)] ?? 9) - (RANK[verdictClass(b2.verdict_key)] ?? 9) ||
      a.airline.localeCompare(b2.airline)
  );
}

// Best-verdict-first ordering, taken from core.js's own class for each key rather than a second
// copy of the mapping here.
function verdictClass(key: string): string {
  return bridge().VERDICT_UI[key]?.cls ?? "unknown";
}

export type Filters = {
  video_calls?: boolean;
  free?: boolean;
  starlink?: boolean;
  no_wifi?: boolean;
  limit?: number;
};

// A mid-retrofit fleet is the normal case, so a filter that only accepted airlines where every
// aircraft qualifies dropped Qatar, whose 777 genuinely carries a video call. Airlines where only
// part of the fleet qualifies are included and flagged, with the whole-fleet ones listed first, so
// a caller can still give the safe answer without the useful one disappearing.
export function findAirlines(f: Filters) {
  const b = bridge();
  const out = [];
  for (const [code, entry] of Object.entries(REGISTRY)) {
    const v = b.fleetVerdict([code]);
    const key = v?.key ?? "UNKNOWN";
    const cost = entry.access ? b.costOf(entry.access) : null;
    const sl = entry.starlink;
    const calls = b.CALL_POLICY[code];

    const fastKeys = ["LEO", "MEO"];
    const everyAircraftFast = fastKeys.includes(key);
    const someAircraftFast =
      everyAircraftFast ||
      entry.rules.some((r) => fastKeys.includes(b.classifyOrbit(r.orbit)));

    if (f.no_wifi && !entry.rules.every((r) => (r.orbit ?? "") === "NONE")) continue;
    if (f.starlink && !(sl && sl.status === "flying")) continue;
    if (f.free && cost !== "Free") continue;
    if (f.video_calls && (!someAircraftFast || calls?.calls === "no")) continue;

    out.push({
      airline: entry.airline,
      iata: code,
      verdict: v?.label ?? "Not verified",
      verdict_key: key,
      cost,
      starlink: sl && sl.status !== "none" ? sl.status : null,
      video_calls: calls?.calls ?? null,
      on_every_aircraft: everyAircraftFast,
      last_verified: entry.as_of ?? null,
      details_url: `https://flightwifi.app/airlines/${slugFor(code)}/`
    });
  }
  out.sort(
    (a, b2) =>
      Number(b2.on_every_aircraft) - Number(a.on_every_aircraft) || a.airline.localeCompare(b2.airline)
  );
  return f.limit && f.limit > 0 ? out.slice(0, f.limit) : out;
}

export function registryStats() {
  const all = Object.values(REGISTRY);
  const sl = all.filter((e) => e.starlink && e.starlink.status !== "none");
  return {
    airlines: all.length,
    sources: all.reduce((n, e) => n + (e.sources?.length ?? 0), 0),
    sourced_to_official_pages: all.filter((e) => e.confidence === "sourced").length,
    starlink_flying: sl.filter((e) => e.starlink!.status === "flying").length,
    starlink_announced: sl.filter((e) => e.starlink!.status === "announced").length,
    no_wifi: all.filter((e) => e.rules.every((r) => (r.orbit ?? "") === "NONE")).length,
    last_verified: AS_OF,
    compiled: COMPILED
  };
}
