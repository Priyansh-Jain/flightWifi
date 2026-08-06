// Google Flights main-world bridge.
//
// The exact aircraft for every itinerary is client-side the moment the results list renders:
// expanding a card fires no data request. But the parsed payload lives in compiled-closure state
// that no DOM walk, window sweep or cache can reach (audited 2026-08-06, see README). The two
// places it IS readable are the ds:1 AF_initDataCallback blob (server-rendered top flights on
// URL-entered searches) and the page's own FlightsFrontendUi response as it crosses the network
// layer. This script runs in the MAIN world, reads both, and republishes just the wifi-relevant
// facts through a DOM node, since DOM is shared between worlds and closures are not.
//
// It never issues a request of its own: it only reads responses the page already fetched for
// itself, in the user's own tab, and nothing leaves the browser.
(function () {
  const AC_RX = /^(Airbus|Boeing|Embraer|ATR|De Havilland|Canadair|Bombardier|Mitsubishi|Saab|Fokker|Dornier|Comac|COMAC) /;
  const IATA_RX = /^[A-Z]{3}$/;
  const NODE_ID = "__fwGF";
  const itins = new Map();
  let version = 0;

  function nodeEl() {
    let node = document.getElementById(NODE_ID);
    if (!node) {
      node = document.createElement("div");
      node.id = NODE_ID;
      node.style.display = "none";
      (document.documentElement || document).appendChild(node);
    }
    return node;
  }

  // dev-only instrumentation; build.sh replaces everything between the markers with a no-op,
  // so the shipped bridge writes nothing but the payload node itself
  // FW-DEVSTAT-START
  const stats = { calls: 0, texts: 0, parsed: 0, harvested: 0 };
  function stat(k, extra) {
    stats[k]++;
    try {
      const n = nodeEl();
      n.setAttribute("s", JSON.stringify(stats));
      if (extra) n.setAttribute("last", String(extra).slice(0, 120));
    } catch (e) {}
  }
  // FW-DEVSTAT-END

  function timeMin(t) {
    if (!Array.isArray(t) || !t.length || typeof t[0] !== "number") return null;
    const h = t[0], m = t.length > 1 && typeof t[1] === "number" ? t[1] : 0;
    if (h < 0 || h > 23 || m < 0 || m > 59) return null;
    return h * 60 + m;
  }

  // A segment record is recognised by its features, not its indexes, so a modest schema shuffle
  // survives: one aircraft string, two airport codes, two clock arrays, one [carrier, number] pair.
  function segOf(a) {
    if (!Array.isArray(a) || a.length < 10) return null;
    let ac = null, dep = null, arr = null, depT = null, arrT = null, cc = null, num = null;
    for (const el of a) {
      if (typeof el === "string") {
        if (!ac && AC_RX.test(el)) ac = el;
        else if (IATA_RX.test(el)) {
          if (!dep) dep = el;
          else if (!arr) arr = el;
        }
      } else if (Array.isArray(el)) {
        if (
          !cc &&
          el.length >= 2 &&
          typeof el[0] === "string" &&
          /^[A-Z0-9]{2}$/.test(el[0]) &&
          /[A-Z]/.test(el[0]) &&
          typeof el[1] === "string" &&
          /^\d{1,4}$/.test(el[1])
        ) {
          cc = el[0];
          num = el[1];
          continue;
        }
        const t = timeMin(el);
        if (t !== null && el.length <= 2) {
          if (depT === null) depT = t;
          else if (arrT === null) arrT = t;
        }
      }
    }
    if (!ac || !dep || !arr || depT === null || arrT === null || !cc) return null;
    return { ac, dep, arr, depT, arrT, cc, num };
  }

  // Segment records are recognised individually and grouped by the array that contains them:
  // sibling segments of one itinerary always share their immediate parent list, and demanding
  // nothing else about that list survives the envelope schema differing from the ds:1 blob.
  function harvest(root) {
    const groups = new Map();
    const seen = new Set();
    (function walk(o, parent, depth) {
      if (!o || typeof o !== "object" || depth > 26 || seen.has(o)) return;
      seen.add(o);
      if (Array.isArray(o)) {
        const seg = segOf(o);
        if (seg && parent) {
          if (!groups.has(parent)) groups.set(parent, []);
          groups.get(parent).push(seg);
          return;
        }
        for (const el of o) {
          // payloads nest JSON strings inside JSON; expand the plausible ones
          if (typeof el === "string" && el.length > 200 && (el[0] === "[" || el[0] === "{")) {
            try {
              walk(JSON.parse(el), null, depth + 1);
            } catch (e) {}
          } else walk(el, o, depth + 1);
        }
        return;
      }
      for (const k in o) walk(o[k], null, depth + 1);
    })(root, null, 0);
    let found = 0;
    for (const segs of groups.values()) {
      const key = segs.map((s) => `${s.cc}${s.num}.${s.dep}${s.depT}`).join("|");
      if (itins.has(key)) continue;
      itins.set(key, {
        dep: segs[0].dep,
        arr: segs[segs.length - 1].arr,
        depT: segs[0].depT,
        arrT: segs[segs.length - 1].arrT,
        stops: segs.length - 1,
        segs: segs.map((s) => ({ cc: s.cc, ac: s.ac })),
      });
      found++;
    }
    return found;
  }

  function publish() {
    let node = document.getElementById(NODE_ID);
    if (!node) {
      // a <script type="application/json"> would be the idiomatic carrier, but Google enforces
      // Trusted Types and script.textContent is a guarded sink there; textContent on a plain
      // hidden div is not a sink at all
      node = document.createElement("div");
      node.id = NODE_ID;
      node.style.display = "none";
      (document.documentElement || document).appendChild(node);
    }
    version++;
    node.textContent = JSON.stringify([...itins.values()]);
    node.setAttribute("v", String(version));
  }

  function ingestText(text) {
    stat("texts", text ? text.length + ":" + text.slice(0, 40).replace(/[^\w)\]}'[\\]/g, "") : "empty");
    if (!text || (text.indexOf("Airbus") < 0 && text.indexOf("Boeing") < 0 && text.indexOf("Embraer") < 0 && text.indexOf("irbus") < 0)) return;
    const clean = text.replace(/^\)\]\}'/, "").trim();
    const roots = [];
    try {
      roots.push(JSON.parse(clean));
    } catch (e) {
      // batchexecute framing: numeric length lines between JSON chunks; parse every bracketed line
      for (const line of clean.split("\n")) {
        const s = line.trim();
        if (!s || (s[0] !== "[" && s[0] !== "{")) continue;
        try {
          roots.push(JSON.parse(s));
        } catch (e2) {}
      }
    }
    if (roots.length) stat("parsed");
    let found = 0;
    for (const root of roots) found += harvest(root);
    if (found) {
      stat("harvested", found);
      publish();
    }
  }

  function looksLikeResults(url) {
    return typeof url === "string" && url.indexOf("/FlightsFrontendUi/data/") >= 0;
  }

  const origFetch = window.fetch;
  window.fetch = function (input, init) {
    const url = typeof input === "string" ? input : input && input.url;
    const p = origFetch.apply(this, arguments);
    if (looksLikeResults(url)) {
      stat("calls", "fetch " + String(url).slice(0, 90));
      p.then((res) => {
        try {
          res
            .clone()
            .text()
            .then(ingestText)
            .catch(() => {});
        } catch (e) {}
      }).catch(() => {});
    }
    return p;
  };

  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    if (looksLikeResults(url)) {
      stat("calls", "xhr " + String(url).slice(0, 90));
      this.addEventListener("load", function () {
        try {
          if (this.responseType === "" || this.responseType === "text") ingestText(this.responseText);
          else stat("texts", "rtype:" + this.responseType);
        } catch (e) {}
      });
    }
    return origOpen.apply(this, arguments);
  };

  function readBlobs() {
    for (const s of document.scripts) {
      const t = s.textContent || "";
      if (t.indexOf("AF_initDataCallback") < 0 || !/Airbus |Boeing |Embraer /.test(t)) continue;
      const start = t.indexOf("data:[");
      const end = t.lastIndexOf(", sideChannel");
      if (start < 0 || end < 0) continue;
      try {
        if (harvest(JSON.parse(t.slice(start + 5, end)))) publish();
      } catch (e) {}
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", readBlobs);
  else readBlobs();
})();
