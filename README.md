# FlightWifi (working title)

A standalone Chrome extension that answers one question on every flight you look at: **can I actually work on this flight's wifi?** Completely separate product from GetStopover: different repo, different brand, different CWS listing. Nothing here imports from or links to the GetStopover extension.

## Why this exists

No booking flow answers the wifi question properly. Google Flights shows a coarse badge ("Wi-Fi for a fee") sourced from ATPCO/Routehappy and drops the provider, the latency class, and the access gating. Skyscanner shows nothing. The people asking "does this flight have Starlink" are really asking "can I take a video call from seat 34K", and the answer is decided by provider + orbit (LEO ≈ 20-50ms, GEO ≈ 600ms+) and by access tiers (an aircraft can "have wifi" that an economy passenger without status can only use for messaging). Single-purpose checkers (StarlinkFlights, doesmyflighthavestarlink, stardrift.ai) exist but lose on placement: they make you open a tab and type a flight number. We render the verdict where the decision happens.

## The DOM investigation that gates the design (verified 2026-08-02, live Google Flights, OSL-IST search)

- **Collapsed result cards contain NO aircraft type.** Not visible, not hidden, not in aria-labels, not per-card in script blobs. Verified with text-walker + aria + script probes.
- **Expanded detail panels contain everything we need as plain text**: aircraft ("Boeing 737"), flight number ("TK 1748"), and Google's own wifi amenity line ("Wi-Fi for a fee"). Example captured text run: `Boeing 737 · TK 1748 · Average legroom (31 in) · Wi-Fi for a fee · In-seat USB outlet…`
- Collapsed cards DO show the airline name.

Consequence, the two-tier design, both now built:
1. **Expanded-panel verdict.** MutationObserver on `aria-expanded` flips → parse aircraft + flight number from the panel text → registry lookup → chip inserted into Google's own amenity list. No network interception, no page-script injection, passive DOM only (same CWS-safe posture that got the other extension approved).
2. **Collapsed-card verdict.** Fleet-level, because the collapsed row names the airline but never the aircraft. Comparing twenty itineraries should not cost twenty clicks, so the row carries the rolled-up answer and the hover card says "expand for the exact aircraft".

## Chip design

The chip is styled to sit inside Google's own visual language rather than shout over it: 11px, 6px radius, a wifi glyph (struck through for the no-wifi case) drawn as a CSS mask so it always takes the verdict colour.

