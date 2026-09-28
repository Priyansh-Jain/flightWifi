var AIRCRAFT_NODE_RX = /^(Airbus|Boeing|Embraer|ATR|De Havilland|Canadair|Bombardier|Mitsubishi|McDonnell|Saab|Fokker|Dornier|Sukhoi|Antonov|Tupolev|Ilyushin|Comac|COMAC|Cessna|Beechcraft|Pilatus|Viking|Xian)\b.*\d/;
var FLIGHT_AFTER_AIRCRAFT_RX = /\b([A-Z][A-Z0-9])\s?(\d{1,4})\b/;
var WIDEBODY_RX = /(A3[358]0|A340|747|767|777|787)/;

var NAME_INDEX = {};
for (const code in WIFI_REGISTRY) NAME_INDEX[WIFI_REGISTRY[code].airline.toLowerCase()] = code;
// longest first: "Thai AirAsia" must not resolve to AirAsia, "Air India Express" must not resolve to Air India
var NAME_KEYS = Object.keys(NAME_INDEX).sort((a, b) => b.length - a.length);

// Google shortens what it prints: the registry's "Vietjet Air" shows on the card as "Vietjet", which
// substring matching can never reach because the stored name is the longer of the two. The trimmed
// form is registered as an alias, but a collision blanks the entry rather than picking a winner, and
// lookups are exact so "Singapore" can never be read out of "Singapore Changi Airport".
// Normalising away spacing and punctuation is what lets the registry's "airBaltic" meet Google's
// "Air Baltic"; it cannot manufacture a match between two genuinely different strings.
var GENERIC_SUFFIX_RX = /\s+(air lines|airlines|airways|airline|air|aviation|airlink)$/i;

