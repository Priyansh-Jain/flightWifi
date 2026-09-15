import { STARLINK_ACCESS_UI, callLabel, callPolicy, capability, codes, costOf, entryFor, fleetRows, fleetVerdict, orbitClass, progressPct, registry, starlinkRows, verdict, verdictUi, type Entry, type Rule, type StarlinkFact, type StarlinkProgress } from "./extension";
import { slugForCode } from "./slugs";
import { regionOf } from "./regions";
import { CORROBORATING, PRIMARY, sourceKind } from "./sources";
import { SITE_LAUNCH } from "./site";

export type ProviderDef = {
  slug: string;
  name: string;
  match: RegExp;
  orbit: string;
  latency: string;
  summary: string;
  how: string[];
};

// General engineering facts only; the latency bands are the same ones the extension's tooltips
// state, so the site and the chips never quote different physics.
export const PROVIDERS: ProviderDef[] = [
  {
    slug: "starlink",
    name: "Starlink",
    match: /starlink/i,
    orbit: "Low Earth orbit (LEO), ~550 km",
    latency: "roughly 20-50 ms",
    summary:
      "SpaceX's low-orbit constellation. Low altitude keeps latency close to ground broadband, which is what makes video calls workable in the air.",
    how: [
      "Thousands of satellites in low orbit hand traffic between each other and ground stations, so the signal path stays short.",
      "Aircraft carry a flat phased-array antenna with no moving parts.",
      "Airlines almost always bundle it as free wifi, sometimes behind a free loyalty sign-in.",
      "The catch is retrofit pace: airlines announce fleet-wide deals but each aircraft is converted individually, so mid-rollout fleets are a coin toss."
    ]
  },
  {
    slug: "viasat",
    name: "Viasat",
    match: /viasat|amara/i,
    orbit: "Geostationary (GEO), ~35,786 km",
    latency: "roughly 600 ms and up",
    summary:
      "The largest GEO provider in aviation, now shipping its multi-orbit Amara platform. High capacity, but the round trip to a satellite parked 36,000 km up puts a floor under latency.",
    how: [
      "A handful of very large satellites each cover huge areas from a fixed point over the equator.",
      "Bandwidth is strong, so browsing, mail and even streaming work well.",
      "Latency is physics: the distance alone adds around half a second, which is why live video calls struggle.",
      "Amara adds LEO capacity from partner constellations on newer fits."
    ]
  },
  {
    slug: "panasonic",
    name: "Panasonic Avionics",
    match: /panasonic/i,
    orbit: "Geostationary (GEO), multi-orbit on new fits",
    latency: "roughly 600 ms and up on GEO",
    summary:
      "One of the two big legacy in-flight connectivity integrators. Runs GEO Ku-band capacity worldwide and is adding OneWeb LEO capacity on newer installations.",
    how: [
      "Leases capacity across many GEO satellites for global coverage.",
      "Deeply integrated with seatback entertainment systems on widebodies.",
      "Newer multi-orbit fits blend OneWeb low-orbit capacity for lower latency."
    ]
  },
  {
    slug: "intelsat",
    name: "Intelsat",
    match: /intelsat|2ku/i,
    orbit: "Geostationary (GEO), multi-orbit with OneWeb",
    latency: "roughly 600 ms and up on GEO",
    summary:
      "Runs the 2Ku system found across large North American fleets, and now sells a multi-orbit service that adds Eutelsat OneWeb low-orbit capacity.",
    how: [
      "2Ku uses a dual-antenna design over GEO Ku-band capacity.",
      "Multi-orbit electronically steered antennas switch between GEO and LEO.",
      "Commonly free-with-loyalty on North American carriers."
    ]
  },
  {
    slug: "ses",
    name: "SES / Open Orbits",
    match: /\bSES\b|mPOWER|open orbits/i,
    orbit: "Medium Earth orbit (MEO) + GEO",
    latency: "roughly 120-150 ms on MEO",
    summary:
      "The only operator flying a medium-orbit fleet, O3b mPOWER. MEO sits between GEO capacity and LEO latency, usually quick enough for a live call.",
    how: [
      "O3b mPOWER satellites orbit at ~8,000 km, cutting the round trip well below GEO.",
      "Sold to airlines through the Open Orbits alliance and partner integrators.",
      "Multi-orbit terminals blend GEO capacity with MEO latency."
    ]
  },
  {
    slug: "anuvu",
    name: "Anuvu",
    match: /anuvu/i,
    orbit: "Geostationary (GEO)",
    latency: "roughly 600 ms and up",
    summary:
      "Connectivity and content provider with GEO capacity, historically strong with fast-moving narrowbody fleets.",
    how: [
      "GEO Ku-band capacity with a content and entertainment business attached.",
      "Being displaced on some fleets by LEO retrofits."
    ]
  },
  {
    slug: "sita-onair",
    name: "SITA OnAir / Inmarsat GX",
    match: /sita|onair|GX Aviation|Inmarsat/i,
    orbit: "Geostationary (GEO) Ka-band",
    latency: "roughly 600 ms and up",
    summary:
      "The GX Aviation Ka-band network (now under Viasat ownership) delivered through SITA and other integrators, common outside North America.",
    how: [
      "Global Xpress Ka-band GEO satellites provide worldwide coverage.",
      "Often paired with mobile-network OnAir services for messaging tiers."
    ]
  },
  {
    slug: "oneweb",
    name: "Eutelsat OneWeb",
    match: /oneweb/i,
    orbit: "Low Earth orbit (LEO), ~1,200 km",
    latency: "roughly 70-100 ms",
    summary:
      "The second-largest LEO constellation, sold through integrators like Panasonic and Intelsat rather than directly to airlines.",
    how: [
      "Polar-orbit LEO fleet with strong high-latitude coverage.",
      "Reaches aircraft through multi-orbit terminals sold by partner integrators."
    ]
  },
  {
    slug: "kuiper",
    name: "Amazon Kuiper",
    match: /kuiper/i,
    orbit: "Low Earth orbit (LEO)",
    latency: "roughly 20-50 ms expected",
    summary:
      "Amazon's LEO constellation, contracted for aviation but not yet flying passengers. Its first airline installs are scheduled from 2027.",
    how: [
      "LEO constellation under active deployment.",
      "First airline commitment runs alongside existing GEO service as a hybrid."
    ]
  }
];

