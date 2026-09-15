# FlightWifi vs the Starlink trackers, September 2026

Five parallel reviews on 11-12 September 2026: the United tracker's pages, its tools and API, its
open-source pipeline, a page-by-page inventory of FlightWifi, and a scan of the wider field. Every
number below was read from a live page, a live API response or the source. Facts that could not be
verified are marked.

The competitor is one person, Martin Amps, running a multi-tenant tracker network from one codebase:
`unitedstarlinktracker.com`, `alaskastarlinktracker.com` and the `airlinestarlinktracker.com` hub,
with Hawaiian and Qatar registered but dark. Source at `github.com/martinamps/ua-starlink-tracker`.

---

## The verdict in one paragraph

FlightWifi is the better dataset and the worse product. We cover 235 airlines to their 3, we cite
668 sources where they cite a methodology page, we answer six questions (system, speed, calls, cost,
per aircraft type, not-verified) where they answer one, and our extension works on three booking
sites to their one. They beat us on the only thing a traveller actually types: **a flight number.**
Their entire product answers "does my flight have Wi-Fi", ours answers "does this airline have
Wi-Fi". The painful part is that we already built the flight-number answer. It is live in the
codebase, wired into the home page and the Starlink page, and it has been returning `503` on
production since launch because one environment variable was never set.

---

## What we already do better, and must not lose

| | FlightWifi | United tracker |
|---|---|---|
| Airlines | 235 | 3 live (UA, AS, HA) |
| Question answered | System, speed, calls, cost, per aircraft type | Starlink yes/no |
| Sources | 668 URLs, per claim, classified airline/provider/trade | Methodology page; per-claim only for non-tracked airlines |
| Aircraft-type verdicts | 183 airlines, 444 pages | Type used only as a prediction prior |
| Cost and access | Every airline | Not modelled at all |
| "No Wi-Fi" and "Not verified" | First-class verdicts | Out of scope |
| Booking sites covered | Google Flights, Skyscanner, Soar | Google Flights only |
| Store listing freshness | Matches the repo | v1.2.0 from June 2025, repo is on v2.0.0 |
| Caching | Static, CDN-cacheable | Every HTML response `no-store` |

