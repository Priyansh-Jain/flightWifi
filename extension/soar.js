// Soar adapter (soar.flights). Two views, same split as Google: the results list names the airline
// but never the metal, so offers get fleet-level verdicts; opening an offer pushes a detail panel
// into the DOM whose segment line reads "Economy · American Airlines · Boeing 777-300ER · AA 0142",
// which is everything needed for an exact per-segment verdict. Like Skyscanner there is no amenity
// data on this site, so an airline the registry has not sourced gets no chip rather than a guess.
const SOAR_OFFER_SEL = ".offer[data-id]";

// Tailwind utility classes here are generated and churn between builds, so nothing is selected by
// class below the offer itself: rows are found by the shape of their text.
//
// Airport codes are deliberately NOT skipped by shape. An earlier "^[A-Z]{3}$" rule meant to reject
// JFK and LHR also rejected every three-letter airline: KLM and ANA silently lost their chips. The
// codes are harmless to probe, because resolution is an exact match against registry names and no
// airline is named after an airport, so a code simply resolves to nothing and falls through.
const SOAR_SKIP_RX = /^(BEST|CHEAPEST|FASTEST|Book|Direct|Nonstop|one-way|round trip)$|^\d|^[₹$€£]|\d\s?(am|pm)$|^\+\d/i;
const SOAR_FLIGHTNO_RX = /^([A-Z0-9]{2})\s?(\d{1,4})$/;
const SOAR_AC_RX = /(Boeing|Airbus|Embraer|Bombardier|ATR|De Havilland|Comac|Sukhoi|Mitsubishi|CRJ|Dash ?8|Q400)\b|^[AB]\d{3}/i;

// Script and style bodies are leaf nodes too, and this app inlines JSON that mentions aircraft
// types, so they are excluded by tag rather than left to the length filter to catch by accident.
const SOAR_NON_TEXT = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEMPLATE: 1, SVG: 1, PATH: 1 };

function soarLeaves(root) {
  return [...root.querySelectorAll("*")].filter((e) => !e.children.length && !SOAR_NON_TEXT[e.tagName]);
}

// The airline column carries a short trade name ("American", "Virgin Atlantic"). Anything that
// resolves against the registry is taken as a carrier; the skip list keeps airport codes, times and
// prices from being probed at all, since a three-letter code could otherwise resolve by accident.
function soarCodes(offer) {
  const codes = [];
  soarLeaves(offer).forEach((e) => {
    const t = (e.textContent || "").trim();
    if (!t || t.length > 40 || SOAR_SKIP_RX.test(t)) return;
    const code = carrierExact(t) || carrierByName(t);
    if (code && !codes.includes(code)) codes.push(code);
  });
  return codes;
}

// The airline column is only ~100px wide, so a verdict placed there wraps to three lines and
// stretches every row. Soar already runs a badge rail along the top edge of the card for its own
// BEST/CHEAPEST label, so the chip goes there instead: one line, no reflow, and it reads as a
// property of the whole offer rather than of the logo it happened to sit under.
function soarAnchor(offer) {
  return offer;
}

function processOffer(offer) {
  if (offer.querySelector(".fw-sum")) return;
  const codes = soarCodes(offer);
  if (!codes.length) return;
  const v = fleetVerdict(codes);
  if (!v) return;
  // the list view has no expansion of its own; the aircraft only appears once the offer is opened
  v.expandHint = "Open the flight for the verdict on the exact aircraft.";
  const chip = buildChip(v);
  chip.classList.add("fw-sum", "fw-soar", "fw-soar-badge");
  chip.setAttribute("data-fw-carrier", codes.join("+"));
  chip.setAttribute("data-fw-src", "fleet");
  const anchor = soarAnchor(offer);
  if (!anchor) return;
  anchor.appendChild(chip);
  FW_TRACE.push(`soar:${codes.join("+")}:${v.cls}`);
}

/* ---------- detail panel: the one Soar view that names the aircraft ---------- */