const FUTURE_RX = /not confirmed in service|not yet (?:switched on|in service|live|active|activated|confirmed|launched|flying)|installs? beginning 20\d\d|scheduled for 20\d\d/i;

export function providerAirlines(def: ProviderDef) {
  const out: { code: string; airline: string; scope: string; cls: string; label: string; inService: boolean }[] = [];
  for (const code of codes()) {
    const entry = entryFor(code)!;
    const rules = entry.rules.filter((r) => def.match.test(r.provider ?? ""));
    if (!rules.length) continue;
    const active = rules.find((r) => orbitClass(r.orbit) !== "NONE") ?? rules[0];
    const clauses = (active.provider ?? "").split(";").filter((c) => def.match.test(c));
    // Starlink has an explicit per-airline status in the registry, because its orbit token cannot
    // tell a converted tail from a contract that starts in 2027. Use it so this page and the
    // tracker can never disagree; other providers still fall back to reading the clause.
    const futureOnly =
      def.slug === "starlink"
        ? entry.starlink?.status !== "flying"
        : clauses.length > 0 && clauses.every((c) => FUTURE_RX.test(c));
    const types = active.types ? active.types.split("|")[0] : "";
    const v = active.types
      ? verdict(code, types.replace(/\[ -\]\?/g, " ").replace(/\\/g, ""))
      : fleetVerdict(code);
    out.push({
      code,
      airline: entry.airline,
      scope: scopeOf(active),
      cls: v?.cls ?? "unknown",
      label: v?.label ?? "Not verified",
      inService: orbitClass(active.orbit) !== "NONE" && !futureOnly
    });
  }
  return out.sort((a, b) => Number(b.inService) - Number(a.inService) || a.airline.localeCompare(b.airline));
}

function scopeOf(rule: Rule): string {
  if (rule.types) {
    return rule.types
      .split("|")
      .map((t) => t.replace(/\[ -\]\?/g, " ").replace(/\\/g, "").trim())
      .join(", ");
  }
  if (rule.fleet === "all") return "Whole fleet";
  if (rule.fleet === "rollout") return "Fleet rollout";
  return rule.fleet ?? "Fleet";
}

export type AircraftDef = { slug: string; name: string; probe: string; wikipedia: string };

