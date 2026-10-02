/* The shipped background worker. It owns the two moments Chrome gives us, the install and the
   removal, plus the Rift scripts once the user allows that site. It asks for no permissions beyond
   the manifest's, which is why build.sh swaps it in for the dev reloader. */

const UNINSTALL_PAGE = "https://flightwifi.app/uninstall/";

function setUninstallPage() {
  try {
    const { version } = chrome.runtime.getManifest();
    chrome.runtime.setUninstallURL(`${UNINSTALL_PAGE}?v=${encodeURIComponent(version)}`);
  } catch (e) {}
}

/* Nothing about this extension is visible until a flight search is on screen, so an install that
   ends at a silent toolbar icon has proved nothing and gets removed in the first week. Opening a
   bare Google Flights would be no better: with no results there are no verdicts to see. So the
   first run lands on a real search whose results carry a mix of systems, and the chips are the
   first thing the new user reads. A tab opened after install also gets the content script the
   normal way, so this never hits the orphaned-tab path the popup has to repair. */
/* London to Doha was chosen by testing candidates against the live page: it returns 18 verdicts
   across 38 results and shows five of the six labels at once, including seven "Video calls work"
   and three "No Wi-Fi". Routes like New York to London draw plenty of chips but every one reads
   "Email & browsing", which demonstrates nothing. Re-test if the mix ever goes flat. */
const DEMO_ROUTE = "Flights from London to Doha on";
const DEMO_DAYS_AHEAD = 75;

function demoUrl() {
  const d = new Date();
  d.setDate(d.getDate() + DEMO_DAYS_AHEAD);
  const when = d.toISOString().slice(0, 10);
  const q = `${DEMO_ROUTE} ${when} one way`;
  // fw=install marks the visit so the activation rate is measurable rather than guessed at.
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(q)}&fw=install`;
}

function onInstalled(details) {
  setUninstallPage();
  // Only a genuinely new user. An update or a browser restart must not seize a tab.
  if (details && details.reason !== "install") return;
  try {
    chrome.tabs.create({ url: demoUrl(), active: true });
  } catch (e) {}
}

setUninstallPage();
chrome.runtime.onInstalled.addListener(onInstalled);
chrome.runtime.onStartup.addListener(setUninstallPage);

const RIFT_ORIGINS = ["https://rift.co/*"];
const RIFT_SCRIPTS = [
  { id: "fw-rift-bridge", matches: RIFT_ORIGINS, js: ["soar-bridge.js"], runAt: "document_end", world: "MAIN" },
  { id: "fw-rift", matches: RIFT_ORIGINS, js: ["data/registry.js", "core.js", "soar.js"], css: ["chip.css"], runAt: "document_end" }
];

async function syncRiftScripts() {
  try {
    const granted = await chrome.permissions.contains({ origins: RIFT_ORIGINS });
    const have = await chrome.scripting.getRegisteredContentScripts({ ids: RIFT_SCRIPTS.map((s) => s.id) });
    if (have.length && (!granted || have.length !== RIFT_SCRIPTS.length)) {
      await chrome.scripting.unregisterContentScripts({ ids: have.map((s) => s.id) });
    }
    if (granted && have.length !== RIFT_SCRIPTS.length) {
      await chrome.scripting.registerContentScripts(RIFT_SCRIPTS);
    }
  } catch (e) {}
}

chrome.permissions.onAdded.addListener(syncRiftScripts);
chrome.permissions.onRemoved.addListener(syncRiftScripts);
chrome.runtime.onInstalled.addListener(syncRiftScripts);
chrome.runtime.onStartup.addListener(syncRiftScripts);

/* Clicking the in-page header button should open this extension's real popup, anchored to the
   toolbar the way clicking the icon does. A content script cannot do that itself, but
   chrome.action.openPopup() can be called from here. It is only available outside policy-installed
   extensions from Chrome 127, so the reply says whether it actually opened and the caller keeps its
   in-page panel for when it did not. */
chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (!msg) return;
  /* The header button pings when the pointer enters it. The reply is nothing; the point is that
     this worker, and with it the extension process the popup will render in, is awake by the time
     the click lands a few hundred milliseconds later instead of being started by it. */
  if (msg.type === "FW_PING") {
    reply({ ok: true });
    return;
  }
  if (msg.type !== "FW_OPEN_POPUP") return;
  (async () => {
    try {
      if (typeof chrome.action?.openPopup !== "function") {
        reply({ opened: false, reason: "chrome.action.openPopup is not available in this Chrome" });
        return;
      }
      /* Name the window the click came from. Left to its default, Chrome opens in whichever window
         it considers active, and rejects with "Could not find an active browser window" when it has
         no opinion, which sent the click to the in-page panel for no reason the user could see. */
      const windowId = sender.tab && sender.tab.windowId;
      if (windowId != null && windowId >= 0) {
        /* Chrome also refuses a window it does not consider focused ("Cannot show popup for an
           inactive window"), and its own error text prescribes this call. The user just clicked in
           that window, so focusing it changes nothing they can see. */
        try {
          const w = await chrome.windows.get(windowId);
          if (!w.focused) await chrome.windows.update(windowId, { focused: true });
        } catch (e) {}
        await chrome.action.openPopup({ windowId });
      } else {
        await chrome.action.openPopup();
      }
      reply({ opened: true });
    } catch (e) {
      /* Chrome's answer plus its own view of the window, which is the fact that decides most of
         these: an unfocused window is refused, and a click from a real pointer focuses its window
         before this code runs, while a synthetic one does not. */
      let focus = "";
      try {
        const w = sender.tab ? await chrome.windows.get(sender.tab.windowId) : null;
        if (w) focus = " [window focused: " + w.focused + ", state: " + w.state + "]";
      } catch (e2) {}
      reply({ opened: false, reason: (e && e.message ? e.message : String(e)) + focus });
    }
  })();
  /* Every path above answers, so holding the channel open cannot strand the caller. */
  return true;
});