function norm(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// A handful of carriers trade under a name the registry does not store at all, which no amount of
// normalising will bridge. Added only when a route sweep shows a real gap, never guessed.
// "lot" is safe only because these lookups match the whole cell text exactly; as a substring it
// would fire on the English word.
var TRADE_NAMES = { "scandinavian airlines": "SK", lot: "LO", "air baltic corporation a/s": "BT" };

// Sister AOCs flying the same branded fleet under a second code. This is NOT for lookalike names
// (Batik Malaysia is a different airline from Batik Indonesia and stays out): an alias is only
// added when the registry entry's own sources cover both codes. Norwegian's wifi page describes
// the group service without distinguishing the Shuttle (DY) and Sweden (D8) AOCs.
var CODE_ALIASES = { D8: "DY" };

function regCode(cc) {
  return WIFI_REGISTRY[cc] ? cc : CODE_ALIASES[cc] && WIFI_REGISTRY[CODE_ALIASES[cc]] ? CODE_ALIASES[cc] : cc;
}

var EXACT_INDEX = {};
for (const code in WIFI_REGISTRY) EXACT_INDEX[norm(WIFI_REGISTRY[code].airline)] = code;
for (const code in WIFI_REGISTRY) {
  const short = norm(WIFI_REGISTRY[code].airline.replace(GENERIC_SUFFIX_RX, ""));
  if (short.length < 4) continue;
  if (short in EXACT_INDEX) {
    if (EXACT_INDEX[short] !== code) EXACT_INDEX[short] = null;
    continue;
  }
  EXACT_INDEX[short] = code;
}
for (const name in TRADE_NAMES) if (WIFI_REGISTRY[TRADE_NAMES[name]]) EXACT_INDEX[norm(name)] = TRADE_NAMES[name];

function carrierExact(text) {
  return EXACT_INDEX[norm(text)] || null;
}

function classifyFleet(aircraftText) {
  if (!aircraftText) return null;
  return WIDEBODY_RX.test(aircraftText) ? "widebody" : "narrowbody";
}

// More than one type rule can match the same aircraft, and when they disagree the cautious one has
// to win. Qatar carries both "777|A350|787 -> Starlink" and "787 -> rollout completing end of 2026,
// Inmarsat until fitted"; taking the first match promised a video call on a 787 that may not be
// fitted yet. Erring low is the only direction that cannot mislead someone into booking.
function pickRule(entry, fleet, aircraftText) {
  if (!entry) return null;
  const generic = (r) => !r.types && (r.fleet === "all" || r.fleet === "most" || r.fleet === "rollout");
  const typed = aircraftText ? entry.rules.filter((r) => r.types && new RegExp(r.types).test(aircraftText)) : [];
  if (typed.length) {
    return typed.reduce((a, b) => (RANK[classifyOrbit(a.orbit)] <= RANK[classifyOrbit(b.orbit)] ? a : b));
  }
  return entry.rules.find((r) => !r.types && r.fleet === fleet) || entry.rules.find(generic) || null;
}

// substring alone would read "ANA" out of "Canadian North" and "Air Panama", so the match has to
// land on word boundaries; longest-first then settles the genuine prefixes like Air India / Air India Express
function nameAt(lower, name) {
  let from = 0;
  for (;;) {
    const i = lower.indexOf(name, from);
    if (i < 0) return false;
    const before = i === 0 ? " " : lower[i - 1];
    const after = i + name.length >= lower.length ? " " : lower[i + name.length];
    if (!/[a-z0-9]/.test(before) && !/[a-z0-9]/.test(after)) return true;
    from = i + 1;
  }
}

function carrierByName(text) {
  const lower = text.toLowerCase();
  for (const name of NAME_KEYS) if (nameAt(lower, name)) return NAME_INDEX[name];
  return null;
}

// Labels name the outcome, not the plumbing: nobody is choosing a flight by satellite orbit, they
// are asking whether they can take the standup call. The one thing an outcome label must not do is
// promise less than the truth, which is why high-orbit reads "Email & browsing" rather than
// "Messaging only" - a 600ms link is bad for live calls and completely fine for mail and docs.
//
// These strings are the product's vocabulary and flightwifi.app uses the same ones, so a reader who
// arrives site -> extension -> flight result meets one classification rather than three. `row` is
// the line this verdict is tallied on in the popup: class cannot carry that, because "Email &
// browsing" and "Varies by aircraft" share a class and are different answers.
//
// Amber is the only colour that asks the reader to stop, so it is reserved for the one case that
// warrants it: part of the fleet has no wifi at all and the schedule will not say which you get.
var VERDICT_UI = {
  LEO: { cls: "fast", row: "calls", label: "Video calls work", why: "Fast connection with low delay. Good for video calls", latency: "roughly 20-50ms (low orbit)" },
  MEO: { cls: "fast", row: "calls", label: "Video calls work", why: "Fast enough for video calls, with some delay", latency: "roughly 120-150ms (mid orbit)" },
  GEO: { cls: "ok", row: "email", label: "Email & browsing", why: "Fast enough for normal use, but high delay affects video calls and live streaming", latency: "roughly 600ms and up (high orbit)" },
  A2G: { cls: "ok", row: "email", label: "Email & browsing", why: "Good for browsing and messaging. The signal comes from the ground, so it can drop out over water", latency: "air-to-ground, no satellite" },
  VARIES: { cls: "ok", row: "varies", label: "Varies by aircraft", why: "Wi-Fi is available, but some planes are faster than others", latency: "varies by aircraft" },
  PARTIAL: { cls: "part", row: "partial", label: "Not on every aircraft", why: "Some planes in this fleet have Wi-Fi, others do not", latency: "varies by aircraft" },
  LEG_PARTIAL: { cls: "part", row: "partial", label: "Not on every aircraft", why: "Wi-Fi differs across your trip. One or more legs have no Wi-Fi", latency: "varies by leg" },
  NONE: { cls: "none", row: "nowifi", label: "No Wi-Fi", why: "No internet on this plane", latency: null },
  GOOGLE_YES: { cls: "ok", row: "unsure", label: "Wi-Fi, speed unknown", why: "Google lists Wi-Fi for this flight, but we have not verified its speed", latency: null },
  GOOGLE_NO: { cls: "none", row: "nowifi", label: "No Wi-Fi", why: "Google does not list Wi-Fi for this flight", latency: null },
  UNKNOWN: { cls: "unknown", row: "unverified", label: "Not verified", why: "No verified Wi-Fi information for this flight yet", latency: null }
};

// What the reader is actually deciding. Only latency-bound outcomes belong here: whether an airline
// lets you stream is a policy of its access tier, not a property of the link, so it stays out.
var CAPABILITY = {
  LEO: { good: ["Video calls", "Email & chat", "Browsing"], bad: [] },
  MEO: { good: ["Video calls", "Email & chat", "Browsing"], bad: [] },
  GEO: { good: ["Email & chat", "Browsing"], bad: ["Video calls", "Live streaming"] },
  A2G: { good: ["Email & chat", "Browsing"], bad: ["Video calls", "Live streaming"] },
  VARIES: { good: ["Email & chat", "Browsing"], bad: ["Video calls"] }
};

// Whether the link can carry a call and whether the airline lets you make one are separate
// questions, and the second one is the trap. Most carriers prohibit voice and video over wifi as a
// term of carriage no matter how fast the connection is, so a latency verdict alone reads as
// permission it cannot grant. Only airlines that state a policy are listed; absent means unknown.
var CALL_POLICY = {
  // taken from the airline's own page or contract of carriage
  DL: { calls: "no", src: "delta.com" },
  UA: { calls: "no", src: "united.com contract of carriage, rule 21" },
  WS: { calls: "no", src: "westjet.com" },
  SK: { calls: "no", src: "flysas.com" },
  NZ: { calls: "no", src: "airnewzealand.com" },
  VS: { calls: "voice", src: "virginatlantic.com" },
  BT: { calls: "yes", src: "airbaltic.com" },
  // consistently reported, airline page not retrievable for direct verification
  AA: { calls: "no", src: "reported", check: true },
  WN: { calls: "no", src: "reported", check: true },
  B6: { calls: "no", src: "reported", check: true },
  AS: { calls: "no", src: "reported", check: true },
  HA: { calls: "no", src: "reported", check: true },
  AC: { calls: "no", src: "reported", check: true },
  QF: { calls: "no", src: "reported", check: true },
  LH: { calls: "no", src: "reported", check: true },
  AF: { calls: "no", src: "reported", check: true },
  TK: { calls: "no", src: "reported", check: true },
  AI: { calls: "no", src: "reported", check: true },
  SQ: { calls: "no", src: "reported", check: true },
  NH: { calls: "no", src: "reported", check: true },
  BA: { calls: "yes", src: "reported", check: true },
  QR: { calls: "yes", src: "reported", check: true },
  EI: { calls: "yes", src: "reported", check: true }
};

var CALL_POLICY_TEXT = {
  no: "Not allowed by the airline",
  yes: "Allowed, headphones recommended",
  voice: "Voice calls allowed, video not"
};

// Where the airline's policy is known the chip says what you may actually do, which matters because
// most carriers prohibit calls however fast the link is. Only the two restrictive cases override:
// an airline that bans calls reads "Fast, but no calls" rather than the class label.
var CALL_LABEL = {
  yes: "Video calls work",
  no: "Fast, but no calls",
  voice: "Voice calls only"
};

// VARIES and PARTIAL are worded for a collapsed row where the aircraft is unknown, and "on some
// flights" reads as evasion once the card has already named the aircraft sitting next to it. When
// the type is known the uncertainty is real but narrower: the sub-fleet is part-fitted, so the
// individual airframe decides, not the schedule. Saying that is more precise and less like a dodge.
var TYPED_UI = {
  VARIES: {
    label: "Varies by aircraft",
    why: "Every plane of this type has Wi-Fi, but some are faster than others"
  },
  PARTIAL: {
    why: "Some planes of this type have Wi-Fi, others do not"
  }
};

var RANK = { NONE: 0, PARTIAL: 1, UNKNOWN: 2, GEO: 3, A2G: 3, VARIES: 4, MEO: 5, LEO: 6 };

// Codeshare rows ("Qatar Airways · British Airways") leave the amenity column too narrow for the
// full label, and the old fallback went straight to a bare glyph, which turned eight Qatar nonstops
// with two different answers into eight identical icons. A short form keeps the answer legible one
// step longer; the glyph-only form is now the last resort, not the second.
var SHORT_LABEL = {
  "Video calls work": "Calls ok",
  "Fast, but no calls": "Fast, no calls",
  "Voice calls only": "Voice only",
  "Email & browsing": "Email",
  "Varies by aircraft": "Varies",
  "Not on every aircraft": "Not all",
  "No Wi-Fi": "None",
  "Wi-Fi, speed unknown": "Wi-Fi ?",
  "Not verified": "Unverified"
};

// Same rule as web/lib/slugs.ts, so the card can link straight to the airline page. Checked against
// all 235 entries: no name collides, so no code suffix is ever needed.
function slugify(name) {
  return String(name)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function classifyOrbit(orbit) {
  if (!orbit) return "UNKNOWN";
  if (orbit === "NONE") return "NONE";
  if (orbit === "UNKNOWN") return "UNKNOWN";
  if (orbit === "A2G") return "A2G";
  const mixed = orbit.startsWith("mixed");
  // "mixed GEO/none" means you might get nothing; "mixed GEO/LEO" means you always get something.
  // Only the first deserves the warning colour.
  if (mixed && /none/i.test(orbit)) return "PARTIAL";
  if (mixed || (orbit.includes("LEO") && orbit.includes("GEO"))) return "VARIES";
  if (orbit.includes("MEO")) return "MEO";
  if (orbit.startsWith("LEO")) return "LEO";
  return "GEO";
}

function decorate(key, extra) {
  return { ...VERDICT_UI[key], key, ...extra };
}

function googleFallback(signal, why, aircraftText) {
  const key = signal === "absent" ? "GOOGLE_NO" : signal === "nodata" ? "UNKNOWN" : "GOOGLE_YES";
  return decorate(key, { provider: null, orbit: null, entry: null, google: signal, why: VERDICT_UI[key].why, reason: why, aircraft: aircraftText });
}

function verdictFor(carrierCode, aircraftText, signal) {
  const entry = carrierCode ? WIFI_REGISTRY[carrierCode] : null;
  if (!entry) return googleFallback(signal, "no-airline", aircraftText);
  const rule = pickRule(entry, classifyFleet(aircraftText), aircraftText);
  if (!rule) return googleFallback(signal, "no-rule-for-aircraft", aircraftText);
  const key = classifyOrbit(rule.orbit);
  // a sourced "we could not establish this" loses to Google actually publishing an amenity line
  if (key === "UNKNOWN" && signal !== "nodata") {
    const g = signal === "absent" ? "GOOGLE_NO" : "GOOGLE_YES";
    return decorate(g, { provider: rule.provider, orbit: rule.orbit, entry, google: signal, viaGoogle: true, aircraft: aircraftText });
  }
  const policy = CALL_POLICY[carrierCode];
  return decorate(key, {
    provider: rule.provider,
    orbit: rule.orbit,
    entry,
    code: carrierCode,
    google: signal,
    aircraft: aircraftText,
    // a fast link is the only case where the policy changes what the chip should say: on a slow or
    // absent one the call is off the table regardless of what the airline permits
    ...(policy && (key === "LEO" || key === "MEO") ? { label: CALL_LABEL[policy.calls] } : {}),
    // knowing the aircraft narrows what the uncertainty is about, so it should narrow the wording too
    ...(aircraftText && TYPED_UI[key] ? TYPED_UI[key] : {}),
    conflict: key === "NONE" && (signal === "free" || signal === "paid" || signal === "generic")
  });
}

// Weakest link wins, but a set that mixes "no wifi" with "wifi" is not "no wifi", it is a coin toss,
// and that distinction is the whole reason the amber tier exists.
function rollup(keys) {
  const bad = keys.some((k) => k === "NONE" || k === "PARTIAL");
  const good = keys.some((k) => k === "PARTIAL" || RANK[k] >= 3);
  if (bad && good) return "PARTIAL";
  // NONE outranks UNKNOWN, so a plain minimum would report a flat "No Wi-Fi" for a trip whose other
  // leg we never checked. An unverified leg cannot be swallowed by a verified one: no wifi is only
  // the answer when every leg says so.
  if (keys.includes("UNKNOWN") && !keys.every((k) => k === "UNKNOWN")) return "UNKNOWN";
  return keys.reduce((a, b) => (RANK[a] <= RANK[b] ? a : b));
}

/* ---------- registry prose -> reader copy ---------- */

// The registry's provider and access fields are written to be checkable by us, not readable by a
// traveller: they carry provenance, hedges, rollout dates and tier tables, and 40% of them run past
// 120 characters. The card keeps the facts someone acts on and leaves the rest to the sources.
// Attribution is stripped rather than dropped: "a 2026 review reports free messaging for all cabins"
// is nine words of hedge wrapped around the one fact the reader wants, and the footnote already
// carries the confidence level. Only a clause that is *nothing but* provenance goes.
var HEDGE_PREFIX_RX =
  /^(((a|an|the)\s+)?((\d{4}|recent|one|independent)\s+)?(review|report|teardown|test)s?\s+(reports?|says?|found|shows?)|reportedly|according to [^,]+,|[\w' ]+'s own (site|website) (lists|shows|quotes)|the airline (lists|quotes))\s+/i;
var PURE_PROVENANCE_RX = /^(not confirmed by|no official|unverified|we could not)/i;
var ACCESS_POINTS = 3;
var ACCESS_LEN = 120;

// ", plus X" and ", with X" hang a sub-detail off the main fact, so each earns its own line
var CLAUSE_SEPS = [", plus ", ", with "];

// clause boundaries, but never inside brackets: splitting there strands a price range's opening paren
function splitClauses(text) {
  const out = [];
  let buf = "";
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === "(") depth++;
    else if (c === ")") depth--;
    if (!depth) {
      if (c === ";" || (c === "." && /\s/.test(text[i + 1] || " "))) {
        out.push(buf);
        buf = "";
        continue;
      }
      const sep = CLAUSE_SEPS.find((s) => text.startsWith(s, i));
      if (sep) {
        out.push(buf);
        buf = "";
        i += sep.length - 1;
        continue;
      }
    }
    buf += c;
  }
  out.push(buf);
  return out.map((s) => s.trim().replace(/^[,;]\s*/, "").replace(/[.;,]$/, "")).filter(Boolean);
}

// cut back to the last point where brackets balance, so a truncated clause never ends mid-parenthesis
function trimTo(s, n) {
  if (s.length <= n) return s;
  let cut = s.slice(0, n - 1).replace(/[\s,]+\S*$/, "");
  let depth = 0;
  for (const c of cut) {
    if (c === "(") depth++;
    else if (c === ")") depth--;
  }
  if (depth > 0) cut = cut.slice(0, cut.lastIndexOf("(")).replace(/[\s,]+$/, "");
  return cut + "…";
}

function costOf(text) {
  // "not disclosed: no source states whether any tier is complimentary" is a statement of absence,
  // and matching the word inside it produced a "Free" badge over a sentence saying nobody knows
  if (/not disclosed|no source (found )?states|not published/i.test(text) && !/US\$|\$\d|EUR ?\d|CHF ?\d|£\d|€\d/i.test(text)) return null;
  const free = /\bfree\b|complimentary|no charge|at no cost/i.test(text);
  const paid = /\bpaid\b|\bfor a fee\b|US\$|\$\d|EUR ?\d|CHF ?\d|£\d|€\d/i.test(text);
  return free && paid ? "Free tier, then paid" : paid ? "Paid" : free ? "Free" : null;
}

function accessPoints(text, cost) {
  const all = splitClauses(text).map((c) => c.replace(HEDGE_PREFIX_RX, ""));
  const kept = all.filter((c) => c && !PURE_PROVENANCE_RX.test(c));
  return (kept.length ? kept : all)
    // a bare "Paid" clause is what the badge above already says
    .filter((c) => !(cost && /^(paid|free)$/i.test(c)))
    .slice(0, ACCESS_POINTS)
    .map((p) => trimTo(p.charAt(0).toUpperCase() + p.slice(1), ACCESS_LEN));
}

// "Inmarsat GX Aviation Ka-band (Inmarsat now owned by Viasat) - not confirmed by Oman Air itself"
// is a research note. The reader wants the brand, so the parenthetical, the caveat after the dash
// and the rollout narrative after the semicolon all go.
var PROVIDER_LEN = 90;

function cleanProvider(p) {
  return trimTo(
    String(p || "")
      .replace(/\s*\([^)]*\)/g, "")
      .split(";")[0]
      .split(/\s+[-–—]\s+/)[0]
      .trim(),
    PROVIDER_LEN
  );
}