// The probe string is the aircraft text exactly as Google Flights prints it, because that is the
// form every registry type token is written against.
export const AIRCRAFT: AircraftDef[] = [
  { slug: "boeing-737", name: "Boeing 737", probe: "Boeing 737" , wikipedia: "https://en.wikipedia.org/wiki/Boeing_737" },
  { slug: "boeing-767", name: "Boeing 767", probe: "Boeing 767" , wikipedia: "https://en.wikipedia.org/wiki/Boeing_767" },
  { slug: "boeing-777", name: "Boeing 777", probe: "Boeing 777" , wikipedia: "https://en.wikipedia.org/wiki/Boeing_777" },
  { slug: "boeing-787", name: "Boeing 787", probe: "Boeing 787" , wikipedia: "https://en.wikipedia.org/wiki/Boeing_787_Dreamliner" },
  { slug: "airbus-a220", name: "Airbus A220", probe: "Airbus A220" , wikipedia: "https://en.wikipedia.org/wiki/Airbus_A220" },
  { slug: "airbus-a320", name: "Airbus A320", probe: "Airbus A320" , wikipedia: "https://en.wikipedia.org/wiki/Airbus_A320_family" },
  { slug: "airbus-a321", name: "Airbus A321", probe: "Airbus A321" , wikipedia: "https://en.wikipedia.org/wiki/Airbus_A321" },
  { slug: "airbus-a330", name: "Airbus A330", probe: "Airbus A330" , wikipedia: "https://en.wikipedia.org/wiki/Airbus_A330" },
  { slug: "airbus-a350", name: "Airbus A350", probe: "Airbus A350" , wikipedia: "https://en.wikipedia.org/wiki/Airbus_A350" },
  { slug: "airbus-a380", name: "Airbus A380", probe: "Airbus A380" , wikipedia: "https://en.wikipedia.org/wiki/Airbus_A380" },
  { slug: "airbus-a319", name: "Airbus A319", probe: "Airbus A319" , wikipedia: "https://en.wikipedia.org/wiki/Airbus_A320_family" },
  { slug: "embraer-e190", name: "Embraer E190", probe: "Embraer 190" , wikipedia: "https://en.wikipedia.org/wiki/Embraer_E-Jet_family" },
  { slug: "embraer-e195", name: "Embraer E195", probe: "Embraer 195" , wikipedia: "https://en.wikipedia.org/wiki/Embraer_E-Jet_E2_family" },
  { slug: "dash-8", name: "Dash 8", probe: "Dash 8" , wikipedia: "https://en.wikipedia.org/wiki/De_Havilland_Canada_Dash_8" },
  { slug: "atr-72", name: "ATR 72", probe: "ATR 72", wikipedia: "https://en.wikipedia.org/wiki/ATR_72" }
];

function clip(text: string, n: number): string {
  if (text.length <= n) return text;
  const cut = text.slice(0, n);
  return `${cut.slice(0, cut.lastIndexOf(" "))}\u2026`;
}

export function aircraftAirlines(def: AircraftDef) {
  const out: { code: string; airline: string; cls: string; label: string; provider: string }[] = [];
  for (const code of codes()) {
    const entry = entryFor(code)!;
    const typed = entry.rules.find((r) => {
      if (!r.types) return false;
      try {
        return new RegExp(r.types).test(def.probe);
      } catch {
        return false;
      }
    });
    if (!typed) continue;
    const v = verdict(code, def.probe);
    out.push({
      code,
      airline: entry.airline,
      cls: v?.cls ?? "unknown",
      label: v?.label ?? "Not verified",
      provider: clip(typed.provider ?? "", 120)
    });
  }
  const rank: Record<string, number> = { fast: 0, ok: 1, part: 2, unknown: 3, none: 4 };
  return out.sort((a, b) => (rank[a.cls] ?? 5) - (rank[b.cls] ?? 5) || a.airline.localeCompare(b.airline));
}

export type ComparePair = { slug: string; a: string; b: string; title: string };

// The six original comparisons are live URLs, so their hand-written slugs stay exactly as they are.
const LEGACY: ComparePair[] = [
  { slug: "qatar-airways-vs-emirates", a: "QR", b: "EK", title: "Qatar Airways vs Emirates Wi-Fi" },
  { slug: "united-vs-delta", a: "UA", b: "DL", title: "United vs Delta Wi-Fi" },
  { slug: "american-vs-united", a: "AA", b: "UA", title: "American vs United Wi-Fi" },
  { slug: "british-airways-vs-virgin-atlantic", a: "BA", b: "VS", title: "British Airways vs Virgin Atlantic Wi-Fi" },
  { slug: "singapore-airlines-vs-cathay-pacific", a: "SQ", b: "CX", title: "Singapore Airlines vs Cathay Pacific Wi-Fi" },
  { slug: "air-india-vs-emirates", a: "AI", b: "EK", title: "Air India vs Emirates Wi-Fi" }
];

