import fs from "node:fs";
import path from "node:path";

// The site and the extension must never disagree about a flight. Rather than porting the verdict
// rules into TypeScript and letting the two copies drift, this evaluates the extension's own
// source at build time: registry.js for the data, and the DOM-free head of core.js for the logic
// that turns a rule into a verdict. Everything below the hover-card marker touches the DOM, so the
// file is sliced there, exactly as test/name-resolution.js has always done it.
const EXT = path.join(process.cwd(), "..", "extension");

export type Rule = {
  fleet?: string;
  types?: string;
  provider?: string;
  orbit?: string;
};

export type StarlinkFact = {
  status: "flying" | "announced" | "none";
  access: "free" | "free_with_account" | "paid" | "unannounced";
};

export type Entry = {
  airline: string;
  rules: Rule[];
  access?: string;
  confidence?: "sourced" | "reported" | string;
  as_of?: string;
  sources?: string[];
  needs_verification?: boolean;
  starlink?: StarlinkFact;
};

export type Verdict = {
  cls: "fast" | "ok" | "part" | "none" | "unknown";
  key: string;
  label: string;
  why?: string;
  latency?: string | null;
  provider?: string | null;
  orbit?: string | null;
  entry?: Entry | null;
};

type Bridge = {
  WIFI_REGISTRY: Record<string, Entry>;
  verdictFor: (code: string, aircraftText: string, signal: string) => Verdict | null;
  classifyOrbit: (orbit?: string) => string;
  providerLine: (rules: Rule[]) => string;
  fleetVerdict: (codes: string[]) => Verdict | null;
  accessPoints: (text: string, cost: unknown) => string[];
  costOf: (text: string) => string | null;
  VERDICT_UI: Record<string, { cls: string; label: string; why: string; latency: string | null }>;
  CALL_POLICY: Record<string, { calls: string; check?: boolean }>;
  CAPABILITY: Record<string, { good: string[]; bad: string[] }>;
  CALL_POLICY_TEXT: Record<string, string>;
  cleanProvider: (p: string) => string;
  decorate: (key: string, extra: object) => RawVerdict;
  rollup: (keys: string[]) => string;
};

type RawVerdict = Verdict & {
  aircraft?: string;
  fleetwide?: boolean;
  code?: string;
  legs?: { code?: string; entry: Entry; key: string }[];
  aircraftNote?: string;
  noExpand?: boolean;
  expandHint?: string;
  conflict?: boolean;
  viaGoogle?: boolean;
  unresolvedOperator?: string;
};

export type TipRow = {
  k: string;
  v?: string;
  caps?: { kind: "good" | "bad"; items: string[] };
  cost?: { cost: string | null; pts: string[] };
};

export type TipData = {
  cls: string;
  label: string;
  why: string;
  legs?: { airline: string; cls: string; label: string }[];
  rows: TipRow[];
  notes: string[];
  info: string;
  src: string;
  latency: string | null;
};

let cached: Bridge | null = null;

function load(): Bridge {
  if (cached) return cached;

  const registrySrc = fs.readFileSync(path.join(EXT, "data", "registry.js"), "utf8");
  const registry = JSON.parse(
    registrySrc.slice(
      registrySrc.indexOf("{"),
      registrySrc.lastIndexOf("};", registrySrc.indexOf("const VERDICTS")) + 1
    )
  ) as Record<string, Entry>;

  const coreSrc = fs.readFileSync(path.join(EXT, "core.js"), "utf8");
  const head = coreSrc.slice(0, coreSrc.indexOf("/* ---------- hover card ----------"));

  const build = new Function(
    "WIFI_REGISTRY",
    `${head}
    return { verdictFor, classifyOrbit, providerLine, fleetVerdict, accessPoints, costOf, VERDICT_UI, CALL_POLICY, CAPABILITY, CALL_POLICY_TEXT, cleanProvider, decorate, rollup };`
  );

  cached = { WIFI_REGISTRY: registry, ...build(registry) } as Bridge;
  return cached;
}

export function registry(): Record<string, Entry> {
  return load().WIFI_REGISTRY;
}

export function codes(): string[] {
  const reg = registry();
  return Object.keys(reg).sort((a, b) => reg[a].airline.localeCompare(reg[b].airline));
}

export function entryFor(code: string): Entry | undefined {
  return registry()[code.toUpperCase()];
}

