// Google Flights adapter: everything here reads Google's DOM; the verdict logic lives in core.js

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

/* ---------- bridge: exact aircraft on the collapsed list ---------- */

// google-bridge.js (main world) republishes the itineraries Google's own search response carries,
// keyed by nothing: matching to a card happens here, by first-departure and last-arrival clock
// time plus carrier overlap plus stop count. Anything ambiguous keeps the fleet verdict; a wrong
// exact answer is worse than an honest coarse one.
let bridgeSeen = "";
let bridgeIndex = null;

function bridgeRead() {
  const node = document.getElementById("__fwGF");
  if (!node) return;
  const v = node.getAttribute("v") || "";
  if (v === bridgeSeen) return;
  bridgeSeen = v;
  let list;
  try {
    list = JSON.parse(node.textContent || "[]");
  } catch (e) {
    return;
  }
  bridgeIndex = new Map();
  for (const it of list) {
    const key = it.depT + "-" + it.arrT;
    if (!bridgeIndex.has(key)) bridgeIndex.set(key, []);
    bridgeIndex.get(key).push(it);
  }
}

const CARD_TIME_RX = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/;
// the booking header prints both clocks in one text node ("3:25 AM \u2013 2:10 PM"), where the list
// keeps them in separate leaves; the range form is only consulted when the exact form fails
const CARD_TIME_RANGE_RX = /^(\d{1,2}):(\d{2})\s*(AM|PM)?\s*[\u2013\u2014-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)?/;

function toMin(h, mm, ap) {
  h = +h;
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return h * 60 + +mm;
}

function cardTimes(li) {
  const out = [];
  const walker = document.createTreeWalker(li, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode()) && out.length < 2) {
    const t = n.textContent.trim();
    const m = CARD_TIME_RX.exec(t);
    const r = m ? null : CARD_TIME_RANGE_RX.exec(t);
    if (!m && !r) continue;
    if (n.parentElement.getBoundingClientRect().width === 0) continue;
    if (m) {
      out.push(toMin(m[1], m[2], m[3]));
    } else {
      out.push(toMin(r[1], r[2], r[3]));
      out.push(toMin(r[4], r[5], r[6]));
    }
  }
  return out.slice(0, 2);
}

function cardStops(li) {
  if (/Nonstop/i.test(li.innerText)) return 0;
  const m = /(\d)\s*stops?/i.exec(li.innerText);
  return m ? +m[1] : null;
}

function bridgeVerdict(li, codes) {
  if (!bridgeIndex) return null;
  const t = cardTimes(li);
  if (t.length < 2) return null;
  let cands = bridgeIndex.get(t[0] + "-" + t[1]);
  if (!cands || !cands.length) return null;
  if (cands.length > 1) {
    const stops = cardStops(li);
    if (stops !== null) cands = cands.filter((it) => it.stops === stops);
    if (cands.length > 1) cands = cands.filter((it) => it.segs.some((s) => codes.includes(s.cc)));
  }
  if (cands.length !== 1) return null;
  // the bridge's carriers come from Google's own payload and outrank the card text: "Batik Air"
  // printed on a DEL-SIN card turned out to be OD Batik Air Malaysia, while the name resolver
  // read the registry's Indonesian ID. When Google's carrier is one we have not sourced, the only
  // honest chip is no chip, so the caller suppresses the fleet verdict instead of showing it.
  // A registered carrier whose aircraft has no rule is a different case entirely (Finnair's Nordic
  // Reg E190s): the airline is known, only this type is not, and the fleet verdict is the honest
  // fallback rather than silence.
  const parts = cands[0].segs.map((s) => {
    const cc = regCode(s.cc);
    return { cc, ac: s.ac, v: verdictFor(cc, s.ac, "nodata") };
  });
  if (parts.some((p) => !WIFI_REGISTRY[p.cc])) return { suppress: true, ccs: parts.map((p) => p.cc).join("+") };
  if (parts.some((p) => !p.v.entry)) return null;
  if (parts.length === 1) return { v: parts[0].v };
  const key = rollup(parts.map((p) => p.v.key));
  const differ = new Set(parts.map((p) => p.v.key)).size > 1;
  return {
    v: decorate(differ && key === "PARTIAL" ? "LEG_PARTIAL" : key, {
      legs: parts.map((p) => ({ code: p.cc, entry: p.v.entry, key: p.v.key })),
      aircraft: parts.map((p) => p.ac).join(" · "),
      entry: null,
    }),
  };
}