var PROVIDER_BRANDS = [
  ["Starlink", /\bstarlink\b/i],
  ["Panasonic", /\bpanasonic\b/i],
  ["Viasat", /\bviasat\b/i],
  ["Inmarsat", /\binmarsat\b/i],
  ["Intelsat", /\bintelsat\b/i],
  ["Eutelsat OneWeb", /\boneweb\b/i],
  ["SES", /\bSES\b/],
  ["SITA OnAir", /\bsita\b/i],
  ["Anuvu", /\banuvu\b/i],
  ["Thales", /\bthales\b/i],
  ["Gogo", /\bgogo\b/i],
  ["Hughes", /\bhughes\b/i],
  ["Nelco", /\bnelco\b/i],
  ["Immfly", /\bimmfly\b/i],
  ["Telesat", /\btelesat\b/i],
  ["Iridium", /\biridium\b/i],
  ["Kuiper", /\bkuiper\b/i],
  ["Gilat", /\bgilat\b/i],
  ["FlyNet", /\bflynet\b/i],
  ["European Aviation Network", /\beuropean aviation network\b|\bEAN\b/],
  ["China Satcom", /\bchina satcom\b/i]
];

var BRAND_GONE_RX = /\b(removed|deactivated|no longer|retired|discontinued|withdrawn|until fitted|until the|pending)\b/i;
var BRAND_LATER_RX = /\b(announced|planned|plans|due|targeted|expected|scheduled|trial|trials|rollout|retrofit|order|ordered|upcoming|to be decided|not yet|no confirmed|from H[12]|under way|underway)\b/i;
var BRAND_NOW_RX = /\b(in service|in passenger service|live|flying|equipped|fitted|installed|available|complete|completed|today|currently|on most|on all|on select|paid|free)\b/i;
var PROVIDER_BRAND_MAX = 2;

