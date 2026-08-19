import { codes, entryFor, fleetRows, fleetVerdict, orbitClass, registry, verdict, type Entry, type Rule } from "./extension";
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

export type AircraftDef = { slug: string; name: string; probe: string };

// The probe string is the aircraft text exactly as Google Flights prints it, because that is the
// form every registry type token is written against.
export const AIRCRAFT: AircraftDef[] = [
  { slug: "boeing-737", name: "Boeing 737", probe: "Boeing 737" },
  { slug: "boeing-767", name: "Boeing 767", probe: "Boeing 767" },
  { slug: "boeing-777", name: "Boeing 777", probe: "Boeing 777" },
  { slug: "boeing-787", name: "Boeing 787", probe: "Boeing 787" },
  { slug: "airbus-a220", name: "Airbus A220", probe: "Airbus A220" },
  { slug: "airbus-a320", name: "Airbus A320", probe: "Airbus A320" },
  { slug: "airbus-a321", name: "Airbus A321", probe: "Airbus A321" },
  { slug: "airbus-a330", name: "Airbus A330", probe: "Airbus A330" },
  { slug: "airbus-a350", name: "Airbus A350", probe: "Airbus A350" },
  { slug: "airbus-a380", name: "Airbus A380", probe: "Airbus A380" },
  { slug: "embraer-e190", name: "Embraer E190", probe: "Embraer 190" },
  { slug: "atr-72", name: "ATR 72", probe: "ATR 72" }
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

export const COMPARISONS: ComparePair[] = [
  { slug: "qatar-airways-vs-emirates", a: "QR", b: "EK", title: "Qatar Airways vs Emirates Wi-Fi" },
  { slug: "united-vs-delta", a: "UA", b: "DL", title: "United vs Delta Wi-Fi" },
  { slug: "american-vs-united", a: "AA", b: "UA", title: "American vs United Wi-Fi" },
  { slug: "british-airways-vs-virgin-atlantic", a: "BA", b: "VS", title: "British Airways vs Virgin Atlantic Wi-Fi" },
  { slug: "singapore-airlines-vs-cathay-pacific", a: "SQ", b: "CX", title: "Singapore Airlines vs Cathay Pacific Wi-Fi" },
  { slug: "air-india-vs-emirates", a: "AI", b: "EK", title: "Air India vs Emirates Wi-Fi" }
];

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

// Slicing the head of an alphabetical pool gave 122 pages the identical six links and left most
// airlines unlinked from anywhere. Starting the window at the airline's own position spreads the
// links across the whole pool while staying deterministic between builds.
export function relatedAirlines(code: string, n = 6): { code: string; airline: string }[] {
  const me = entryFor(code);
  if (!me) return [];
  const mine = headlineClass(me);
  const pool = codes()
    .map((c) => ({ code: c, entry: entryFor(c)! }))
    .filter((x) => x.code !== code.toUpperCase() && headlineClass(x.entry) === mine);
  if (pool.length <= n) return pool.map((x) => ({ code: x.code, airline: x.entry.airline }));
  const start = pool.findIndex((x) => x.entry.airline.localeCompare(me.airline) > 0);
  const from = start < 0 ? 0 : start;
  return Array.from({ length: n }, (_, i) => pool[(from + i) % pool.length]).map((x) => ({
    code: x.code,
    airline: x.entry.airline
  }));
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

export function searchIndex() {
  return codes().map((code) => {
    const e = entryFor(code)!;
    const v = fleetVerdict(code);
    return { code, airline: e.airline, label: v?.label ?? "Not verified", cls: v?.cls ?? "unknown" };
  });
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
const TRADE_DOMAIN_RX =
  /onemileatatime|awardwallet|simpleflying|thepointsguy|paxex\.aero|runwaygirlnetwork|liveandletsfly|happyfares|skift|cnbc|bloomberg|gulfnews|reuters|forbes|aerotime|aviationweek|apex\.aero|timeout|seekingalpha|businesstraveller|executivetraveller|flyertalk|reddit|wikipedia|travelweekly|thenationalnews|khaleejtimes|aviationa2z|ch-aviation|airlinegeeks|aviationsourcenews/i;

export function sourceMix(entry: Entry): { official: number; trade: number; total: number } {
  const list = entry.sources ?? [];
  const trade = list.filter((u) => TRADE_DOMAIN_RX.test(u)).length;
  return { official: list.length - trade, trade, total: list.length };
}

export function sourceNote(entry: Entry): string {
  const { official, trade } = sourceMix(entry);
  if (!official && !trade) return "No sources are recorded for this entry yet.";
  if (!official)
    return `${entry.airline} does not publish its Wi-Fi terms in a form we could cite, so this entry rests on aviation trade reporting rather than the airline's own pages.`;
  if (!trade)
    return `Every fact on this page comes from ${entry.airline}'s own publications or its connectivity provider's announcements.`;
  return `Facts on this page come from ${entry.airline}'s own publications and its connectivity provider's announcements, with aviation trade reporting used for corroboration.`;
}

export function sourceTotals() {
  let official = 0;
  let trade = 0;
  let tradeOnly = 0;
  for (const code of codes()) {
    const m = sourceMix(entryFor(code)!);
    official += m.official;
    trade += m.trade;
    if (!m.official && m.total) tradeOnly += 1;
  }
  return { official, trade, tradeOnly, total: official + trade };
}