function processSummaryRow(li) {
  const existing = li.querySelector(".fw-sum");
  if (existing) existing.__fwBridgeV = bridgeSeen;
  if (existing && existing.__fw && (existing.__fw.aircraft || existing.__fw.exact)) return;
  // the done-marker is only ever set on a real decision (chip placed, or suppressed): the bridge
  // publishes before Google hydrates the cards, and marking a skeleton li here would stop it from
  // ever being revisited once its text actually arrives
  const found = summaryTarget(li);
  if (!found) return;
  const res = bridgeVerdict(li, found.codes);
  if (res && res.suppress) {
    if (existing) existing.remove();
    li.__fwBridgeV = bridgeSeen;
    FW_TRACE.push(`suppress:${res.ccs}`);
    return;
  }
  const exact = res && res.v;
  if (existing && !exact) return;
  if (existing) existing.remove();
  const v = exact || fleetVerdict(found.codes);
  if (!v) return;
  if (exact) v.exact = true;
  if (found.unresolved && found.unresolved.length) v.unresolvedOperator = found.unresolved.join(", ");
  const chip = buildChip(v);
  chip.classList.add("fw-sum");
  chip.setAttribute("data-fw-carrier", found.codes.join("+"));
  chip.setAttribute("data-fw-src", exact ? "bridge" : "fleet");
  chip.__fwBridgeV = bridgeSeen;
  found.host.appendChild(chip);
  // The columns row is height-capped (42px) and the card is a grid whose next row can hold Google's
  // own full-width CO2e badge, so there is no free line below the airline name: anything placed
  // there overflows the cap straight into the badge and the two draw on top of each other. The chip
  // therefore never leaves the name line. When the full label does not fit it collapses to the
  // coloured glyph alone (the hover card and aria-label still carry the verdict), and in the rare
  // cell already filled by an "Operated by ..." note it tucks in beside the times on line one.
  const fits = () => chip.getBoundingClientRect().right <= found.host.getBoundingClientRect().right + 1;
  if (!fits()) {
    chip.classList.add("fw-sum-min");
    if (!fits()) {
      const times = found.host.parentElement && found.host.parentElement.firstElementChild;
      if (times && times !== found.host) times.appendChild(chip);
      else chip.remove();
    }
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
    // The verdict lives in the amenity column, on its own row directly under Google's wifi line or
    // in the slot where that line would have been: wifi is an amenity, and that column is where the
    // reader is already looking for it. Google's amenity lines are flex <li>s inside a <ul>, so the
    // chip gets its own row rather than being squeezed beside a label.
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
    chip.classList.add(list ? "fw-stack" : "fw-inline");
    chip.setAttribute("data-fw-carrier", carrier || "");
    chip.setAttribute("data-fw-src", v.entry ? (v.viaGoogle ? "google-over-entry" : "registry") : "google:" + v.reason);
    chip.setAttribute("data-fw-ac", node.textContent.trim());
    if (list) {
      const slot = document.createElement("li");
      slot.className = "fw-row";
      slot.appendChild(chip);
      const anchor = row && row.parentElement === list ? row.nextSibling : list.children[1] || null;
      list.insertBefore(slot, anchor);
    } else {
      host.appendChild(chip);
    }
    FW_TRACE.push(`chip:${carrier}:${v.cls}:${signal}`);
  });
}

const FW_VER = "55";
/* ---------- booking view (/travel/flights/booking) ---------- */

// Selecting a flight leaves the results list entirely. The booking view rebuilds the itinerary
// without <li> rows, so the expander walk in sweep() never reaches it and the page went unchipped
// even though it names the aircraft once its sections are open. The shape is the familiar one:
// the type sits in its own leaf and Google glues the flight number to it in the same visual run
// ("Airbus A320G9 466"), with the airline on a sibling line of the same block.
function bookingCarrier(host, acLine) {
  for (const line of (host.innerText || "").split("\n")) {
    const t = line.trim();
    // the aircraft line carries the flight number, not a name, and would resolve nothing anyway
    if (!t || t === acLine) continue;
    const c = carrierExact(t) || carrierByName(t);
    if (c) return c;
  }
  return null;
}

