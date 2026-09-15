/* A status button in Google's own header bar.
 *
 * Chrome does not pin a newly installed extension to the toolbar, it hides it behind the
 * puzzle-piece menu, so the popup is unreachable until someone thinks to go looking for it. This
 * puts the same summary one click away on the page where the verdicts already are, and doubles as
 * proof the extension is running.
 *
 * It reads the chips already on the page and renders nothing of its own beyond the count, so it
 * cannot disagree with them. If the header cannot be found it injects nothing rather than guessing
 * at a position, because a button in the wrong place is worse than no button.
 */

var FW_BTN_ID = "fw-header-btn";
var FW_CELL_ID = "fw-header-cell";

// Google's global bar namespaces every class with gb_, and while the suffix letters rotate between
// releases the prefix has been stable for years. Rather than pin to one class, find the right-hand
// control cluster by where it sits: small controls in the top strip, hard against the right edge.
// Their shared parent is the row to join.
function fwHeaderRow() {
  const w = window.innerWidth;
  const controls = [];
  for (const el of document.querySelectorAll('[class*="gb_"]')) {
    const r = el.getBoundingClientRect();
    if (r.top < 0 || r.top > 80) continue;
    if (r.height < 24 || r.height > 72 || r.width < 24 || r.width > 120) continue;
    if (r.right < w - 300) continue;
    if (!el.querySelector("svg, img")) continue;
    controls.push(el);
  }
  if (!controls.length) return null;
  // the parent shared by the most of them is the control row
  const tally = new Map();
  for (const el of controls) {
    const p = el.parentElement;
    if (p) tally.set(p, (tally.get(p) || 0) + 1);
  }
  let best = null;
  let bestN = 0;
  for (const [p, n] of tally) {
    const r = p.getBoundingClientRect();
    if (r.top > 80 || r.width > 600) continue;
    if (n > bestN) {
      best = p;
      bestN = n;
    }
  }
  return best;
}

var FW_MARK_ID = "fw-header-mark";
var FW_STYLE_ID = "fw-header-style";

/* Theming is CSS, not JavaScript, and that is what makes it instant. Google Flights writes its
   choice to body[data-theme] ("dark", "light", or "" for device default) in the same instant it
   repaints, and Points Path keys off exactly that attribute. Rules keyed on it flip in the same
   style pass as Google's own icons; the earlier version re-read the theme on a two-second tick and
   lagged by up to that. The ring and fill are the colours Google's own outlined controls use in
   this strip; the glyph is the foreground colour, the same as GetStopover's mark beside it, so the
   two extensions read as one family in the bar. Custom properties carry the colours into the
   mark's shadow root, which is where Google's stylesheet cannot reach. */
var FW_HEADER_CSS =
  "#fw-header-btn{--fw-ring:#dadce0;--fw-bg:#ffffff;--fw-hover:#f1f3f4;--fw-glyph:#0a0a0a;" +
  "border-color:var(--fw-ring)!important;background:var(--fw-bg)!important}" +
  "#fw-header-btn:hover{background:var(--fw-hover)!important}" +
  "body[data-theme=\"dark\"] #fw-header-btn{--fw-ring:#5f6368;--fw-bg:transparent;--fw-hover:rgba(232,234,237,.08);--fw-glyph:#e8eaed}" +
  "@media (prefers-color-scheme:dark){body:not([data-theme=\"light\"]) #fw-header-btn{--fw-ring:#5f6368;--fw-bg:transparent;--fw-hover:rgba(232,234,237,.08);--fw-glyph:#e8eaed}}";