// "Economy · American Airlines · Boeing 777-300ER · AA 0142" in a single text node. Parsed by shape
// rather than position, because the cabin segment is not always present and the order of the middle
// two has no guarantee behind it.
function parseSoarSegment(text) {
  const parts = text.split("·").map((s) => s.trim()).filter(Boolean);
  if (parts.length < 2) return null;
  let flight = null;
  let aircraft = null;
  let airline = null;
  parts.forEach((p) => {
    if (!flight && SOAR_FLIGHTNO_RX.test(p)) flight = p;
    else if (!aircraft && SOAR_AC_RX.test(p)) aircraft = p;
  });
  parts.forEach((p) => {
    if (p === flight || p === aircraft || airline) return;
    if (carrierExact(p) || carrierByName(p)) airline = p;
  });
  if (!aircraft && !airline) return null;
  return { flight, aircraft, airline };
}

// Soar prints its own amenity pills ("Wi-Fi") in a flex row directly beneath the segment line.
// Appending to the host puts the verdict on a line of its own; dropping it into that row instead
// keeps it beside the pill it qualifies. A segment with no amenities has no row, so the host is
// still the fallback.
function soarSegAnchor(node, host) {
  const next = node.nextElementSibling;
  return next && !next.classList.contains("fw-chip") ? next : host;
}

function processSegment(node) {
  const host = node.parentElement;
  // the chip may now live one level down in the pill row, so the guard cannot be scoped to :scope
  if (!host || host.querySelector(".fw-chip")) return;
  const seg = parseSoarSegment(node.textContent || "");
  if (!seg) return;

  // the operating flight number is the stronger signal: on a codeshare the marketing name in the
  // same line belongs to a different carrier than the metal
  let code = null;
  if (seg.flight) {
    const c = regCode(SOAR_FLIGHTNO_RX.exec(seg.flight)[1]);
    if (WIFI_REGISTRY[c]) code = c;
  }
  if (!code && seg.airline) code = carrierExact(seg.airline) || carrierByName(seg.airline);
  if (!code) return;

  const v = verdictFor(code, seg.aircraft || "", "nodata");
  // no amenity data on this site, so an unresolved carrier or type says nothing rather than guessing
  if (!v || !v.entry) return;
  const chip = buildChip(v);
  chip.classList.add("fw-sum", "fw-soar", "fw-seg");
  chip.setAttribute("data-fw-carrier", code);
  chip.setAttribute("data-fw-src", seg.aircraft ? "registry" : "fleet");
  chip.setAttribute("data-fw-ac", seg.aircraft || "");
  soarSegAnchor(node, host).appendChild(chip);
  FW_TRACE.push(`soar-seg:${code}:${v.cls}`);
}

const FW_VER = "1";
let sweepCount = 0;
let totalMs = 0;

function sweep() {
  const t0 = performance.now();
  sweepCount++;
  let processed = 0;
  try {
    if (sweepCount % 30 === 1) syncTheme();
    document.querySelectorAll(SOAR_OFFER_SEL).forEach((offer) => {
      if (offer.querySelector(".fw-sum")) return;
      processed++;
      processOffer(offer);
    });
    // the detail panel is not inside .offer, so segment lines are found document-wide
    soarLeaves(document.body).forEach((e) => {
      const t = e.textContent || "";
      if (t.length > 160 || t.indexOf("·") === -1 || !SOAR_AC_RX.test(t)) return;
      processed++;
      processSegment(e);
    });
  } catch (e) {
    document.documentElement.setAttribute("data-fw-err", String(e && e.message ? e.message : e));
  }
  const ms = performance.now() - t0;
  totalMs += ms;
  if (sweepCount % 25 === 0 || processed) {
    document.documentElement.setAttribute(
      "data-fw-debug",
      JSON.stringify({ v: FW_VER, site: "soar", sweeps: sweepCount, processed, lastMs: Math.round(ms * 100) / 100, totalMs: Math.round(totalMs) })
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

observer.observe(document.body, { childList: true, subtree: true });
document.addEventListener("visibilitychange", sweep);
sweep();