// Pairs people actually choose between: same routes, same market, same week of searching. Anything
// that would only ever be an accidental query is left out, because a comparison nobody is looking
// for is a page nobody reads.
const RIVALS: [string, string][] = [
  ["AA", "DL"], ["DL", "AS"], ["AS", "UA"], ["B6", "DL"], ["B6", "AA"], ["WN", "DL"], ["WN", "AA"],
  ["WN", "UA"], ["F9", "WN"], ["B6", "WN"], ["HA", "AS"], ["G4", "F9"],
  ["BA", "AA"], ["VS", "DL"], ["AF", "DL"], ["KL", "DL"], ["LH", "UA"], ["BA", "AF"], ["BA", "LH"],
  ["AF", "KL"], ["LH", "LX"], ["AZ", "LH"], ["EI", "BA"], ["IB", "BA"], ["TP", "IB"], ["FI", "BT"],
  ["DY", "SK"], ["AY", "SK"], ["LO", "LH"], ["A3", "TK"],
  ["U2", "FR"], ["FR", "W6"], ["U2", "W6"], ["VY", "FR"], ["LS", "U2"], ["HV", "FR"],
  ["EK", "EY"], ["QR", "EY"], ["EK", "TK"], ["QR", "TK"], ["SV", "EK"], ["GF", "QR"], ["WY", "EK"],
  ["FZ", "G9"], ["EK", "SQ"], ["QR", "SQ"], ["EK", "BA"], ["QR", "BA"],
  ["AI", "6E"], ["6E", "SG"], ["AI", "QR"], ["IX", "6E"], ["6E", "AK"], ["AI", "BA"],
  ["SQ", "TG"], ["SQ", "MH"], ["CX", "JL"], ["JL", "NH"], ["KE", "OZ"], ["BR", "CI"], ["TG", "MH"],
  ["GA", "SQ"], ["VN", "SQ"], ["CA", "MU"], ["MU", "CZ"], ["CA", "CZ"], ["CX", "BR"], ["JX", "BR"],
  ["AK", "TR"], ["TR", "SQ"],
  ["QF", "VA"], ["QF", "NZ"], ["VA", "JQ"], ["QF", "SQ"], ["NZ", "FJ"], ["QF", "EK"],
  ["AC", "WS"], ["AC", "UA"], ["AC", "TS"],
  ["LA", "AV"], ["LA", "G3"], ["G3", "AD"], ["AM", "Y4"], ["AV", "CM"], ["LA", "AM"], ["AR", "LA"],
  ["ET", "KQ"], ["ET", "MS"], ["SA", "ET"], ["AT", "MS"], ["FA", "SA"], ["ET", "QR"]
];

let comparisons: ComparePair[] | null = null;

export function allComparisons(): ComparePair[] {
  if (comparisons) return comparisons;
  const seen = new Set(LEGACY.map((c) => [c.a, c.b].sort().join("-")));
  const slugs = new Set(LEGACY.map((c) => c.slug));
  const out = [...LEGACY];
  for (const [a, b] of RIVALS) {
    const ea = entryFor(a);
    const eb = entryFor(b);
    if (!ea || !eb) continue;
    const key = [a, b].sort().join("-");
    if (seen.has(key)) continue;
    const slug = `${slugForCode(a)}-vs-${slugForCode(b)}`;
    if (slugs.has(slug)) continue;
    seen.add(key);
    slugs.add(slug);
    out.push({ slug, a, b, title: `${ea.airline} vs ${eb.airline} Wi-Fi` });
  }
  comparisons = out;
  return out;
}

export const COMPARISONS: ComparePair[] = allComparisons();

// 98 comparisons in one flat grid is a wall, so the index groups them the way a traveller thinks
// about them: the market they are choosing inside, and the long-haul pairs that cross markets.
export function comparisonGroups(): { title: string; pairs: ComparePair[] }[] {
  const buckets = new Map<string, ComparePair[]>();
  for (const c of COMPARISONS) {
    const ra = regionOf(c.a);
    const rb = regionOf(c.b);
    const key = ra && ra === rb ? `${ra} carriers` : "Long-haul rivals";
    const list = buckets.get(key) ?? [];
    list.push(c);
    buckets.set(key, list);
  }
  return [...buckets.entries()]
    .map(([title, pairs]) => ({ title, pairs: pairs.sort((x, y) => x.title.localeCompare(y.title)) }))
    .sort((x, y) => (x.title === "Long-haul rivals" ? 1 : y.title === "Long-haul rivals" ? -1 : y.pairs.length - x.pairs.length));
}