function brandsIn(text) {
  const clean = String(text || "").replace(/\s*\([^)]*\)/g, " ");
  const found = [];
  const add = (name) => {
    if (name && found.indexOf(name) === -1) found.push(name);
  };
  for (const [name, rx] of PROVIDER_BRANDS) {
    const m = rx.exec(clean);
    if (m && m.index === 0) add(name);
  }
  for (const c of splitClauses(clean)) {
    if (BRAND_GONE_RX.test(c)) continue;
    if (BRAND_LATER_RX.test(c) && !BRAND_NOW_RX.test(c)) continue;
    for (const [name, rx] of PROVIDER_BRANDS) if (rx.test(c)) add(name);
  }
  return found;
}

function orderBrands(names) {
  const i = names.indexOf("Starlink");
  if (i > 0) names.splice(i, 1), names.unshift("Starlink");
  const use = names.slice(0, PROVIDER_BRAND_MAX);
  return use.length > 1 ? use.join(" and ") : use[0] || "";
}

function brandLine(text) {
  return orderBrands(brandsIn(text));
}

// joined across a fleet, "None" alongside a real provider reads as a product name
function providerLine(rules) {
  const live = [];
  for (const r of rules) {
    if (classifyOrbit(r.orbit) === "NONE") continue;
    for (const n of brandsIn(r.provider)) if (live.indexOf(n) === -1) live.push(n);
  }
  const brands = orderBrands(live);
  if (brands) return brands;
  const names = [...new Set(rules.map((r) => cleanProvider(r.provider)).filter(Boolean))];
  const real = names.filter((n) => !/^none\b/i.test(n));
  const use = real.length ? real : names;
  // a fleet running four networks is a fact about the fleet, not a list to recite on a flight card
  return trimTo(use.length > 2 ? `${use.slice(0, 2).join(" / ")} and ${use.length - 2} more` : use.join(" / "), PROVIDER_LEN);
}

// The collapsed row names the airlines but never the aircraft, so the honest summary rolls the whole
// fleet into one answer; a connection rolls each leg's operator in as well.
//
// A connection is not one fleet, though, and collapsing it to a fleet word misreads the trip:
// DEL-DOH-FRA-STN on IndiGo, Qatar and Ryanair came out as "Not guaranteed", which describes one
// uncertain aircraft when the truth is that two of the three legs are certainly dark and the third
// has Starlink. When the legs disagree the label says so and sends the reader to the breakdown.
function fwLegsVerdict(segs) {
  const parts = segs.map((s) => {
    const cc = regCode(s.cc || "");
    return { cc, ac: s.ac, dep: s.dep, arr: s.arr, v: verdictFor(cc, s.ac || "", "nodata") };
  });
  if (parts.some((p) => !p.cc || !WIFI_REGISTRY[p.cc])) return { suppress: true, ccs: parts.map((p) => p.cc).join("+") };
  if (parts.some((p) => !p.ac || !p.v || !p.v.entry)) return null;
  if (parts.length === 1) return { v: parts[0].v, ccs: parts[0].cc };
  const key = rollup(parts.map((p) => p.v.key));
  const differ = new Set(parts.map((p) => p.v.key)).size > 1;
  return {
    ccs: [...new Set(parts.map((p) => p.cc))].join("+"),
    v: decorate(differ && key === "PARTIAL" ? "LEG_PARTIAL" : key, {
      legs: parts.map((p) => ({ code: p.cc, entry: p.v.entry, key: p.v.key, aircraft: p.ac, v: p.v, dep: p.dep, arr: p.arr })),
      aircraft: parts.map((p) => p.ac).join(" \u00b7 "),
      entry: null
    })
  };
}

