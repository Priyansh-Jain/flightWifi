// Skyscanner adapter. The results list never names the aircraft, so tickets get fleet-level
// verdicts: the same rollup the Google collapsed row uses, resolved from the airline names in the
// logo alt text. The booking page is the exception and gets its own treatment further down. There
// is no amenity fallback on this site, so an airline the registry has not sourced simply gets no
// chip rather than a guess.
const SKY_CARD_SEL = '[data-testid="ticket"], [class*="FlightsTicket_container"]';

// Single-airline tickets carry the name in the logo's alt text. Multi-airline tickets drop the
// imgs entirely and print a label like "IndiGo + Scoot"; the last resort is the card's own
// accessible text, "Flight with Air India, Scoot."
function skyNames(card) {
  const names = [];
  const push = (s) => {
    s = (s || "").trim();
    if (s && s.length <= 40 && !names.some((n) => n.toLowerCase() === s.toLowerCase())) names.push(s);
  };
  card.querySelectorAll("img[alt]").forEach((img) => push(img.getAttribute("alt")));
  if (!names.length) {
    card.querySelectorAll('[class*="LogoImage_label"]').forEach((e) => {
      (e.textContent || "").split(/\s*\+\s*|,\s*/).forEach(push);
    });
  }
  if (!names.length) {
    const m = /flight with\s+([^.|]{2,80})/i.exec(card.innerText || "");
    if (m) m[1].split(/\s*\+\s*|,\s*/).forEach(push);
  }
  return names;
}

function skyCodes(card) {
  return [...new Set(skyNames(card).map((n) => carrierExact(n) || carrierByName(n)).filter(Boolean))];
}

// Beside the airline logo is the only spot that exists on every ticket variant; the exact wrapper
// is probed at runtime because Skyscanner's class names are build hashes that churn.
function skyAnchor(card) {
  const logo = card.querySelector('img[alt], [class*="LogoImage_container"]');
  if (!logo) return null;
  let el = logo.parentElement;
  for (let i = 0; i < 3 && el && el !== card; i++) {
    const s = getComputedStyle(el);
    if (s.display.includes("flex") || s.display === "grid") return el;
    el = el.parentElement;
  }
  return logo.parentElement;
}

function processTicket(card) {
  if (card.querySelector(".fw-sum")) return;
  const codes = skyCodes(card);
  if (!codes.length) return;
  const v = fleetVerdict(codes);
  if (!v) return;
  v.noExpand = true;
  const chip = buildChip(v);
  chip.classList.add("fw-sum", "fw-sky");
  chip.setAttribute("data-fw-carrier", codes.join("+"));
  chip.setAttribute("data-fw-src", "fleet");
  const anchor = skyAnchor(card);
  if (!anchor) return;
  anchor.appendChild(chip);
  FW_TRACE.push(`sky:${codes.join("+")}:${v.cls}`);
}

/* ---------- booking page (/config/): the one Skyscanner view that names the aircraft ---------- */

// The results list never names the metal, but the booking page's per-leg "Show info" panel does
// ("A321 (narrowbody)"), so this page upgrades from fleet-level to exact per-segment verdicts:
// a leg-level chip beside the leg summary while collapsed, replaced by a chip beside each flight
// number once the panel is open and the aircraft is in the DOM.
const SKY_LEG_SEL = '[data-testid^="itinerary-leg-"]';
// IATA codes can lead with a digit ("6E5007"), so the class is [A-Z0-9] twice; the letter guard in
// the code below is what rejects pure numbers, and lowercase exclusion is what rejects "1h 05"
const SKY_FLIGHTNO_RX = /^([A-Z0-9]{2})\s?\d{1,4}$/;
const SKY_AC_RX = /^(A2\d\d\w*|A3\d\d\w*|7\d7\w*|ATR ?\d+|Embraer ?\d+|E-?\d{2,3}\w*|Dash ?8|Q400|CRJ ?\d+|Comac ?\d+)/;

function after(a, b) {
  return !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
}

function legNames(leg) {
  const m = /flight with\s+([^.]{2,80})\./i.exec(leg.textContent || "");
  if (!m) return [];
  return m[1].split(/\s*\+\s*|,\s*|\s+and\s+/).map((s) => s.trim()).filter(Boolean);
}