// Every comparison used to have exactly one inbound link, from its own index. Siblings give the
// crawler a path between them and give the reader the next question they were going to ask.
export function siblingComparisons(slug: string, n = 6): ComparePair[] {
  const me = COMPARISONS.find((c) => c.slug === slug);
  if (!me) return [];
  const region = regionOf(me.a);
  const scored = COMPARISONS.filter((c) => c.slug !== slug).map((c) => {
    let score = 0;
    if (c.a === me.a || c.b === me.b || c.a === me.b || c.b === me.a) score += 4;
    if (region && (regionOf(c.a) === region || regionOf(c.b) === region)) score += 2;
    return { c, score };
  });
  return scored
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score || x.c.title.localeCompare(y.c.title))
    .slice(0, n)
    .map((x) => x.c);
}

// A carrier's headline class is its best genuinely-flying tier, which is what "related airlines"
// and comparison verdicts key off.
export function headlineClass(entry: Entry): string {
  const ranks: Record<string, number> = { LEO: 0, MEO: 1, VARIES: 2, GEO: 3, A2G: 3, PARTIAL: 4, UNKNOWN: 5, NONE: 6 };
  let best = "UNKNOWN";
  for (const r of entry.rules) {
    const k = orbitClass(r.orbit);
    if ((ranks[k] ?? 9) < (ranks[best] ?? 9)) best = k;
  }
  return best;
}

// Ranking the pool alphabetically from the airline's own position spread the links but produced
// nonsense neighbours: TAROM linked six other T-airlines, Fiji linked Finnair. Relevance now comes
// first (region, then system, then how it is sold, then shared aircraft) and the alphabetical
// rotation only breaks ties, so the links stay spread without reading as machine output.
function providerKey(entry: Entry): string {
  const text = entry.rules.map((r) => r.provider ?? "").join(" ");
  const hit = PROVIDERS.find((p) => p.match.test(text));
  return hit ? hit.slug : "";
}

function accessKey(entry: Entry): string {
  const a = (entry.access ?? "").toLowerCase();
  if (!a || /no passenger internet|not offered/.test(a)) return "none";
  if (/free for all|free to all|free for every|complimentary for all/.test(a)) return "free-all";
  if (/free/.test(a) && /(member|loyalty|sign|account|programme|program)/.test(a)) return "free-account";
  if (/free/.test(a) && /(tier|messag|chat|then|first)/.test(a)) return "free-tier";
  if (/free/.test(a)) return "free-all";
  return "paid";
}

function typeKeys(code: string): Set<string> {
  const out = new Set<string>();
  for (const row of fleetRows(code)) for (const t of row.types) out.add(t.toLowerCase().replace(/[^a-z0-9]/g, ""));
  return out;
}

export function relatedAirlines(code: string, n = 6): { code: string; airline: string }[] {
  const up = code.toUpperCase();
  const me = entryFor(up);
  if (!me) return [];
  const mine = headlineClass(me);
  const myRegion = regionOf(up);
  const myProvider = providerKey(me);
  const myAccess = accessKey(me);
  const myTypes = typeKeys(up);

  const pool = codes()
    .filter((c) => c !== up)
    .map((c) => ({ code: c, entry: entryFor(c)! }))
    .filter((x) => headlineClass(x.entry) === mine);
  if (!pool.length) return [];

  const scored = pool.map((x) => {
    let score = 0;
    if (myRegion && regionOf(x.code) === myRegion) score += 6;
    if (myProvider && providerKey(x.entry) === myProvider) score += 3;
    if (accessKey(x.entry) === myAccess) score += 2;
    if (myTypes.size) {
      const theirs = typeKeys(x.code);
      for (const t of myTypes) if (theirs.has(t)) { score += 2; break; }
    }
    const sl = me.starlink?.status ?? "none";
    if (sl !== "none" && (x.entry.starlink?.status ?? "none") === sl) score += 1;
    return { ...x, score };
  });

  const bands = new Map<number, typeof scored>();
  for (const row of scored) {
    const band = bands.get(row.score) ?? [];
    band.push(row);
    bands.set(row.score, band);
  }
  const out: { code: string; airline: string }[] = [];
  for (const score of [...bands.keys()].sort((a, b) => b - a)) {
    const band = bands.get(score)!;
    const start = band.findIndex((x) => x.entry.airline.localeCompare(me.airline) > 0);
    const from = start < 0 ? 0 : start;
    for (let i = 0; i < band.length && out.length < n; i++) {
      const x = band[(from + i) % band.length];
      out.push({ code: x.code, airline: x.entry.airline });
    }
    if (out.length >= n) break;
  }
  return out;
}