function fleetVerdict(codes) {
  // two legs on the same carrier are one fleet answer, not a repeated row; deduping here also
  // keeps the single-carrier path (with its provider and cost detail) for an out-and-back on one airline
  const legs = [...new Set(codes)].map((code) => ({ code, entry: WIFI_REGISTRY[code] })).filter((l) => l.entry);
  if (!legs.length) return null;
  for (const leg of legs) leg.key = rollup(leg.entry.rules.map((r) => classifyOrbit(r.orbit)));
  const only = legs.length === 1 ? legs[0].entry : null;
  const key = rollup(legs.map((l) => l.key));
  const legsDiffer = legs.length > 1 && new Set(legs.map((l) => l.key)).size > 1;
  return decorate(legsDiffer && key === "PARTIAL" ? "LEG_PARTIAL" : key, {
    legs,
    entry: only,
    provider: only ? providerLine(only.rules) : null,
    orbit: only ? only.rules.map((r) => r.orbit).join(" / ") : null,
    fleetwide: true
  });
}

/* ---------- hover card ---------- */

// A native title= tooltip waits half a second, cannot be styled and cannot hold a table, and the
// whole point of the chip is to answer the question without expanding the card. One fixed-position
// node on <body> keeps this entirely outside Google's own layout.
var tip = null;
var activeChip = null;
// Leaving the chip does not close the card at once: the pointer needs a moment to cross the gap
// into the card, and once it is inside, the card stays until the pointer leaves it. This is how
// Google's own airport-code tooltips behave on the same page, so it is what people expect here.
var HIDE_GRACE_MS = 180;
var hideTimer = null;

function cancelHide() {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
}

function scheduleHide() {
  cancelHide();
  hideTimer = setTimeout(() => {
    hideTimer = null;
    hideTip();
  }, HIDE_GRACE_MS);
}

