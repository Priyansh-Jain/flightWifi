/* FlightWifi popup. The first tab is a status panel for the page you are on: is the extension
   working, what did it find, and what can I do next. Anything longer than a sentence belongs on
   flightwifi.app, which is why the explanations are an accordion rather than a page of prose. */

const SITES = ["google", "skyscanner", "soar"];

// One row per answer, in the order a traveller cares about. These labels and explanations are the
// same strings core.js puts on the chips, and `key` matches the `row` it stamps on each one, so the
// popup, the chip and the website all name a verdict identically. Changing a label here means
// changing it in VERDICT_UI too.
// Named FW_ROWS because registry.js is loaded first and already declares a global `VERDICTS`; a
// second declaration of a name it uses is a syntax error that takes the whole popup down.
const FW_ROWS = [
  { key: "calls", label: "Video calls work", why: "Low-orbit satellite. Quick enough to treat like ground wifi, video calls included." },
  { key: "email", label: "Email & browsing", why: "High-orbit satellite or air-to-ground. The lag is the limit, not the speed, so live calls stutter." },
  { key: "varies", label: "Varies by aircraft", why: "Every aircraft has wifi. Whether you get the quick kind depends which one turns up." },
  { key: "partial", label: "Not on every aircraft", why: "Part of this fleet has no wifi at all, and the schedule will not say which aircraft you get." },
  { key: "nowifi", label: "No Wi-Fi", why: "No usable internet on this aircraft. Download before you fly." },
  { key: "unsure", label: "Wi-Fi, speed unknown", why: "There is wifi, but the provider is unverified, so we will not claim a speed." },
  { key: "unverified", label: "Not verified", why: "No trustworthy source yet, so we say nothing rather than guess." }
];

const HAS_WIFI = ["calls", "email", "varies", "unsure"];

const ICON = {
  calls: '<path d="m16 13 5.22 3.48a.5.5 0 0 0 .78-.42V7.87a.5.5 0 0 0-.76-.43L16 10.5" /><rect x="2" y="6" width="14" height="12" rx="2" />',
  email: '<rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />',
  varies: '<path d="M16 3h5v5" /><path d="M4 20 21 3" /><path d="M21 16v5h-5" /><path d="m15 15 6 6" /><path d="M4 4l5 5" />',
  partial: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4" /><path d="M12 17h.01" />',
  nowifi: '<path d="m2 2 20 20" /><path d="M8.5 16.5a5 5 0 0 1 7 0" /><path d="M2 8.82a15 15 0 0 1 4.17-2.65" /><path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76" /><path d="M16.85 11.25a10 10 0 0 1 2.22 1.68" /><path d="M5 13a10 10 0 0 1 5.24-2.76" /><path d="M12 20h.01" />',
  unsure: '<path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><path d="M12 20h.01" />',
  unverified: '<circle cx="12" cy="12" r="9.5" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" /><path d="M12 17h.01" />'
};

const CHEVRON = '<path d="m9 18 6-6-6-6" />';
const OUT_ARROW = '<path d="M7 17 17 7" /><path d="M8 7h9v9" />';

// A tab that was already open when the extension installed or updated has no live content script:
// Chrome orphans the old one, so the chips it already drew stay on screen while its message port is
// dead. Clicking the toolbar icon grants activeTab for that tab, which is enough to read its url and
// put the script back, so the popup repairs the page instead of asking the user to reload it.
// google-bridge.js goes into the MAIN world, exactly as the manifest injects it, because that is the
// only world that can reach the page's own flight payload.
const SITE_INJECT = [
  {
    rx: /^https:\/\/www\.google\.[a-z.]{2,7}\/travel\/flights/,
    label: "Google Flights",
    main: ["google-bridge.js"],
    iso: ["data/registry.js", "core.js", "header.js", "google.js"],
    css: ["chip.css"]
  },
  {
    rx: /^https?:\/\/www\.skyscanner\.[a-z.]{2,7}\/transport\//,
    label: "Skyscanner",
    main: ["skyscanner-bridge.js"],
    iso: ["data/registry.js", "core.js", "header.js", "skyscanner.js"],
    css: ["chip.css"]
  },
  {
    rx: /^https:\/\/rift\.co\//,
    label: "Rift",
    main: ["soar-bridge.js"],
    iso: ["data/registry.js", "core.js", "soar.js"],
    css: ["chip.css"],
    optional: ["https://rift.co/*"]
  }
];