function processLeg(leg) {
  const leaves = [...leg.querySelectorAll("*")].filter((e) => !e.children.length);
  const headers = leaves.filter((e) => SKY_FLIGHTNO_RX.test((e.textContent || "").trim()));
  const acs = leaves.filter((e) => SKY_AC_RX.test((e.textContent || "").trim()));

  headers.forEach((h, i) => {
    const host = h.parentElement;
    if (!host) return;
    const next = headers[i + 1] || null;
    const ac = acs.find((a) => after(h, a) && (!next || after(a, next)));
    // the header row survives collapsing the panel, so the chip placed while it was open keeps its
    // exact aircraft; the only replacement is the upgrade from fleet-level to aircraft-level.
    // The check reads the verdict object, never a debug attribute: the build strips those, and a
    // stripped attribute here would have made every sweep tear the chip down and rebuild it.
    const existing = host.querySelector(":scope > .fw-chip");
    if (existing) {
      if ((existing.__fw && (existing.__fw.aircraft || existing.__fw.noUpgrade)) || !ac) return;
      existing.remove();
    }
    const code = regCode(SKY_FLIGHTNO_RX.exec(h.textContent.trim())[1]);
    if (!/[A-Z]/.test(code)) return;
    // the name fallback is only safe when the leg has one airline; on a mixed leg an unregistered
    // code would otherwise borrow whichever other carrier resolves first
    const names = legNames(leg);
    const carrier = WIFI_REGISTRY[code] ? code : names.length === 1 ? carrierExact(names[0]) || carrierByName(names[0]) : null;
    if (!carrier) return;
    // with the panel open the aircraft is exact, so the verdict is; before that the segment is
    // still the whole fleet, and fleetVerdict keeps the part-fitted nuance a catch-all rule loses.
    // A registered carrier whose aircraft has no rule drops back to the fleet verdict too.
    let v = ac ? verdictFor(carrier, ac.textContent.trim(), "nodata") : null;
    if (!v || !v.entry) {
      v = fleetVerdict([carrier]);
      if (v) {
        // noUpgrade marks this as final so the upgrade pass does not tear it down every sweep
        v.noUpgrade = true;
        if (ac) {
          v.expandHint = "No rule for this exact type yet, so this is the airline's fleet answer.";
          v.aircraftNote = ac.textContent.trim() + " (no type-level verdict yet)";
        } else {
          v.expandHint = 'Open "Show info" on this flight for the exact aircraft.';
          v.aircraftNote = 'whole fleet until you open "Show info"';
        }
      }
    }
    if (!v || !v.entry) return;
    const chip = buildChip(v);
    chip.classList.add("fw-sum", "fw-sky", "fw-seg");
    chip.setAttribute("data-fw-carrier", carrier);
    chip.setAttribute("data-fw-src", ac ? "registry" : "fleet");
    chip.setAttribute("data-fw-ac", ac ? ac.textContent.trim() : "");
    host.appendChild(chip);
    FW_TRACE.push(`sky-seg:${carrier}:${v.cls}`);
  });

  // a segment chip carries strictly more information than the leg rollup, so the summary chip
  // only lives while the panel is closed
  const summary = leg.querySelector(".fw-leg-sum");
  if (leg.querySelector(".fw-seg")) {
    if (summary) summary.remove();
    return;
  }
  if (summary) return;
  const codes = [...new Set(legNames(leg).map((n) => carrierExact(n) || carrierByName(n)).filter(Boolean))];
  if (!codes.length) return;
  const v = fleetVerdict(codes);
  if (!v) return;
  v.noExpand = true;
  const anchor = leaves.find((e) => (e.textContent || "").trim() === "Details");
  if (!anchor || !anchor.parentElement) return;
  const chip = buildChip(v);
  chip.classList.add("fw-sum", "fw-sky", "fw-leg-sum");
  chip.setAttribute("data-fw-carrier", codes.join("+"));
  chip.setAttribute("data-fw-src", "fleet");
  anchor.parentElement.appendChild(chip);
  FW_TRACE.push(`sky-leg:${codes.join("+")}:${v.cls}`);
}

const FW_VER = "54";
let sweepCount = 0;
let totalMs = 0;

function sweep() {
  const t0 = performance.now();
  sweepCount++;
  let processed = 0;
  try {
    if (sweepCount % 30 === 1) syncTheme();
    document.querySelectorAll(SKY_CARD_SEL).forEach((card) => {
      if (card.querySelector(".fw-sum")) return;
      processed++;
      processTicket(card);
    });
    document.querySelectorAll(SKY_LEG_SEL).forEach((leg) => {
      processed++;
      processLeg(leg);
    });
  } catch (e) {
    document.documentElement.setAttribute("data-fw-err", String(e && e.message ? e.message : e));
  }
  const ms = performance.now() - t0;
  totalMs += ms;
  if (sweepCount % 25 === 0 || processed) {
    document.documentElement.setAttribute(
      "data-fw-debug",
      JSON.stringify({ v: FW_VER, site: "sky", sweeps: sweepCount, processed, lastMs: Math.round(ms * 100) / 100, totalMs: Math.round(totalMs) })
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
  "skyscanner",
  () => {
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("visibilitychange", sweep);
    sweep();
  },
  () => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", sweep);
  }
);