// `html` is for markup this file builds itself; anything page- or registry-derived goes through `v`
function tipRow(k, v, html) {
  return `<div class="fw-tip-k">${k}</div><div class="fw-tip-v">${html || escapeHtml(v)}</div>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

var MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthOf(asOf) {
  const m = /^(\d{4})-(\d{2})/.exec(asOf || "");
  return m && MONTHS_SHORT[+m[2] - 1] ? `${MONTHS_SHORT[+m[2] - 1]} ${m[1]}` : asOf || "";
}

// The footnote used to read "sourced, verification pending · as of 2026-08 · 6 refs", which is our
// bookkeeping rather than anything a traveller can weigh. What they can weigh is when the entry
// was last checked. Across several airlines the oldest check date
// is the honest one.
function sourceLine(entries) {
  const asOf = entries.map((e) => e.as_of).filter(Boolean).sort()[0];
  return asOf ? `Checked ${monthOf(asOf)}` : "Registry entry";
}

function capRow(kind, items) {
  return tipRow(
    kind === "good" ? "Good for" : "Not for",
    "",
    items.map((i) => `<span class="fw-cap fw-cap-${kind}">${escapeHtml(i)}</span>`).join("")
  );
}

// The rows below the verdict describe one airline's system. On a connection that airline is the
// one whose leg set the verdict: the weakest link is what the reader is going to hit.
function weakestLeg(legs) {
  return legs.reduce((a, b) => (RANK[a.key] <= RANK[b.key] ? a : b));
}

function legLabel(leg) {
  return (leg.v && leg.v.label) || VERDICT_UI[leg.key].label;
}

// What a leg can and cannot carry, one line per item, so the reader can tie each answer to a
// specific flight instead of inferring it from a rolled-up verdict.
function legCaps(key) {
  if (key === "NONE") return [["bad", "No internet on this plane"]];
  if (key === "PARTIAL") return [["bad", "Some planes of this type have no Wi-Fi"]];
  if (key === "UNKNOWN") return [["unknown", "Not verified"]];
  const cap = CAPABILITY[key];
  if (!cap) return [];
  return [...cap.good.map((g) => ["good", g]), ...cap.bad.map((b) => ["bad", b])];
}

// The header line on a connection describes the journey, not the satellite: the reader wants to
// know whether the legs agree before they read them.
function journeyWhy(v) {
  const legs = v.legs;
  const none = legs.filter((l) => l.key === "NONE").length;
  const keys = new Set(legs.map((l) => l.key));
  if (none && none < legs.length) {
    return none === 1
      ? "One leg has no Wi-Fi, so it sets the trip result."
      : `${none} legs have no Wi-Fi, so they set the trip result.`;
  }
  if (keys.size > 1) return "Wi-Fi differs across your trip. The weakest leg sets the result.";
  return `Same result on every leg. ${v.why}`;
}

// One card per leg, numbered and labelled by route, so each verdict is tied to a flight segment
// rather than to an airline name that may appear twice. Per-leg ticks appear only when the legs
// actually differ; when they agree, the shared rows below say it once. A fleet-level connection on
// one airline (no route, no aircraft, one answer) has nothing a card per leg could add.
function legCards(v) {
  const legs = v.legs;
  const differ = new Set(legs.map((l) => l.key)).size > 1;
  const airlinesDiffer = new Set(legs.map((l) => l.code)).size > 1;
  const detailed = legs.some((l) => (l.dep && l.arr) || l.aircraft);
  if (!detailed && !differ && !airlinesDiffer) return "";
  const lay = v.layovers || {};
  return (
    `<div class="fw-legs">` +
    legs
      .map((leg, i) => {
        const route = leg.dep && leg.arr ? ` · ${escapeHtml(leg.dep)} → ${escapeHtml(leg.arr)}` : "";
        const main = escapeHtml(leg.entry.airline) + (leg.aircraft ? ` · ${escapeHtml(leg.aircraft)}` : "");
        const ui = VERDICT_UI[leg.key];
        const caps = differ
          ? `<div class="fw-leg-caps">${legCaps(leg.key)
              .map(([k, t]) => `<span class="fw-cap fw-cap-${k}">${escapeHtml(t)}</span>`)
              .join("")}</div>`
          : "";
        const last = i === legs.length - 1;
        const conn = last
          ? ""
          : `<div class="fw-leg-conn">↓ ${leg.arr ? (lay[leg.arr] ? `${escapeHtml(lay[leg.arr])} at ${escapeHtml(leg.arr)}` : `connect at ${escapeHtml(leg.arr)}`) : "connection"}</div>`;
        return (
          `<div class="fw-leg-card"><div class="fw-leg-hd">Leg ${i + 1}${route}</div>` +
          `<div class="fw-leg-main"><span>${main}</span><b class="fw-tip-tag fw-${ui.cls}">${escapeHtml(legLabel(leg))}</b></div>` +
          caps +
          `</div>` +
          conn
        );
      })
      .join("") +
    `</div>`
  );
}

function aircraftText(v, legsShown) {
  const legs = v.legs || [];
  if (legs.length > 1 && legs.every((l) => l.aircraft)) {
    if (legsShown) return null;
    const acs = legs.map((l) => l.aircraft);
    const uniq = [...new Set(acs)];
    return uniq.length === 1 ? `${uniq[0]} on every leg` : acs.join(", then ");
  }
  if (v.aircraft) return v.aircraft;
  if (!v.fleetwide) return "not shown";
  return v.aircraftNote || (v.noExpand ? "whole fleet, this view never names it" : "whole fleet, not named until you expand");
}

var CARD_ACCESS_LEN = 74;

function accessLine(entry, cost) {
  const short = String(entry.access_short || "").trim();
  if (short) return short;
  const pts = accessPoints(entry.access, cost).filter((t) => t.indexOf("\u2026") === -1 && t.length <= CARD_ACCESS_LEN);
  return pts.length ? pts[0] : "";
}

function costHtml(entry, withPoints, withBadge) {
  const cost = costOf(entry.access);
  const line = withPoints ? accessLine(entry, cost) : "";
  return (
    (cost && withBadge !== false ? `<b class="fw-cost">${escapeHtml(cost)}</b>` : "") +
    (line ? `<ul class="fw-pts"><li>${escapeHtml(line)}</li></ul>` : "")
  );
}

function tipHtml(v) {
  const rows = [];
  const legs = v.legs && v.legs.length > 1 ? v.legs : null;
  const weak = legs ? weakestLeg(legs) : null;
  const entry = legs ? weak.entry : v.entry;
  const code = legs ? weak.code : v.code;
  const airlines = legs ? [...new Map(legs.map((l) => [l.code, l])).values()] : [];
  const airlinesDiffer = airlines.length > 1;
  const legsHtml = legs ? legCards(v) : "";
  const keysDiffer = Boolean(legs) && new Set(legs.map((l) => l.key)).size > 1;
  const cap = CAPABILITY[v.key];

  // what you can do with it comes first, because that is the question; who supplies it comes after.
  // On a connection whose legs disagree the ticks already sit on each leg card, so they are not
  // repeated here for the weakest one.
  if (cap && !keysDiffer) {
    if (cap.good.length) rows.push(capRow("good", cap.good));
    if (cap.bad.length) rows.push(capRow("bad", cap.bad));
  }

  // The capability rows say what the link can carry; this says what you are allowed to do with it.
  // Only a policy taken from the airline's own pages is stated as a row: "permitted (unconfirmed)"
  // tells the reader nothing they can act on. A reported ban still surfaces below as a hedged note,
  // because on that side the cost of staying quiet is someone planning a call they cannot make.
  const policyRows = (legs ? airlines : code ? [{ code, entry }] : [])
    .map((l) => ({ l, policy: CALL_POLICY[l.code] }))
    .filter((x) => x.policy && !x.policy.check);
  if (v.key !== "NONE") {
    for (const { l, policy } of policyRows) {
      const who = airlinesDiffer ? `<span class="fw-tip-who">${escapeHtml(l.entry.airline)}</span>` : "";
      rows.push(tipRow("Calls", "", who + escapeHtml(CALL_POLICY_TEXT[policy.calls])));
    }
  }

  if (entry) {
    const raw = legs ? (weak.v ? weak.v.provider : providerLine(weak.entry.rules)) : v.provider;
    // for a no-wifi verdict the field usually carries the nuance that matters (a streaming LAN with
    // no uplink, say); a bare "None" only repeats the label
    const dark = v.key === "NONE" || (legs && weak.key === "NONE");
    const p = dark ? cleanProvider(raw) : brandLine(raw) || cleanProvider(raw);
    if (p && !/^none$/i.test(p)) rows.push(tipRow(dark ? "Onboard" : "Provider", p));
  }

  const ac = aircraftText(v, Boolean(legsHtml));
  if (ac) rows.push(tipRow("Aircraft", ac));

  // Cost is the row a connection card used to drop entirely, and it is the one people compare on.
  // With two airlines on the trip each gets its badge; the fine print follows only the airline
  // whose leg set the verdict, so the card does not double in height.
  // a price on a no-wifi card is the entertainment portal's, not internet's, so the row says what
  // is on board rather than what internet costs. Only when every leg is dark, though: an airline
  // whose 787 sells Wi-Fi and whose 737 has none is quoting the 787's price, and that is a cost.
  const noWifi = legs ? legs.every((l) => l.key === "NONE") : v.key === "NONE";
  if (airlinesDiffer) {
    const cells = airlines
      .filter((l) => l.entry && l.entry.access)
      .map((l) => `<div class="fw-tip-cost"><span class="fw-tip-who">${escapeHtml(l.entry.airline)}</span>${costHtml(l.entry, l.code === weak.code, l.key !== "NONE")}</div>`);
    if (cells.length) rows.push(tipRow("Cost", "", cells.join("")));
  } else if (entry && entry.access) {
    const html = costHtml(entry, true, !noWifi);
    if (html) rows.push(tipRow(noWifi ? "Onboard" : "Cost", "", html));
  }

  const notes = [];
  // the gap between "the link can carry this" and "the airline allows this" is the one people get
  // caught by, so it is stated outright rather than left for the reader to infer. Only worth a note
  // where the link would otherwise carry the call: on a slow or absent one the policy changes nothing.
  const fastLink = v.key === "LEO" || v.key === "MEO" || v.key === "VARIES";
  if (fastLink) {
    const barred = [];
    const reported = [];
    const voiceOnly = [];
    for (const l of legs ? airlines : code ? [{ code, entry }] : []) {
      const policy = CALL_POLICY[l.code];
      if (!policy || !l.entry) continue;
      if (policy.calls === "no") (policy.check ? reported : barred).push(l.entry.airline);
      if (policy.calls === "voice") voiceOnly.push(l.entry.airline);
    }
    const names = (list) => (list.length > 1 ? `${list.slice(0, -1).join(", ")} and ${list[list.length - 1]}` : list[0]);
    const verb = (list, one, many) => (list.length > 1 ? many : one);
    if (barred.length && reported.length) {
      notes.push(`📵 Airline policy: ${names(barred)} ${verb(barred, "does", "do")} not allow voice or video calls and ${names(reported)} ${verb(reported, "is", "are")} reported not to, however fast the Wi-Fi is.`);
    } else if (barred.length) {
      notes.push(`📵 Airline policy: ${names(barred)} ${verb(barred, "does", "do")} not allow voice or video calls, however fast the Wi-Fi is.`);
    } else if (reported.length) {
      notes.push(`📵 Airline policy: ${names(reported)} ${verb(reported, "is", "are")} reported not to allow voice or video calls, however fast the Wi-Fi is.`);
    }
    if (voiceOnly.length) notes.push(`📵 Airline policy: ${names(voiceOnly)} ${verb(voiceOnly, "allows", "allow")} voice calls but not video calls.`);
  }
  if (v.conflict) notes.push("⚠️ Google lists Wi-Fi for this flight, but our data for this plane says there is none. Treat it as uncertain.");
  if (v.viaGoogle) notes.push("This answer comes from Google. We have not verified the Wi-Fi on this plane ourselves.");
  if (v.unresolvedOperator) {
    notes.push(`⚠️ Operated by ${v.unresolvedOperator}, which we have not verified yet. The answer above is for the airline that sold the ticket.`);
  }

  // saying plainly what we do not know is the part that earns the rest of the card
  const info = !v.fleetwide
    ? ""
    : v.expandHint ||
      (v.noExpand
        ? "This is the answer for the whole fleet. This view never names the plane, so we cannot tell which one you get."
        : legs
          ? airlinesDiffer
            ? "Each airline above is its whole fleet. Expand the flight to see the plane on each leg."
            : "Whole fleet on every leg. Expand the flight to see the plane on each."
          : "Expand the flight for the answer on the exact plane.");

  const caption = airlinesDiffer && weak.entry ? `<div class="fw-tip-caption">Details below are for ${escapeHtml(weak.entry.airline)}, the leg that sets the result.</div>` : "";

  // provenance is the footnote, not a field: it matters enormously to us and to almost no reader
  const src = legs ? sourceLine(legs.map((l) => l.entry)) : entry ? sourceLine([entry]) : "From Google's flight data, not our own checks";
  const href = entry ? `https://flightwifi.app/airlines/${slugify(entry.airline)}/` : "https://flightwifi.app/";
  const act = `<a class="fw-tip-link" href="${href}" target="_blank" rel="noopener">${entry ? escapeHtml(entry.airline) + " Wi-Fi details" : "Wi-Fi details"} ↗</a>`;

  return (
    `<div class="fw-tip-head fw-${v.cls}"><span class="fw-tip-dot"></span>${escapeHtml(v.label)}<span class="fw-tip-brand">FlightWifi</span></div>` +
    `<div class="fw-tip-why">${escapeHtml(legs ? journeyWhy(v) : v.why)}</div>` +
    legsHtml +
    caption +
    `<div class="fw-tip-grid">${rows.join("")}</div>` +
    notes.map((n) => `<div class="fw-tip-note">${escapeHtml(n)}</div>`).join("") +
    (info ? `<div class="fw-tip-info">${escapeHtml(info)}</div>` : "") +
    `<div class="fw-tip-foot"><span class="fw-tip-src">${escapeHtml(src)}</span>` +
    `<span class="fw-tip-act">${act}</span></div>`
  );
}

