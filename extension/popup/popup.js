/* FlightWifi popup: a status panel, not a second website.
   It answers three things and stops: is the extension working, what did it find on this page, and
   what can I do next. Anything longer than a sentence belongs on flightwifi.app, which is why the
   explanations are an accordion rather than a page of prose. */

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
    iso: ["data/registry.js", "core.js", "google.js"]
  },
  {
    rx: /^https?:\/\/www\.skyscanner\.[a-z.]{2,7}\/transport\//,
    label: "Skyscanner",
    main: [],
    iso: ["data/registry.js", "core.js", "skyscanner.js"]
  },
  {
    rx: /^https?:\/\/soar\.flights\//,
    label: "Soar",
    main: [],
    iso: ["data/registry.js", "core.js", "soar.js"]
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

/* ---------- current page ---------- */

function renderTally(counts) {
  const ul = $("tally");
  ul.replaceChildren();
  let total = 0;
  for (const row of FW_ROWS) {
    const n = counts[row.key] || 0;
    if (!n) continue;
    total += n;
    const li = document.createElement("li");
    li.className = `v-${row.key}`;
    li.append(
      Object.assign(document.createElement("span"), { className: "pip" }),
      Object.assign(document.createElement("span"), { className: "n", textContent: String(n) }),
      Object.assign(document.createElement("span"), { className: "sep", textContent: "·" }),
      Object.assign(document.createElement("span"), { className: "lbl", textContent: row.label })
    );
    ul.append(li);
  }
  $("found").textContent = total === 1 ? "1 flight checked" : `${total} flights checked`;
  return total;
}

// An accordion, not a page of prose: six explanations opened at once is documentation, and the
// website is where documentation belongs.
function renderGlossary() {
  const box = $("glossary");
  box.replaceChildren();
  for (const row of FW_ROWS) {
    const head = document.createElement("button");
    head.type = "button";
    head.className = "acc-h";
    head.setAttribute("aria-expanded", "false");
    head.append(
      Object.assign(document.createElement("span"), { className: `pip v-${row.key}` }),
      Object.assign(document.createElement("span"), { className: "grow", textContent: row.label }),
      Object.assign(document.createElement("span"), { className: "chev", textContent: "›", ariaHidden: "true" })
    );

    const body = document.createElement("div");
    body.className = "acc-b";
    body.textContent = row.why;
    body.hidden = true;

    head.addEventListener("click", () => {
      const open = body.hidden;
      for (const b of box.querySelectorAll(".acc-b")) b.hidden = true;
      for (const h of box.querySelectorAll(".acc-h")) h.setAttribute("aria-expanded", "false");
      body.hidden = !open;
      head.setAttribute("aria-expanded", String(open));
    });

    box.append(head, body);
  }
}

function show(view, text, sub, dotClass) {
  $("statusText").textContent = text;
  $("statusSub").textContent = sub || "";
  $("statusSub").hidden = !sub;
  $("dot").className = `dot ${dotClass}`;
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

    const signature = JSON.stringify([status || null, site ? site.label : null]);
    if (signature === lastPainted) return;
    lastPainted = signature;

    if (!status) {
      if (site) show("unreachable", "Can't reach this page", site.label, "wait");
      else show("idle", "FlightWifi is ready", "", "");
      return;
    }
    if (!status.enabled) {
      show("off", `Switched off for ${status.label}`, "", "off");
      return;
    }

    // Painting first tells us whether anything is actually on screen, which is the difference between
    // "working" and "waiting for you to search".
    const total = renderTally(status.counts || {});
    if (total === 0) show("waiting", "Waiting for flight results", status.label, "wait");
    else show("active", "FlightWifi is active", status.label, "on");
  } finally {
    inFlight = false;
  }
}

// Puts the content script back into an orphaned tab. Only the top frame is touched, which is where
// the manifest puts it too. Silently does nothing anywhere the caller could not match a site.
async function repair(tab, site) {
  try {
    if (site.main.length) {
      await chrome.scripting.executeScript({ target: { tabId: tab.id, frameIds: [0] }, files: site.main, world: "MAIN" });
    }
    await chrome.scripting.executeScript({ target: { tabId: tab.id, frameIds: [0] }, files: site.iso });
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

/* ---------- wiring ---------- */

$("gear").addEventListener("click", () => {
  const open = $("settings").hidden;
  $("settings").hidden = !open;
  $("main").hidden = open;
  $("gear").setAttribute("aria-expanded", String(open));
});

$("explain").addEventListener("click", () => {
  const open = $("glossary").hidden;
  $("glossary").hidden = !open;
  $("explain").setAttribute("aria-expanded", String(open));
  $("explain").firstChild.textContent = open ? "Hide explanations " : "What do these mean? ";
});

for (const s of SITES) {
  $(`s-${s}`).addEventListener("change", (e) => saveSetting(s, e.target.checked));
}

// The off state names the site it is switched off for, so it can switch it back on in one click
// rather than sending the user to hunt through the gear menu for it.
$("turnOn").addEventListener("click", () => {
  if (!currentSite) return;
  $(`s-${currentSite}`).checked = true;
  saveSetting(currentSite, true);
});

// The unreachable state's one action. Closing the popup is deliberate: the reload will re-run the
// content script and the next open will find it.
$("reloadTab").addEventListener("click", () => {
  if (currentTab) chrome.tabs.reload(currentTab.id);
  window.close();
});

meta();
renderGlossary();
loadSettings();
loadStatus();

// Belt and braces under the deadlines above: if nothing has painted by now, something hung past
// every timeout, and the placeholder must not be what the user is left looking at.
setTimeout(() => {
  if (lastPainted !== null) return;
  const site = currentTab ? SITE_INJECT.find((s) => s.rx.test(currentTab.url || "")) : null;
  lastPainted = "watchdog";
  if (site) show("unreachable", "Can't reach this page", site.label, "wait");
  else show("idle", "FlightWifi is ready", "", "");
}, 6000);

// A popup only lives while it is open, so this interval dies with it and never runs in the
// background. It exists so a search whose results are still loading updates the count in place.
setInterval(loadStatus, 1200);