// Every message to the page is scoped to the top frame and given a deadline. sendMessage is a
// promise that can simply never settle: a listener that held the channel open, or a frame Google
// is prerendering or has frozen. The popup has no other clock, so an unbounded await here is a
// popup that says "Checking this page" forever.
function ask(tabId, ms) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), ms);
    chrome.tabs
      .sendMessage(tabId, { type: "FW_STATUS" }, { frameId: 0 })
      .then((r) => { clearTimeout(timer); resolve(r || null); })
      .catch(() => { clearTimeout(timer); resolve(null); });
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const $ = (id) => document.getElementById(id);

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function icon(paths, className) {
  const wrap = el("span", className);
  wrap.setAttribute("aria-hidden", "true");
  wrap.innerHTML = `<svg viewBox="0 0 24 24">${paths}</svg>`;
  return wrap;
}

function svg(paths, className) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  node.setAttribute("viewBox", "0 0 24 24");
  node.setAttribute("aria-hidden", "true");
  node.setAttribute("class", className);
  node.innerHTML = paths;
  return node;
}

$("siteAuto").addEventListener("click", async () => {
  const btn = $("siteAuto");
  const origins = (btn.dataset.origins || "").split(" ").filter(Boolean);
  if (!origins.length) return;
  try {
    if (await chrome.permissions.request({ origins })) btn.hidden = true;
  } catch {}
});

/* ---------- footer meta, read from the bundled registry so it can never drift ---------- */

function meta() {
  try {
    const all = Object.values(WIFI_REGISTRY);
    const asOf = all.map((e) => e.as_of).filter(Boolean).sort().pop();
    const [y, m] = (asOf || "").split("-");
    const month = MONTHS[Number(m) - 1];
    $("meta").textContent = month ? `${all.length} airlines · Updated ${month} ${y}` : `${all.length} airlines`;
  } catch {
    $("meta").hidden = true;
  }
}

function verdictItem(row, count) {
  const li = el("li", `item v-${row.key}`);
  const head = el("button", "item-h");
  head.type = "button";
  head.setAttribute("aria-expanded", "false");
  head.append(icon(ICON[row.key], "tile"), el("span", "grow card-t", row.label));
  if (count !== undefined) head.append(el("span", "count", String(count)));
  head.append(svg(CHEVRON, "chev"));

  const body = el("p", "item-b", row.why);
  body.hidden = true;

  head.addEventListener("click", () => {
    const open = body.hidden;
    const list = li.parentElement;
    for (const b of list.querySelectorAll(".item-b")) b.hidden = true;
    for (const h of list.querySelectorAll(".item-h")) h.setAttribute("aria-expanded", "false");
    body.hidden = !open;
    head.setAttribute("aria-expanded", String(open));
  });

  li.append(head, body);
  return li;
}

/* ---------- current page ---------- */