function processBookingLeg(node) {
  const host = node.parentElement;
  // each leg block carries its own amenity column; the chip belongs there for the same reason it
  // does on the search page, with the aircraft line only as the fallback when a leg has no column
  const list = amenityListFor(node);
  if (!host || host.querySelector(".fw-chip") || (list && list.querySelector(".fw-row"))) return;
  const ac = node.textContent.trim();
  const acLine = (host.innerText || "").split("\n").find((l) => l.includes(ac)) || "";
  // operating flight number first: on a codeshare the name printed above belongs to the marketing
  // carrier while the number belongs to the metal
  const m = FLIGHT_AFTER_AIRCRAFT_RX.exec(acLine.slice(acLine.indexOf(ac) + ac.length));
  let code = m ? regCode(m[1]) : null;
  if (!code || !WIFI_REGISTRY[code]) code = bookingCarrier(host, acLine);
  if (!code) return;
  const v = verdictFor(code, ac, "nodata");
  // no amenity line on this view, so an unsourced carrier or type says nothing rather than guessing
  if (!v || !v.entry) return;
  const chip = buildChip(v);
  chip.classList.add("fw-sum", "fw-book");
  chip.classList.add(list ? "fw-stack" : "fw-inline");
  chip.setAttribute("data-fw-carrier", code);
  chip.setAttribute("data-fw-src", "registry");
  chip.setAttribute("data-fw-ac", ac);
  if (list) {
    const wifiRow = [...list.children].find((r) => /Wi-?Fi/i.test(r.textContent || "") && !r.classList.contains("fw-row"));
    const slot = document.createElement("li");
    slot.className = "fw-row";
    slot.appendChild(chip);
    list.insertBefore(slot, wifiRow ? wifiRow.nextSibling : list.children[1] || null);
  } else {
    host.appendChild(chip);
  }
  FW_TRACE.push(`book:${code}:${v.cls}`);
}

// Collapsed, the booking card names the airline but not the metal. The bridge, though, usually
// still holds the itinerary this card came from (booking is an SPA hop off the same search), so
// the per-leg exact verdict is tried first and the fleet rollup is only the fallback; without
// this the card a user just saw green on the list could greet them amber here, computed from a
// fleet whose unfitted types their trip never touches. Exact-only resolution keeps this off the
// "Book with X" option rows, whose airline names Google glues into longer runs that an exact
// lookup cannot match.
function bookingTimeScope(host) {
  let n = host;
  for (let i = 0; n && i < 8; i++) {
    if (cardTimes(n).length >= 2) return n;
    n = n.parentElement;
  }
  return null;
}

function processBookingSummary(el) {
  if (el.closest("button, a, [role='button']")) return;
  const code = carrierExact((el.textContent || "").trim());
  if (!code) return;
  const host = el.parentElement;
  if (!host || host.querySelector(".fw-chip")) return;
  // a block that also names the aircraft belongs to the exact pass, even when that pass declined
  if ([...host.children].some((c) => AIRCRAFT_NODE_RX.test((c.textContent || "").trim()))) return;
  const scope = bookingTimeScope(host);
  const res = scope ? bridgeVerdict(scope, [code]) : null;
  if (res && res.suppress) {
    FW_TRACE.push(`book-sum-suppress:${res.ccs}`);
    return;
  }
  let v = res && res.v;
  let src = "bridge";
  if (v) {
    v.exact = true;
  } else {
    src = "fleet";
    v = fleetVerdict([code]);
    if (!v) return;
    v.expandHint = "Expand the flight for the verdict on the exact aircraft.";
  }
  const chip = buildChip(v);
  chip.classList.add("fw-sum", "fw-book", "fw-inline");
  chip.setAttribute("data-fw-carrier", code);
  chip.setAttribute("data-fw-src", src);
  host.appendChild(chip);
  FW_TRACE.push(`book-sum:${code}:${v.cls}`);
}

function sweepBooking() {
  let processed = 0;
  const airlineLeaves = [];
  for (const el of document.querySelectorAll("span, div")) {
    if (el.children.length) continue;
    const t = (el.textContent || "").trim();
    // the results list is handled by the <li> walk; this pass is only for the booking DOM
    if (!t || el.closest("li")) continue;
    if (t.length <= 60 && AIRCRAFT_NODE_RX.test(t)) {
      processed++;
      processBookingLeg(el);
    } else if (t.length <= 40) {
      airlineLeaves.push(el);
    }
  }
  // after the exact pass, so its chips are in place before the fleet pass checks for them
  for (const el of airlineLeaves) {
    processed++;
    processBookingSummary(el);
  }
  return processed;
}

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
    bridgeRead();
    // the booking view has no <li> rows at all, so it needs its own pass; scoping by path keeps
    // this leaf walk off the results page, whose DOM is orders of magnitude larger
    if (location.pathname.indexOf("/travel/flights/booking") === 0) processed += sweepBooking();
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
        // A card that already has a chip is only worth revisiting when the bridge has published
        // something new since that chip was made; the marker keeps upgrades to one pass per publish.
        const chip = li.querySelector(".fw-sum");
        if ((chip ? chip.__fwBridgeV : li.__fwBridgeV) === bridgeSeen) return;
        if (li.getBoundingClientRect().width === 0) return;
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

// Behind the per-site setting from the popup. fwBoot lives in core.js so all three site
// files boot identically; it calls start() when the site is on and stop() when switched off.
fwBoot(
  "google",
  () => {
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-expanded"] });
    document.addEventListener("visibilitychange", sweep);
    sweep();
  },
  () => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", sweep);
  }
);