// The heading has to describe what the list actually is, or it reads as filler.
export function relatedTitle(code: string, rows: { code: string }[], label: string): string {
  const region = regionOf(code);
  if (region && rows.length && rows.every((r) => regionOf(r.code) === region))
    return `Other ${region} airlines where the answer is "${label}"`;
  return `Other airlines where the answer is "${label}"`;
}

// Comparison pages had exactly one inbound link each, from their own index.
export function comparisonsFor(code: string): ComparePair[] {
  const up = code.toUpperCase();
  return COMPARISONS.filter((c) => c.a === up || c.b === up);
}

// Aircraft pages exist for a fixed set of types; linking a fleet row to its type page only when
// that page exists keeps the crawl clean.
export function aircraftSlugFor(type: string): string | null {
  const t = type.toLowerCase().replace(/\s+/g, " ").trim();
  const hit = AIRCRAFT.find((a) => {
    const name = a.name.toLowerCase();
    const bare = name.replace(/^(boeing|airbus|embraer) /, "");
    return t === name || t === bare || t.startsWith(`${bare} `) || bare.startsWith(t);
  });
  return hit ? hit.slug : null;
}

// The directory has to answer "which airline should I pick" without a click, so every column is
// derived rather than written: the capability list is the extension's own, the cost comes from the
// access parser, and "calls" asks whether any aircraft in the fleet can hold one rather than what
// the fleet rolls up to, because a mid-retrofit carrier rolls up to PARTIAL while its A350s are on
// Starlink.
export type DirectoryRow = {
  code: string;
  airline: string;
  slug: string;
  label: string;
  cls: string;
  key: string;
  starlink: "flying" | "announced" | null;
  bestFor: string;
  cost: string | null;
  calls: boolean;
};

let dirCache: DirectoryRow[] | null = null;

export function directoryRows(): DirectoryRow[] {
  if (dirCache) return dirCache;
  dirCache = codes().map((code) => {
    const e = entryFor(code)!;
    const v = fleetVerdict(code);
    const key = v?.key ?? "UNKNOWN";
    const cls = v?.cls ?? "unknown";
    // The verdict pill already says what the link can carry, so this column is written as short
    // tokens rather than sentences: it has to be scannable down 235 rows, not read.
    const cap = capability(key);
    const SHORT: Record<string, string> = { "Video calls": "Calls", "Email & chat": "Email", Browsing: "Browsing" };
    const bestFor =
      cap && cap.good.length
        ? cap.good.map((g) => SHORT[g] ?? g).join(" · ")
        : key === "PARTIAL"
          ? "Varies by plane"
          : "—";
    // A "free" line on a carrier with no internet is describing a seatback streaming portal, not a
    // connection, so cost is suppressed rather than shown as Free.
    const cost = cls === "none" ? null : costOf(e.access);
    const fastSomewhere = e.rules.some(
      (r) =>
        ["LEO", "MEO"].includes(orbitClass(r.orbit)) ||
        (orbitClass(r.orbit) === "VARIES" && /starlink/i.test(r.provider ?? ""))
    );
    // The homepage and the extension both relabel a fast fleet by its call policy, so the directory
    // does too rather than showing the generic orbit wording next to the same coloured pill.
    const policy = callPolicy(code);
    const label =
      (key === "LEO" || key === "MEO") && policy ? callLabel(policy.calls) ?? v?.label : v?.label;
    return {
      code,
      airline: e.airline,
      slug: slugForCode(code),
      label: label ?? "Not verified",
      cls,
      key,
      starlink: e.starlink && e.starlink.status !== "none" ? e.starlink.status : null,
      bestFor,
      cost,
      calls: fastSomewhere && policy?.calls !== "no"
    };
  });
  return dirCache;
}

