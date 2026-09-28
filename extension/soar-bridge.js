(function () {
  if (window.__fwSoarBridge) return;
  window.__fwSoarBridge = true;
  const NODE_ID = "__fwSOAR";
  const published = new Map();
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

  function offerOf(el) {
    const key = Object.keys(el).find((k) => k.indexOf("__reactFiber") === 0);
    let f = key ? el[key] : null;
    for (let i = 0; f && i < 12; i++) {
      const p = f.memoizedProps;
      if (p && p.offer && Array.isArray(p.offer.slices)) return p.offer;
      f = f.return;
    }
    return null;
  }

  function segsOf(offer) {
    const out = [];
    for (const slice of offer.slices) {
      if (!slice || !Array.isArray(slice.segments)) return null;
      for (const s of slice.segments) {
        if (!s) return null;
        const ac = typeof s.aircraft === "string" ? s.aircraft : s.aircraft && typeof s.aircraft.name === "string" ? s.aircraft.name : null;
        out.push({
          cc: s.operating_carrier_iata || s.carrier_iata || null,
          mk: s.carrier_iata || null,
          ac,
          dep: s.origin || null,
          arr: s.destination || null,
          num: s.operating_flight_number || s.flight_number || null
        });
      }
    }
    return out.length ? out : null;
  }

  function publish() {
    const node = nodeEl();
    const obj = {};
    for (const [k, v] of published) obj[k] = v;
    version++;
    node.textContent = JSON.stringify(obj);
    node.setAttribute("v", String(version));
    document.dispatchEvent(new CustomEvent("fw:soar"));
  }

  function scan() {
    let added = 0;
    for (const el of document.querySelectorAll(".offer[data-id]")) {
      const id = el.getAttribute("data-id");
      if (!id || published.has(id)) continue;
      const offer = offerOf(el);
      if (!offer) continue;
      const segs = segsOf(offer);
      if (!segs) continue;
      published.set(id, { segs });
      added++;
    }
    if (added) publish();
  }

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    setTimeout(() => {
      queued = false;
      scan();
    }, 150);
  });

  function start() {
    observer.observe(document.body, { childList: true, subtree: true });
    scan();
    setInterval(scan, 1500);
  }

  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start);
})();