function renderTally(counts) {
  const ul = $("tally");
  const open = ul.querySelector('.item-h[aria-expanded="true"]');
  const openKey = open ? open.parentElement.className : null;
  ul.replaceChildren();
  let total = 0;
  let withWifi = 0;
  for (const row of FW_ROWS) {
    const n = counts[row.key] || 0;
    if (!n) continue;
    total += n;
    if (HAS_WIFI.includes(row.key)) withWifi += n;
    const li = verdictItem(row, n);
    ul.append(li);
    if (li.className === openKey) li.querySelector(".item-h").click();
  }

  const arc = $("ringArc");
  arc.setAttribute("stroke-dasharray", `${total ? Math.round((withWifi / total) * 100) : 0} 100`);
  arc.classList.toggle("empty", withWifi === 0);

  const calls = counts.calls || 0;
  const nowifi = counts.nowifi || 0;
  if (withWifi > 0) {
    $("heroBig").textContent = `${withWifi} of ${total}`;
    $("heroLine").textContent = total === 1 ? "flight has Wi-Fi" : "flights have Wi-Fi";
  } else if (nowifi === total) {
    $("heroBig").textContent = "No Wi-Fi";
    $("heroLine").textContent = total === 1 ? "on this flight" : `on any of these ${total} flights`;
  } else {
    $("heroBig").textContent = String(total);
    $("heroLine").textContent = total === 1 ? "flight checked, none with confirmed Wi-Fi" : "flights checked, none with confirmed Wi-Fi";
  }
  $("heroSub").textContent = calls === 1 ? "1 where video calls work" : `${calls} where video calls work`;
  $("heroSub").hidden = calls === 0;
  return total;
}

const PILL = {
  active: (site) => `Active · ${site}`,
  waiting: (site) => `Waiting · ${site}`,
  idle: () => "Ready",
  off: (site) => `Off · ${site}`,
  unreachable: () => "Not responding"
};

function show(view, site, dotClass) {
  $("statusText").textContent = PILL[view](site || "");
  $("dot").className = `dot ${dotClass}`;
  $("siteName").textContent = site ? `· ${site}` : "";
  if (view === "off") $("offTitle").textContent = `Verdicts are off on ${site}`;
  for (const v of ["active", "waiting", "idle", "off", "unreachable"]) $(v).hidden = view !== v;
}

/* ---------- reading the page ---------- */

// Which of the three sites the open tab is, so the off-state button knows what to switch back on.
let currentSite = null;
let currentTab = null;
// Repairing a tab is a one-shot: if it does not take, retrying every tick would reinject forever.
let repairTried = false;
// What the panel last drew. Results stream in on a flight search, so the popup re-reads while it is
// open, and comparing signatures keeps it from repainting a tally that has not changed.
let lastPainted = null;
// The interval must not stack a second read on top of one still waiting on the page.
let inFlight = false;

