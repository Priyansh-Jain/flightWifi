(function () {
  if (window.__fwSkyBridge) return;
  window.__fwSkyBridge = true;
  const NODE_ID = "__fwSKY";
  const SEARCH_MARK = "/g/radar/api/v2/web-unified-search/";
  const DETAILS_URL = "/g/sonar/v3/itinerary/details";
  const HEADERS = {
    "content-type": "application/json",
    "grpc-metadata-x-skyscanner-channelid": "website",
    "grpc-metadata-x-skyscanner-devicedetection-ismobile": "false",
    "grpc-metadata-x-skyscanner-devicedetection-istablet": "false"
  };
  const MAX_PARALLEL = 3;
  const MAX_PER_PAGE = 24;
  const VIEW_MARGIN = 200;
  const MAX_TRIES = 3;
  const RETRY_MS = 8000;
  const legsById = new Map();
  const resolved = new Map();
  const pending = new Set();
  const waiting = new Set();
  const failed = new Set();
  const tries = new Map();
  const queue = [];
  let active = 0;
  let spent = 0;
  let halted = false;
  let allowed = false;
  let version = 0;
  let culture = null;
  let search = null;

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

  // FW-DEVSTAT-START
  const stats = { firstScan: 0, ticketsAt: 0, legsAt: 0, legs: 0, cultureAt: 0, firstReqAt: 0, lastOkAt: 0, waited: 0, ok: 0, failed: 0 };
  function stat(k, v) {
    if (v === "t") {
      if (!stats[k]) stats[k] = Math.round(performance.now());
    } else if (v === "now") {
      stats[k] = Math.round(performance.now());
    } else if (typeof v === "number") {
      stats[k] = v;
    } else {
      stats[k]++;
    }
    try {
      nodeEl().setAttribute("s", JSON.stringify(stats));
    } catch (e) {}
  }
  const evlog = [];
  function ev(kind, id) {
    evlog.push(kind + ":" + String(id).slice(-10) + "@" + Math.round(performance.now()));
    try {
      nodeEl().setAttribute("e", evlog.slice(-80).join(" "));
    } catch (e) {}
  }
  // FW-DEVSTAT-END

  function notify() {
    document.dispatchEvent(new CustomEvent("fw:sky"));
  }

  function publish() {
    const node = nodeEl();
    const obj = {};
    for (const [k, v] of resolved) obj[k] = v;
    version++;
    node.textContent = JSON.stringify(obj);
    node.setAttribute("v", String(version));
    notify();
  }

  function onScreen(el) {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.bottom > -VIEW_MARGIN && r.top < window.innerHeight + VIEW_MARGIN;
  }

  function inView(id) {
    const el = document.querySelector('[data-flightwifi-itin="' + CSS.escape(id) + '"]');
    return !!el && onScreen(el);
  }

  function ingestSearch(text) {
    let root;
    try {
      root = JSON.parse(text);
    } catch (e) {
      return;
    }
    const its = root && root.itineraries;
    const list = its && Array.isArray(its.results) ? its.results : Array.isArray(its) ? its : [];
    for (const it of list) {
      if (!it || typeof it.id !== "string" || !Array.isArray(it.legs)) continue;
      const legs = [];
      for (const l of it.legs) {
        const o = l && l.origin && l.origin.entityId;
        const d = l && l.destination && l.destination.entityId;
        const m = l && typeof l.departure === "string" ? /^(\d{4})-(\d{2})-(\d{2})/.exec(l.departure) : null;
        if (!o || !d || !m) {
          legs.length = 0;
          break;
        }
        legs.push({ originEntityId: String(o), destinationEntityId: String(d), date: { year: +m[1], month: +m[2], day: +m[3] } });
      }
      if (legs.length) legsById.set(it.id, legs);
    }
    if (legsById.size) {
      stat("legsAt", "t");
      stat("legs", legsById.size);
    }
    for (const id of waiting) {
      if (!legsById.has(id)) continue;
      waiting.delete(id);
      queue.push(id);
    }
    pump();
  }

  const origFetch = window.fetch;
  window.fetch = function (input) {
    const url = typeof input === "string" ? input : input && input.url;
    const p = origFetch.apply(this, arguments);
    if (typeof url === "string" && url.indexOf(SEARCH_MARK) >= 0) {
      p.then((res) => {
        try {
          res.clone().text().then(ingestSearch).catch(() => {});
        } catch (e) {}
      }).catch(() => {});
    }
    return p;
  };

  function fiberProps(el, test, hops) {
    const key = Object.keys(el).find((k) => k.indexOf("__reactFiber") === 0);
    let f = key ? el[key] : null;
    for (let i = 0; f && i < hops; i++) {
      const p = f.memoizedProps;
      if (p && test(p)) return p;
      f = f.return;
    }
    return null;
  }

  const CABINS = { economy: "ECONOMY", premiumeconomy: "PREMIUM_ECONOMY", business: "BUSINESS", first: "FIRST" };

  function earlyContext() {
    try {
      const raw = document.cookie.split(";").map((c) => c.trim()).find((c) => c.indexOf("ssculture=") === 0);
      const dec = raw ? decodeURIComponent(raw.slice(10)) : "";
      const pick = (k) => {
        const m = new RegExp(k + ":::([A-Za-z-]+)").exec(dec);
        return m ? m[1] : null;
      };
      const market = pick("market");
      const currency = pick("currency");
      const locale = pick("locale");
      if (market && currency && locale) {
        culture = { market, currencyCode: currency, locale };
        stat("cultureAt", "t");
      }
    } catch (e) {}
    try {
      const q = new URL(location.href).searchParams;
      const adults = parseInt(q.get("adultsv2") || q.get("adults") || "1", 10);
      const cabin = CABINS[(q.get("cabinclass") || "economy").toLowerCase()];
      const kids = (q.get("childrenv2") || "").split("|").map((x) => parseInt(x, 10)).filter((x) => !isNaN(x));
      if (adults > 0 && cabin) search = { adults, childAges: kids, cabinClass: cabin };
    } catch (e) {}
  }

  let fiberChecked = false;

  function readContext(el) {
    if (fiberChecked) return;
    const p = fiberProps(el, (q) => q.variables && q.variables.culture && q.variables.flightSearch, 80);
    if (!p) return;
    fiberChecked = true;
    const c = p.variables.culture;
    const s = p.variables.flightSearch;
    if (c.market && c.currency && c.locale) {
      culture = { market: c.market, currencyCode: c.currency, locale: c.locale };
      stat("cultureAt", "t");
    }
    const ages = Array.isArray(s.children) ? s.children.map((x) => (typeof x === "number" ? x : x && x.age)).filter((x) => typeof x === "number") : [];
    if (s.cabinClass && s.adults) search = { adults: +s.adults, childAges: ages, cabinClass: String(s.cabinClass).toUpperCase() };
  }

  async function resolve(id) {
    active++;
    spent++;
    stat("firstReqAt", "t");
    ev("req", id);
    let done = false;
    let why = "exc";
    try {
      const body = {
        itineraryId: id,
        searchRequestDetails: {
          adults: search.adults,
          childAges: search.childAges,
          cabinClass: search.cabinClass,
          legs: legsById.get(id).map((l) => ({ originEntityId: l.originEntityId, addAlternativeOrigins: false, destinationEntityId: l.destinationEntityId, addAlternativeDestinations: false, date: l.date }))
        },
        userPreferences: culture
      };
      const res = await origFetch.call(window, DETAILS_URL, { method: "POST", headers: HEADERS, body: JSON.stringify(body), credentials: "include" });
      if (res.status === 403 || res.status === 429 || res.status >= 500) {
        halted = true;
        why = "halt" + res.status;
        return;
      }
      if (!res.ok) {
        why = "s" + res.status;
        return;
      }
      const j = await res.json();
      const legs = j && j.itinerary && Array.isArray(j.itinerary.legs) ? j.itinerary.legs : null;
      if (!legs) {
        why = "null";
        return;
      }
      done = true;
      const segs = [];
      for (const l of legs) {
        for (const s of l.segments || []) {
          const op = s.operatingCarrier || {};
          const mk = s.marketingCarrier || {};
          segs.push({
            cc: op.displayCode || op.altId || op.alternateId || mk.displayCode || mk.altId || mk.alternateId || null,
            mk: mk.displayCode || mk.altId || mk.alternateId || null,
            num: s.flightNumber || null,
            ac: s.amenityInfo && typeof s.amenityInfo.transportDescription === "string" ? s.amenityInfo.transportDescription : null,
            dep: s.origin && ((s.origin.airport && s.origin.airport.displayCode) || s.origin.displayCode) || null,
            arr: s.destination && ((s.destination.airport && s.destination.airport.displayCode) || s.destination.displayCode) || null
          });
        }
      }
      if (segs.length) {
        resolved.set(id, { segs });
        ev("ok", id);
        stat("ok");
        stat("lastOkAt", "now");
        publish();
      }
    } catch (e) {
    } finally {
      active--;
      if (done) {
        pending.delete(id);
      } else {
        const n = (tries.get(id) || 0) + 1;
        tries.set(id, n);
        ev("fail-" + why, id);
        stat("failed");
        if (!halted && n < MAX_TRIES) {
          setTimeout(() => {
            queue.push(id);
            pump();
          }, n * RETRY_MS);
        } else {
          failed.add(id);
          pending.delete(id);
        }
      }
      pump();
    }
  }

  function pump() {
    while (allowed && !halted && culture && search && active < MAX_PARALLEL && spent < MAX_PER_PAGE && queue.length) {
      const id = queue.shift();
      if (resolved.has(id) || failed.has(id) || !inView(id)) {
        pending.delete(id);
        continue;
      }
      if (!legsById.has(id)) {
        ev("wait", id);
        waiting.add(id);
        stat("waited");
        continue;
      }
      resolve(id);
    }
  }

  function scan() {
    if (halted) return;
    stat("firstScan", "t");
    let known = false;
    for (const el of document.querySelectorAll('[data-testid="ticket"]')) {
      stat("ticketsAt", "t");
      let id = el.dataset.flightwifiItin;
      if (!id) {
        const p = fiberProps(el, (q) => typeof q.itineraryId === "string", 15);
        if (!p) continue;
        id = p.itineraryId;
        el.dataset.flightwifiItin = id;
        ev("tag", id);
        if (resolved.has(id)) known = true;
      }
      readContext(el);
      if (resolved.has(id) || pending.has(id) || failed.has(id) || !onScreen(el)) continue;
      pending.add(id);
      queue.push(id);
    }
    if (known) notify();
    pump();
  }

  let queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    setTimeout(() => {
      queued = false;
      scan();
    }, 200);
  }

  function start() {
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    scan();
  }
  document.addEventListener("fw:sky-on", () => {
    allowed = true;
    pump();
  });
  document.addEventListener("fw:sky-off", () => {
    allowed = false;
  });
  earlyContext();
  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start);
})();
