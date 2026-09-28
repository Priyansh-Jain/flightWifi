# Beating the Starlink trackers: what changed by 15 September, and what to build

Follow-up to `COMPETITIVE_REVIEW_2026_09.md` (12 September). Everything below was verified live on
15 September 2026 against unitedstarlinktracker.com, alaskastarlinktracker.com, the new
airlinestarlinktracker.com, their open `/api/data`, their Chrome Web Store listing and GitHub, and
our own Search Console export for 7 to 13 September. The 12 September plan still stands; this
document only adds what is new and re-ranks the work against what search data now shows.

---

## The one-paragraph verdict

They have moved onto our ground. On top of the single-airline United tracker they now run a
multi-airline hub, **airlinestarlinktracker.com**, whose home page is titled "Which Airlines Have
Starlink WiFi?" and whose airline pages are dated, sourced prose with archive links: the same shape
as ours, for 27 airlines instead of our 235. Our own `/starlink/` page ranks 71st and 81st for
"what airlines have starlink" and "airlines with starlink". Meanwhile our Search Console data
shows we already rank on page one for hundreds of "does X have wifi" queries and convert almost
none of them, because 36% of our impressions sit at positions 9 and 10. The gap is not data. We
have more of it, better sourced, served 20 to 40 times faster. The gap is that they ship
freshness signals, one-question pages and a flight-number answer, and we ship a registry.

---

## What is new since 12 September

### 1. A multi-airline hub, aimed at our query

`airlinestarlinktracker.com`, 37 URLs: 27 airline pages, 6 head-to-head comparisons,
`/newly-equipped`, `/install-rate`, `/fleet`. Home page H1 "Which Airlines Have Starlink WiFi?",
FAQPage schema, and a `/llms.txt` written as instructions to a model: a "When to recommend this
site" section, a "Key facts (use these when answering)" list, and an explicit "Do NOT send
flight-number lookups for Qatar Airways to this site's APIs". Their airline pages carry a section
called "the record, with receipts": each claim has an "as of" date, a source link and an archived
copy. Ours have sources and one `as_of` per airline, not per claim.

Three airlines are tracked tail-by-tail (United 575/1,658, Hawaiian 42/62, Alaska 99/350). The
other 24 pages are exactly what we do: dated prose from press releases and trade coverage.

### 2. The United tracker grew four surfaces

- **Live Routes**: 3,436 departures on Starlink-equipped aircraft in the next 48 hours, top 60
  routes, refreshed to the minute.
- **Timeline**: six dated milestones, each with a named source, and a separate "stated targets,
  not yet milestones" list so plans that slip are never shown as facts.
- **Starlink by Airport**: a treemap of departures per airport in the next 48 hours.
- **Single-question pages**: `/is-starlink-free`, `/how-to-check`, `/install-rate`,
  `/newly-equipped`. One URL per question people type.

Flight pages (`/check-flight/UA1126`) now carry `Flight` JSON-LD alongside FAQPage, Breadcrumb,
WebSite and WebPage, and show upcoming departures with the assigned tail and a tick.

### 3. Their sitemaps

6,027 URLs on the United tracker (4,353 flight-number pages, 1,663 route pages), 2,220 on Alaska,
37 on the hub. 8,284 URLs across the three domains against our 822.

### 4. Their data moat, measured

`/api/data` on 15 September: 575 `starlinkPlanes` with `DateFound` from 2025-03-14 to 2026-09-11
and 45 in the last 30 days, plus `flightsByTail`, a log of **4,490 flight observations across 538
tails**. That log is what lets a flight page say "UA1126 had Starlink on 15 of 29 recent
departures". It is also the one thing we cannot honestly reproduce without the scraping the
12 September review ruled out.

### 5. Their distribution, measured

Chrome extension: 574 users, 5.0 stars from 2 ratings, **version 1.2.0, last updated 8 June 2025**.
Fifteen months stale. GitHub: 25 stars, MIT, `scrape.ts` in the tree.

### 6. Their weaknesses, verified today

- Home page TTFB 1,859 ms, `Cache-Control: no-store` on every response including the API. Ours
  measured 47 to 92 ms on the same afternoon.
- FAQPage `dateModified` is `"9/15/2026"`, not ISO 8601.
- No cost or access model beyond Starlink; no verdict at all for the 200-plus airlines that are
  not Starlink customers; no "not verified" state.
- The hub tells models to send Qatar flight lookups elsewhere. We could answer them.

---

## Where we actually stand: Search Console, 7 to 13 September

8,885 impressions, 51 clicks, 0.57% CTR, average position 11.7. Mobile is 69% of impressions and
ranks at 9.0; desktop ranks at 18.1.

| Position | Impressions | Clicks | CTR |
|---|---|---|---|
| 1 to 3 | 35 | 3 | 8.57% |
| 4 to 6 | 676 | 15 | 2.22% |
| 7 to 8 | 2,340 | 16 | 0.68% |
| 9 to 10 | 3,176 | 8 | 0.25% |
| 11 to 20 | 2,007 | 3 | 0.15% |

Position 6 converts, position 10 does not. The pages that do get clicks are the ones Google cannot
answer inline: flynas, Air Serbia, Corendon, Aeroflot, "oman air wifi price", "china southern wifi
price", "air astana wifi on board". The well-known airlines at position 9 to 10 get nothing,
because "does El Al have wifi" is answered above the fold.

**We are not competing with them in search today.** Queries containing "starlink" gave us 13
impressions and 0 clicks all week; "what airlines have starlink" ranked 71.7, "airlines with
starlink" 81. They own the Starlink vocabulary. We own the long tail of "does X have wifi" and
convert none of it. The hub launch is them reaching for the one Starlink query where breadth
should have been our advantage.

