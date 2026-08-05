const AIRCRAFT_NODE_RX = /^(Airbus|Boeing|Embraer|ATR|De Havilland|Canadair|Bombardier|Mitsubishi|McDonnell|Saab|Fokker|Dornier|Sukhoi|Antonov|Tupolev|Ilyushin|Comac|COMAC|Cessna|Beechcraft|Pilatus|Viking|Xian)\b.*\d/;
const FLIGHT_AFTER_AIRCRAFT_RX = /\b([A-Z][A-Z0-9])\s?(\d{1,4})\b/;
const WIDEBODY_RX = /(A3[358]0|A340|747|767|777|787)/;

const NAME_INDEX = {};
for (const code in WIFI_REGISTRY) NAME_INDEX[WIFI_REGISTRY[code].airline.toLowerCase()] = code;
// longest first: "Thai AirAsia" must not resolve to AirAsia, "Air India Express" must not resolve to Air India
const NAME_KEYS = Object.keys(NAME_INDEX).sort((a, b) => b.length - a.length);

// Google shortens what it prints: the registry's "Vietjet Air" shows on the card as "Vietjet", which
// substring matching can never reach because the stored name is the longer of the two. The trimmed
// form is registered as an alias, but a collision blanks the entry rather than picking a winner, and
// lookups are exact so "Singapore" can never be read out of "Singapore Changi Airport".
// Normalising away spacing and punctuation is what lets the registry's "airBaltic" meet Google's
// "Air Baltic"; it cannot manufacture a match between two genuinely different strings.
const GENERIC_SUFFIX_RX = /\s+(air lines|airlines|airways|airline|air|aviation|airlink)$/i;