Their dependency chain is also weaker than ours. Their ground truth for "this tail has Starlink" is
two public Google Sheets maintained by hobbyists at `unitedfleetsite.com`, cross-checked by driving
united.com with a stealth browser, with Flightradar24 reverse lookups over an undocumented endpoint
and FlyerTalk scraped through a residential relay. Three of those are terms-of-service evasion they
document themselves, and two closed issues (#64, #87) were both count bugs from parsing the sheets.
We should copy none of that.

---

## What they do better

**1. They answer the question people type.** Flight number plus date, four honest states: verified
yes with the tail, assigned-but-not-Starlink with the provider and verification age, a probability
with its observation count, or an explicit "not published yet". Every answer is a deep link
(`/check-flight/UA14/2026-09-12`) that re-runs on load, so it is shareable and re-checkable.

**2. They are honest about the two-day horizon.** Their own audit found tail assignments essentially
do not exist more than two to three days before departure: 896 legs at day 0, 1,515 at day 1, 826 at
day 2, 1 at day 3, 0 at day 4. So they say so in the copy: "Aircraft assignments firm up ~2 days
before departure — check back then for a confirmed answer." Nobody else in this space says this
plainly, and it is the single most useful sentence for someone booking three weeks out.

**3. A claim ladder with real abstention.** Blue "Starlink" means verified against the airline's own
page; green "Starlink (installed)" means it is in fleet data but not re-verified; grey "Starlink
~92%" appears only at 80% and above with non-low confidence; below that, no badge at all. Unknown is
never rendered as no. Multi-leg itineraries take the weakest leg.

**4. Distribution machinery we lack entirely.** An MCP server with 7 tools at `/mcp`, no auth. An
`llms.txt` written as answer recipes with trigger phrases and one dated quotable sentence carrying
the HTML id `starlink-stat`. An Atom feed of newly equipped tails. A shields-style `/badge.svg` plus
an `/embed` page. IndexNow pings on data change. Their sitemap carries 6,015 URLs against our 726.

**5. Momentum, not just a snapshot.** "+47 in the last 30 days", a trailing-three-month install rate
against the airline's own target, a "newly equipped" page, and an install-date per tail. Our
registry stores a single `progress` number per airline with no history, so we cannot compute a
delta.

**6. Their data is open, and they invite reuse.** Their methodology page: "The full current dataset
is one open JSON endpoint — no key, no registration: /api/data." Verified live on 2026-09-12: HTTP
200, `access-control-allow-origin: *`, 1.0 MB, `totalCount` 1658, 567 rows each carrying
`TailNumber`, `Aircraft`, `OperatedBy`, `fleet` and `DateFound`, with `DateFound` running from
2025-03-14 to 2026-09-09 and 47 rows inside the last 30 days.

---

## Defects in FlightWifi found during this review

**1. The flight-number checker is dead in production.** `web/app/api/flight/route.ts` returns
`503 {"error":"unavailable"}` because `AERODATABOX_KEY` is not set in the Vercel deployment. The
whole UI path exists and degrades politely to the fleet answer, so nothing looks broken, but the
headline feature on the home page has never worked for a visitor.

**2. The home page FAQ contradicts our own data.** `web/app/page.tsx` line 100 says "United had about
522 of 1,817 aircraft converted as of mid-August 2026". The registry holds 563 of 1,658 as of
2026-09-07. Line 92 lists the flying Starlink airlines and omits Lufthansa, which has been flying
since 19 August. These answers are hand-written; every other count on the site is derived.

**3. "235" is hard-coded in at least eight places**, including the root layout description, the
About page, `llms.txt` and three blog strings. The registry is the only place that should know the
number.

**4. Our two most prominent rollout numbers are borrowed from competitors.** United cites
`unitedstarlinktracker.com` and Alaska cites `starlinkflights.com`, both labelled "Tracker" in the
UI. Honest, but it means our flagship page leans on a hobby project for its biggest figure.

---

## Plan

### Tier 0: fix what is already built (hours, no new data)

1. **Set `AERODATABOX_KEY` on Vercel and turn the checker on.** RapidAPI Basic is free for 600 units
   a month (about 300 checks); Pro is $5.35. This alone moves us from "does this airline have Wi-Fi"
   to "does my flight have Wi-Fi".
2. **Derive the home page FAQ from the registry** instead of hand-writing it, the way every other
   count on the site already works.
3. **Derive the hard-coded 235.**

### Tier 1: the flight-level answer (days)

4. **Per-tail verdicts for United** by joining their open `/api/data` to the `aircraft.reg` that
   AeroDataBox already returns to us. Attribution is requested and we already credit them. This also
   gives us a second opinion on the United progress number we currently copy. Label the dependency
   plainly and keep a fallback: if the tail is unknown, answer at aircraft-type level as we do today.
5. **Adopt the claim ladder**: verified, installed per fleet data, fleet-level answer, or no claim.
   Never render unknown as no. This fits our existing "Not verified" verdict exactly.
6. **Say the two-day rule out loud** wherever a future-dated flight is checked. It costs nothing and
   it is the most useful sentence on the subject.
7. **Deep-link every answer** at `/flight/{number}/{date}/` so it is shareable, re-checkable the day
   before, and indexable.

### Tier 2: distribution, using data we already hold (days)

8. **An MCP server for FlightWifi**, same pattern as the GetStopover one already running at
   `mcp.getstopover.com`.
9. **Rewrite `llms.txt` as answer recipes** with trigger phrases, one canonical URL per question, and
   a dated quotable sentence with a stable element id.
10. **Atom feed of registry changes, a `/badge.svg` and an `/embed` page.** These are cheap and they
    are exactly the kind of asset that earns the referring domains we discussed separately.
11. **Store a small history of `progress`** so we can publish momentum rather than a snapshot.

### Do not build

- **A route planner that ranks connections by Starlink coverage.** Theirs recommends San Francisco to
  Chicago to Halifax to Newark as an "89% all legs" answer while hiding the nonstop, with no travel
  time, price or connection validity. That is a trust hazard, and trust is our entire position.
- **Scraping.** No Flightradar24 undocumented endpoints, no stealth browsers on airline sites, no
  residential relays for forum threads.
- **A per-flight-number probability model.** It needs months of assignment logging before it says
  anything true. The aircraft-type answer plus the two-day rule is honest today.

---

## Smaller things worth copying

- A FlightAware hand-off link so power users can verify a tail themselves.
- Sitemap thresholds that refuse to advertise thin pages (they use "seen at least 3 times").
- `lastmod` and `dateModified` taken from data stamps, omitted rather than faked to now.
- A citation verifier that refuses to merge a claim unless its numbers appear in the cited page.
- Reading the flight number from Google's `data-travelimpactmodelwebsiteurl` attribute in the
  extension before falling back to class-name heuristics.

## Their mistakes worth avoiding

- Departure times rendered in the viewer's browser timezone with no label.
- Two different probabilities for the same flight on the same page (raw 91% next to smoothed 98%).
- Accepting any date, past or 2027, and answering with the same number.
- Announcing a rate limit in `llms.txt` that the code does not enforce.
- MCP instructions that tell the model what the user wants and force verbatim tables.