export function verdict(code: string, aircraft = ""): Verdict | null {
  return load().verdictFor(code.toUpperCase(), aircraft, "nodata");
}

// Fleet-level chips must use the same rollup the extension shows on results lists; probing
// verdictFor with an empty aircraft skips typed rules entirely and misreads all-typed entries.
export function fleetVerdict(code: string): Verdict | null {
  return load().fleetVerdict([code.toUpperCase()]);
}

export function orbitClass(orbit?: string): string {
  return load().classifyOrbit(orbit);
}

export function providerLine(rules: Rule[]): string {
  return load().providerLine(rules);
}

export function accessPoints(access?: string): string[] {
  if (!access) return [];
  const b = load();
  return b.accessPoints(access, b.costOf(access));
}

export function callPolicy(code: string) {
  return load().CALL_POLICY[code.toUpperCase()] ?? null;
}

export function callPolicyText(calls: string): string {
  return load().CALL_POLICY_TEXT[calls] ?? "";
}

export function costOf(access?: string): string | null {
  return access ? load().costOf(access) : null;
}

export function capability(key: string): { good: string[]; bad: string[] } | null {
  return load().CAPABILITY[key] ?? null;
}

// The aircraft a rule covers are stored as a regex alternation ("777|A350|787"). For a page we want
// them back as the plain type names Google prints, which is what the alternation branches already
// are, minus the character-class escapes a few tokens carry ("Dash[ -]?8").
export function ruleTypes(rule: Rule): string[] {
  if (!rule.types) return [];
  return rule.types
    .split("|")
    .map((t) => t.replace(/\[ -\]\?/g, " ").replace(/\\/g, "").trim())
    .filter(Boolean);
}

// Registry rules are an ordered, most-cautious-wins ruleset, not a partition of the fleet: more than
// one rule can name the same aircraft. Printing them 1:1 gave a reader two different answers for one
// type. So every type token is resolved through the extension's own pickRule and tokens that land on
// the same winning rule share a row, with the System text taken from the rule that actually won.
const FLEET_SCOPE: Record<string, string> = {
  widebody: "Widebodies",
  narrowbody: "Narrowbodies",
  most: "Most of the fleet",
  rollout: "Aircraft being fitted"
};

// An untyped fleet:"all" rule is the remainder the other rules have not claimed, so calling it
// "Whole fleet" contradicts them. It only covers the whole fleet when it is the only rule.
function untypedScope(rule: Rule, ruleCount: number): string {
  if (rule.fleet === "all") return ruleCount === 1 ? "Whole fleet" : "Rest of fleet";
  return FLEET_SCOPE[rule.fleet ?? ""] ?? "Rest of fleet";
}

export function fleetRows(code: string) {
  const entry = entryFor(code);
  if (!entry) return [];
  const ui = load().VERDICT_UI;
  const rows: {
    rule: Rule;
    types: string[];
    scope: string;
    key: string;
    label: string;
    cls: string;
    provider: string;
  }[] = [];

  const tokens: string[] = [];
  for (const rule of entry.rules) {
    for (const t of ruleTypes(rule)) if (!tokens.includes(t)) tokens.push(t);
  }

  const groups = new Map<string, { types: string[]; label: string; cls: string; provider: string; orbit: string }>();
  for (const t of tokens) {
    const v = verdict(code, t);
    const provider = v?.provider ?? "";
    const orbit = v?.orbit ?? "";
    const key = `${orbit}|${provider}`;
    const g = groups.get(key);
    if (g) g.types.push(t);
    else
      groups.set(key, {
        types: [t],
        label: v?.label ?? "Not verified",
        cls: v?.cls ?? "unknown",
        provider,
        orbit
      });
  }
  for (const g of groups.values()) {
    rows.push({
      rule: { types: g.types.join("|"), provider: g.provider, orbit: g.orbit },
      types: g.types,
      scope: g.types.join(", "),
      key: orbitClass(g.orbit),
      label: g.label,
      cls: g.cls,
      provider: g.provider
    });
  }

  const untyped = entry.rules.filter((r) => !r.types);
  for (const rule of untyped) {
    const k = orbitClass(rule.orbit);
    rows.push({
      rule,
      types: [],
      scope: untypedScope(rule, entry.rules.length),
      key: k,
      label: ui[k]?.label ?? "Not verified",
      cls: ui[k]?.cls ?? "unknown",
      provider: rule.provider ?? ""
    });
  }
  return rows;
}