function norm(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// A handful of carriers trade under a name the registry does not store at all, which no amount of
// normalising will bridge. Added only when a route sweep shows a real gap, never guessed.
// "lot" is safe only because these lookups match the whole cell text exactly; as a substring it
// would fire on the English word.
const TRADE_NAMES = { "scandinavian airlines": "SK", lot: "LO" };

const EXACT_INDEX = {};
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

function carrierForLeg(aircraftNode, li) {
  const aircraftText = aircraftNode.textContent.trim();
  let code = null;
  let el = aircraftNode.parentElement;
  for (let i = 0; i < 4 && el && el !== li; i++) {
    const text = el.textContent;
    const idx = text.indexOf(aircraftText);
    if (idx >= 0) {
      const m = text.slice(idx + aircraftText.length).match(FLIGHT_AFTER_AIRCRAFT_RX);
      if (m && !code) code = m[1];
      if (code && WIFI_REGISTRY[code]) return code;
      // subsidiaries fly under their own code (Wizz Air UK is W9, not W6) but keep the parent's name
      const byName = carrierByName(text);
      if (byName) return byName;
    }
    el = el.parentElement;
  }
  return carrierByName(li.textContent) || code;
}

// Labels name the outcome, not the plumbing: nobody is choosing a flight by satellite orbit, they
// are asking whether they can take the standup call. The one thing an outcome label must not do is
// promise less than the truth, which is why high-orbit reads "Email & browsing" rather than
// "Messaging only" - a 600ms link is bad for live calls and completely fine for mail and docs.
//
// Amber is the only colour that asks the reader to stop, so it is reserved for the one case that
// warrants it: part of the fleet has no wifi at all and the schedule will not say which you get.
const VERDICT_UI = {
  LEO: { cls: "fast", label: "Video calls work", why: "Low-orbit satellite, quick enough to be treated like ground wifi", latency: "roughly 20-50ms (low orbit)" },
  MEO: { cls: "fast", label: "Video calls work", why: "Mid-orbit satellite, usually quick enough for a live call", latency: "roughly 120-150ms (mid orbit)" },
  GEO: { cls: "ok", label: "Email & browsing", why: "High-orbit satellite. The lag is the limit, not the speed", latency: "roughly 600ms and up (high orbit)" },
  A2G: { cls: "ok", label: "Email & browsing", why: "Ground-based network beamed up from masts. Fine until you need it live", latency: "air-to-ground, no satellite" },
  VARIES: { cls: "ok", label: "Fast on some flights", why: "Every aircraft has wifi. Whether it is the quick kind depends which one turns up", latency: "varies by aircraft" },
  PARTIAL: { cls: "part", label: "Not guaranteed", why: "Part of this fleet has no wifi at all, and the schedule will not say which aircraft you get", latency: "varies by aircraft" },
  LEG_PARTIAL: { cls: "part", label: "Wi-Fi on some legs", why: "The legs of this trip do not match. At least one of them has no wifi at all", latency: "varies by leg" },
  NONE: { cls: "none", label: "No Wi-Fi", why: "No usable internet on this aircraft", latency: null },
  GOOGLE_YES: { cls: "ok", label: "Wi-Fi, speed unknown", why: "Google lists wifi here. We have not verified the provider, so we will not claim a speed", latency: null },
  GOOGLE_NO: { cls: "none", label: "No Wi-Fi", why: "Google publishes amenities for this flight and wifi is not among them", latency: null },
  UNKNOWN: { cls: "unknown", label: "Not verified", why: "We would rather say nothing than guess", latency: null }
};

// What the reader is actually deciding. Only latency-bound outcomes belong here: whether an airline
// lets you stream is a policy of its access tier, not a property of the link, so it stays out.
const CAPABILITY = {
  LEO: { good: ["Video calls", "Email & chat", "Browsing"], bad: [] },
  MEO: { good: ["Video calls", "Email & chat", "Browsing"], bad: [] },
  GEO: { good: ["Email & chat", "Browsing"], bad: ["Video calls", "Anything live"] },
  A2G: { good: ["Email & chat", "Browsing"], bad: ["Video calls", "Anything live"] },
  VARIES: { good: ["Email & chat", "Browsing"], bad: ["Counting on a video call"] }
};

const RANK = { NONE: 0, PARTIAL: 1, UNKNOWN: 2, GEO: 3, A2G: 3, VARIES: 4, MEO: 5, LEO: 6 };

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
  return decorate(key, {
    provider: rule.provider,
    orbit: rule.orbit,
    entry,
    google: signal,
    aircraft: aircraftText,
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
const HEDGE_PREFIX_RX =
  /^(((a|an|the)\s+)?((\d{4}|recent|one|independent)\s+)?(review|report|teardown|test)s?\s+(reports?|says?|found|shows?)|reportedly|according to [^,]+,|[\w' ]+'s own (site|website) (lists|shows|quotes)|the airline (lists|quotes))\s+/i;
const PURE_PROVENANCE_RX = /^(not confirmed by|no official|unverified|we could not)/i;
const ACCESS_POINTS = 3;
const ACCESS_LEN = 120;

// ", plus X" and ", with X" hang a sub-detail off the main fact, so each earns its own line
const CLAUSE_SEPS = [", plus ", ", with "];

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
const PROVIDER_LEN = 90;

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

// joined across a fleet, "None" alongside a real provider reads as a product name
function providerLine(rules) {
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
let tip = null;

// `html` is for markup this file builds itself; anything page- or registry-derived goes through `v`
function tipRow(k, v, html) {
  return `<div class="fw-tip-k">${k}</div><div class="fw-tip-v">${html || escapeHtml(v)}</div>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
}

// Across several airlines the honest headline is the weakest link, not a concatenation of every
// airline's provenance, which runs to three lines and says nothing the reader can act on.
function sourceLine(entries) {
  const refs = entries.reduce((n, e) => n + (e.sources ? e.sources.length : 0), 0);
  const confidence = entries.some((e) => e.confidence === "reported") ? "reported" : "sourced";
  const pending = entries.some((e) => e.needs_verification);
  const asOf = entries.map((e) => e.as_of).sort()[0];
  return (
    `${confidence}${pending ? ", verification pending" : ""} · as of ${asOf}` +
    (refs ? ` · ${refs} ref${refs > 1 ? "s" : ""}` : "")
  );
}

function capRow(kind, items) {
  return tipRow(
    kind === "good" ? "Good for" : "Not for",
    "",
    items.map((i) => `<span class="fw-cap fw-cap-${kind}">${escapeHtml(i)}</span>`).join("")
  );
}

function tipHtml(v) {
  const rows = [];
  const multi = v.legs && v.legs.length > 1;
  const cap = CAPABILITY[v.key];
  // a connection is only as good as its worst leg, and hiding which leg is the bad one would
  // leave the reader unable to act on the verdict
  const legs = multi
    ? `<div class="fw-tip-legs">` +
      v.legs
        .map(
          (leg) =>
            `<div class="fw-tip-leg"><span>${escapeHtml(leg.entry.airline)}</span>` +
            `<b class="fw-tip-tag fw-${VERDICT_UI[leg.key].cls}">${escapeHtml(VERDICT_UI[leg.key].label)}</b></div>`
        )
        .join("") +
      `</div>`
    : "";
  // what you can do with it comes first, because that is the question; who supplies it comes after
  if (cap && !multi) {
    if (cap.good.length) rows.push(capRow("good", cap.good));
    if (cap.bad.length) rows.push(capRow("bad", cap.bad));
  }
  if (!multi && v.entry) {
    const p = cleanProvider(v.provider);
    // for a no-wifi verdict the field usually carries the nuance that matters (a streaming LAN with
    // no uplink, say); a bare "None" only repeats the label
    if (p && !/^none$/i.test(p)) rows.push(tipRow(v.key === "NONE" ? "Onboard" : "Provider", p));
  }
  rows.push(tipRow("Aircraft", v.aircraft || (v.fleetwide ? "whole fleet, not named until you expand" : "not shown")));
  if (!multi && v.entry && v.entry.access) {
    const cost = costOf(v.entry.access);
    const pts = accessPoints(v.entry.access, cost);
    rows.push(
      tipRow(
        "Cost",
        "",
        (cost ? `<b class="fw-cost">${escapeHtml(cost)}</b>` : "") +
          (pts.length ? `<ul class="fw-pts">${pts.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul>` : "")
      )
    );
  }

  const notes = [];
  if (v.conflict) notes.push("Google lists wifi on this flight and our aircraft-level data does not. Treat as uncertain.");
  if (v.viaGoogle) notes.push("This verdict is Google's. Our registry has no confirmed provider for this aircraft.");
  if (v.unresolvedOperator) {
    notes.push(`Flown by ${v.unresolvedOperator}, which is not in the registry yet. This is the marketing airline's fleet answer, not that operator's.`);
  }
  // saying plainly what we do not know is the part that earns the rest of the card. On a connection
  // it also has to explain the mismatch the reader is about to hit: a carrier whose fleet is part
  // fitted reads "Not guaranteed" here and can still turn out to be a Starlink aircraft on expansion.
  const info = !v.fleetwide
    ? ""
    : multi
      ? "Each airline above is its whole fleet. Expand to see the aircraft actually flying each leg."
      : "Expand the flight for the verdict on the exact aircraft.";

  // provenance is the footnote, not a field: it matters enormously to us and to almost no reader
  const src = multi
    ? sourceLine(v.legs.map((l) => l.entry))
    : v.entry
      ? sourceLine([v.entry])
      : "Google's own amenity data, not our own verification";

  return (
    `<div class="fw-tip-head fw-${v.cls}"><span class="fw-tip-dot"></span>${escapeHtml(v.label)}</div>` +
    `<div class="fw-tip-why">${escapeHtml(v.why)}</div>` +
    legs +
    `<div class="fw-tip-grid">${rows.join("")}</div>` +
    notes.map((n) => `<div class="fw-tip-note">${escapeHtml(n)}</div>`).join("") +
    (info ? `<div class="fw-tip-info">${escapeHtml(info)}</div>` : "") +
    `<div class="fw-tip-src">${escapeHtml(src)}${v.latency ? ` · ${escapeHtml(v.latency)}` : ""}</div>`
  );
}

let activeChip = null;

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
  if (!v) return;
  if (!tip || !tip.isConnected) {
    tip = document.createElement("div");
    tip.className = "fw-tip";
    document.body.appendChild(tip);
  }
  if (activeChip !== chip) tip.innerHTML = tipHtml(v);
  activeChip = chip;
  tip.style.visibility = "hidden";
  tip.style.display = "block";
  placeTip(chip);
  tip.style.visibility = "visible";
}

function hideTip() {
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
    if (chip) showTip(chip);
    else if (!(e.target.closest && e.target.closest(".fw-tip"))) hideTip();
  },
  true
);
// chips are not focusable, so any focus change means attention moved elsewhere
document.addEventListener("focusin", hideTip);
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
  // aria-label on a bare span is ignored by most screen readers; role="img" makes it authoritative
  // and lets the reasoning be announced. Deliberately not focusable: the chip is informational, and
  // thirty extra tab stops between the reader and "Select flight" is a worse trade than losing the
  // hover card on keyboard, which only repeats what the label and this description already say.
  chip.setAttribute("role", "img");
  chip.setAttribute("aria-label", `FlightWifi: ${v.label}. ${v.why}.`);
  return chip;
}

// Google publishes a per-leg amenity block. Its wifi line is the fallback verdict for any airline
// the registry has not sourced yet, and the other amenity lines tell us the block exists at all,
// which is what separates "Google says no wifi" from "Google says nothing".
const AMENITY_RX = /legroom|in-seat (power|usb)|stream media|on-demand video|live tv|emissions|carbon/i;

function collectNodes(li) {
  const aircraft = [];
  const wifi = [];
  const amenity = [];
  const walker = document.createTreeWalker(li, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    const t = n.textContent.trim();
    if (!t || t.length > 60) continue;
    if (AIRCRAFT_NODE_RX.test(t)) aircraft.push(n);
    else if (/Wi-?Fi/i.test(t) && !n.parentElement.closest(".fw-chip")) wifi.push(n);
    else if (AMENITY_RX.test(t)) amenity.push(n);
  }
  return { aircraft, wifi, amenity };
}

// The verdict belongs in the same right-hand amenity list every time, whether or not Google
// published a wifi line for the leg. Each leg carries its own <ul>, reached two levels up from
// the aircraft text, so the walk is capped well short of the card to avoid picking up a sibling leg's.
function amenityListFor(aircraftNode) {
  let el = aircraftNode.parentElement;
  for (let i = 0; i < 4 && el; i++) {
    for (const ul of el.querySelectorAll("ul")) {
      if (AMENITY_RX.test(ul.textContent)) return ul;
    }
    el = el.parentElement;
  }
  return null;
}

function googleSignal(wifiNode, hasAmenity) {
  if (!wifiNode) return hasAmenity ? "absent" : "nodata";
  const t = wifiNode.textContent;
  return /free\s*wi-?fi/i.test(t) ? "free" : /for a fee|paid/i.test(t) ? "paid" : "generic";
}

function isAfter(a, b) {
  return !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
}

// Google Flights ships its own light/dark toggle, so the OS preference is not authoritative and the
// real page background is. Same probe the GetStopover extension uses: a transparent background says
// nothing about what the reader actually sees, so it is skipped rather than read as black, and text
// colour is the last word because it is never transparent.
const RGB_RX = /(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/;

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

let themeSeen = "";
function syncTheme() {
  const theme = readTheme();
  if (theme === themeSeen) return;
  themeSeen = theme;
  document.documentElement.classList.remove("fw-dark", "fw-light");
  document.documentElement.classList.add(theme);
}

// Toggling the theme rewrites class/style on <html> or <body> and changes no result card, so waiting
// for the next sweep would leave the chips the wrong colour until something else moved. Watching the
// two elements that actually carry the theme costs nothing; data-fw-debug is written to <html> on
// every sweep, so the filter has to exclude it or this fires constantly.
new MutationObserver(syncTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });
if (document.body) {
  new MutationObserver(syncTheme).observe(document.body, { attributes: true, attributeFilter: ["class", "style"] });
}
if (window.matchMedia) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  if (mq.addEventListener) mq.addEventListener("change", syncTheme);
}

const FW_TRACE = [];

/* ---------- collapsed summary row ---------- */

// Comparing twenty itineraries should not cost twenty clicks, so the collapsed row carries the
// fleet-level answer. It sits beside the airline name, which is the only text in that row the
// verdict is actually about, and which has ~180px of unused width next to it.
//
// Google prints that cell as: one span holding the operating carriers comma-separated per leg,
// a separator span, then the codeshare partners. Only the first span is metal we will sit on, so
// "KLM · Delta" is one KLM flight while "Air India Express, Air India" is two different aircraft.
// this cell prints each airline name as its own text node, so an exact lookup is safe here
function codesIn(text) {
  return text
    .split(/,\s*/)
    .map((part) => carrierExact(part) || carrierByName(part))
    .filter(Boolean);
}

// "Operated by Air Seychelles for Etihad Airways" means the aircraft is a Seychelles one, and its
// cabin is what the passenger actually sits in. Believing the marketing carrier here would promise
// Etihad's satellite wifi on an aircraft that has no internet at all.
const OPERATED_BY_RX = /operated by\s+(.+?)(?:\s+for\s+.+)?$/i;

function summaryTarget(li) {
  const walker = document.createTreeWalker(li, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    const t = n.textContent.trim();
    if (!t || t.length > 90 || !/[A-Za-z]/.test(t)) continue;
    const p = n.parentElement;
    if (!p || p.closest(".fw-chip")) continue;
    const codes = codesIn(t);
    if (!codes.length) continue;
    if (p.getBoundingClientRect().width === 0) continue;
    const host = p.parentElement;
    const operators = [];
    const unresolved = [];
    for (const node of host.childNodes) {
      const m = node.textContent.trim().match(OPERATED_BY_RX);
      if (!m) continue;
      const found = codesIn(m[1]);
      if (found.length) operators.push(...found);
      else unresolved.push(m[1].trim());
    }
    // one marketing carrier and one named operator is unambiguous, so the operator replaces it;
    // anything more tangled keeps both and lets the weakest leg speak
    if (operators.length) {
      return { codes: codes.length === 1 && operators.length === 1 ? operators : [...new Set([...codes, ...operators])], host };
    }
    // an operator we cannot resolve is the marketing carrier's answer standing in for an aircraft
    // we know nothing about, which is worth saying out loud rather than quietly averaging over
    return { codes, host, unresolved };
  }
  return null;
}

function processSummaryRow(li) {
  if (li.querySelector(".fw-sum")) return;
  const found = summaryTarget(li);
  if (!found) return;
  const v = fleetVerdict(found.codes);
  if (!v) return;
  if (found.unresolved && found.unresolved.length) v.unresolvedOperator = found.unresolved.join(", ");
  const chip = buildChip(v);
  chip.classList.add("fw-sum");
  chip.setAttribute("data-fw-carrier", found.codes.join("+"));
  chip.setAttribute("data-fw-src", "fleet");
  found.host.appendChild(chip);
  // Google clamps that cell to a single nowrap line with an ellipsis, so on a row carrying an
  // "Operated by ..." note there is no room left and the chip gets sliced in half. Measuring is the
  // only way to know: when it does not fit it moves up to the block above, which wraps, and lands
  // on its own line under the airline name.
  if (chip.getBoundingClientRect().right > found.host.getBoundingClientRect().right + 1) {
    chip.classList.add("fw-sum-block");
    found.host.parentElement.appendChild(chip);
  }
  FW_TRACE.push(`sum:${found.codes.join("+")}:${v.cls}`);
}

function processExpandedCard(li) {
  const { aircraft, wifi, amenity } = collectNodes(li);
  FW_TRACE.push(`ac=${aircraft.length},wf=${wifi.length},am=${amenity.length}`);
  if (!aircraft.length) return;
  const claimed = new Set();
  aircraft.forEach((node, i) => {
    const next = aircraft[i + 1] || null;
    const inLeg = (x) => isAfter(node, x) && (!next || isAfter(x, next));
    const target = wifi.find((w) => !claimed.has(w) && inLeg(w));
    // Google's amenity lines are flex <li>s inside a <ul>, so a chip appended into the row gets
    // squeezed beside the label; it belongs on its own row where it has the full column width
    const list = amenityListFor(node);
    const row = target ? target.parentElement.closest("li") : null;
    const host = list || (target ? target.parentElement : node.parentElement);
    if (host.querySelector(":scope > .fw-leg, :scope > .fw-row")) {
      FW_TRACE.push("guard-skip");
      return;
    }
    if (target) claimed.add(target);
    const carrier = carrierForLeg(node, li);
    const signal = googleSignal(target, amenity.some(inLeg));
    const v = verdictFor(carrier, node.textContent.trim(), signal);
    const chip = buildChip(v);
    chip.classList.add("fw-leg");
    // beside Google's amenity line the column is ~100px wide and an inline chip spills out of it,
    // so there it stacks underneath; in the wide airline row it stays inline
    chip.classList.add(list ? "fw-stack" : "fw-inline");
    chip.setAttribute("data-fw-carrier", carrier || "");
    chip.setAttribute("data-fw-src", v.entry ? (v.viaGoogle ? "google-over-entry" : "registry") : "google:" + v.reason);
    chip.setAttribute("data-fw-ac", node.textContent.trim());
    if (list) {
      const slot = document.createElement("li");
      slot.className = "fw-row";
      slot.appendChild(chip);
      // sit directly under Google's own wifi line, or in the slot where it would have been
      const anchor = row && row.parentElement === list ? row.nextSibling : list.children[1] || null;
      list.insertBefore(slot, anchor);
    } else {
      host.appendChild(chip);
    }
    FW_TRACE.push(`chip:${carrier}:${v.cls}:${signal}`);
  });
}

const FW_VER = "43";
let sweepCount = 0;

let totalMs = 0;

function sweep() {
  const t0 = performance.now();
  sweepCount++;
  let processed = 0;
  try {
    // the theme observers above carry this now; this is only a backstop for a restyle that touches
    // neither class nor style, and getComputedStyle forces a recalc so it stays rare
    if (sweepCount % 30 === 1) syncTheme();
    document.querySelectorAll("button[aria-expanded]").forEach((btn) => {
      const li = btn.closest("li");
      if (!li) return;
      if (btn.getAttribute("aria-expanded") === "true") {
        if (li.querySelector(".fw-leg")) return;
        processed++;
        processExpandedCard(li);
      } else {
        // Google keeps a hidden mirror of roughly half the collapsed rows, and summaryTarget can
        // only discover they are unusable by walking every text node in the card first. One rect
        // read rejects them up front instead, and they come back the moment they are made visible.
        if (li.querySelector(".fw-sum") || li.getBoundingClientRect().width === 0) return;
        processed++;
        processSummaryRow(li);
      }
    });
  } catch (e) {
    document.documentElement.setAttribute("data-fw-err", String(e && e.message ? e.message : e));
  }
  const ms = performance.now() - t0;
  totalMs += ms;
  if (sweepCount % 25 === 0 || processed) {
    document.documentElement.setAttribute(
      "data-fw-debug",
      JSON.stringify({ v: FW_VER, sweeps: sweepCount, processed, lastMs: Math.round(ms * 100) / 100, totalMs: Math.round(totalMs) })
    );
  }
}

let queued = false;
const observer = new MutationObserver(() => {
  if (queued) return;
  queued = true;
  queueMicrotask(() => {
    queued = false;
    sweep();
  });
});

observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-expanded"] });
document.addEventListener("visibilitychange", sweep);
sweep();