function fwEnsureHeaderStyle() {
  if (document.getElementById(FW_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = FW_STYLE_ID;
  style.textContent = FW_HEADER_CSS;
  (document.head || document.documentElement).appendChild(style);
}

// The brand mark itself: the plane taking off with the Wi-Fi arcs, the same paths icons/icon.html
// puts on the blue tile for the toolbar icon. Here it is drawn without the tile, in currentColor,
// so it is dark on the light bar and light on the dark one, like Google's own icons and like
// GetStopover's mark beside it. The viewBox is cropped to the artwork's measured bounds
// (x 12-109, y 27-102 of the 128 tile) so it sits centred in the ring rather than low and left.
var FW_MARK =
  '<svg viewBox="10 24 102 80" width="26" height="20" aria-hidden="true">' +
  '<g stroke="currentColor" stroke-width="8" stroke-linecap="round" fill="none">' +
  '<path d="M78.81 45.81 A13 13 0 0 1 97.19 45.81"/>' +
  '<path d="M70.68 37.68 A24.5 24.5 0 0 1 105.32 37.68"/></g>' +
  '<circle cx="88" cy="55" r="5.5" fill="currentColor"/>' +
  '<path fill="currentColor" transform="translate(8,44) scale(3.55)" ' +
  'd="M21.48 10.06c-.21-.8-1.04-1.28-1.84-1.06l-5.31 1.42-6.9-6.43-1.93.51 4.14 7.17-4.97 1.33-1.97-1.54-1.45.39 1.82 3.16.77 1.33 1.6-.43 5.31-1.42 4.35-1.16 5.31-1.42c.82-.23 1.28-1.05 1.07-1.85z"/></svg>';

function fwCloseHeaderPanel() {
  const old = document.getElementById("fw-header-panel");
  if (old) {
    if (typeof old.__fwCleanup === "function") old.__fwCleanup();
    old.remove();
  }
  const btn = document.getElementById(FW_BTN_ID);
  if (btn) btn.setAttribute("aria-expanded", "false");
}

function fwOpenHeaderPanel(btn) {
  fwCloseHeaderPanel();
  const host = document.createElement("div");
  host.id = "fw-header-panel";
  const r = btn.getBoundingClientRect();
  host.style.cssText = [
    "position:fixed",
    `top:${Math.round(r.bottom + 8)}px`,
    `right:${Math.max(8, Math.round(window.innerWidth - r.right))}px`,
    "z-index:2147483647",
    "border-radius:12px",
    "overflow:hidden",
    "box-shadow:0 10px 34px rgba(0,0,0,.32)"
  ].join(";");

  // The real popup, framed. Reimplementing it here would have meant a second copy of the tally,
  // the glossary, the per-site switches and the footer, free to drift from the toolbar version.
  // An extension page in an iframe keeps its own origin and its full chrome.* access, so the
  // popup behaves exactly as it does from the toolbar, including reading this very tab.
  const frame = document.createElement("iframe");
  frame.id = "fw-header-frame";
  frame.src = chrome.runtime.getURL("popup/popup.html");
  frame.setAttribute("title", "FlightWifi");
  // 320 matches the popup's own width; the height is provisional until the popup reports its own.
  frame.style.cssText = "width:320px;height:320px;border:0;display:block;background:transparent;color-scheme:normal";
  host.appendChild(frame);
  document.body.appendChild(host);
  btn.setAttribute("aria-expanded", "true");

  // An iframe cannot size itself to its content, so the popup posts its height and we follow it.
  const onMessage = (ev) => {
    if (ev.source !== frame.contentWindow) return;
    const h = ev.data && ev.data.type === "FW_POPUP_HEIGHT" ? Number(ev.data.height) : 0;
    if (h > 80 && h < 900) frame.style.height = Math.round(h) + "px";
  };
  window.addEventListener("message", onMessage);
  host.__fwCleanup = () => window.removeEventListener("message", onMessage);

  setTimeout(() => {
    const away = (ev) => {
      if (host.contains(ev.target) || btn.contains(ev.target)) return;
      document.removeEventListener("mousedown", away, true);
      fwCloseHeaderPanel();
    };
    document.addEventListener("mousedown", away, true);
  }, 0);
}

/* What the button is for: the real popup, opened where the toolbar icon would open it. Only the
   worker can call chrome.action.openPopup(), so the click asks it to. Anything that stops that
   lands in the same place, the in-page panel, so the button is never dead: a Chrome older than 127,
   a worker that never answers, a content script orphaned by an update.

   The deadline is generous on purpose. Waking the worker and opening the popup was measured at
   790ms, and an impatient deadline is worse than a slow one: it opens the panel and then the
   toolbar popup arrives anyway, leaving two. Hence the fellBack bookkeeping, which retracts the
   panel if the real popup wins late. */
var FW_POPUP_DEADLINE_MS = 4000;
var fwOpening = false;
var fwLastWarm = 0;
var fwFallbackSaid = false;

/* Most of what the click waits for is not the popup at all. A service worker idles out thirty
   seconds after its last event, and the extension process goes with it, so a click after a few
   minutes of reading results pays for a worker start and a process spawn before the popup can even
   begin to load. The pointer reaches the button a few hundred milliseconds before it clicks, and
   that is enough to have both running. The ping asks the worker for nothing. */
function fwWarmWorker() {
  const now = Date.now();
  if (now - fwLastWarm < 15000) return;
  fwLastWarm = now;
  try {
    chrome.runtime.sendMessage({ type: "FW_PING" }).catch(() => undefined);
  } catch (e) {
    /* orphaned script, nothing to warm */
  }
}

/* Hover is not always early enough: a fast pointer reaches the button and clicks in the same
   instant, and the very first click after a refresh then starts the worker, spawns the extension
   process and only then loads the popup, while Chrome shows an empty bubble for the whole second
   that takes. So while a Google Flights tab is visible the worker is kept awake instead: one empty
   ping every 25 seconds, inside the 30-second idle window, none while the tab is hidden. Cost is
   one message; benefit is that every click, including the first, takes the warm path. */
var FW_KEEPALIVE_MS = 25000;
var fwKeepalive = null;

function fwPing() {
  fwLastWarm = Date.now();
  try {
    chrome.runtime.sendMessage({ type: "FW_PING" }).catch(() => undefined);
  } catch (e) {
    /* orphaned script, nothing to keep alive */
  }
}

function fwOnVisibility() {
  if (document.visibilityState === "visible") {
    fwPing();
    if (!fwKeepalive) fwKeepalive = setInterval(fwPing, FW_KEEPALIVE_MS);
  } else if (fwKeepalive) {
    clearInterval(fwKeepalive);
    fwKeepalive = null;
  }
}

function fwStartKeepalive() {
  document.addEventListener("visibilitychange", fwOnVisibility);
  fwOnVisibility();
}

function fwStopKeepalive() {
  document.removeEventListener("visibilitychange", fwOnVisibility);
  if (fwKeepalive) clearInterval(fwKeepalive);
  fwKeepalive = null;
}

function fwSetBusy(btn, on) {
  const host = document.getElementById(FW_MARK_ID);
  if (host) host.toggleAttribute("data-busy", on);
  btn.setAttribute("aria-busy", on ? "true" : "false");
}

async function fwOpenToolbarPopup(btn) {
  if (fwOpening) return;
  fwOpening = true;
  let fellBack = false;
  fwSetBusy(btn, true);
  const deadline = setTimeout(() => {
    fellBack = true;
    fwOpening = false;
    fwSetBusy(btn, false);
    fwOpenHeaderPanel(btn);
  }, FW_POPUP_DEADLINE_MS);
  let opened = false;
  let reason = "";
  try {
    const reply = await chrome.runtime.sendMessage({ type: "FW_OPEN_POPUP" });
    opened = !!(reply && reply.opened);
    if (!opened) reason = reply && reply.reason ? reply.reason : "the worker sent no answer";
  } catch (e) {
    /* no worker to answer, or this script has been orphaned by an update */
    reason = e && e.message ? e.message : String(e);
  }
  clearTimeout(deadline);
  fwOpening = false;
  fwSetBusy(btn, false);
  if (opened) {
    if (fellBack) fwCloseHeaderPanel();
  } else if (!fellBack) {
    /* Said once per page, the way Points Path does, so the fallback is never a silent mystery. */
    if (!fwFallbackSaid) {
      fwFallbackSaid = true;
      console.warn("[FlightWifi] toolbar popup unavailable (" + reason + "); showing the in-page panel instead");
    }
    fwOpenHeaderPanel(btn);
  }
}

function fwInjectHeaderButton() {
  /* After the extension reloads or updates, this copy of the script lives on in the tab with no
     chrome.runtime behind it. Its button could open nothing, so take it away rather than leave a
     control that ignores clicks. The tick that calls this keeps running, which is harmless: each
     tick finds no button to add and no runtime to add it for. */
  if (!chrome.runtime || !chrome.runtime.id) {
    fwRemoveHeaderButton();
    return;
  }
  if (document.getElementById(FW_BTN_ID)) return;
  const row = fwHeaderRow();
  if (!row) return;
  fwEnsureHeaderStyle();

  // Google lays this strip out as an anonymous table: the row is display:block and its existing
  // control is a table-cell. Dropping a plain inline-grid button in made it an anonymous cell
  // aligned to the baseline, which put it twelve pixels above the viewport AND shoved Google's own
  // control down twenty pixels. So the button goes inside a wrapper that copies whatever layout the
  // sibling is already using, and only the inside of the wrapper is ours to style.
  const peer = [...row.children].find((c) => {
    const r = c.getBoundingClientRect();
    return r.height >= 24 && r.height <= 72;
  });
  const peerCs = peer ? getComputedStyle(peer) : null;
  const peerBox = peer ? peer.getBoundingClientRect() : null;
  const size = peerBox ? Math.round(Math.min(48, Math.max(32, peerBox.height))) - 8 : 36;

  const cell = document.createElement("div");
  cell.id = FW_CELL_ID;
  cell.style.cssText = [
    `display:${peerCs ? peerCs.display : "inline-block"}`,
    "vertical-align:middle",
    "text-align:center",
    "line-height:0"
  ].join(";");

  const btn = document.createElement("button");
  btn.id = FW_BTN_ID;
  btn.type = "button";
  btn.title = "FlightWifi";
  btn.setAttribute("aria-label", "FlightWifi summary");
  btn.setAttribute("aria-expanded", "false");
  btn.style.cssText = [
    "display:inline-grid",
    "place-items:center",
    `width:${size}px`,
    `height:${size}px`,
    "margin:0 4px",
    "padding:0",
    "border-radius:50%",
    "border-width:1px",
    "border-style:solid",
    "cursor:pointer",
    "box-sizing:border-box",
    "line-height:0",
    "vertical-align:middle"
  ].join(";");

  /* The glyph lives in a shadow root. Google's stylesheet has rules like `.gb_Ra svg { color: ... }`
     that match any svg inside its header, ours included, and they beat an inline colour on the
     button. Nothing outside a shadow tree can select what is inside it, so the glyph keeps the
     colour we give it. The colour arrives through a custom property, which does inherit across the
     boundary. */
  const mark = document.createElement("span");
  mark.id = FW_MARK_ID;
  mark.style.cssText = "display:block;line-height:0";
  /* The spinner is the answer to "did my click register?": it is on screen in the first frame after
     the click, while the real popup takes anything from a third of a second to two. It fades the
     glyph and turns a thin arc around it; under reduced motion it is a still ring instead. */
  mark.attachShadow({ mode: "open" }).innerHTML =
    "<style>" +
    ":host{display:block;line-height:0;position:relative}" +
    "svg{display:block;color:var(--fw-glyph,#0a0a0a);transition:opacity .12s}" +
    ":host([data-busy]) svg{opacity:.3}" +
    ".ring{position:absolute;left:50%;top:50%;width:32px;height:32px;margin:-16px 0 0 -16px;border-radius:50%;" +
    "border:2px solid transparent;border-top-color:var(--fw-glyph,#0a0a0a);opacity:0;pointer-events:none}" +
    ":host([data-busy]) .ring{opacity:.85;animation:fw-spin .65s linear infinite}" +
    "@keyframes fw-spin{to{transform:rotate(360deg)}}" +
    "@media (prefers-reduced-motion:reduce){:host([data-busy]) .ring{animation:none;border-color:var(--fw-glyph,#0a0a0a);opacity:.3}}" +
    "</style>" + FW_MARK + '<span class="ring"></span>';
  btn.appendChild(mark);

  btn.addEventListener("pointerenter", fwWarmWorker);
  btn.addEventListener("focus", fwWarmWorker);
  btn.addEventListener("click", (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (document.getElementById("fw-header-panel")) fwCloseHeaderPanel();
    else void fwOpenToolbarPopup(btn);
  });

  cell.appendChild(btn);
  const peerBefore = peerBox ? Math.round(peerBox.top) : null;
  row.insertBefore(cell, row.firstChild);

  // Two ways this can still go wrong: our button lands somewhere useless, or it shifts one of
  // Google's own controls. Either is worse than not being there, so undo it rather than leave a
  // broken header behind.
  const placed = btn.getBoundingClientRect();
  const peerAfter = peer ? Math.round(peer.getBoundingClientRect().top) : null;
  const shiftedGoogle = peerBefore !== null && peerAfter !== null && Math.abs(peerAfter - peerBefore) > 4;
  if (placed.top < 0 || placed.top > 80 || placed.height < 20 || shiftedGoogle) cell.remove();
}

function fwRemoveHeaderButton() {
  fwStopKeepalive();
  fwCloseHeaderPanel();
  const cell = document.getElementById(FW_CELL_ID);
  if (cell) cell.remove();
  const style = document.getElementById(FW_STYLE_ID);
  if (style) style.remove();
}

// Google re-renders its header on navigation inside the app, which drops anything we added, so the
// button is re-checked on the same cheap interval the adapters already use rather than on its own
// observer.
function fwStartHeaderButton() {
  fwInjectHeaderButton();
  fwStartKeepalive();
  return setInterval(fwInjectHeaderButton, 2000);
}