// A typed rule can lose every one of its aircraft to a more cautious rule, which is how a signed
// rollout disappears from the table. Those belong under it as context, never as a current verdict.
export function fleetNotes(code: string): string[] {
  const entry = entryFor(code);
  if (!entry) return [];
  const shown = new Set(fleetRows(code).map((r) => r.provider));
  return entry.rules
    .filter((r) => r.types && r.provider && !shown.has(r.provider))
    .map((r) => r.provider as string);
}

export type StarlinkRow = {
  code: string;
  airline: string;
  status: "flying" | "announced";
  detail: string;
  access: StarlinkFact["access"];
  fleetwide: boolean;
};

// The differentiator: not "which airlines signed a Starlink deal", but how far each one has actually
// got. Neither half of that can be read off the orbit token, because "mixed GEO/LEO" is used both
// for fleets with converted tails flying and for fleets whose first install is years out, and the
// access prose mixes present terms with future promises ("paid today ... free once service starts").
// Both now come from explicit per-airline fields in the registry, set from the same sources.
export function starlinkRows(): StarlinkRow[] {
  const reg = registry();
  const rows: StarlinkRow[] = [];
  for (const [code, entry] of Object.entries(reg)) {
    const sl = entry.starlink;
    if (!sl || sl.status === "none") continue;
    const mentions = entry.rules.filter((r) => /starlink/i.test(`${r.provider ?? ""}`));
    const inService = mentions.filter((r) => /LEO/.test(r.orbit ?? ""));
    const src = (sl.status === "flying" ? inService[0] : null) ?? mentions[0];
    // a couple of carriers carry the deal only in their access line, because no rule of theirs has
    // changed yet; dropping them would hide exactly the "signed, nothing flying" case this tracks
    const fromAccess = (entry.access ?? "")
      .split(";")
      .map((c) => c.trim())
      .find((c) => /starlink/i.test(c));
    rows.push({
      code,
      airline: entry.airline,
      status: sl.status,
      detail: src?.provider ?? fromAccess ?? entry.access ?? "",
      access: sl.access,
      fleetwide: sl.status === "flying" && entry.rules.every((r) => /LEO/.test(r.orbit ?? ""))
    });
  }
  const order = { flying: 0, announced: 1 };
  return rows.sort(
    (a, b) => order[a.status] - order[b.status] || a.airline.localeCompare(b.airline)
  );
}

// What the reader is deciding is whether they pay, so the free tiers that need a free account are
// worth separating from the ones that need nothing. Announced rows never render as a present-tense
// price: at most they carry the terms the airline has promised for launch.
export const STARLINK_ACCESS_UI: Record<
  StarlinkFact["access"],
  { flying: { cls: string; label: string }; announced: string }
> = {
  free: { flying: { cls: "fast", label: "Free" }, announced: "Free" },
  free_with_account: {
    flying: { cls: "fast", label: "Free with account" },
    announced: "Free with account"
  },
  paid: { flying: { cls: "part", label: "Paid" }, announced: "Paid" },
  unannounced: { flying: { cls: "unknown", label: "Not stated" }, announced: "Not announced" }
};

export function stats() {
  const reg = registry();
  const all = Object.values(reg);
  return {
    airlines: all.length,
    sourced: all.filter((e) => e.confidence === "sourced").length,
    sources: all.reduce((n, e) => n + (e.sources?.length ?? 0), 0),
    noWifi: all.filter((e) => e.rules.every((r) => r.orbit === "NONE")).length,
    asOf: all.map((e) => e.as_of).filter(Boolean).sort().pop() ?? ""
  };
}

function sourceLine(entries: Entry[]): string {
  const refs = entries.reduce((n, e) => n + (e.sources ? e.sources.length : 0), 0);
  const confidence = entries.some((e) => e.confidence === "reported") ? "reported" : "sourced";
  const pending = entries.some((e) => e.needs_verification);
  const asOf = entries.map((e) => e.as_of || "").sort()[0];
  return (
    `${confidence}${pending ? ", verification pending" : ""} · as of ${asOf}` +
    (refs ? ` · ${refs} ref${refs > 1 ? "s" : ""}` : "")
  );
}