- **Labels name the outcome, not the plumbing.** Nobody picks a flight by satellite orbit; they are asking whether they can take the standup call. So the chip reads "Video calls work" / "Email & browsing" / "Fast on some flights" / "Not guaranteed" / "No Wi-Fi", not "LEO" or "Panasonic". The constraint on an outcome label is that it must not promise *less* than the truth either: high orbit is "Email & browsing" rather than "Messaging only", because a 600ms link is genuinely fine for mail, docs and Slack and only fails on live calls.
- **One line, one claim.** The chip carries the verdict and nothing else. Provider, latency, access gating and provenance all live in the hover card, because beside Google's amenity line the column is ~100px wide and a second clause just wraps to three lines.
- **The hover card answers before it evidences.** Verdict, then one plain sentence, then ✓ good for / ✕ not for, then provider and cost, then what we do not know, then a dim `ⓘ` footnote carrying confidence and source count. Provenance matters enormously to us and to almost no reader, so it is the footnote rather than a field.
- **Registry prose is not reader copy.** `provider` and `access` are written to be *checkable*: they carry parentheticals, hedges, rollout dates and full tier tables, and 40% of `access` values run past 120 characters. Rendering them raw produced a wall of text, so the card derives reader copy instead. `access` is split into clauses on `;`, sentence ends, `, plus ` and `, with ` (bracket-aware, so a price range never loses its opening paren), capped at three points of 120 characters each, with a `Free` / `Paid` / `Free tier, then paid` badge derived from keywords. `provider` drops its parenthetical, its post-dash caveat and its post-semicolon rollout story. Measured over all 237 entries: bullets median 60 chars, providers median 20, zero unbalanced brackets, zero entries left with nothing to show.
- **Attribution is stripped, not dropped.** "a 2026 review reports free messaging for all cabins" is a hedge wrapped around a fact the reader wants; the first pass filtered the whole clause and lost the fact. Only clauses that are *nothing but* provenance ("not confirmed by the airline") are removed, and the confidence level survives in the footnote either way.
- **Amber is rationed.** It is the only colour that asks the reader to stop, so it is reserved for the one case that earns it: part of the fleet has no wifi at all and the schedule will not say which aircraft turns up. A slow-but-working satellite is information, not a warning, so GEO and A2G read blue. Before this split, 142 of 207 wifi-carrying rules were amber, which made the colour mean nothing; it is now 20 of 237 airlines.
- **A real hover card, not `title=`.** A native tooltip waits half a second, cannot be styled and cannot hold a table, which defeats the point of answering the question without expanding the card. One `position: fixed` node on `<body>` keeps it entirely outside Google's layout. It follows the chip on scroll rather than hiding, because Google Flights fires scroll on its inner containers constantly and hiding on any scroll tore the card away the moment it appeared.
- **Two placements.** Google's amenity lines are flex `<li>`s inside a `<ul>`, so a chip appended into that row gets squeezed beside the label. There the chip is inserted as its **own row** in the list (`.fw-row`) where it gets the full column width; in the collapsed airline row it sits inline next to the carrier name, which has ~180px of unused width.
- **The collapsed chip never leaves the name line.** The columns row is height-capped at 42px and the card is a grid whose next row can hold Google's own full-width CO2e badge, so there is no free line under the airline name: both "append below the cell" and "wrap inside the cell" put the chip exactly on top of that badge (verified by rect, both at the same y). When the full label does not fit beside the name, the chip collapses to the coloured glyph alone (`.fw-sum-min`, hover card and aria-label still carry the verdict); the last-resort fallback tucks it beside the times on line one. On live pages the glyph form absorbed every tight cell, including the "Operated by ..." rows.
- **Shared palette with the GetStopover extension.** Same tones, same 24% fill in dark mode, so the two products read as siblings rather than as two unrelated tools: green `#86efac`, amber `#fcd34d`, red `#fca5a5`, grey `#cbd5e1`, plus a blue `#93c5fd` for the "works, just basic" tier that GetStopover has no equivalent of. `chip.css` writes each colour exactly once, as a light triple plus a dark `r,g,b` list; the theme bindings rebind three variables rather than restating the table.
- **Both themes.** Google Flights ships its own light/dark toggle, so `prefers-color-scheme` is not authoritative. `readTheme()` walks up from `<body>` for the first *opaque* background and takes its luminance, falling back to text colour, which is never transparent. Skipping transparent backgrounds matters: reading `rgba(0,0,0,0)` as a colour scores it as black and flips a light page to dark. The result is stamped as `fw-dark` / `fw-light` on `<html>`, driven by a `MutationObserver` on `<html>`/`<body>` class+style plus the `prefers-color-scheme` change event, so a toggle repaints in ~250ms instead of waiting for the next sweep. `getComputedStyle` forces a style recalc, so the sweep keeps only a rare backstop call.

## Reading the collapsed row

Google packs three different things into that one cell, and they mean different things for wifi:

| Cell renders as | DOM | Means | We resolve |
|---|---|---|---|
| `KLM · Delta` | two spans, separator between | KLM metal, Delta codeshare | KLM |
| `Air India Express, Air India` | one span, comma-separated | two legs, two operators | both, weakest wins |
| `Etihad` + `Operated by Air Seychelles for Etihad Airways` | separate note | Seychelles metal | Air Seychelles |

The third case is the one that bites: Etihad has satellite wifi and Air Seychelles has no internet at all, so believing the marketing carrier promises wifi on an aircraft that has none.

**A connection is not one fleet.** Rolling its legs into a single fleet-level word misreads the trip. DEL-DOH-FRA-STN on IndiGo, Qatar and Ryanair rolled up to "Not guaranteed", which reads as *one uncertain aircraft* when the truth is that two of the three legs are certainly dark and the third carries Starlink. When the legs disagree the verdict becomes `LEG_PARTIAL` — **"Wi-Fi on some legs"** — and the hover card lists each airline with its own verdict.