function placeTip(chip) {
  const r = chip.getBoundingClientRect();
  const t = tip.getBoundingClientRect();
  const left = Math.max(8, Math.min(r.left, window.innerWidth - t.width - 12));
  const below = r.bottom + 8;
  tip.style.left = `${left}px`;
  tip.style.top = `${below + t.height > window.innerHeight - 8 ? Math.max(8, r.top - t.height - 8) : below}px`;
}

function showTip(chip) {
  const v = chip.__fw;
  if (!v) return false;
  if (!tip || !tip.isConnected) {
    tip = document.createElement("div");
    tip.className = "fw-tip";
    tip.setAttribute("role", "tooltip");
    tip.addEventListener("mouseenter", cancelHide);
    tip.addEventListener("mouseleave", scheduleHide);
    document.body.appendChild(tip);
  }
  if (activeChip !== chip) tip.innerHTML = tipHtml(v);
  activeChip = chip;
  tip.style.visibility = "hidden";
  tip.style.display = "block";
  placeTip(chip);
  tip.style.visibility = "visible";
  return true;
}

function hideTip() {
  cancelHide();
  if (!activeChip) return;
  activeChip = null;
  if (tip) tip.style.display = "none";
}

// Google Flights fires scroll on its inner containers constantly, so hiding on any scroll would
// tear the card away the moment it appeared. It follows the chip instead, and only leaves when
// the chip itself does.
function trackTip() {
  if (!activeChip) return;
  if (!activeChip.isConnected) return hideTip();
  const r = activeChip.getBoundingClientRect();
  if (r.bottom < 0 || r.top > window.innerHeight) return hideTip();
  placeTip(activeChip);
}

document.addEventListener(
  "mouseover",
  (e) => {
    const chip = e.target.closest && e.target.closest(".fw-chip");
    if (chip) {
      cancelHide();
      showTip(chip);
    } else if (e.target.closest && e.target.closest(".fw-tip")) {
      cancelHide();
    } else {
      scheduleHide();
    }
  },
  true
);
// chips are not focusable, so any focus change means attention moved elsewhere; focus landing
// inside the card (its link) is the one exception
document.addEventListener("focusin", (e) => {
  if (tip && tip.contains(e.target)) return;
  hideTip();
});
document.addEventListener("scroll", trackTip, true);
window.addEventListener("resize", trackTip);