function tipFromVerdict(v: RawVerdict): TipData {
  const b = load();
  const rows: TipRow[] = [];
  const multi = !!(v.legs && v.legs.length > 1);
  const cap = b.CAPABILITY[v.key];
  const policy = !multi && v.code ? b.CALL_POLICY[v.code] : null;
  if (cap && !multi) {
    if (cap.good.length) rows.push({ k: "Good for", caps: { kind: "good", items: cap.good } });
    if (cap.bad.length) rows.push({ k: "Not for", caps: { kind: "bad", items: cap.bad } });
  }
  if (policy && v.key !== "NONE") {
    rows.push({ k: "Calls", v: b.CALL_POLICY_TEXT[policy.calls] + (policy.check ? " (unconfirmed)" : "") });
  }
  if (!multi && v.entry) {
    const p = b.cleanProvider(v.provider || "");
    if (p && !/^none$/i.test(p)) rows.push({ k: v.key === "NONE" ? "Onboard" : "Provider", v: p });
  }
  rows.push({
    k: "Aircraft",
    v:
      v.aircraft ||
      (v.fleetwide
        ? v.aircraftNote || (v.noExpand ? "whole fleet, this view never names it" : "whole fleet, not named until you expand")
        : "not shown")
  });
  if (!multi && v.entry && v.entry.access) {
    const cost = b.costOf(v.entry.access);
    rows.push({ k: "Cost", cost: { cost, pts: b.accessPoints(v.entry.access, cost) } });
  }
  const notes: string[] = [];
  const fastLink = v.key === "LEO" || v.key === "MEO" || v.key === "VARIES";
  const says = policy && policy.check ? "is reported to restrict" : "restricts";
  if (policy && policy.calls === "no" && fastLink && v.entry) {
    notes.push(`📵 ${v.entry.airline} ${says} voice and video calls over wifi. The link can carry one; the airline is the limit.`);
  }
  if (policy && policy.calls === "voice" && fastLink && v.entry) {
    notes.push(`📵 ${v.entry.airline} permits voice calls but not video calls over wifi.`);
  }
  if (v.unresolvedOperator) {
    notes.push(`Flown by ${v.unresolvedOperator}, which is not in the registry yet. This is the marketing airline's fleet answer, not that operator's.`);
  }
  const info = !v.fleetwide
    ? ""
    : v.expandHint ||
      (v.noExpand
        ? "Fleet-level verdict. This view never names the aircraft, so the exact one flying is unknown."
        : multi
          ? "Each airline above is its whole fleet. Expand to see the aircraft actually flying each leg."
          : "Expand the flight for the verdict on the exact aircraft.");
  const src = multi
    ? sourceLine(v.legs!.map((l) => l.entry))
    : v.entry
      ? sourceLine([v.entry])
      : "Google's own amenity data, not our own verification";
  return {
    cls: v.cls,
    label: v.label,
    why: v.why || "",
    legs: multi ? v.legs!.map((l) => ({ airline: l.entry.airline, cls: b.VERDICT_UI[l.key].cls, label: b.VERDICT_UI[l.key].label })) : undefined,
    rows,
    notes,
    info,
    src,
    latency: v.latency ?? null
  };
}

// The hover card the extension shows for one results row, built the same way google.js builds it:
// one verdict per leg, rolled up when the legs disagree.
export function legsTip(legs: { code: string; aircraft?: string }[]): TipData | null {
  const b = load();
  const parts = legs.map((l) => ({ cc: l.code.toUpperCase(), ac: l.aircraft || "", v: b.verdictFor(l.code.toUpperCase(), l.aircraft || "", "nodata") as RawVerdict | null }));
  if (parts.some((p) => !p.v || !p.v.entry)) return null;
  if (parts.length === 1) return tipFromVerdict(parts[0].v!);
  const key = b.rollup(parts.map((p) => p.v!.key));
  const differ = new Set(parts.map((p) => p.v!.key)).size > 1;
  const v = b.decorate(differ && key === "PARTIAL" ? "LEG_PARTIAL" : key, {
    legs: parts.map((p) => ({ code: p.cc, entry: p.v!.entry, key: p.v!.key })),
    aircraft: parts.map((p) => p.ac).filter(Boolean).join(" · "),
    entry: null
  });
  return tipFromVerdict(v);
}