That leaves one gap the reader will still hit, so the card names it: the per-leg rows are *fleet-level*, and a part-fitted carrier like Qatar reads "Not guaranteed" there while the aircraft actually flying the leg turns out to be a Starlink 787. On a connection the info banner says so directly rather than leaving it to be discovered.

## Honesty rules (non-negotiable, same discipline as programs.json)

- **Never print a speed number.** Throughput isn't a property of a flight, and we have no sourced Mbps figures. Verdicts are latency-class based, which *is* a property of the orbit: LEO/MEO = "Video calls work", GEO/A2G = "Email & browsing", part-fitted fleets = "Not guaranteed". The hover card gives the latency band (≈20-50ms low orbit, ≈600ms+ high orbit) because that follows from physics, not from a benchmark we did not run.
- **Capability lists stay latency-bound.** The ✓/✕ list says what the *link* can carry. Whether an airline permits streaming is a policy of its access tier, not a property of the orbit, so it is described under Access and never as a ✕.
- **Registry entries need sources.** Target: two sources per airline, at least one official (airline page or provider press release), each entry carries `as_of` + `sources` + `confidence` (`sourced` / `reported` + `needs_verification`).
- **When two rules disagree, the cautious one wins.** Aircraft-type patterns overlap: Qatar carries both `777|A350|787 → Starlink (LEO)` and `787 → rollout completing end of 2026, Inmarsat until fitted (mixed)`, and taking the first match promised a video call on a 787 that may not be fitted. `pickRule` now takes the lowest-ranked of every matching type rule. Erring low is the only direction that cannot mislead someone into booking. Two verdicts across the registry change as a result: Qatar's 787 (LEO → VARIES) and Qingdao's A320 (GEO → UNKNOWN).
- **Unknown is a first-class verdict.** We never invent a provider for an airline we have not sourced. This is what separates us from the aggregator sites that fill gaps with guesses; during research we found one listing a major carrier's wifi under the wrong airline's code entirely.
- **Every claim is attributed.** A verdict either comes from our sourced registry or from Google's own amenity line, and the tooltip always says which.
- **Access gating is part of the verdict.** Provider + orbit + who can actually use it (free / paid / status-gated), because "has wifi" and "you can use it" are different facts.

## Repo layout

```
extension/
  manifest.json        MV3; google.com/travel/flights + skyscanner .net/.com/.co.uk/.co.in
  core.js              site-agnostic: verdicts, name resolution, rollups, hover card, theme
  google.js            Google Flights adapter: collapsed rows + expanded per-leg panels
  skyscanner.js        Skyscanner adapter: result tickets, fleet-level only
  chip.css             verdict chip styling
  data/registry.js     WIFI_REGISTRY: airline → fleet rules → provider/orbit/access
  icons/               generated from ../icons/icon.html
```

## Google Flights bridge: exact aircraft on the collapsed list

`google-bridge.js` runs in the MAIN world at `document_start` and reads the two places Google's own itinerary payload is reachable: the server-rendered `ds:1` AF_initDataCallback blob (URL-entered searches) and the page's `/_/FlightsFrontendUi/data/` response as it crosses the page's own `fetch`/XHR (in-page searches). **It never issues a request**: it only reads replies the page already fetched for itself, and nothing leaves the browser. Segment records are recognised by feature (one aircraft string, two IATA codes, two clock arrays, one carrier+number pair), not by index, and grouped by their parent array, so the blob schema and the response schema both parse. The result is republished through a hidden div, because DOM is shared between worlds and closures are not (and because Trusted Types makes `script.textContent` a guarded sink on Google pages).

`google.js` matches cards by first-departure + last-arrival clock time, then stop count, then carrier overlap; only a unique match is used, so an ambiguous card keeps its fleet verdict. Matched cards get **aircraft-exact verdicts collapsed**: `data-fw-src="bridge"`, hover shows the actual type, no "expand for exact" banner. Two honesty rules layered on top:

- **Google's carriers outrank the card text.** The payload's per-segment codes caught "Batik Air" on DEL-SIN actually being OD Batik Air Malaysia while the name resolver read Indonesian ID: the wrong airline's data on the chip. When the bridge's carrier is unregistered, the chip is **suppressed entirely** rather than left showing the misattributed fleet verdict.
- **The done-marker is only set on a real decision.** The bridge publishes before Google hydrates the cards; marking a skeleton li as processed froze the whole list chipless once (v53's first cut). Cards are only marked once a chip is placed or suppressed.

Sort and filter changes re-render client-side from memory (no refetch), so already-placed chips survive them; new searches fire a fresh response through the wrap.

## Skyscanner

Two surfaces with different ceilings:

- **Results list**: never names the aircraft, so tickets get **fleet-level verdicts**, the same rollup Google's collapsed rows use. Carrier names resolve from three sources in order: logo `img[alt]`, the multi-airline label ("IndiGo + Scoot"), and the card's accessible text ("Flight with Air India, Scoot").
- **Booking page** (`/config/`): the per-leg panel names the metal ("A321 (narrowbody)" in `SegmentAmenityInfo`), so each segment gets an **exact aircraft-level chip beside its flight number** ("IndiGo 6E5007 → No Wi-Fi", "Scoot TR751 → Email & browsing"). The flight-number code is the primary carrier signal, and the regex allows digit-leading IATA codes ("6E5007") while lowercase exclusion keeps durations ("1h 05") out; the airline-name fallback only applies on single-carrier legs, so an unregistered code on a mixed leg can never borrow another carrier's verdict. If the aircraft is not in the DOM yet the chip is fleet-level with an "Open Show info" hint and upgrades in place when it appears.

There is no amenity fallback on either surface, so an airline the registry has not sourced gets **no chip** rather than a guess (live example: "BatikAir Malaysia" is OD, a different airline from the registry's Indonesian ID, and stays chipless until OD is researched).

**Aircraft on the results list is impossible, audited 2026-08-06, do not re-litigate.** On a fresh results page (BLR-DXB, no itinerary opened) the aircraft exists nowhere: visible DOM, hidden leaves, attributes and script tags all zero; the page's single Redux store walked structurally (28,887 objects including Maps/Sets) has zero aircraft-like keys and zero true value matches (76 regex hits all classified: "7x7" digit runs inside carrier ids, ad UUIDs and DoubleClick URLs); ticket component fiber props zero; localStorage, sessionStorage, IndexedDB and CacheStorage all empty of it. The results search endpoint is `/g/radar/api/v2/web-unified-search/`, and its normalized segment schema is exactly 11 fields (times, places, duration, carrier ids, flight number). Positive control proving the probes work: `shared.flightBookingPanel` gains `amenity_info.transportDescription` ("A320neo (narrowbody)") for exactly the segments of an itinerary once its `/config/` page fires the booking-panel fetch. Getting aircraft onto the list would therefore mean prefetching that per-itinerary endpoint for every visible result: active scraping of a rate-limited, captcha-guarded API, ruled out on CWS posture, ToS and user-session safety. The store does expose per-segment `operating_carrier_id` + IATA `alt_id`, so a main-world bridge (the GetStopover pattern) could upgrade results-list carrier accuracy (codeshares, wet-leases) without touching the network; that is the one enhancement available there.

## Coverage model: every airline gets an answer

The registry is an **upgrade layer over Google's own data**, not the only source. Google Flights publishes a per-leg amenity block, and its wifi line ("Free Wi-Fi" / "Wi-Fi for a fee") is real data from ATPCO/Routehappy. So a leg resolves in this order:

| Case | Chip | Colour |
|---|---|---|
| Registry has a rule for this airline + aircraft | latency verdict | green / blue / amber / red by orbit |
| No registry rule, Google lists wifi | "Wi-Fi" | blue |
| No registry rule, Google lists amenities but no wifi | "No Wi-Fi" | red |
| No registry rule, Google published no amenities at all | "Not verified" | grey |

Two consequences. Coverage is no longer bounded by the registry: an airline we have never researched still gets a truthful answer. And the registry keeps its whole value, because only a sourced entry can tell you *whether you can take a video call*, which is the actual question. The tooltip always names which of the two produced the verdict, so a Google-derived verdict is never passed off as our own verification. Where the two disagree (we say the aircraft has none, Google says it has wifi) the tooltip flags the conflict instead of hiding it.

## Registry status

**237 airlines** (four research tranches, 2026-08-03/04). 153 sourced (65%), 607 source URLs, 127 airlines with a sourced no-wifi verdict. Originally seeded with 4. Every entry carries `sources`, `as_of`, and a `confidence` of `sourced` or `reported`; entries with open questions carry `needs_verification`.

The fourth tranche was **gap-driven rather than guessed**: the extension tags every chip with `data-fw-src`, so sweeping 15 real routes across every major market produced a measured list of what actually falls through, and only those carriers were researched. Three quarters of the additions turned out to be the same trap — a free in-cabin wireless network that carries stored films and games but has no route to the internet (Tunisair's "Wi-Fi Streaming", Citilink's "LinkTertainment", Caribbean Airlines' "Caribbean View"). Google's amenity data and the aggregators both read those as "has wifi".

Aircraft-type patterns must use the **base forms Google prints**. A rule written as `A321neo` never fires, because Google renders plain "Airbus A321" — that one dead token was silently disabling the A321 rule on ten airlines (Cathay, Korean, Asiana, China Airlines, Philippine, Aer Lingus, Royal Jordanian, EgyptAir, LATAM, KLM). Same for `Embraer 145` against Google's "Embraer ERJ-145", and the C909 which Google calls "Comac 909 Passenger". `merge_registry.py` now rewrites all three classes automatically, and `audit_registry.js` must report **zero** dead patterns.

Carrier resolution matches the flight-number code first, then the airline name. Name matching is **longest-first and word-boundary anchored** — the registry contains 16 names that are substrings of other names ("Air India" inside "Air India Express", "AirAsia" inside "Thai AirAsia"), and a naive substring match also reads "ANA" out of "Canadian North" and "Air Panama".

Google also prints names *shorter* than the registry stores them ("Vietjet Air" renders as "Vietjet"), which substring matching can never reach. A second index registers each name with its generic suffix stripped (`Airlines`, `Airways`, `Air`, …), 102 aliases with zero collisions; a collision would blank the entry rather than pick a winner. Those lookups are **exact**, which is the safety property — a bare "Singapore" resolves to the airline only as a whole string, never out of "Singapore Changi Airport". 41 resolution cases are asserted in the check below.

The registry is generated, not hand-edited: `scratchpad/merge_registry.py` merges the per-agent research JSON over a curated base and runs two normalization passes (aircraft-type tokens rewritten to the base forms Google prints; any low-latency verdict whose provider text names a future date is downgraded to "depends on the aircraft"). `scratchpad/audit_registry.js` then tests all 228 airlines against the real strings Google renders and must report zero dead type patterns.

## Load for testing

chrome://extensions → Developer mode → Load unpacked → select `extension/`. Search any route on Google Flights, expand a result.

## Packaging

`./build.sh` stages a production copy under `dist/staging/` and zips it to `dist/flightwifi-<version>.zip`. The dev tree keeps its hot-reloader and instrumentation untouched; the build strips them from the copy: `dev-reload.js`, `reload-token.txt`, the `background` + `permissions` manifest keys, `FW_TRACE`, and every `data-fw-*` attribute write. It then verifies the staged file parses, the manifest carries no permissions, and no instrumentation survived, before zipping. The packaged extension requests **zero permissions**: one content script on `https://www.google.com/travel/flights*`, nothing else.

## Before launch

- [x] Icons (16/32/48/128, generated from `icons/icon.html` by headless Chrome, wired into the manifest)
- [x] Packaging script with strip verification (`build.sh`)
- [ ] Name (ships as "FlightWifi" — the build drops the "(working title)" suffix; rename = find-replace across repo)
- [ ] CWS listing: screenshots (1280×800), description copy, privacy declarations, single-purpose statement
- [ ] Selector resilience pass (Google Flights DOM changes; the parser is text-regex based on purpose, but the li/aria-expanded anchors need a fallback sweep)
- [ ] Chip rendering QA across locales (non-English UIs degrade gracefully to registry-only verdicts: airline and aircraft names are locale-independent, Google's amenity text is not)
- [ ] Work the `needs_verification` queue (137 of 237 entries, mostly time-bombed rollout facts; biggest expiry: Qatar narrowbodies end-2026, Korean Air Starlink go-live, EVA free-promo end date)