/* ---------- chip ---------- */

// One line, one claim. Everything that used to crowd the chip (provider, access, sourcing) moved
// into the hover card, because in a 100px amenity column a second clause just wraps to three lines.
function buildChip(v) {
  const chip = document.createElement("span");
  chip.className = `fw-chip fw-${v.cls}`;
  chip.textContent = v.label;
  chip.__fw = v;
  // The popup tallies by this, not by class: two different answers share the "ok" class.
  if (v.row) chip.dataset.fwRow = v.row;
  // aria-label on a bare span is ignored by most screen readers; role="img" makes it authoritative
  // and lets the reasoning be announced. Deliberately not focusable: the chip is informational, and
  // thirty extra tab stops between the reader and "Select flight" is a worse trade than losing the
  // hover card on keyboard, which only repeats what the label and this description already say.
  chip.setAttribute("role", "img");
  chip.setAttribute("aria-label", `FlightWifi: ${v.label}. ${v.why}.`);
  return chip;
}

// Google Flights ships its own light/dark toggle, so the OS preference is not authoritative and the
// real page background is. Same probe the GetStopover extension uses: a transparent background says
// nothing about what the reader actually sees, so it is skipped rather than read as black, and text
// colour is the last word because it is never transparent.
var RGB_RX = /(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/;

function lum(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function readTheme() {
  for (let el = document.body; el; el = el.parentElement) {
    const m = RGB_RX.exec(getComputedStyle(el).backgroundColor);
    if (m && (m[4] === undefined || +m[4] >= 0.5)) return lum(+m[1], +m[2], +m[3]) < 128 ? "fw-dark" : "fw-light";
  }
  const t = RGB_RX.exec(getComputedStyle(document.body).color);
  if (t) return lum(+t[1], +t[2], +t[3]) >= 128 ? "fw-dark" : "fw-light";
  return "fw-light";
}

var themeSeen = "";
function syncTheme() {
  const theme = readTheme();
  if (theme === themeSeen) return;
  themeSeen = theme;
  document.documentElement.classList.remove("fw-dark", "fw-light");
  document.documentElement.classList.add(theme);
}

// Toggling the theme rewrites class/style on <html> or <body> and changes no result card, so waiting
// for the next sweep would leave the chips the wrong colour until something else moved. Watching the
// two elements that actually carry the theme costs nothing; the filter stays on class+style so the
// dev build's own debug attribute writes on <html> cannot retrigger it.
new MutationObserver(syncTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });
if (document.body) {
  new MutationObserver(syncTheme).observe(document.body, { attributes: true, attributeFilter: ["class", "style"] });
}
if (window.matchMedia) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  if (mq.addEventListener) mq.addEventListener("change", syncTheme);
}

var FW_TRACE = [];


/* ---------- popup bridge ----------
   The popup cannot see the page, so the content script answers for it. Counting the rendered
   summary chips is the honest number: it is exactly what the user can see on screen right now,
   not what we attempted. Also gates each site behind its own setting, kept here rather than in the
   three site files so their boot tails stay identical. */

var FW_SITE_LABEL = { google: "Google Flights", skyscanner: "Skyscanner", soar: "Soar" };

function fwCounts() {
  const out = {};
  for (const el of document.querySelectorAll(".fw-chip.fw-sum")) {
    const row = el.dataset.fwRow;
    if (row) out[row] = (out[row] || 0) + 1;
  }
  return out;
}

function fwRemoveChips() {
  for (const n of document.querySelectorAll(".fw-chip, .fw-row")) n.remove();
}

function fwBoot(site, start, stop) {
  // The popup re-injects this script into tabs an extension update orphaned, so a boot has to tell
  // three states apart: nothing here yet, a live instance already running, and the remains of one
  // Chrome orphaned. A boolean flag cannot, because the isolated world's globals outlive the
  // context that set them, so a corpse looks exactly like a running instance and the repair becomes
  // a silent no-op. Asking the previous instance to prove it is alive can: touching chrome.runtime
  // from an orphaned context throws, so only a genuinely live script answers true.
  let previousIsAlive = false;
  try {
    previousIsAlive = typeof window.__fwPing === "function" && window.__fwPing() === true;
  } catch (e) {
    previousIsAlive = false;
  }
  if (previousIsAlive) return false;
  window.__fwPing = () => {
    try {
      return !!(chrome.runtime && chrome.runtime.id);
    } catch (e) {
      return false;
    }
  };

  // Reaching here means this script owns the page's chips from now on. On a normal load there are
  // none; on a repair injection the orphaned script left its own behind, and those must go, because
  // a chip drawn by a dead instance is not one this instance will keep up to date.
  // The orphan's timers and observer are still running, though, and would keep redrawing over us,
  // so it is told to stand down through the one channel a dead extension context still has: a DOM
  // event. This instance listens for the same event so that the next repair can stop it in turn.
  // Dispatch first, listen second, or an instance would stop itself.
  document.dispatchEvent(new CustomEvent("fw:takeover"));
  fwRemoveChips();
  const onTakeover = () => {
    document.removeEventListener("fw:takeover", onTakeover);
    try {
      stop();
    } catch (e) {}
    fwRemoveChips();
  };
  document.addEventListener("fw:takeover", onTakeover);

  let on = null;
  const apply = (next) => {
    if (next === on) return;
    on = next;
    if (next) start();
    else {
      stop();
      fwRemoveChips();
    }
  };
  // Fail open: a storage read that throws must never cost the user the product's actual function.
  chrome.storage.local
    .get("fwSites")
    .then((s) => apply(((s && s.fwSites) || {})[site] !== false))
    .catch(() => apply(true));

  chrome.storage.onChanged.addListener((ch, area) => {
    if (area === "local" && ch.fwSites) apply(((ch.fwSites.newValue) || {})[site] !== false);
  });

  // The reply is synchronous, so the listener must return nothing. Returning true tells Chrome to
  // hold the channel open for an asynchronous answer that never comes, and a channel held open is a
  // sendMessage promise on the other end that never settles: the popup sits on its placeholder.
  chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
    if (!msg || msg.type !== "FW_STATUS") return;
    reply({ site, label: FW_SITE_LABEL[site], enabled: on === true, counts: fwCounts() });
  });
  return true;
}