export function relatedRows(code: string, n = 6): DirectoryRow[] {
  const index = new Map(directoryRows().map((r) => [r.code, r]));
  return relatedAirlines(code, n)
    .map((r) => index.get(r.code))
    .filter((r): r is DirectoryRow => Boolean(r));
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export function monthLabel(asOf: string): string {
  const [y, m] = asOf.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

export function schemaDates(asOf: string): { datePublished: string; dateModified: string } {
  const mod = `${asOf}-01`;
  return { datePublished: SITE_LAUNCH, dateModified: mod > SITE_LAUNCH ? mod : SITE_LAUNCH };
}

// The registry's sourcing is airline-and-provider-first, but a minority of carriers publish nothing
// about wifi and their entry rests on aviation trade press instead. Claiming "official sources only"
// across every page was therefore false on those entries, so each surface states which it is.
// A denylist counted every unknown domain as official, so 18 airlines whose only citation was a
// trade outlet still claimed "sourced from official pages". Officialness is now positive evidence:
// the host must be the airline's own domain or a known connectivity provider.
export type { SourceKind } from "./sources";
export { sourceKind } from "./sources";

export function sourceMix(entry: Entry, code: string): { primary: number; corroborating: number; weak: number; total: number } {
  const list = entry.sources ?? [];
  let primary = 0;
  let corroborating = 0;
  for (const u of list) {
    const k = sourceKind(u, entry.airline, code);
    if (PRIMARY.includes(k)) primary += 1;
    else if (CORROBORATING.includes(k)) corroborating += 1;
  }
  return { primary, corroborating, weak: list.length - primary - corroborating, total: list.length };
}

// The badge under a verdict used to read "trade reporting" for anything that was not the airline's
// own page, which flattered a Wikipedia article and understated a provider announcement.
export function sourceStrength(entry: Entry, code: string): string {
  const { primary, corroborating, total } = sourceMix(entry, code);
  if (!total) return "No sources recorded";
  if (primary) return "Sourced from official pages";
  if (corroborating) return "Sourced from trade reporting";
  return "Sourced from secondary reporting";
}

export function sourceNote(entry: Entry, code: string): string {
  const { primary, corroborating, weak } = sourceMix(entry, code);
  const poss = entry.airline.endsWith("s") ? `${entry.airline}'` : `${entry.airline}'s`;
  if (!primary && !corroborating && !weak) return "No sources are recorded for this entry yet.";
  if (!primary && !corroborating)
    return `${entry.airline} does not publish its Wi-Fi terms in a form we could cite and no trade title has covered them, so this entry rests on secondary sources and is due a re-check.`;
  if (!primary)
    return `${entry.airline} does not publish its Wi-Fi terms in a form we could cite, so this entry rests on aviation trade reporting rather than the airline's own pages.`;
  if (!corroborating && !weak)
    return `Every fact on this page comes from ${poss} own publications or its connectivity provider's announcements.`;
  return `Facts on this page come from ${poss} own publications and its connectivity provider's announcements, with aviation trade reporting used for corroboration.`;
}

export function sourceTotals() {
  let official = 0;
  let trade = 0;
  let secondary = 0;
  let tradeOnly = 0;
  let secondaryOnly = 0;
  for (const code of codes()) {
    const m = sourceMix(entryFor(code)!, code);
    official += m.primary;
    trade += m.corroborating;
    secondary += m.weak;
    if (!m.primary && m.total) tradeOnly += 1;
    if (!m.primary && !m.corroborating && m.total) secondaryOnly += 1;
  }
  return { official, trade, secondary, tradeOnly, secondaryOnly, total: official + trade + secondary };
}

// Nobody publishes the negative list, and the mainstream guides get it wrong: several airlines
// widely listed as "free wifi" actually run an entertainment-only cabin network with no route to
// the internet. Both facts are derivable, so this can never go stale.
export type NoWifiRow = { code: string; airline: string; access: string; kind: "portal" | "none" | "announced" };

const PORTAL_RX = /stream|portal|entertainment|local .*network|moving map|cabin LAN|wireless IFE|AirFi|Immfly|Bluebox/i;
const ANNOUNCED_RX = /announced|signed|planned|from 20\d\d|selected|due |trial/i;

export function noWifiRows(): NoWifiRow[] {
  const out: NoWifiRow[] = [];
  for (const code of codes()) {
    const e = entryFor(code)!;
    if (!e.rules.every((r) => orbitClass(r.orbit) === "NONE")) continue;
    const text = `${e.access ?? ""} ${e.rules.map((r) => r.provider ?? "").join(" ")}`;
    const kind: NoWifiRow["kind"] = PORTAL_RX.test(text)
      ? "portal"
      : ANNOUNCED_RX.test(text)
        ? "announced"
        : "none";
    out.push({ code, airline: e.airline, access: e.access ?? "", kind });
  }
  return out.sort((a, b) => a.airline.localeCompare(b.airline));
}

// Whether the link can carry a call and whether the airline permits one are separate questions, and
// the second is the trap. Only airlines that state a policy appear; absent means unknown, not yes.
export type CallRow = {
  code: string;
  airline: string;
  policy: "yes" | "no" | "voice";
  reported: boolean;
  cls: string;
  label: string;
  fastEnough: boolean;
};

export function callRows(): CallRow[] {
  const out: CallRow[] = [];
  for (const code of codes()) {
    const p = callPolicy(code);
    if (!p) continue;
    const e = entryFor(code)!;
    const v = fleetVerdict(code);
    const fastEnough = e.rules.some((r) => ["LEO", "MEO", "VARIES"].includes(orbitClass(r.orbit)));
    out.push({
      code,
      airline: e.airline,
      policy: p.calls as CallRow["policy"],
      reported: Boolean(p.check),
      cls: v?.cls ?? "unknown",
      label: v?.label ?? "Not verified",
      fastEnough
    });
  }
  const rank = { yes: 0, voice: 1, no: 2 };
  return out.sort((a, b) => rank[a.policy] - rank[b.policy] || a.airline.localeCompare(b.airline));
}

export type StarlinkTableRow = {
  code: string;
  airline: string;
  slug: string;
  status: "flying" | "announced";
  access: StarlinkFact["access"];
  cost: string;
  detail: string;
  fleetwide: boolean;
  progress: StarlinkProgress | null;
  pct: number | null;
  wifiLabel: string;
  wifiCls: string;
  asOf: string;
  updated: string;
};

// The prose a rule carries is written for an airline page; the table needs the clause that says how
// far the rollout has got, without the provider names and parentheses.
function shortDetail(detail: string, fleetwide: boolean): string {
  if (fleetwide) return "Whole fleet";
  const flat = detail.replace(/\s*\([^)]*\)/g, "");
  const clauses = flat.split(/;\s*/);
  const pick = clauses.find((c) => /starlink/i.test(c)) ?? clauses[0] ?? "";
  const cleaned = pick.replace(/\s+/g, " ").trim();
  return cleaned.length > 96 ? `${cleaned.slice(0, 93).replace(/[,;: ]+$/, "")}…` : cleaned;
}

// One serialisable row per Starlink airline for the client-side table: the Wi-Fi column shows what
// a Starlink aircraft gives (with the airline's own call policy), or, for a deal with nothing
// flying, what the fleet gives today.
export function starlinkTableRows(): StarlinkTableRow[] {
  const leo = verdictUi("LEO");
  return starlinkRows().map((r) => {
    const entry = entryFor(r.code)!;
    const policy = callPolicy(r.code);
    let wifiLabel: string;
    let wifiCls: string;
    if (r.status === "flying") {
      wifiLabel = (policy ? callLabel(policy.calls) : null) ?? leo?.label ?? "Video calls work";
      wifiCls = leo?.cls ?? "fast";
    } else {
      const fv = fleetVerdict(r.code);
      const key = fv?.key ?? "UNKNOWN";
      wifiLabel = ((key === "LEO" || key === "MEO") && policy ? callLabel(policy.calls) : null) ?? fv?.label ?? "Not verified";
      wifiCls = fv?.cls ?? "unknown";
    }
    const progress = r.status === "flying" ? entry.starlink?.progress ?? null : null;
    const dates = (entry.starlink?.milestones ?? []).map((m) => m.date).sort();
    const ui = STARLINK_ACCESS_UI[r.access];
    return {
      code: r.code,
      airline: r.airline,
      slug: slugForCode(r.code),
      status: r.status,
      access: r.access,
      cost: r.status === "flying" ? ui.flying.label : ui.announced,
      detail: shortDetail(r.detail, r.fleetwide),
      fleetwide: r.fleetwide,
      progress,
      pct: progress ? progressPct(progress) : null,
      wifiLabel,
      wifiCls,
      asOf: entry.as_of ?? "",
      updated: dates.length ? dates[dates.length - 1] : entry.as_of ?? ""
    };
  });
}

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Registry dates are as precise as the source: a day when the airline gave one, otherwise a month.
export function shortDate(d: string): string {
  const [y, m, day] = d.split("-");
  const mon = SHORT_MONTHS[Number(m) - 1];
  if (!mon) return d;
  return day ? `${Number(day)} ${mon} ${y}` : `${mon} ${y}`;
}