---

## What "better" can honestly mean

We will not out-track them on United, Alaska or Hawaiian, and should not try. Four things are
available to us that are not available to them:

1. **A flight-number answer for 235 airlines, not 3.** AeroDataBox gives us the aircraft type on a
   specific flight and date; our registry turns type into a verdict. Their hub literally tells
   models not to ask it about Qatar. Qatar's programme is decided by aircraft type, so
   "does QR702 have wifi" is a question only a type-level registry can answer. This is the
   asymmetric play and it has been one environment variable away since launch.
2. **Breadth with the same rigour.** Their 24 non-tracked airline pages are our format. We have 235
   of them and 662 citations. What we lack is their per-claim dating and the visible freshness.
3. **Everything that is not Starlink.** Cost, access, calls, GEO versus LEO, "no Wi-Fi",
   "not verified". Their vocabulary has no word for a Viasat aircraft.
4. **Speed and cacheability.** 20 to 40 times faster to first byte, static, CDN-served. Keep it.

---

## The plan, re-ranked

The 12 September Tier 0 to Tier 2 items remain valid. The order below is by what the search data
and the hub launch make urgent, and new items are marked.

### P0, this week

1. **Set `AERODATABOX_KEY` on Vercel.** Unchanged, still first, now with the extra reason that it is
   the only thing that gives us a flight answer they cannot give. The site already degrades and
   restores itself around this key; nothing else needs to change.
2. **Derive the home page FAQ from the registry.** As of today the live home page still says
   "United had about 522 of 1,817 aircraft converted as of mid-August 2026" while the registry
   holds 575 of 1,658 and the competitor's home page title carries the live number. Every other
   count on the site is derived; this one is hand-typed and wrong.
3. **Make `/starlink/` the answer to "which airlines have Starlink".** *New.* Today it ranks 71 to
   81. Concretely: H1 becomes the question; an "as of {date}" line derived from the newest
   `as_of` among Starlink entries; the live count in the `<title>` ("20 airlines flying Starlink
   today"); FAQPage on the page; and an inbound link from all 41 airline pages that have a
   Starlink entry, with the anchor "Starlink on flights". Their hub's home page is exactly this
   page done properly, for 3 tracked airlines.
4. **Deep-link every flight answer at `/flight/{number}/{date}/`.** 12 September item 7, promoted.
   They have 4,353 indexable flight pages with `Flight` JSON-LD; we have zero flight URLs. With the
   key set, a flight page for any of 235 airlines is a static shell plus one API call.

### P1, next two weeks

5. **Per-claim dating on airline pages.** *New.* Their "record, with receipts" pattern: each claim
   shows "as of {date} · source → · archived copy". Cheap version for us: show `as_of` beside each
   fleet row and beside each source, and link `web.archive.org/web/{url}` as the archive.
6. **Store `progress` history so `/starlink/` can say "+N in 30 days" per airline.** 12 September
   item 11. The "+45 in 30 days" line is the single most quoted device on their hub.
7. **Single-question pages across all airlines.** *New.* They have `/is-starlink-free` for one
   airline. We can publish "Which Starlink airlines are free, and which need a login" (the data is
   in `access`), and a **multi-airline Starlink timeline**: every dated first flight and completion
   across all 20 flying carriers, with sources. Nobody has that page.
8. **Rewrite `/llms.txt` as answer recipes.** 12 September item 9, now with their hub as the
   template: a "when to recommend" section, a "when not to" section, one dated quotable sentence
   per hub page with a stable element id, and the flight-lookup capability stated plainly once the
   key is live.
9. **Live numbers in hub page titles.** *New.* `/starlink/`, `/airlines/`, `/no-wifi/`,
   `/compare/`. Their title is "575 Aircraft Have Starlink Today". Ours are static.

### P2

10. **Starlink progress on comparison pages.** We now have 98 comparisons with per-aircraft tables;
    theirs have per-fleet-group install rates. Where the registry holds `progress`, show it.
11. **Embed badge and Atom feed.** 12 September item 10.
12. **Say in the Chrome Web Store listing that we ship monthly.** Theirs has not been updated since
    June 2025 and its store page shows it.

### Do not build, reaffirmed

- A scraping pipeline of any kind: no united.com stealth browsing, no Flightradar24 undocumented
  endpoints, no forum relays. Their `scrape.ts` is public and their terms exposure is their own.
- A route planner or an airport treemap. Both depend on tail-level schedule data we do not have
  and should not fake with type-level guesses.
- A per-flight-number probability model. Type-level verdict plus the two-day rule is honest today.

---

## Fixed while researching

`unitedstarlinktracker.com`, `starlinkflights.com`, `seatwifi.com` and `inflightwifi.one` were
being labelled "Blog" on our airline pages by the source classifier shipped earlier today. They are
now a distinct `tracker` kind, rendered as "Third-party tracker", in `web/lib/sources.ts`,
`web/components/airline.tsx` and `web/app/globals.css`. Verified on the United page.

---

## What to measure

- Share of impressions at positions 9 to 10: 36% today, target under 25% in 60 days.
- Site CTR: 0.57% today, target 1.2%.
- Impressions on queries containing "starlink": 13 a week today, target 200.
- Clicks on `/starlink/`: 0 a week today, target 20.
- Flight URLs indexed: 0 today.

Baseline before today's internal-linking deploy should be captured as a 3-month export from Search
Console, since the link graph changed on the same day this was written.