async function loadStatus() {
  if (inFlight) return;
  inFlight = true;
  try {
    let tab = null;
    try {
      // No `tabs` permission is needed for the id: querying gives it even when the url is withheld,
      // and messaging a content script the manifest already registered needs nothing extra.
      [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    } catch {
      tab = null;
    }
    currentTab = tab;

    let status = tab ? await ask(tab.id, 1500) : null;

    // url is only readable because the toolbar click granted activeTab, which is exactly when it
    // matters: it is how the popup can tell "not a flight site" from "a flight site that is silent".
    const site = tab ? SITE_INJECT.find((s) => s.rx.test(tab.url || "")) : null;

    if (!status && tab && site && !repairTried) {
      repairTried = true;
      status = await repair(tab, site);
    }

    currentSite = status ? status.site : null;
    syncAutoButton(site);

    const signature = JSON.stringify([status || null, site ? site.label : null]);
    if (signature === lastPainted) return;
    lastPainted = signature;

    if (!status) {
      if (site) show("unreachable", site.label, "wait");
      else show("idle", "", "");
      return;
    }
    if (!status.enabled) {
      show("off", status.label, "off");
      return;
    }

    // Painting first tells us whether anything is actually on screen, which is the difference between
    // "working" and "waiting for you to search".
    const total = renderTally(status.counts || {});
    if (total === 0) show("waiting", status.label, "wait");
    else show("active", status.label, "on");
  } finally {
    inFlight = false;
  }
}

async function syncAutoButton(site) {
  const btn = $("siteAuto");
  if (!site || !site.optional) {
    btn.hidden = true;
    return;
  }
  let granted = false;
  try {
    granted = await chrome.permissions.contains({ origins: site.optional });
  } catch {
    granted = false;
  }
  $("siteAutoTitle").textContent = `Show verdicts on ${site.label} automatically`;
  btn.dataset.origins = site.optional.join(" ");
  btn.hidden = granted;
}

// Puts the content script back into an orphaned tab. Only the top frame is touched, which is where
// the manifest puts it too. Silently does nothing anywhere the caller could not match a site.
async function repair(tab, site) {
  try {
    if (site.main.length) {
      await chrome.scripting.executeScript({ target: { tabId: tab.id, frameIds: [0] }, files: site.main, world: "MAIN" });
    }
    await chrome.scripting.executeScript({ target: { tabId: tab.id, frameIds: [0] }, files: site.iso });
    if (site.css) await chrome.scripting.insertCSS({ target: { tabId: tab.id, frameIds: [0] }, files: site.css });
  } catch {
    return null;
  }

  // A script that booted a moment ago has not swept the page yet, so its first honest answer is an
  // empty tally. Settling on that would report "waiting for flight results" over a page already
  // full of them, so give the first sweep a couple of seconds to land. A page that really has no
  // results still ends up here, and waiting is then the right answer.
  const deadline = Date.now() + 2500;
  let last = null;
  while (Date.now() < deadline) {
    last = await ask(tab.id, 700);
    if (last && Object.keys(last.counts || {}).length) return last;
    await sleep(300);
  }
  return last;
}

const RANK = { NONE: 0, PARTIAL: 1, UNKNOWN: 2, GEO: 3, A2G: 3, VARIES: 4, MEO: 5, LEO: 6 };
const KEY_ROW = { LEO: "calls", MEO: "calls", GEO: "email", A2G: "email", VARIES: "varies", PARTIAL: "partial", NONE: "nowifi", UNKNOWN: "unverified" };
const STARLINK_ACCESS = { free: "Free", free_with_account: "Free with account", paid: "Paid" };

function classifyOrbit(orbit) {
  if (!orbit) return "UNKNOWN";
  if (orbit === "NONE") return "NONE";
  if (orbit === "UNKNOWN") return "UNKNOWN";
  if (orbit === "A2G") return "A2G";
  const mixed = orbit.startsWith("mixed");
  if (mixed && /none/i.test(orbit)) return "PARTIAL";
  if (mixed || (orbit.includes("LEO") && orbit.includes("GEO"))) return "VARIES";
  if (orbit.includes("MEO")) return "MEO";
  if (orbit.startsWith("LEO")) return "LEO";
  return "GEO";
}

function rollup(keys) {
  const bad = keys.some((k) => k === "NONE" || k === "PARTIAL");
  const good = keys.some((k) => k === "PARTIAL" || RANK[k] >= 3);
  if (bad && good) return "PARTIAL";
  if (keys.includes("UNKNOWN") && !keys.every((k) => k === "UNKNOWN")) return "UNKNOWN";
  return keys.reduce((a, b) => (RANK[a] <= RANK[b] ? a : b));
}

function slugify(name) {
  return String(name)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

let AIRLINES = [];

function buildAirlines() {
  try {
    AIRLINES = Object.entries(WIFI_REGISTRY)
      .map(([code, e]) => {
        const row = FW_ROWS.find((r) => r.key === KEY_ROW[rollup(e.rules.map((r) => classifyOrbit(r.orbit)))]);
        const sl = e.starlink || {};
        let line = e.access_short || "";
        if (sl.status === "flying") line = STARLINK_ACCESS[sl.access] ? `Starlink flying · ${STARLINK_ACCESS[sl.access]}` : "Starlink flying";
        else if (sl.status === "announced") line = "Starlink announced";
        return { code, name: e.airline, lower: e.airline.toLowerCase(), row, line, flying: sl.status === "flying", slug: slugify(e.airline) };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    AIRLINES = [];
  }
  $("q").placeholder = `Search ${AIRLINES.length} airlines by name or code`;
  if (AIRLINES.length) {
    $("lookupTeaser").textContent = `Wi‑Fi and Starlink for all ${AIRLINES.length} airlines`;
    document.querySelector('.nav[data-tab="lookup"]').dataset.tipText = `Wi‑Fi and Starlink for any of ${AIRLINES.length} airlines`;
  }
}

function matchAirlines(query) {
  const q = query.trim().toLowerCase();
  if (!q) return AIRLINES.filter((a) => a.flying);
  const scored = [];
  for (const a of AIRLINES) {
    let score = -1;
    if (a.code.toLowerCase() === q) score = 0;
    else if (a.lower.startsWith(q)) score = 1;
    else if (a.lower.split(/[\s-]+/).some((w) => w.startsWith(q))) score = 2;
    else if (a.lower.includes(q)) score = 3;
    if (score >= 0) scored.push([score, a]);
  }
  return scored.sort((x, y) => x[0] - y[0] || x[1].name.localeCompare(y[1].name)).slice(0, 50).map(([, a]) => a);
}

function renderResults() {
  const query = $("q").value;
  const list = matchAirlines(query);
  const ul = $("results");
  ul.replaceChildren();
  for (const a of list) {
    const li = el("li");
    const link = el("a", "card card-link result");
    link.href = `https://flightwifi.app/airlines/${a.slug}/`;
    link.target = "_blank";
    link.rel = "noopener";
    const top = el("span", "result-top");
    const name = el("span", "grow card-t", a.name);
    name.append(el("span", "code", a.code));
    top.append(name, el("span", `vpill v-${a.row.key}`, a.row.label));
    link.append(top);
    if (a.line) link.append(el("span", "card-s", a.line));
    li.append(link);
    ul.append(li);
  }
  const blank = !query.trim();
  $("lookupLabel").textContent = blank
    ? `Flying Starlink now · ${list.length} airlines`
    : list.length === 1 ? "1 airline" : `${list.length} airlines`;
  $("lookupLabel").hidden = !blank && !list.length;
  $("noResults").hidden = blank || list.length > 0;
}

let tipTimer = null;
let tipWarm = false;

function showTip(btn) {
  const tip = $("tip");
  $("tipTitle").textContent = btn.dataset.tipTitle;
  $("tipText").textContent = btn.dataset.tipText;
  const r = btn.getBoundingClientRect();
  const center = r.top + r.height / 2;
  const top = Math.min(Math.max(center - tip.offsetHeight / 2, 8), window.innerHeight - tip.offsetHeight - 8);
  tip.style.top = `${top}px`;
  tip.style.setProperty("--arrow", `${center - top}px`);
  tip.classList.add("show");
  btn.setAttribute("aria-describedby", "tip");
  tipWarm = true;
}

function hideTip(btn) {
  clearTimeout(tipTimer);
  $("tip").classList.remove("show");
  if (btn) btn.removeAttribute("aria-describedby");
  tipTimer = setTimeout(() => { tipWarm = false; }, 300);
}

function openTab(name) {
  for (const t of document.querySelectorAll(".tab")) t.hidden = t.id !== `tab-${name}`;
  for (const n of document.querySelectorAll(".nav")) {
    if (n.dataset.tab === name) n.setAttribute("aria-current", "page");
    else n.removeAttribute("aria-current");
  }
  if (name === "lookup") {
    renderResults();
    $("q").focus();
  }
}

/* ---------- settings ---------- */

async function loadSettings() {
  const { fwSites } = await chrome.storage.local.get("fwSites");
  for (const s of SITES) $(`s-${s}`).checked = (fwSites || {})[s] !== false;
}

async function saveSetting(site, on) {
  const { fwSites } = await chrome.storage.local.get("fwSites");
  await chrome.storage.local.set({ fwSites: { ...(fwSites || {}), [site]: on } });
  // The open tab reacts to the storage change on its own; re-read so the panel agrees with it.
  loadStatus();
}

function applyTheme(choice) {
  const root = document.documentElement;
  if (choice === "light" || choice === "dark") root.dataset.theme = choice;
  else delete root.dataset.theme;
  try {
    if (choice === "light" || choice === "dark") localStorage.setItem("fwTheme", choice);
    else localStorage.removeItem("fwTheme");
  } catch {}
  for (const b of document.querySelectorAll("[data-theme-choice]")) {
    b.setAttribute("aria-checked", String(b.dataset.themeChoice === (root.dataset.theme || "system")));
  }
}

/* ---------- wiring ---------- */

for (const n of document.querySelectorAll(".nav")) {
  n.addEventListener("click", () => {
    hideTip(n);
    openTab(n.dataset.tab);
  });
  n.addEventListener("mouseenter", () => {
    clearTimeout(tipTimer);
    if (tipWarm) showTip(n);
    else tipTimer = setTimeout(() => showTip(n), 350);
  });
  n.addEventListener("mouseleave", () => hideTip(n));
  n.addEventListener("focus", () => { if (n.matches(":focus-visible")) showTip(n); });
  n.addEventListener("blur", () => hideTip(n));
}
for (const b of document.querySelectorAll("[data-go]")) {
  b.addEventListener("click", () => openTab(b.dataset.go));
}

$("q").addEventListener("input", renderResults);
$("q").addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const first = $("results").querySelector("a");
  if (first) first.click();
});

for (const s of SITES) {
  $(`s-${s}`).addEventListener("change", (e) => saveSetting(s, e.target.checked));
}

for (const b of document.querySelectorAll("[data-theme-choice]")) {
  b.addEventListener("click", () => applyTheme(b.dataset.themeChoice));
}

// The off state names the site it is switched off for, so it can switch it back on in one click
// rather than sending the user to hunt through the settings for it.
$("turnOn").addEventListener("click", () => {
  if (!currentSite) return;
  $(`s-${currentSite}`).checked = true;
  saveSetting(currentSite, true);
});

// The unreachable state's one action. Closing the popup is deliberate: the reload will re-run the
// content script and the next open will find it.
$("reloadTab").addEventListener("click", async () => {
  // Close only after the reload has been accepted: closing first tore down this context before
  // the request went out, and the button did nothing.
  try {
    let tab = currentTab;
    if (!tab) [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) await chrome.tabs.reload(tab.id);
  } catch (e) {
    console.warn("[FlightWifi] reload failed:", e && e.message);
  }
  window.close();
});

applyTheme(document.documentElement.dataset.theme || "system");
meta();
buildAirlines();
loadStatus();
// The status read is asynchronous and starts at once. The glossary is built after the first frame
// so the shell is on screen before that work runs; the popup is not shown until it has painted, and
// a click is waiting on it. Settings follow in the same frame.
requestAnimationFrame(() => {
  $("glossary").replaceChildren(...FW_ROWS.map((row) => verdictItem(row)));
  loadSettings();
});

// Belt and braces under the deadlines above: if nothing has painted by now, something hung past
// every timeout, and the placeholder must not be what the user is left looking at.
setTimeout(() => {
  if (lastPainted !== null) return;
  const site = currentTab ? SITE_INJECT.find((s) => s.rx.test(currentTab.url || "")) : null;
  lastPainted = "watchdog";
  if (site) show("unreachable", site.label, "wait");
  else show("idle", "", "");
}, 6000);

// A popup only lives while it is open, so this interval dies with it and never runs in the
// background. It exists so a search whose results are still loading updates the count in place.
setInterval(loadStatus, 1200);

// The header button on Google Flights frames this same page rather than keeping a second copy of
// it. An iframe cannot size itself to its content, so when we are framed we report our height and
// let the host set it. The message carries nothing but a number.
if (window.parent !== window) {
  const reportHeight = () => {
    try {
      window.parent.postMessage({ type: "FW_POPUP_HEIGHT", height: document.documentElement.scrollHeight }, "*");
    } catch (e) {
      /* the host went away */
    }
  };
  reportHeight();
  try {
    new ResizeObserver(reportHeight).observe(document.documentElement);
  } catch (e) {
    setInterval(reportHeight, 500);
  }
}
