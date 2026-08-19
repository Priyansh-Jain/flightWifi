# FlightWifi site review, 18 August 2026

**Status: all 10 confirmed defects fixed and verified in the build on 19 August 2026.** See "What was fixed" below. The unverified leads further down are partly addressed; the rest remain open.

## Round 2: external audit response (19 August 2026)

An external audit recommended a broad list of SEO, performance, a11y and conversion work. Most of it was already shipped (it was written from the PDF screenshots and could not see the HTML). Measured Lighthouse across 8 page types after this round: **performance 98-99, accessibility 100, best practices 100, SEO 100, LCP 2.0-2.4s, CLS 0, TBT 10-30ms.**

Done in this round: responsive AVIF/WebP pipeline (`components/Shot.tsx` + `scripts/images.mjs`) because static export disables Next's optimizer, cutting the LCP image from 128KB to 27KB; explicit LCP preload with imageSrcSet; underlines for links inside running text and breadcrumbs (the last a11y gap); `<Link>`-to-static-file prefetch 404s replaced with plain anchors; a real `/contact/` page; a factual proof band on the homepage.

Declined, with reasons: **analytics of any kind** (the site's own privacy policy and Chrome Web Store listing both state that nothing is collected); **testimonials, star ratings and "as featured in"** (none exist yet, so they would be fabricated); **Turborepo restructure** (the existing bridge already prevents duplication); **next/font** (a webfont download would slow a site whose LCP is already 2.1s on a system stack); **A/B testing tooling** (Google Optimize was sunset in 2023, and the extension has too few users for significance).

## What was fixed

| # | Defect | Fix |
|---|---|---|
| C1 | "Whole fleet: No Wi-Fi" contradicted the wifi rows above it on 15 airline pages | `fleetRows` now labels an untyped `fleet:"all"` rule "Whole fleet" only when it is the entry's only rule, and derives "Widebodies"/"Narrowbodies"/"Most of the fleet"/"Aircraft being fitted" from the rule's own fleet key |
| C2 | Airline FAQ told 24 Starlink carriers their wifi "runs over high-orbit satellite" | `buildFaq` branches on whether any rule carries a fast orbit, not on headline class, and applies call policy first |
| C3 | Starlink tracker filed carriers with nothing flying under "genuinely flying" | new explicit `starlink.status` field per airline in registry.js, replacing the orbit-string heuristic |
| C4 | Green "Free" chip for airlines that are paid today or have no wifi | new explicit `starlink.access` field; announced rows never render a present-tense price chip |
| C5 | Uzbekistan Airways promised A321 wifi the registry calls "not confirmed in service" | A321 split into its own `orbit: "NONE"` rule, so the type reads "No Wi-Fi" and the fleet chip becomes "Not on every aircraft" |
| C6 | Fleet tables rendered rules as a partition, giving one aircraft two verdicts | every type token resolved through the extension's `pickRule`; tokens sharing a winning rule share a row; System text comes from the winning rule; rules that never win move to a "Announced, not yet flying" note |
| C7 | Ryanair and IndiGo listed as "free Wi-Fi that is a movie server" when they have no cabin network | replaced with Transavia, Nok Air and Drukair, which the registry supports, plus a clarifying line about Ryanair and IndiGo |
| C8 | "never aggregator blogs" claim false across blog, home and 235 airline footers | per-entry `sourceNote()` states what that airline actually rests on; methodology now publishes the real split; every "official sources only" claim reworded |
| C9 | Live Starlink table reported Copa as free, contradicting its own FAQ | same `starlink.access` fix; Copa now renders "Paid" |
| C10 | Table labelled five non-flying carriers "Rolling out" | same `starlink.status` fix; tracker is now 19 flying / 21 announced |

Also fixed from the unverified set: the Tailwind colour named `none` that turned `outline-none` into a permanent red 2px ring on the airlines search box; mobile overflow at 320px and 390px; compare-page tables clipped mid-word; three dead source URLs (Delta, LAM Mozambique, Solaseed); `relatedAirlines` returning the same six links on 122 pages; missing skip link, focus ring, `color-scheme` and prose link underlines; keyboard-focusable invisible panel in the article rail; compare and aircraft pages unreachable from airline pages; `og:url`; sitemap `lastmod` predating JSON-LD dates; mobile nav hiding four sections; footer not pinned on short pages.


8 review agents across independent dimensions (data accuracy, blog facts, bridge code, links, desktop UI, mobile, copy, accessibility), then adversarial verification of the 10 highest-severity verifiable claims. 102 findings total. Every confirmed item below was independently reproduced by a second agent that was instructed to refute it; none survived as false.

## Confirmed defects (10 of 10 verified real)

### C1. "Whole fleet: No Wi-Fi" row contradicts the wifi rows above it on 15 airline pages

**Severity** high · **Dimension** data-accuracy  
**Where** /Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/extension.ts:153 (fleetRows scope); rendered at /Users/priyansh/Desktop/NowOrNever/flightwifi/web/out/airlines/korean-air/index.html, .../air-india/index.html, and 13 more

**Evidence**

fleetRows labels any untyped rule with fleet:"all" as "Whole fleet", but in these entries that rule is the catch-all remainder, not the fleet. Korean Air's page shows rows "737 / Email & browsing", "A321 / Email & browsing", "A350 / Email & browsing" and then "Whole fleet / No Wi-Fi" — while the registry text on that very row reads "None on most widebodies until the Starlink rollout completes". Air India shows "Whole fleet / No Wi-Fi" against registry text "None on the 777s and the rest of the fleet". The FAQ repeats it verbatim: "Yes, on part or all of the fleet. 737: Email & browsing. A321: Email & browsing. A350: Email & browsing. Whole fleet: No Wi-Fi." Verified by script across out/airlines: 15 pages have a "Whole fleet → No Wi-Fi" row plus at least one wifi row — aerolineas-argentinas, air-china, air-cote-d-ivoire(no), air-india, azerbaijan-airlines, china-eastern, china-southern, garuda-indonesia, hainan-airlines, juneyao-airlines, korean-air, middle-east-airlines, tap-air-portugal, vietnam-airlines, virgin-australia, xiamen-air. The same table is reused on /compare/air-india-vs-emirates/.

**Verifier**

Reproduced independently, and the claim if anything understates the bug.

CODE: /Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/extension.ts:153 is exactly as described: `scope: types.length ? types.join(", ") : rule.fleet === "all" ? "Whole fleet" : "Rest of fleet"` — the fleet:"all" rule is labeled "Whole fleet" unconditionally, with no check for sibling rules.

REGISTRY SEMANTICS: /Users/priyansh/Desktop/NowOrNever/flightwifi/extension/core.js:64-71 `pickRule` defines `generic = (r) => !r.types && (r.fleet === "all" || "most" || "rollout")` and only falls back to it AFTER `entry.rules.find(r => r.types && ...)`. So in the shipping verdict engine, fleet:"all" is the ordered catch-all remainder, not a fleetwide assertion. The site inverts that meaning.

RENDERED: I re-ran the scan over /Users/priyansh/Desktop/NowOrNever/flightwifi/web/out/airlines/*/index.html and got exactly 15 pages with a "Whole fleet → No Wi-Fi" row plus at least one wifi row: aerolineas-argentinas, air-china, air-india, azerbaijan-airlines, china-eastern, china-southern, garuda-indonesia, hainan-airlines, juneyao-airlines, korean-air, middle-east-airlines, tap-air-portugal, vietnam-airlines, virgin-australia, xiamen-air (air-cote-d-ivoire does not qualify, matching the reviewer's own "(no)" annotation, so the count of 15 is right). Korean Air's table renders 737/A321/A350 "Email & browsing" then "Whole fleet | No Wi-Fi | None on most widebodies until the Starlink rollout completes", and the FAQ answer reads verbatim "Yes, on part or all of the fleet. 737: Email & browsing. A321: Email & browsing. A350: Email & browsing. Whole fleet: No Wi-Fi." The same table ships on /compare/air-india-vs-emirates/ ("Whole fleet | No Wi-Fi" under three wifi rows).

WORSE THAN CLAIMED — three additional failure modes the reviewer's "No Wi-Fi" filter missed:
1. Inversion: china-eastern renders `fleet:"widebody"` (the sub-fleet that HAS wifi) as "Rest of fleet" and `fleet:"all"` (the actual remainder) as "Whole fleet". china-southern does the same. The two labels are swapped.
2. Duplicate scopes: turkish-airlines renders TWO indistinguishable "Rest of fleet" rows (from fleet:"widebody" Panasonic and fleet:"narrowbody" Anuvu).
3. Opposite-direction contradiction: qatar-airways ends "Rest of fleet | No Wi-Fi | None yet on the A320 family" followed by "Whole fleet | Varies by aircraft | Starlink on all 777/A350/787-8 widebodies" — a "Whole fleet" claim that its own provider text limits to widebodies, on a page that just said part of the fleet has none.

Registry-wide: 19 entries pair typed rules with an untyped fleet:"all" catch-all; 32 entries have fleet:"all" as their only rule (where "Whole fleet" is correct). Untyped fleet values in use: all(53), rollout(17), most(11), narrowbody(4), widebody(3) — all of the non-"all" ones currently collapse to the single string "Rest of fleet".

**Fix**

The proposed fix is directionally right but incomplete: swapping fleet:"all" to "Rest of fleet" when it has siblings collides with the label already (wrongly) used for every non-"all" untyped rule, so China Eastern would render two identical "Rest of fleet" rows and Turkish Airlines already does.

Replace the whole ternary at lib/extension.ts:153 with a scope derived from the rule's own fleet key plus its position:

- typed rule → types.join(", ") (unchanged)
- fleet:"all" AND it is the entry's only rule → "Whole fleet"
- fleet:"all" with any sibling rule → "Rest of fleet" (it is the ordered remainder, matching core.js pickRule)
- fleet:"widebody" → "Widebodies"
- fleet:"narrowbody" → "Narrowbodies"
- fleet:"most" → "Most of the fleet"
- fleet:"rollout" → "Aircraft being fitted"
- unknown/absent fleet → "Rest of fleet"

That fixes the Korean Air/Air India contradiction, un-inverts China Eastern and China Southern, de-duplicates Turkish Airlines, and stops Qatar Airways asserting "Whole fleet" for a widebody-only Starlink row. Keep registry rule order so the remainder row still renders last. The FAQ builder and /compare tables consume the same `scope` field, so both are fixed by the one change; no registry edits are needed.

### C2. FAQ tells readers 24 Starlink carriers run "high-orbit satellite", contradicting the registry and the page's own chip

**Severity** high · **Dimension** data-accuracy  
**Where** /Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/airlines/[slug]/page.tsx buildFaq() else-branch; rendered at out/airlines/emirates/index.html, air-france/index.html, united/index.html and 21 others

**Evidence**

buildFaq only takes the fast branch when headlineClass is LEO or MEO. Every mid-rollout carrier classifies as VARIES and falls through to: "Not reliably. Emirates's wifi runs over high-orbit satellite, where the roughly 600 ms round trip breaks live calls even when browsing is fine." The registry entry on the same page says "Starlink in service (33 Boeing 777 and 3 A380 flying as of Jul 2026)". Air France gets the identical sentence against "Starlink (28 of 31 777-300ER and 30 of 41 A350 equipped)"; United against "about 522 of ~1,817 aircraft". The page chip already says "Varies by aircraft", so the FAQ also contradicts the header. Script over the registry: 24 airlines have headlineClass VARIES and therefore all carry this sentence (Emirates, United, BA, Lufthansa, Alaska, JetBlue, Southwest, Avianca, LATAM, GOL, Aerolineas Argentinas, Singapore, Thai, Air France, Iberia, SWISS, Austrian, SAS, Aer Lingus, ITA, Saudia, Gulf Air, Air Arabia, Discover).

**Verifier**

Reproduced independently at source and in shipped HTML. `buildFaq()` in /Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/airlines/[slug]/page.tsx takes the fast branch only when `cls === "LEO" || cls === "MEO"` (line 56), and `headlineClass()` in lib/derive.ts ranks VARIES below LEO/MEO, so every mixed-orbit carrier falls to line 62: "Not reliably. ${name}'s wifi runs over high-orbit satellite, where the roughly 600 ms round trip breaks live calls even when browsing is fine."

Ran the same registry+core.js bridge the site uses: exactly 24 entries have headlineClass VARIES, and the reviewer's airline list matches mine element for element. Confirmed the rendered text in out/airlines/emirates/index.html, air-france/index.html, united/index.html, thai-airways/index.html and saudia/index.html. Emirates' own fleet row on the same page reads "Starlink in service (33 Boeing 777 and 3 A380 flying as of Jul 2026)" and its access line reads "Free in all cabins on Starlink-fitted aircraft", so the FAQ contradicts the registry, the fleet table, the cost section and the "Varies by aircraft" chip in the header, all within one page.

Two things the claim understates rather than overstates. First, the wrong answer is also emitted as FAQPage JSON-LD (components/ui.tsx lines 82-92); grep confirms `"acceptedAnswer":{"@type":"Answer","text":"Not reliably. Emirates's wifi runs over high-orbit satellite..."}` in the shipped HTML, so it feeds rich results and AI answers, not just on-page copy. Second, the real blast radius is 26, not 24: Copa Airlines (orbits `mixed LEO/none`, headlineClass PARTIAL) and Air New Zealand (`GEO|mixed GEO/none|mixed LEO/none`) also get the sentence, and Copa's registry entry contains no GEO rule at all, making it the flattest falsehood on the site.

One minor imprecision in the claim, not enough to refute it: the title says "24 Starlink carriers", but only 15 of the 24 name Starlink in their rules. Thai Airways and Saudia are `mixed GEO/MEO` (SES O3b mPOWER, which the site's own /providers/ses/ page rates at 120-150 ms and "usually quick enough for a live call"), and Avianca/LATAM/GOL/Aerolineas/Air Arabia/Discover/JetBlue are mixed GEO/LEO without a Starlink string. The defect holds for all of them regardless: each has a non-GEO rule the FAQ denies.

Severity high: factual error contradicting the ground-truth registry, on 26 pages, propagated into structured data.

**Fix**

The proposed fix is right in shape but wrong in two details. (a) Its copy, "On the aircraft still running the legacy system, no — around 600 ms breaks live calls", joins clauses with an em dash, which the project rules list as its own defect. (b) Branching on VARIES alone still leaves Copa and Air New Zealand wrong, and the "roughly 20-50 ms" figure is wrong for the MEO carriers (Thai, Saudia), which are 120-150 ms.

Branch on whether any rule actually carries a low or mid orbit, not on headlineClass, and check CALL_POLICY before orbit so the policy bans (United rule 21, SAS, Lufthansa, Alaska, Southwest, Singapore, Air France, JetBlue) answer for the right reason:

  const policy = callPolicy(code);
  const hasFast = entry.rules.some((r) => /LEO|MEO/.test(r.orbit ?? ""));
  const hasSlow = entry.rules.some((r) => /GEO/.test(r.orbit ?? ""));

  let calls: string;
  if (allNone) {
    calls = `No, because ${name} has no onboard internet at all.`;
  } else if (policy?.calls === "no") {
    calls = `No. ${name} ${policy.check ? "is reported to restrict" : "restricts"} voice and video calls as cabin policy, whichever aircraft you get.`;
  } else if (cls === "LEO" || cls === "MEO") {
    calls = policy?.calls === "voice"
      ? `${name} permits voice calls on its fast wifi, but not video calls.`
      : `Yes, on the low-orbit-equipped aircraft. Latency there is roughly 20-50 ms, similar to home broadband.`;
  } else if (hasFast && hasSlow) {
    calls = `Only on part of the fleet. Aircraft with the newer low or mid-orbit fit run at roughly 20-50 ms on low orbit and 120-150 ms on mid-orbit, which live calls survive. Aircraft still on the legacy high-orbit system run at roughly 600 ms, which breaks them. Which one you get depends on the aircraft, so check the verdict table above.`;
  } else if (hasFast) {
    calls = `Yes on the fitted aircraft, where latency is roughly 20-50 ms. The rest of the fleet has no wifi at all yet.`;
  } else {
    calls = `Not reliably. ${name}'s wifi runs over high-orbit satellite, where the roughly 600 ms round trip breaks live calls even when browsing is fine.`;
  }

The `hasFast && !hasSlow` arm is what fixes Copa (`mixed LEO/none`), which the VARIES-only fix would leave broken. Keep the existing final else untouched: it is correct for the 67 genuinely all-GEO carriers.

### C3. Starlink tracker files carriers with nothing flying under "The system is genuinely flying"

**Severity** high · **Dimension** data-accuracy  
**Where** /Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/extension.ts:185-186 (starlinkRows); rendered at /Users/priyansh/Desktop/NowOrNever/flightwifi/web/out/starlink/index.html

**Evidence**

starlinkRows sets status="partial" for any rule whose orbit merely contains "mixed…LEO", ignoring the FUTURE_RX guard that derive.ts:providerAirlines already defines. The "Mid-retrofit: varies by aircraft (17)" section is blurbed "The system is genuinely flying, on some of the planes" and contains: Singapore Airlines — "installations begin Q1 2027, rollout completes end-2029"; Austrian Airlines — "under the Lufthansa Group deal from H2 2026"; SWISS — "from H2 2026, completing 2029"; ITA Airways — "phased 2026-2029"; Lufthansa — "first Starlink aircraft (A320neo D-AINM) enters service 19 August 2026" (still future at the site's 2026-08 as-of). This is the page's stated differentiator ("An announced deal never counts as flying here") failing. It also inflates the home page line "24 airlines are flying passengers on Starlink or are mid-retrofit today" (out/index.html), which is 7 in-service + 17 partial.

**Verifier**

Independently reproduced. starlinkRows() (web/lib/extension.ts:167-193) classifies status purely off the orbit string: any Starlink rule with orbit matching /mixed/ AND /LEO/ becomes "partial", with no test for whether an aircraft is actually converted. Re-running that logic over extension/data/registry.js yields 7 in-service / 17 partial / 16 announced, matching the built headings in out/starlink/index.html ("Flying with passengers (7)", "Mid-retrofit: varies by aircraft (17)", "Signed, nothing flying yet (16)"), and out/index.html renders "24<!-- --> airlines are flying passengers on Starlink or are mid-retrofit today" = 7+17. The "partial" table, blurbed "The system is genuinely flying, on some of the planes", contains five carriers whose own registry text asserts nothing in the air: SQ "Starlink (confirmed May 2026; installations begin Q1 2027, rollout completes end-2029)", OS "under the Lufthansa Group deal from H2 2026", LX "from H2 2026, completing 2029", AZ "phased 2026-2029", LH "first Starlink aircraft (A320neo D-AINM) enters service 19 August 2026" (all orbit "mixed GEO/LEO", fleet "rollout", as_of 2026-08, page dateModified 2026-08-01). SQ is an outright contradiction of the page's stated differentiator "An announced deal never counts as flying here". HOWEVER the reviewer's diagnosis and fix are wrong: I tested derive.ts's FUTURE_RX against all five Starlink clauses and it matches none (futureOnly=false for every one; "installations begin Q1 2027" does not match "installs? beginning 20\d\d"). derive.ts has the identical bug, not a working guard: out/providers/starlink/index.html lists SQ, OS, LX and AZ under "Airlines flying Starlink (27)". Reusing FUTURE_RX in starlinkRows would change zero rows. LH is the weakest instance (in service one day after the build date); SQ alone carries the finding. Severity high.

**Fix**

Do not port FUTURE_RX (verified no-op on these clauses). The root cause is that orbit "mixed GEO/LEO" is overloaded in registry.js: it means both "some tails converted" (AF, EK, UA, SAS, BA, IB, EI, AS, WN, GF, CM, NZ) and "conversion contracted, none converted yet" (SQ, OS, LX, AZ, LH). No string classifier can separate those reliably, and the project rule is that facts trace to the registry. Fix at the data layer: add an explicit in-service marker to the Starlink rollout rule, e.g. "since": "2026-06" (or "in_service": false), set on the 12 carriers with a flying tail and absent/false on SQ, OS, LX, AZ and LH until first revenue service. Then key starlinkRows off that field: status "partial" only when the chosen Starlink rule carries the marker, otherwise "announced", and drop the orbit-string heuristic entirely. Apply the same marker in derive.ts:providerAirlines for inService, replacing FUTURE_RX, so /providers/starlink and /starlink cannot disagree. Since orbit also drives the extension verdict, SQ/OS/LX/AZ should additionally have their rollout rule orbit corrected from "mixed GEO/LEO" to "GEO" (their only live system today), which stops the extension answering "Varies by aircraft" for fleets where no aircraft has Starlink. Expected result: 7 in service, 12 partial, 21 announced, and the homepage line becomes 19; LH moves back to partial on 19 August 2026 by editing its registry marker, not by a date function.

### C4. Starlink tracker shows a green "Free" chip for airlines whose wifi is paid today or absent

**Severity** high · **Dimension** data-accuracy  
**Where** /Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/extension.ts:194 (free: /\bfree\b/i.test(access)); rendered at /Users/priyansh/Desktop/NowOrNever/flightwifi/web/out/starlink/index.html

**Evidence**

The regex matches future-tense promises anywhere in the access string. Confirmed chips in the built HTML: Korean Air "Free" (registry access: "Paid today on equipped narrowbodies and A350s (about US$10.95 for two hours…); Starlink is announced as free of charge … once service starts"); Asiana "Free" ("Paid today (roughly US$11.95/1h…); becomes free once Starlink enters service"); El Al "Free" ("Paid today: Basic / Social / Business passes…"); Brussels Airlines "Free" ("No onboard internet at all today"); Edelweiss "Free" ("None today"); Copa "Free" ("Paid for most passengers via the onboard Starlink portal") — which the same page's own FAQ contradicts with "Copa sells it in economy." In the other direction Air Seoul shows "Paid tiers" against "No wifi available today".

**Verifier**

Independently reproduced. web/lib/extension.ts:194 computes `free: /\bfree\b/i.test(entry.access ?? "")` and app/starlink/page.tsx renders it as a two-state chip `r.free ? "Free" : "Paid tiers"` with cls fast/part. Extracting the chips from the shipped out/starlink/index.html and diffing against registry.js confirms every case the reviewer named, and more. Wrong green "Free": Korean Air ("Paid today ... about US$10.95 for two hours"), Asiana ("Paid today (roughly US$11.95/1h...)"), El Al ("Paid today: Basic / Social / Business passes"), Brussels Airlines ("No onboard internet at all today"), Edelweiss ("No inflight internet today"), Copa ("Paid for most passengers via the onboard Starlink portal"), plus two the reviewer missed: Jin Air ("No inflight wifi in service today") and Eurowings, the worst false positive, whose access reads "Paid passes only, roughly EUR 2.90 to 3.90 ... the free Wings Connect portal carries flight info and partner offers but no internet" — the matched word "free" describes a portal that explicitly has no internet. Wrong "Paid tiers": Air Seoul ("No wifi available today"), and also flydubai ("No onboard internet at present; ... to be complimentary" — "complimentary" is in core.js costOf but not in the site regex), SalamAir, FlySafair, JetSMART, Cebu Pacific, Vietjet, Volaris, and Frontier whose access says "pricing has not been announced". The self-contradiction is verbatim in the built page: Copa's row shows a green Free chip while the same file's FAQ says "Copa sells it in economy." costOf() does exist at extension/core.js:312, and core.js:236 already carries a `conflict` flag for exactly this NONE-orbit-plus-cost-signal case, so the site bridge is ignoring machinery the extension already has. Severity high: factual error against the ground-truth registry, on the page the site pitches as its differentiator dataset.

**Fix**

The proposed fix is directionally right but incomplete on both ends, and its "strip clauses matching FUTURE_RX" step is the brittle part: the registry access strings have no machine-readable present/future split, so regex-splitting on "once ... starts" / "from 2027" / "will be" will keep missing cases. Do it in this order instead:

1. Decide "no wifi today" from structured data, not prose. If every rule in the entry has orbit === "NONE", render a third, neutral state ("No wifi today", cls "none") and never call costOf at all. That single move fixes Brussels, Edelweiss, Jin Air, Air Seoul, flydubai, SalamAir, FlySafair, Frontier, JetSMART, Cebu Pacific, Vietjet and Volaris, and it reuses the same signal core.js:236 already treats as a conflict.

2. Only for entries that have wifi today, run the extension's costOf() (import it through the existing build-time bridge rather than re-implementing the regex, so "complimentary / no charge / at no cost" is covered) on the access text with any trailing future clause dropped. Render costOf's three outcomes distinctly: "Free" (fast), "Free tier, then paid" (ok), "Paid" (part). Korean Air, Asiana and El Al then land on Paid; Copa lands on "Free tier, then paid", which matches its own FAQ line.

3. Eurowings still slips through costOf because its "free" refers to a no-internet portal, so also treat a clause containing "free"/"complimentary" within ~40 chars of "no internet"/"but no internet" as non-free, or simply never let a bare green "Free" render when costOf returns both signals.

4. Rename the column header from "Free?" to "Cost today", since the answer is about the present state and now has more than two values. Keep the chip strings out of the settled verdict-chip vocabulary discussion by treating this as a cost column, but do not reuse "Not verified"/"No Wi-Fi" wording that would read as a verdict chip.

### C5. Uzbekistan Airways page promises A321 wifi the registry explicitly calls "not confirmed in service"

**Severity** high · **Dimension** data-accuracy  
**Where** /Users/priyansh/Desktop/NowOrNever/flightwifi/web/out/airlines/uzbekistan-airways/index.html vs registry entry HY

**Evidence**

The registry has one rule: fleet "rollout", types "787|A320|A321", provider "Panasonic Avionics eX3 Ka-band IFEC (787 and A320neo); Neo Space Group with the SES Open Orbits multi-orbit network is due on the A321neo fleet from 2026 but is not confirmed in service", orbit GEO. The page renders scope "787, A320, A321" with a flat "Email & browsing" verdict, and the header chip is "Email & browsing" for the whole airline. So the only aircraft the registry says is unconfirmed (A321neo) is presented as having working wifi, and a "rollout" fleet whose own access line says "on fitted aircraft only" gets a fleet-wide positive verdict with no "Not on every aircraft" state.

**Verifier**

Independently reproduced. The HY registry rule bundles A321 into a GEO rule whose provider prose limits Panasonic eX3 to "787 and A320neo" and states the A321neo NSG/SES system "is not confirmed in service" ("A320" cannot match "Airbus A321neo", so A321 rests solely on the unconfirmed clause). Evaluating the real bridge (core.js head + registry.js) gives verdictFor("HY","Airbus A321neo") = "Email & browsing" and fleetVerdict(["HY"]) = "Email & browsing". This ships on three surfaces: /airlines/uzbekistan-airways/ (row "787, A320, A321 -> Email & browsing", header chip, page title, and FAQ "787, A320, A321: Email & browsing."), /aircraft/airbus-a321/ (Uzbekistan Airways = "Email & browsing", with clip(...,120) cutting the provider string one word before "not confirmed in service" so the caveat is invisible), and /providers/panasonic/ (listed as flying Panasonic with scope "787, A320, A321", though the registry limits Panasonic to 787/A320neo). The site also contradicts itself: /providers/ses/ correctly files Uzbekistan Airways under "Announced or planned" because derive.ts FUTURE_RX already matches "not confirmed in service", but that same signal is ignored by fleetRows and the fleet chip. The registry's own convention confirms the outlier status: 29 rules encode announced-but-unconfirmed deals as orbit "NONE" (e.g. AD/Azul A330 "no in-service confirmation" -> "No Wi-Fi" on the type, "Not on every aircraft" fleet-wide). HY is the only entry that folds an explicitly unconfirmed type into a positive orbit. The secondary point about "rollout" is slightly overstated as a standalone bug (11 rules use fleet "rollout" with a plain GEO orbit by design; PARTIAL is keyed off orbit "mixed X/none", not off fleet), but it is the same root defect here, since HY has no NONE/mixed rule to make the amber state fire despite an access line reading "on fitted aircraft only".

**Fix**

The finding is real but the proposed fix is wrong in two ways. (1) Do not use orbit "mixed GEO/none" for the A321neo: that classifies as PARTIAL, which means "some of this type is fitted", which is exactly the claim the registry says is unconfirmed. (2) Do not use "UNKNOWN" either: rollup() returns UNKNOWN whenever any key is UNKNOWN and not all are, so the whole-airline chip would degrade to "Not verified" for a carrier whose 787s and A320neos are confirmed flying. Correct fix, matching the registry's own established convention (AD/Azul A330, HA/Hawaiian 787): drop the A321 token from the existing rule (types "787|A320") and add a second rule { types: "A321", orbit: "NONE", provider: "Neo Space Group with the SES Open Orbits multi-orbit network is due on the A321neo fleet from 2026 but is not confirmed in service" }. That yields "No Wi-Fi" on the A321 row, and rollup([GEO, NONE]) -> PARTIAL gives the fleet chip "Not on every aircraft", which matches the "on fitted aircraft only" access line; the same edit also corrects the /aircraft/airbus-a321/ row and the /providers/panasonic/ scope in one place. Skip the proposed fleetRows change that drops type tokens whose provider clause matches FUTURE_RX: provider clauses do not reliably map onto type tokens (HY's clauses name "A320neo" and "A321neo" while the tokens are "A320"/"A321"), so that heuristic would silently mis-scope other entries. If a code-side guard is still wanted, make it a build-time consistency check that fails the build when a rule's provider clause matches FUTURE_RX while the rule's orbit is not NONE/UNKNOWN, rather than mutating rendered scope.

### C6. Fleet tables render registry rules as if they partition the fleet, producing two verdicts for the same aircraft

**Severity** high · **Dimension** data-accuracy  
**Where** /Users/priyansh/Desktop/NowOrNever/flightwifi/web/components/airline.tsx:6-33 (FleetTable) with lib/extension.ts fleetRows; out/airlines/qatar-airways/index.html and out/airlines/singapore-airlines/index.html

**Evidence**

core.js pickRule treats rules as an ordered, most-cautious-wins ruleset; the site prints them 1:1 as rows. Qatar's table reads: "777, A350, 787 → Video calls work", then "787 → Varies by aircraft", then "A380, A330 → Email & browsing", then "Rest of fleet → No Wi-Fi", then "Whole fleet → Varies by aircraft" whose System text is "Starlink on all 777/A350/787-8 widebodies" — a fleet-wide Starlink claim sitting directly under a row saying the A380/A330 run Inmarsat GEO. A reader looking up a 787 gets two different answers, and the FAQ concatenates all five: "777, A350, 787: Video calls work. 787: Varies by aircraft. … Whole fleet: Varies by aircraft." Singapore Airlines has the same defect: A350 appears in all three rows (Panasonic Ku, SITA OnAir Ka, Starlink), each labelled "Email & browsing".

**Verifier**

Reproduced exactly, and the defect is broader than the reviewer describes.

fleetRows (/Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/extension.ts:133-160) does `entry.rules.map(...)` — one row per registry rule — and labels each row with `verdict(code, types[0])`, i.e. the pickRule outcome for the rule's FIRST token only. core.js:64-72 pickRule is explicitly an ordered most-cautious-wins resolver (its own comment names Qatar's overlapping 777|A350|787 / 787 pair as the reason it exists), so printing rules 1:1 publishes the losing rules as if they were separate fleet segments.

Verified in the shipped HTML and on localhost:3105 (identical). /out/airlines/qatar-airways/index.html table: "777, A350, 787 | Video calls work | Starlink" / "787 | Varies by aircraft | Starlink rollout on 787-9s… Inmarsat GX/SITA OnAir until fitted" / "A380, A330 | Email & browsing" / "Rest of fleet | No Wi-Fi" / "Whole fleet | Varies by aircraft | Starlink on all 777/A350/787-8 widebodies". A 787 gets two contradictory verdicts; row 1's chip is really the 777 answer. /out/airlines/singapore-airlines/index.html: A350 appears in all three rows, all chipped "Email & browsing", and the third row pairs that GEO chip with "Starlink (confirmed May 2026; installations begin Q1 2027…)" — chip and System column come from different rules.

Registry scan (235 airlines): 4 entries have a type token repeated across rules (QR 787, SQ 777/A350/A380, LA A320/A321, RJ 787), and 30 entries have typed rules plus an untyped fleet:"all"/"most"/"rollout" rule that fleetRows:153 renders as "Whole fleet"/"Rest of fleet". That second bucket is worse than anything the reviewer cited, because core.js only reaches those rules as a last-resort fallback: /out/airlines/air-india/ prints "Whole fleet | No Wi-Fi" under rows giving A350/787/A321 wifi, and /out/airlines/korean-air/ prints "Whole fleet | No Wi-Fi" under three wifi rows.

The FAQ concatenation is real and lands in published FAQPage JSON-LD (app/airlines/[slug]/page.tsx:32-45 maps the same rows): Qatar's is verbatim "Yes, on part or all of the fleet. 777, A350, 787: Video calls work. 787: Varies by aircraft. A380, A330: Email & browsing. Rest of fleet: No Wi-Fi. Whole fleet: Varies by aircraft."; Air India's is "…A350: Email & browsing. 787: Not on every aircraft. A321: Not on every aircraft. Whole fleet: No Wi-Fi." — a self-contradiction served to Google as structured data.

Only overstatement: the QR row's System text reads "Starlink on all 777/A350/787-8 widebodies", which is type-scoped prose, not literally a "fleet-wide Starlink claim" — but the site's own Aircraft column labels that row "Whole fleet", so the rendered contradiction stands. The code comment at extension.ts:129-132 states the intent as "One row per distinct answer an airline can give", so this is a bug against stated intent, not a deliberate rules-dump.

**Fix**

The per-type resolution half of the proposed fix is right; the untyped half is lossy and it misses the chip/System mismatch. Corrected fix for fleetRows:

1. Typed rows: expand the union of tokens across all typed rules (ruleTypes on each), resolve EACH token through the extension's own pickRule path (verdict(code, token)), then group tokens that share the same winning rule into one row. Qatar collapses to "777, A350 → Video calls work" and "787 → Varies by aircraft"; Singapore collapses to a single Panasonic/SITA row.

2. Take the System column from the WINNING rule, not the row's originating rule — otherwise Singapore keeps a GEO "Email & browsing" chip sitting next to "Starlink … installations begin Q1 2027". A rollout rule that never wins pickRule (SQ's Starlink) should not silently vanish either: surface it as a separate "Coming" line or a footnote under the table, not as a fleet row that reads like current service.

3. Do NOT merge untyped rules into one "everything else" row. Qatar has two of them and they say different things: fleet:"narrowbody" = "No Wi-Fi" (the decision-relevant fact for an A320 passenger) and fleet:"all" = the fallback. Keep fleet-scoped untyped rules as their own row labelled by their actual scope ("Narrowbodies (A320 family)"), and render only the trailing fleet:"all"/"most"/"rollout" catch-all — which pickRule reaches solely when nothing else matched — as "Any other aircraft", last in the table. Never "Whole fleet": that label is what makes Air India and Korean Air read "Whole fleet: No Wi-Fi" on airlines that demonstrably have wifi.

4. buildFaq consumes fleetRows, so fixing the rows fixes the FAQPage JSON-LD automatically; verify the Air India and Korean Air answers no longer end in "Whole fleet: No Wi-Fi" after the change, and re-check the 30 entries that pair typed rules with an untyped all/most/rollout rule.

### C7. Ryanair and IndiGo are listed as "free Wi-Fi that is a movie server" when the registry says they have no Wi-Fi at all

**Severity** high · **Dimension** blog-accuracy  
**Where** /Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/blog.ts:36 and :85 (rendered at /blog/which-airlines-have-starlink/ and /blog/which-airlines-offer-free-wifi/)

**Evidence**

Both articles name Ryanair and IndiGo in the local-entertainment-portal bucket: "Dozens of airlines advertise onboard Wi-Fi that is a local streaming network... easyJet, Ryanair, IndiGo, Vietjet and many others fall in this bucket today" and "easyJet, Ryanair, IndiGo, Vietjet, Volotea and Aeroflot all fall here today." registry.js FR access = "No Wi-Fi and no internet of any kind on any Ryanair aircraft." 6E access = "IndiGo has no inflight wifi today; first A321XLR wifi trials expected late 2026". Neither entry mentions a streaming portal, unlike U2 ("AirFi's free local streaming portal"), VJ, V7 and SU which do. The site's own built pages refute the articles: out/airlines/ryanair/index.html reads "Ryanair Wi-Fi No Wi-Fi ... No Wi-Fi and no internet of any kind on any Ryanair aircraft" and out/airlines/indigo/index.html reads "IndiGo Wi-Fi No Wi-Fi ... IndiGo has no inflight wifi today". The paragraph's punchline ("Your phone shows full bars and your messages do not send") is impossible on a carrier with no cabin Wi-Fi.

**Verifier**

Reproduced against the registry and the shipped HTML. registry.js FR: rules = [{fleet:"all", provider:"None", orbit:"NONE"}], access = "No Wi-Fi and no internet of any kind on any Ryanair aircraft." 6E: same NONE rule, access = "IndiGo has no inflight wifi today; first A321XLR wifi trials expected late 2026". Neither entry mentions any cabin network, portal, or streaming server, unlike the entries the same paragraphs correctly cite (U2 "AirFi's free local streaming portal", VJ "the onboard portal is local streaming and retail only", V7 "the onboard 'Volotea' network reaches only a free local entertainment portal", SU "Free local entertainment portal over cabin Wi-Fi").

Both paragraphs are live in the built output. out/blog/which-airlines-have-starlink/index.html: "Dozens of airlines advertise onboard Wi-Fi that is a local streaming network: films, a menu, a moving map, and no connection to the ground. easyJet, Ryanair, IndiGo, Vietjet and many others fall in this bucket today". out/blog/which-airlines-offer-free-wifi/index.html: "Dozens of airlines advertise free onboard Wi-Fi that is a local entertainment server... easyJet, Ryanair, IndiGo, Vietjet, Volotea and Aeroflot all fall here today. Your phone shows full bars and your messages do not send." Source is lib/blog.ts, the "The biggest lie in airline Wi-Fi" and "\"Free Wi-Fi\" that is not internet" paragraphs.

The site contradicts itself: out/airlines/ryanair/index.html titles "Ryanair Wi-Fi: No Wi-Fi (2026-08)" and out/airlines/indigo/index.html titles "IndiGo Wi-Fi: No Wi-Fi (2026-08)". The paragraph's punchline is also physically impossible on a carrier with no cabin Wi-Fi radio: there are no bars to show. This violates the rule that all airline facts must trace to the registry and never go beyond it. Severity high (factual error on two indexed pages, and it is the exact myth the site exists to debunk).

**Fix**

The defect is real but the reviewer's replacement list would introduce four new registry contradictions, so do not apply it as written.

Bad substitutes from the proposed fix:
- Jet2 (LS): access = "No inflight wifi is offered, and passengers are advised to download entertainment before flying", rule provider = "none; no inflight wifi and no streaming portal". Identical defect to Ryanair.
- Norse Atlantic (N0): "No inflight internet is available; the 787s carry seatback entertainment only" — seatback, no cabin Wi-Fi network, so "full bars" is again impossible.
- EVA Air (BR): has a real GEO rule — Panasonic Avionics on 787/777/A330, complimentary for Business and Infinity MileageLands tiers, paid otherwise. Only the 17 A321s are wireless-IFE-only. Naming EVA in the fake-Wi-Fi tier would be the most serious error of the set.
- TUI fly (X3): orbit LEO, Iridium Certus narrowband with paid WhatsApp messaging. Messages do send, so it fails the paragraph's own punchline.
- Volaris (Y4) is portal-only but the portal costs about MXN 20, so it must not appear in the "free Wi-Fi that is not internet" article; it is only usable in the Starlink article's wording.

Correct fix, per a full scan of the 235 entries:
1. In lib/blog.ts:36 replace "easyJet, Ryanair, IndiGo, Vietjet and many others" with carriers whose registry entry actually describes a free local cabin portal, e.g. "easyJet, Transavia, Air Transat, Vietjet and many others".
2. In lib/blog.ts:85 replace "easyJet, Ryanair, IndiGo, Vietjet, Volotea and Aeroflot" with "easyJet, Transavia, Air Transat, Jazeera Airways, Vietjet, Volotea and Aeroflot". Other verified-free portal entries available: Sun Country (SY), SunExpress (XQ), Air Macau (NX), SmartWings (QS), Corendon (XC), Luxair (LG), Binter Canarias (NT), Nok Air (DD), Solaseed (6J), AIRDO (HD), Tigerair Taiwan (IT), Thai VietJet (VZ), Bamboo Airways (QH), S7 (S7), Rossiya (FV), Pobeda (DP).
3. Move Ryanair and IndiGo into a separate sentence for the genuinely-nothing tier, which is a distinct and equally useful fact (64 registry airlines are NONE with no portal at all): e.g. "A second group has no cabin network whatsoever, so there is nothing to connect to: Ryanair, IndiGo, Wizz Air, Frontier, Allegiant and flydubai among them." Note the Starlink article already uses flydubai this way in the announced-tier section, so keep the two mentions consistent.

### C8. Both articles claim the dataset uses "never aggregator blogs", but 211 of 651 registry sources are aggregator/trade blogs and 14 airlines have no official source at all

**Severity** high · **Dimension** blog-accuracy  
**Where** /Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/blog.ts:18, :26, :42, :68 (and echoed on the home page and every airline page footer)

**Evidence**

blog.ts:26 states "The audit used only official airline documentation and connectivity-provider announcements, never aggregator blogs." blog.ts:42 states "Method: every claim traces to an official airline page or provider announcement, checked airline by airline." Counting registry.js sources: 651 total, 211 match aggregator/trade/news domains (onemileatatime.com, awardwallet.com, simpleflying.com, thepointsguy.com, paxex.aero, runwaygirlnetwork.com, liveandletsfly.com, happyfares.in, skift.com, cnbc.com, bloomberg.com, gulfnews.com and similar). 14 airlines have zero non-aggregator sources: IndiGo, Lufthansa, Southwest, Korean Air, easyJet, Ryanair, Allegiant, Air Serbia, Akasa, Air India Express, AirAsia, Vietjet, ZIPAIR, Flair. IndiGo's only source is https://www.happyfares.in/blog/inflight-wifi-indian-airlines-2026/ — an aggregator blog — and the same article cites IndiGo as a factual example while telling the reader aggregators are unreliable. Emirates and Turkish, the two lead entries, both cite awardwallet.com.

**Verifier**

Independently reproduced and the claim is understated, not overstated. Verified in /Users/priyansh/Desktop/NowOrNever/flightwifi/extension/data/registry.js: exactly 651 sources across 235 airlines, matching the reviewer's count. blog.ts:26 ("never aggregator blogs") and blog.ts:42 ("every claim traces to an official airline page or provider announcement") are verbatim and render live on localhost:3105. IndiGo's only source is happyfares.in — an aggregator blog — while the same article names IndiGo as an example in the passage warning that "aggregator sites list them all as 'has Wi-Fi'". Emirates and Turkish both cite awardwallet.com. The strongest instance the reviewer missed: app/airlines/[slug]/page.tsx:128 renders "Facts on this page come only from the airline's own publications and its connectivity provider's announcements" unconditionally on all 235 airline pages; the live /airlines/indigo/ page prints the happyfares.in URL three lines above that sentence. Under a strict airline-domain/provider-domain test ~60 airlines (not 14) have no official source, including China Eastern, China Southern, Cathay, Wizz, Cebu Pacific, Jet2, TAP. Even under the site's own lenient /methodology/ rule ("Aggregator wifi guides and user reports are never sources"), 117 sources violate it: Wikipedia x23, onemileatatime x18, simpleflying x8, awardwallet x3, seatwifi.com and inflightwifi.one (literal aggregator wifi guides), 2 Yahoo Chiebukuro Q&A threads and flight-report.com (user reports), and 6 news.google.com/rss/search?q=... query URLs that are not documents at all. 17 airlines rest entirely on that class of source, including United and Singapore Airlines, both headline entries in the Starlink article. The home page compounds it by printing "235 airlines · 651 official sources" (app/page.tsx:70). Two minor overstatements that do not change the verdict: easyJet does have a provider source (airfi.aero, AirFi's own announcement), so the list of 14 is really 13; and "the two lead entries" is loose framing since the Starlink table is alphabetical.

**Fix**

The proposed fix targets the wrong three places and understates the scope. Make /methodology/ the canonical wording (it is already the only honest page: "an airline's own pages and press releases, or its connectivity provider's announcements, with established aviation trade press used for corroboration") and bring every other surface into line with it, in this priority order:

1. app/airlines/[slug]/page.tsx:128 — highest severity, renders on all 235 pages directly beneath the contradicting URL. Replace "Facts on this page come only from the airline's own publications and its connectivity provider's announcements" with wording that matches what is actually listed, e.g. "Sourced from the airline and its connectivity provider where published, and from aviation trade press otherwise." Better still, make it conditional on whether the entry actually has an airline/provider-domain source.
2. app/page.tsx:38 (FAQ, the most absolute claim: "...only (SpaceX, Viasat, Panasonic, Intelsat, SES, Anuvu, SITA), never aggregator blogs or user reports"), :58 hero, and :70 which labels all 651 as "official sources" — change the stat label to "651 source citations" (the methodology page already uses that honest phrasing).
3. components/chrome.tsx:57 — site-wide footer, "compiled from official airline and provider sources only".
4. lib/blog.ts:26 and :42, plus the excerpts at :18, :68 and the body line at :73 ("235 airlines, official sources only").
5. app/layout.tsx:14, app/about/page.tsx:31, app/airlines/page.tsx:25, app/compare/[slug]/page.tsx:25 and :106 — same "official sources only" phrasing.

Separately from the copy fix, three registry items violate even the corrected, lenient wording and should be removed or replaced rather than covered by softer copy: (a) the 6 news.google.com/rss/search?q=... entries on T'way, Jin Air, Jeju Air, Lion Air and Batik Air, which are search queries, not sources; (b) seatwifi.com and inflightwifi.one, which are the aggregator wifi guides the methodology page explicitly disavows; (c) the user-report citations (2 Yahoo Chiebukuro threads, flight-report.com). Prioritise real sources for United and Singapore Airlines, which are named in the article body and FAQs yet rest entirely on points blogs, a fan tracker and Wikipedia.

### C9. The live {{starlink-table}} reports Copa Starlink as free, contradicting the same article's own FAQ and the registry

**Severity** high · **Dimension** blog-accuracy  
**Where** /Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/extension.ts:194 (rendered in out/blog/which-airlines-have-starlink/index.html and out/starlink/index.html)

**Evidence**

The rendered table row is "Copa Airlines | Rolling out | Starlink rollout (first aircraft Jul 2026...) | Yes" under the "Free?" column. registry.js CM access = "Paid for most passengers via the onboard Starlink portal; free in Business class, for ConnectMiles PreferMember Gold, Platinum and Presidential members...". The article's own FAQ two screens later says "Copa sells it in economy." The cause is `free: /\bfree\b/i.test(entry.access ?? "")` in starlinkRows() — any occurrence of the word "free" anywhere in the access string flips the column to Yes. The same bug makes every one of the 24 rows read "Yes", including Lufthansa, whose access is "Messaging and tiered paid packages today; Starlink planned free for Miles & More...". /starlink/ carries the identical contradiction: its table says Copa "Free" while its FAQ on the same page says "Copa sells it in economy."

**Verifier**

Reproduced end to end.

CODE: /Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/extension.ts:194 is exactly `free: /\bfree\b/i.test(entry.access ?? "")` inside starlinkRows() — a substring test over the whole access sentence, with no regard for which clause the word "free" governs.

REGISTRY: CM access = "Paid for most passengers via the onboard Starlink portal; free in Business class, for ConnectMiles PreferMember Gold, Platinum and Presidential members, and for existing Starlink Residential or Starlink Roam subscribers." Copa's free carve-out is Business class plus paid-elite status, not a free-to-join account, so the general-passenger default is paid.

RENDERED: out/blog/which-airlines-have-starlink/index.html — table row "Copa Airlines | Rolling out | Starlink rollout (first aircraft Jul 2026, fleet complete target Q1 2027); most aircraft… | Yes". I extracted all 25 <tr>s: header plus 24 data rows, and the Free? column is "Yes" on every single one. The FAQ further down the same page (and its FAQPage JSON-LD) says "Copa sells it in economy." out/starlink/index.html renders Copa with a `v v-fast` chip labelled "Free" while its own FAQ on the same page again says "Copa sells it in economy." No legend or caveat anywhere near either table redefines "Free?"; the blog intro explicitly frames the table as "live from the registry".

Three surfaces consume r.free: app/blog/[slug]/page.tsx:87 (Yes / Paid tiers), app/starlink/page.tsx:49 (Free / Paid tiers chips), app/page.tsx:48 (home list).

One overstatement, not fatal: Lufthansa is a weak example. LH access says "Starlink planned free for Miles & More and Travel ID members", and Miles & More/Travel ID are free to join, which is the same treatment the page's own FAQ endorses for United, Air France, SAS, Southwest, Alaska, WestJet and Virgin Atlantic. So the LH row is right by accident, not wrong. Same for SWISS, Austrian and ITA, whose access strings all end with an explicit "Starlink will be free in all classes for status and Travel ID customers". Copa is the one row in that table that flatly contradicts both the registry and the article's own FAQ. That is enough on its own: a factual error on two shipped pages, self-contradicting within each page.

The reviewer also missed that the same regex fails in the inverse direction. flydubai access = "No onboard internet at present; the announced Starlink service is to be complimentary for all passengers once it enters service." No literal "free", so free=false and /starlink/ labels flydubai "Paid tiers" — the opposite of what the registry says. Brussels Airlines ("free of charge across all travel classes for status customers and Travel ID users") passes only because it happens to use the word. Several no-Wi-Fi carriers (Volaris, Cebu Pacific, JetSMART, Vietjet, FlySafair, Air Seoul) also read "Paid tiers" when the registry says they sell nothing at all.

**Fix**

The proposed fix is half right and its "at minimum" fallback is already in the code — both tables ALREADY have a second state ("Paid tiers" at app/blog/[slug]/page.tsx:112 and app/starlink/page.tsx:95); the branch is simply unreachable for these rows. Adding a third label without fixing classification changes nothing. Also, patching the regex to reject strings containing "Paid for most"/"paid" is fragile and would newly break British Airways ("Paid GEO packages on unequipped aircraft… free full wifi in all cabins on Starlink-equipped aircraft"), SWISS, Austrian and ITA, all of which correctly resolve to free-for-Starlink today.

Right fix, in registry-as-source-of-truth order:

1. Add an explicit per-airline field in /Users/priyansh/Desktop/NowOrNever/flightwifi/extension/data/registry.js, e.g. `starlink_access: "free" | "free_with_account" | "paid"`, set from the same official sources as `access`. This satisfies the project rule that every site fact traces to the registry, and it is the only approach that survives access-string rewording. Copa = "paid", Lufthansa/SWISS/Austrian/ITA/United/Air France/SAS/Southwest/Alaska/WestJet/Virgin Atlantic/Singapore = "free_with_account", Gulf Air/Iberia/airBaltic/ZIPAIR/Aer Lingus/Qatar/Emirates/Air NZ/flydubai/Brussels = "free".

2. In starlinkRows(), replace the boolean with `free: entry.starlink_access ?? null` and drop the regex entirely. Do NOT default a missing value to false — that is what mislabels flydubai and the no-Wi-Fi carriers as "Paid tiers". Default to null and render a dash or "Not stated".

3. Render three states plus unknown: "Free", "Free with account", "Paid", "—". This also fixes the separate inversion where carriers with no Wi-Fi product at all currently advertise "Paid tiers" on /starlink/.

4. Copy sync: with Copa correctly classified, the blog and /starlink/ FAQ line "Copa sells it in economy" stops contradicting the table. Keep that FAQ sentence; it is the accurate one.

Scope note for whoever applies this: the fix touches app/blog/[slug]/page.tsx:112, app/starlink/page.tsx:95 and lib/extension.ts:166 (the `free: boolean` type) as well as line 194.

### C10. The in-article table labels Lufthansa, SWISS, Austrian, ITA and Singapore Airlines "Rolling out" while the article's own prose says they have nothing in the air

**Severity** high · **Dimension** blog-accuracy  
**Where** /Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/blog.ts:33, :55 vs the rendered table in out/blog/which-airlines-have-starlink/index.html (filter at app/blog/[slug]/page.tsx:87)

**Evidence**

blog.ts:33 heads a section "Signed, celebrated, and not carrying a single passenger" and states "Every airline in the announced tier has a real Starlink contract and nothing in the air." The FAQ at :55 puts "The Lufthansa Group... Singapore Airlines (installs from Q1 2027)" in that tier. But the table rendered directly above shows "Austrian Airlines | Rolling out", "ITA Airways | Rolling out", "Lufthansa | Rolling out", "Singapore Airlines | Rolling out — Starlink (confirmed May 2026; installations begin Q1 2027, rollout completes end-2029)", "SWISS | Rolling out". starlinkRows() classifies any `mixed .../LEO` orbit as "partial", and these five entries carry `mixed GEO/LEO` for a rollout that has not begun. /starlink/ repeats it, filing all five under "Mid-retrofit: varies by aircraft (17) — The system is genuinely flying, on some of the planes." Separately, StarlinkTable filters `r.status !== "announced"`, so the 16 airlines the section and FAQ discuss (Korean Air, flydubai, El Al, Frontier, Volaris, JetSMART, Cebu Pacific, Vietjet...) appear nowhere in the article's table.

**Verifier**

Reproduced end to end.

1. `starlinkRows()` (web/lib/extension.ts:181-186) sets status purely from orbit strings: any Starlink rule with `mixed .../LEO` becomes "partial", with no test for whether the rollout has started. The code comment at :171 states the intent plainly: "a mixed orbit is mid-retrofit".

2. Registry ground truth for the five carriers (extension/data/registry.js) — every one carries `orbit: "mixed GEO/LEO"`, `fleet: "rollout"`, and provider text that is explicitly future:
   - LH: "first Starlink aircraft (A320neo D-AINM) enters service 19 August 2026"
   - LX: "Starlink under the Lufthansa Group deal from H2 2026, completing 2029"
   - OS: "Starlink under the Lufthansa Group deal from H2 2026"
   - AZ: "Starlink under the Lufthansa Group deal, phased 2026-2029"
   - SQ: "Starlink (confirmed May 2026; installations begin Q1 2027, rollout completes end-2029)"

3. Built HTML confirms the render. Parsing the table in out/blog/which-airlines-have-starlink/index.html gives 24 rows, of which "Austrian Airlines | Rolling out", "ITA Airways | Rolling out", "Lufthansa | Rolling out", "Singapore Airlines | Rolling out | Starlink (confirmed May 2026; installations begin Q1 2027…)", "SWISS | Rolling out" sit in the same visual bucket as United, Emirates and Air France. The article's own prose (blog.ts:33) says "Every airline in the announced tier has a real Starlink contract and nothing in the air" and names the Lufthansa Group; the FAQ (blog.ts:55) adds "Singapore Airlines (installs from Q1 2027)". Same page, opposite claims. Singapore Airlines is the unambiguous factual error: the cell's own detail text says installs start Q1 2027 while the chip says it is rolling out.

4. /starlink is worse because the bucket carries a stronger blurb. out/starlink/index.html renders "Mid-retrofit: varies by aircraft (17) — The system is genuinely flying, on some of the planes", and all five are inside it, next to a sibling bucket "Signed, nothing flying yet (16)" that is where the prose and FAQ put them.

5. The filter claim also holds. `StarlinkTable` at app/blog/[slug]/page.tsx:87 drops `status !== "announced"`, and I counted the buckets from the registry: 7 in service, 17 partial, 16 announced (Frontier, Korean Air, Asiana, Brussels, El Al, Volaris, JetSMART, Eurowings, flydubai, SalamAir, Cebu Pacific, Vietjet, Jin Air, FlySafair, Air Seoul, Edelweiss). Every carrier the "Signed, celebrated, and not carrying a single passenger" section discusses is absent from the article's only table.

Supporting evidence the reviewer did not cite: the mixed-orbit tagging is arbitrary even within one deal. Brussels Airlines, Eurowings and Edelweiss are on the identical Lufthansa Group Starlink contract but carry GEO/NONE orbits, so they land in "announced" while LH, LX, OS and AZ land in "partial". The tier a carrier shows up in is an artifact of how a rule string was typed, not of any fact about the fleet.

Blast radius is smaller than it first looks in one respect: extension/core.js:66-69 picks the lowest-ranked typed rule, so a Singapore Airlines A350 still resolves to "Email & browsing" in the extension and on /airlines/singapore-airlines/ (verified in the built page). The breakage is confined to the two `starlinkRows()` surfaces, which is where the site's whole "announced is not flying" thesis lives.

**Fix**

The proposed fix is directionally right but needs three corrections.

(a) The reuse target exists but does not match. `FUTURE_RX` is at web/lib/derive.ts:143 and covers "not yet in service", "installs beginning 20xx", "scheduled for 20xx" — none of which match any of the five actual strings. Export it from derive.ts, extend it in place rather than writing a second copy in extension.ts, and add the patterns the registry really uses: /installations? begin/i, /installs? from/i, /from H[12] 20\d\d/i, /phased 20\d\d[-–]20\d\d/i, /enters service /i, /completing 20\d\d/i.

(b) Match on the Starlink clause only, not the whole provider string. Lufthansa's rule reads "FlyNet (GEO) today; first Starlink aircraft … enters service 19 August 2026", so a whole-string test picks up "today" and would be ambiguous. Split provider on ";", keep the clauses matching /starlink/i, and demote to "announced" when every such clause is future-only — the same shape derive.ts:151-153 already uses for `providerAirlines`.

(c) Do not stop at the derivation guard. Also fix the registry so the same contract does not produce two different tiers: LH, LX, OS, AZ and SQ carry `mixed GEO/LEO` for a rollout with no tail flying, while Brussels, Eurowings and Edelweiss carry GEO/NONE for the same Lufthansa Group deal. Pick one convention (mixed orbit only once at least one aircraft is in revenue service) and apply it to all eight. This is the durable fix; the regex guard is the safety net for the next entry someone types.

For the table itself, prefer one table over two. Drop the `status !== "announced"` filter in StarlinkTable and give the third state its own chip reading "Signed only", mirroring /starlink's "Signed, nothing flying yet". A second table splits a 40-row dataset for no reader benefit, and a single table with three states demonstrates the article's thesis instead of asserting it. Note the chip strings here are status chips, not verdict chips, so "Yes" / "Rolling out" / "Signed only" do not collide with the settled verdict vocabulary.

One consequence worth stating: with the guard in place Lufthansa reads "Signed only" until someone updates the registry text after 19 August 2026. That is correct behaviour for a site whose claim is that the registry, not a press release, decides the tier.

## Unverified findings by dimension (92)

These come from a single reviewer each and were not put through adversarial verification, so treat them as leads rather than established defects.

### a11y

**[high] Shipped CSS turns `outline-none` into a permanent 2px red outline — the airlines search box renders as a persistent error state and has no real focus indicator**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/tailwind.config.ts:10 (root cause); /Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/airlines/AirlineDirectory.tsx:40 (consumer); /Users/priyansh/Desktop/NowOrNever/flightwifi/web/out/_next/static/chunks/13qj9v10rxmnf.css (built)

The built stylesheet contains `.outline-none{outline-offset:2px;outline:2px solid #b3261e}` instead of Tailwind's intended `outline:2px solid transparent`. Root cause: `theme.extend.colors` declares a color literally keyed `none: "#b3261e"`, so Tailwind's `outlineColor` plugin emits `.outline-none{outline-color:#b3261e}`, which runs after the core `outlineStyle` `none` utility and wins the cascade. The search input on /airlines/ carries `outline-none`, so it ships with a permanent bright-red 2px ring — visible in the full-page screenshot /Users/priyansh/Downloads/flightwifi-site-screenshots/airlines.jpg, where the search box is outlined red on first paint with no user interaction. Two consequences: (1) the only entry point to a 235-airline directory reads as a validation error / broken field; (2) focus is now indicated only by a 1px border-color swap from `--line` to `--accent` sitting *inside* a louder permanent red ring, so keyboard focus is effectively invisible (WCAG 2.4.7). The `fast`/`ok`/`part`/`none` color keys are otherwise unused anywhere in app/, components/ or lib/ (grep for `text-none|bg-none|text-fast|text-ok|text-part` returns nothing).

*Fix:* Delete the four unused entries from `theme.extend.colors` in tailwind.config.ts (or rename them `verdict-fast`/`verdict-ok`/`verdict-part`/`verdict-none` so nothing collides with a core utility name). Then replace `outline-none` on the search input with an explicit visible ring, e.g. `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]`, rather than suppressing the outline and relying on a 1px border shift.

**[high] ArticleSectionNav's hover panel is keyboard-focusable while fully invisible: 6 phantom tab stops per blog article**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/components/ArticleSectionNav.tsx:49-68

The section-list panel is `pointer-events-none ... opacity-0 ... group-hover:pointer-events-auto group-hover:opacity-100`. It is revealed on `group-hover` only — there is no `group-focus-within` variant, and the built CSS confirms only `.group:hover .group-hover\:opacity-100{opacity:1}` exists. `opacity:0` does not remove elements from the tab order and the buttons carry no `tabindex="-1"`, `inert`, or `aria-hidden` (verified in the built markup at /Users/priyansh/Desktop/NowOrNever/flightwifi/web/out/blog/can-you-work-on-plane-wifi/index.html, offset ~4899: plain `<button type="button" class="block w-full truncate rounded-lg ...">`). At viewports >=1280px a keyboard user tabbing past the breadcrumb lands on 6 completely invisible buttons (5 sections + FAQs), each with no rendered focus ring anywhere on screen, then 6 more dash buttons that duplicate the exact same targets — 12 tab stops for 6 destinations, half of them unseeable. `pointer-events-none` blocks the mouse but not Enter/Space, so pressing Enter on a phantom stop scroll-jumps the page with no visible cause. Affects all 3 article pages (blog/can-you-work-on-plane-wifi, blog/which-airlines-have-starlink, blog/which-airlines-offer-free-wifi). WCAG 2.4.7 Focus Visible and 2.4.3 Focus Order.

*Fix:* Add `group-focus-within:opacity-100 group-focus-within:pointer-events-auto` to the panel wrapper so keyboard focus reveals it, and drop the duplicate tab stops by giving the dash buttons `tabindex={-1}` (or `aria-hidden`) once the panel list is the reachable control. Also add `aria-current="true"` to the active item so the rail's state is announced, and swap the `<button onClick>` for `<a href={'#'+s.id}>` so the targets work without JS and support open-in-new-tab.

**[medium] Inline body links are distinguished by color alone at 1.86:1 (dark) and 2.91:1 (light) against surrounding text — both below the 3:1 floor**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/globals.css:43-51

`a { color: var(--accent); text-decoration: none }` with the underline restored only on `:hover` (not `:focus`). Computed link-vs-body-text ratios: dark `--accent #7cb1ff` vs `--ink #e8edf3` = 1.86:1; light `--accent #1a5fb4` vs `--ink #10151c` = 2.91:1. WCAG 1.4.1 technique G183 requires >=3:1 between link and body text when color is the only differentiator, so both themes fail. This is real in-prose text, not just nav chrome: /Users/priyansh/Desktop/NowOrNever/flightwifi/web/out/blog/can-you-work-on-plane-wifi/index.html has `SES's O3b mPOWER`, `Starlink`, `Virgin Atlantic`, `British Airways`, `Qatar Airways`, `Aer Lingus`, `United`, `Emirates`, `airline's page`, `extension` all embedded mid-paragraph, confirmed visually unadorned in blog--can-you-work-on-plane-wifi.jpg. Everything else in the palette passes and does not need changing (dark: --muted on --bg 7.59:1, on --bg-raised 7.17:1; --ink on --bg 16.33:1; --accent on --bg 8.78:1. light: --muted on --bg 6.14:1, on --bg-raised 5.77:1; --ink on --bg 18.32:1; --accent on --bg 6.29:1. Chips dark: v-fast 8.38, v-ok 7.38, v-part 8.99, v-none 7.15, v-unknown 6.40. Chips light: v-fast 4.78, v-ok 5.49, v-part 5.30, v-none 5.55, v-unknown 5.32 — all clear AA 4.5:1, light v-fast being the thinnest margin).

*Fix:* Underline links inside `.prose` by default: `.prose p a, .prose li a { text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; }`. Leave nav/footer/card links undecorated — those are in link-only regions where 1.4.1 does not bite. Also add `a:focus-visible { text-decoration: underline }` so the hover affordance has a keyboard equivalent.

**[medium] No `color-scheme` declaration, so UA-painted widgets render light-mode over the dark palette**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/globals.css:8-28 and :30-35

Grep for `color-scheme` across app/, components/, lib/ and the built HTML returns only the two `@media (prefers-color-scheme: light)` query headers — the property itself is never set, and there is no `<meta name="color-scheme">` in the built head. The site's default state is dark (`--bg: #0b0f14` on bare `:root`), but the browser still believes the page is light. Concretely: the `<input type="search">` on /airlines/ gets a light-mode text caret and a dark WebKit clear-`x` glyph painted on `--bg-raised #11161d` (near-invisible), scrollbars render light-on-dark, and Chrome/Safari pick their light-scheme default focus-ring color for every link and button — which matters more than usual here because the site defines no `:focus-visible` styles of its own anywhere in globals.css, so every focus indicator on the site is the UA default.

*Fix:* Add `color-scheme: dark;` to the bare `:root` block and `color-scheme: light;` inside the `@media (prefers-color-scheme: light)` block. While there, add a site-wide keyboard focus style so indicators stop depending on UA defaults: `:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 3px; }`.

**[medium] No skip link: 8 repeated header tab stops before content on all 277 pages**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/layout.tsx:28-30; /Users/priyansh/Desktop/NowOrNever/flightwifi/web/components/chrome.tsx:16-46

Grep for `skip` across app/ and components/ returns nothing, and no skip-link markup appears in any built HTML. Every page opens with the logo link plus 6 desktop nav links plus the Extension pill (8 focusable elements at >=768px) before `<main>`. The landmark structure itself is sound — `<header>` / `<nav>` / `<main>` / `<footer>` all present, `<nav aria-label="Breadcrumb">` on 275 pages, one `<h1>` per page with no page missing it and no heading-level skips on home, /airlines/, /airlines/emirates/, /starlink/ or the blog article — but landmarks alone do not help keyboard-only sighted users, who must tab the same 8 links on every one of the 235 airline pages. WCAG 2.4.1 Bypass Blocks.

*Fix:* Add a visually-hidden-until-focused skip link as the first child of `<body>` in app/layout.tsx: `<a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-[var(--accent-ink)]">Skip to content</a>`, and give the existing `<main>` an `id="main"` plus `tabIndex={-1}`.

**[low] Directory search filters 235 results with no screen-reader announcement**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/airlines/AirlineDirectory.tsx:41-58

Typing in the search box re-renders the `<ul>` from 235 items down to N, and on zero matches swaps in a `<p>No airline matches "{q}"…</p>`. Neither the list nor that fallback paragraph sits in a live region, and there is no result-count text at all. A screen-reader user typing "emir" gets silence and must arrow through the list to discover whether anything matched, or whether the zero-state fired.

*Fix:* Render a count line above the list inside `aria-live="polite"` and `aria-atomic="true"` — e.g. `{filtered.length} of {rows.length} airlines` — and move the no-match paragraph inside the same live region so both states announce. Wiring `aria-controls` from the input to the list id also helps.

**[low] Smooth scrolling is unconditional, with no `prefers-reduced-motion` escape**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/globals.css:34; /Users/priyansh/Desktop/NowOrNever/flightwifi/web/components/ArticleSectionNav.tsx:39

`html { scroll-behavior: smooth }` is global, and ArticleSectionNav's `go()` calls `el.scrollIntoView({ behavior: "smooth", block: "start" })`. Grep for `reduced-motion` across app/, components/ and the built CSS returns nothing. Long animated jumps down a 7-minute article are a known vestibular trigger, and the section rail's whole purpose is long jumps.

*Fix:* Wrap the CSS rule in `@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth } }`, and in ArticleSectionNav read `window.matchMedia('(prefers-reduced-motion: reduce)').matches` to pass `behavior: 'auto'` when set.

**[low] Sticky nav loses its blur in Firefox because the minifier dropped the unprefixed `backdrop-filter`**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/globals.css:92-98; /Users/priyansh/Desktop/NowOrNever/flightwifi/web/out/_next/static/chunks/13qj9v10rxmnf.css

Source declares both `backdrop-filter: blur(10px)` and `-webkit-backdrop-filter: blur(10px)`, but the built CSS keeps only the prefixed one: `@supports (background:color-mix(in srgb, red 50%, transparent)){.nav-blur{background:color-mix(in srgb, var(--bg) 88%, transparent);-webkit-backdrop-filter:blur(10px)}}`. Firefox supports `backdrop-filter` unprefixed only, so it takes the `@supports` branch (it does support `color-mix`) and gets an 88%-opaque bar with no blur — page content scrolling underneath shows through behind the nav's own text, which is a legibility problem for the one bar that is on screen at all times.

*Fix:* Re-add the unprefixed declaration after the prefixed one so it survives dedup, or drop the translucency to a fully opaque `var(--bg)` when blur is unavailable via `@supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))` gating the `color-mix` background rather than gating on `color-mix` alone.

**[low] Section-rail dashes are 28x7px targets with no `aria-current`**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/components/ArticleSectionNav.tsx:71-76

Each dash button is `py-0.5` (2px vertical padding) wrapping a `h-[3px]` span, giving a 7px-tall hit area at 28px wide active / 16px inactive — well under the 24x24 CSS px of WCAG 2.2 SC 2.5.8. The hover panel arguably invokes the 'alternative control' exception, but that panel is hover-gated so it is unavailable to anyone not using a mouse. Separately, the active dash is signalled purely visually (`w-7 bg-[var(--ink)]` vs `w-4 bg-[var(--muted)] opacity-50`) with no `aria-current`, so assistive tech gets no reading-position feedback.

*Fix:* Bump the button padding to `py-2 px-1` (keeping the 3px span as the visual mark) so the invisible hit area clears 24px, and add `aria-current={active === s.id ? 'true' : undefined}` to both the dash and panel buttons.

### blog-accuracy

**[high] "Eutelsat OneWeb capacity is already flying... at Air Arabia" is unsupported by the registry and refuted by the page the sentence links to**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/blog.ts:38

The sentence reads "[Eutelsat OneWeb](/providers/oneweb/) capacity is already flying in multi-orbit setups at Avianca and Air Arabia." registry.js G9 (Air Arabia) provider = "Panasonic Avionics Ku-band multi-orbit IFC, in passenger service since March 2026 (separate from the fleetwide Panasonic eXW wireless IFE...)" — no OneWeb anywhere in the entry. Because PROVIDERS[oneweb].match is /oneweb/i, Air Arabia is correctly excluded from the linked page: out/providers/oneweb/index.html lists "Airlines flying Eutelsat OneWeb (5): Aerolineas Argentinas, Avianca, Discover Airlines, GOL, LATAM" plus "Announced or planned (1) Volotea". A reader who follows the link finds the claim contradicted. Avianca alone is correct (its provider string names "leased Eutelsat OneWeb LEO capacity").

*Fix:* Swap Air Arabia for a carrier the registry actually attributes OneWeb capacity to — Aerolineas Argentinas, Discover Airlines, GOL or LATAM.

**[medium] Article 3 names British Airways and Aer Lingus as airlines where calls work; both airline pages say calls do not work on those fleets**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/blog.ts:127

The sentence is "[British Airways](/airlines/british-airways/), [Qatar Airways](/airlines/qatar-airways/) and [Aer Lingus](/airlines/aer-lingus/) let calls happen", inside a paragraph whose premise is "some airlines have fast Wi-Fi and prohibit calls anyway" — so it asserts these three have fast Wi-Fi and permit calls. out/airlines/british-airways/index.html: "Can you make video calls on British Airways Wi-Fi? Not reliably. British Airways's wifi runs over high-orbit satellite, where the roughly 600 ms round trip breaks live calls even when browsing is fine." out/airlines/aer-lingus/index.html has the identical wording. Only Qatar's page agrees ("777, A350, 787: Video calls work"). Separately, core.js CALL_POLICY marks BA, QR and EI all `check: true` ("consistently reported, airline page not retrievable for direct verification") while the article hedges the ban list ("several more are reported to") but states these three flatly; and airBaltic — the only carrier with a sourced `calls: "yes"` (src: airbaltic.com) — is omitted from the permitted list entirely.

*Fix:* Lead the permitted list with airBaltic and Qatar (the sourced/fast cases), and either drop BA and Aer Lingus or move them to a hedged clause noting the policy is reported and most of both fleets is still high-orbit, so the link is the limit rather than the policy.

**[medium] "O3b mPOWER is coming to Thai Airways" contradicts the provider page, which lists Thai as already flying it**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/blog.ts:38

The article says "[SES's mid-orbit O3b mPOWER](/providers/ses/) is coming to Thai Airways and Air Astana." out/providers/ses/index.html lists Thai Airways under "Airlines flying SES / Open Orbits (8)" and puts only Air Astana under "Announced or planned (4)". registry.js TG provider = "NSG Skywaves multi-orbit (GEO + O3b mPOWER MEO): 777 retrofits began Q3 2025...", i.e. in service, not coming. Air Astana is correct ("SES (O3b mPOWER) has been selected for the A321LR fleet, with the critical design review completed Q2 2026 and installs to follow").

*Fix:* Rewrite as "is flying on Thai Airways 777s today and is coming to Air Astana", or move Thai into the already-flying clause alongside Avianca.

**[medium] The home page advertises "six honest verdicts" while article 3 cites a seventh chip that the home page never lists**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/page.tsx:90 vs lib/blog.ts:127

app/page.tsx:90 renders "Every flight gets one of six honest verdicts" and the rendered home page lists exactly six: Video calls work, Email & browsing, Varies by aircraft, Not on every aircraft, No Wi-Fi, Not verified. blog.ts:127 tells the reader "fast Wi-Fi with a call ban reads \"Fast, but no calls\" instead of \"Video calls work\"". extension/core.js defines ten distinct labels across VERDICT_UI and CALL_LABEL: the six above plus "Fast enough for calls", "Fast, but no calls", "Voice calls only" and "Wi-Fi, speed unknown". The home page also mislabels the LEO row: it prints "Video calls work" with the LEO `why` string, but VERDICT_UI.LEO's default label is "Fast enough for calls" — "Video calls work" only appears when CALL_POLICY says calls are permitted.

*Fix:* Either widen the home page section to the full set (and rename the heading to match the count), or split it into "the four link verdicts" plus "three call-policy variants", so a reader who arrives from article 3 finds the chip it named.

**[medium] The Starlink table's binary "Yes" puts Air Canada and Hawaiian in the same bucket as airBaltic and ZIPAIR, and the 90-char clip hides the caveat that reverses it**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/blog/[slug]/page.tsx:87-115 (clip at :33)

The rendered table's top block reads "Air Canada | Yes | Starlink on 25 Dash 8-400s under the Jazz cabin-modernization program (9 equipped as of… | Yes" and "Hawaiian Airlines | Yes | Starlink | Yes", directly above airBaltic, Qatar and ZIPAIR. The registry's full AC string ends "...focused on Billy Bishop Toronto routes; not on mainline aircraft" — the clip at 90 characters cuts exactly before the disqualifying clause. Hawaiian has two NONE rules (787s "None yet; Starlink installs expected fall 2026" and 717s "None, and none planned on the interisland 717s"), which is why its own page verdict is not a clean fast chip. The article's prose immediately below defines this tier as "the airlines where you don't need luck: every plane, or every plane of the listed type, has it" and names only Qatar, airBaltic, ZIPAIR and Virgin Atlantic — so the table's membership does not match the section it introduces.

*Fix:* Scope the "Yes" chip to the rule's types (e.g. "Yes, Dash 8-400 only", "Yes, A330/A321") rather than the airline, and raise the clip to the sentence boundary or clip on ";" so the "not on mainline aircraft" caveat survives.

**[low] flydubai's chronology is reversed: the Wi-Fi was removed 18 months before the Starlink announcement, not "in the meantime"**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/blog.ts:33

The article says flydubai "announced Starlink and removed its old Wi-Fi in the meantime, so today it flies with nothing", implying removal followed the announcement. registry.js FZ: "Anuvu GEO Wi-Fi was progressively removed from the 737 fleet from January 2024 and fully deactivated by May 2024; Starlink announced November 2025". The removal completed roughly 18 months before the announcement, so the causal framing ("cautionary tale" of stripping service in anticipation) is not what the data says.

*Fix:* Rewrite to the registry's order: flydubai deactivated its Anuvu Wi-Fi in 2024, then announced Starlink in November 2025 with nothing installed since, so it has flown with no internet for over two years.

**[low] "This week" is baked into a static export, and the sentence it anchors becomes false on 2026-08-19**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/blog.ts:33 and :55

Body: "The Lufthansa Group's 850-aircraft deal begins with a single A320neo this week." FAQ: "The Lufthansa Group (first aircraft this week, 850+ jets through 2029)". registry.js LH: "first Starlink aircraft (A320neo D-AINM) enters service 19 August 2026". The article is dated 2026-08-18 and ships as pre-rendered HTML in out/, so the relative date is frozen. From 19 August the phrase is wrong and, more importantly, Lufthansa stops belonging to the section it sits in ("not carrying a single passenger"). This is the exact staleness the article's own intro warns about.

*Fix:* Use the absolute date from the registry ("begins with a single A320neo, D-AINM, on 19 August 2026") and move Lufthansa's tier assignment out of hardcoded prose into the live table once the partial/announced classification is fixed.

**[low] "Converting dozens more each month" is a rate the registry does not contain, and it understates the registry's own target**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/blog.ts:31

The article says United "is at about 522 of 1,817 aircraft, converting dozens more each month." registry.js UA records only "about 522 of ~1,817 aircraft as of mid-Aug 2026, 1,000 targeted by end of 2026; widebodies complete by summer 2027" — no monthly rate. Reaching 1,000 from 522 in the remaining ~4.5 months implies roughly 105 aircraft per month, not "dozens". Under the project rule that the site must never invent beyond the registry, an unsourced conversion rate is out of bounds in either direction.

*Fix:* Drop the rate or restate it from data that is in the registry: "522 of 1,817 today, with 1,000 targeted by the end of 2026."

**[low] FAQ lists Wizz Air among announced-Starlink airlines, but the Starlink tracker omits it**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/blog.ts:55 vs lib/extension.ts:180-200

The FAQ names "El Al, flydubai, Frontier, Wizz Air, Volaris, JetSMART, Cebu Pacific and Vietjet" as signed-not-flying. out/starlink/index.html's "Signed, nothing flying yet (16)" section lists every one of those except Wizz Air. registry.js W6 has rule provider "None" with the deal recorded only in access ("the Starlink deal does not begin installs until 2027"), and starlinkRows() filters on `/starlink/i.test(r.provider)` only, so W6 never enters the table. A reader who follows the article to the tracker to confirm Wizz Air finds nothing.

*Fix:* Have starlinkRows() also match the entry's `access` text when no rule provider mentions Starlink (status "announced"), or move the W6 deal note into the rule's provider string so both surfaces agree.

### bridge-code

**[high] Airline pages tell 26 carriers' readers their Wi-Fi "runs over high-orbit satellite" when the registry says LEO/MEO**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/airlines/[slug]/page.tsx:56-63 (buildFaq, else branch)

buildFaq branches on headlineClass(entry): only "LEO" and "MEO" reach the fast wording, so every VARIES / PARTIAL / UNKNOWN airline falls into the else and emits `Not reliably. X's wifi runs over high-orbit satellite, where the roughly 600 ms round trip breaks live calls even when browsing is fine.` A node probe over the registry counts 26 airlines that hit this branch while carrying a LEO or MEO rule: Emirates, United, British Airways, Lufthansa, Alaska, JetBlue, Southwest, Copa, Avianca, LATAM, GOL, Aerolineas Argentinas, Air New Zealand, Singapore Airlines, Thai, Air France, Iberia, SWISS, Austrian, SAS, Aer Lingus, ITA, Saudia, Gulf Air, Air Arabia, Discover. Verified in shipped HTML: out/airlines/united/index.html renders "Not reliably. United's wifi runs over high-orbit satellite…" on a page whose own fleet table row reads `Starlink rollout underway (about 522 of ~1,817 aircraft…)` with chip "Varies by aircraft", and whose own blog (/blog/which-airlines-have-starlink/) says United has ~522 Starlink aircraft. Same text on out/airlines/emirates/, out/airlines/british-airways/. Two further pages (PX Air Niugini, AQ 9 Air) assert high-orbit satellite when their only orbit token is "UNKNOWN" — inventing beyond the registry. The sentence is also copied verbatim into each page's FAQPage JSON-LD.

*Fix:* Stop keying the answer off a single collapsed headlineClass. Build the answer from fleetRows(code): if any row's key is LEO/MEO, say calls work on those aircraft and name the rest as the slow case (that is what VARIES/PARTIAL mean); reserve the 600 ms sentence for entries whose every non-NONE rule classifies GEO/A2G; and for headlineClass UNKNOWN emit the "not verified" wording instead of asserting an orbit.

**[high] /providers/starlink/ lists carriers with nothing in the air under "Airlines flying Starlink", including in JSON-LD**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/derive.ts:143-167 (FUTURE_RX + providerAirlines inService)

`inService: orbitClass(active.orbit) !== "NONE" && !futureOnly` treats the rule's orbit as if it described the matched provider. When an airline's current system is GEO and Starlink is only mentioned in the same rule's prose, the row is marked flying. Confirmed in out/providers/starlink/index.html under the heading "Airlines flying Starlink (27)": Asiana Airlines (registry: "Panasonic Avionics; the Hanjin-group Starlink switch is planned … with no Asiana aircraft live yet"), El Al ("Starlink is announced but does not enter service until 2027"), Eurowings ("…none in passenger service yet"), and Singapore Airlines ("installations begin Q1 2027, rollout completes end-2029"). Their verdict chips in that table read "Email & browsing" — the GEO chip — which is itself the tell. Austrian, SWISS and ITA appear there too on "from H2 2026"/"phased 2026-2029" text. The count and names are baked into the FAQ answer and the FAQPage JSON-LD on the same page: "27 airlines in the registry are flying Starlink: … Asiana Airlines, Austrian Airlines and more." The site's own blog contradicts this, listing Singapore Airlines and the Lufthansa Group under "signed but don't fly it yet". FUTURE_RX catches only Korean Air, Uzbekistan and JetBlue; it misses "does not enter service until 2027", "none in passenger service yet", "no … aircraft live yet", "installations begin Q1 2027".

*Fix:* Derive inService from the matched provider clause, not the rule orbit: require that the clause mentioning this provider is itself backed by a LEO/MEO-bearing orbit token (or an explicit in-service phrase), and widen FUTURE_RX to cover "not in passenger service", "none … live yet", "does not enter service until 20\d\d", "installations? begin", "from H2 20\d\d", "phased 20\d\d". Anything not provably flying belongs in the "Announced or planned" block.

**[high] The "Free?" column is a raw /\bfree\b/ match on access prose, so paid airlines and airlines with no Wi-Fi all read "Free"**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/extension.ts:194 (starlinkRows free), consumed at app/starlink/page.tsx:96, app/page.tsx:124, app/blog/[slug]/page.tsx:112

`free: /\bfree\b/i.test(entry.access ?? "")` fires on any occurrence of the word. Shipped output: out/starlink/index.html shows Korean Air "Free" (access: "Paid today on equipped narrowbodies and A350s (about US$10.95 for two hours, US$20.95 full flight); Starlink is announced as free of charge … once service starts"), Copa "Free" ("Paid for most passengers via the onboard Starlink portal") on the very page whose FAQ says "Copa sells it in economy", SWISS/Austrian/ITA "Free" (all three say full internet is paid today), and Brussels Airlines / Edelweiss / Jin Air "Free" despite "No onboard internet at all today". In out/blog/which-airlines-have-starlink/index.html all 24 table rows print "Yes" — the `: "Paid tiers"` branch is unreachable there. The bridge already loads core.js's costOf(), which returns "Free tier, then paid" for Korean Air and Copa and is used for accessPoints, so the correct classifier is present and unused.

*Fix:* Export costOf from lib/extension.ts and render its three states ("Free", "Free tier, then paid", "Paid") instead of a boolean; suppress the column entirely for rows in the "Signed, nothing flying yet" group, where a cost for an unlaunched product is meaningless.

**[high] Aircraft-page FAQ calls the fastest tier "a low-orbit system" for an MEO carrier**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/aircraft/[slug]/page.tsx:42-46

`const fast = rows.filter(r => r.cls === "fast")` then "…run a low-orbit system on the {type}". core.js gives cls "fast" to both LEO and MEO. Viva Aerobus's only registry rule is `orbit: "MEO"`, provider "SES multi-orbit (GEO+MEO) via ESA antenna". Shipped out/aircraft/airbus-a320/index.html: "As of August 2026, Viva Aerobus runs a low-orbit system on the Airbus A320, the fastest tier in the registry", and out/aircraft/airbus-a321/index.html: "Hawaiian Airlines, Viva Aerobus run a low-orbit system on the Airbus A321". The site's own /providers/ses/ page says mPOWER is medium earth orbit at ~8,000 km. Both sentences are also emitted as FAQPage JSON-LD. Secondary: the airline list uses join(", ") with no final "and".

*Fix:* Split the sentence on the verdict key rather than cls: name LEO carriers as low-orbit and MEO carriers as mid-orbit (or say "a low- or mid-orbit system" when the set is mixed). Add an Oxford-style join for the airline list.

**[medium] Aircraft pages pair a chip from one rule with the provider text of another**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/derive.ts:207-226 (aircraftAirlines)

The System column uses `entry.rules.find(...)` — the first rule whose types regex matches the probe — while the chip comes from verdict(code, probe), which routes through core.js pickRule() and deliberately picks the most cautious matching rule. Probing all 12 aircraft pages against the registry finds one live divergence: on /aircraft/boeing-787/, Qatar Airways renders chip "Varies by aircraft" next to System "Starlink" (confirmed in out/aircraft/boeing-787/index.html), because the chip actually came from Qatar's second 787 rule, "Starlink rollout on 787-9s completing before end of 2026; Inmarsat GX/SITA OnAir until fitted" (orbit mixed GEO/LEO). clip(…, 120) then strips the caveat, so the reader sees a flat "Starlink" beside a hedged chip. The same shape appears on airline pages via fleetRows (LATAM, Singapore, Royal Jordanian rows show one rule's provider with another rule's chip).

*Fix:* Have aircraftAirlines and fleetRows return the provider of the rule the verdict actually came from — expose pickRule through the bridge (it is already in the sliced head) and read `picked.provider` — so the chip and the System column can never describe different rules.

**[medium] Homepage renders the raw status enum as a verdict chip: "in service" / "partial"**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/page.tsx:122

`<Chip cls={r.status === "in service" ? "fast" : "ok"} label={r.status} />` prints StarlinkRow.status verbatim. out/index.html Status column reads lowercase "in service" on seven rows and "partial" on one (Aer Lingus). Every other consumer maps the enum to reader copy: /starlink/ uses STATUS_META titles, the blog table uses "Yes" / "Rolling out". A site-wide scan of `class="v v-*"` labels in out/ finds "in service" and "partial" only on the homepage.

*Fix:* Map status to the same human labels the tracker uses before passing it to Chip ("Flying" / "Rolling out"), ideally by lifting STATUS_META out of app/starlink/page.tsx into lib so the homepage, tracker and blog share one label table.

**[medium] FleetTable throws away rule.fleet, so Turkish Airlines shows two rows both labelled "Rest of fleet"**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/extension.ts:153 (fleetRows scope)

`scope: types.length ? types.join(", ") : rule.fleet === "all" ? "Whole fleet" : "Rest of fleet"` collapses fleet values "widebody", "narrowbody", "rollout" and "most" into one string. Registry counts for untyped rules: all=53, rollout=17, most=11, widebody=3, narrowbody=4. Shipped out/airlines/turkish-airlines/index.html renders two indistinguishable rows: "Rest of fleet | Email & browsing | Panasonic" and "Rest of fleet | Email & browsing | Anuvu", losing the widebody/narrowbody split the registry stores. out/airlines/united/index.html labels its single fleet-wide rollout row "Rest of fleet" — rest of nothing. derive.ts scopeOf() (lines 170-179) already handles this correctly ("Fleet rollout", falls through to the raw fleet word), which is why /providers/starlink/ shows United as "Fleet rollout" while /airlines/united/ shows "Rest of fleet".

*Fix:* Delete the duplicate and have fleetRows call the same scope function derive.ts already has: "Whole fleet" for all, "Fleet rollout" for rollout, "Most of the fleet" for most, "Widebodies"/"Narrowbodies" for the fleet-class rules, "Rest of fleet" only when a sibling typed rule exists.

**[medium] Directory search misses the airline names travelers actually type**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/airlines/AirlineDirectory.tsx:26-31, fed by lib/derive.ts:267-274 (searchIndex)

searchIndex ships only {code, airline, label, cls} and the filter is `r.airline.toLowerCase().includes(n) || r.code.toLowerCase() === n`. Registry names are the short forms ("United", "Delta", "Southwest", "Qantas", "JetBlue", "SAS", "airBaltic"), so probing the real data shows zero matches for "United Airlines", "Delta Air Lines", "Southwest Airlines", "JetBlue Airways", "Qantas Airways", "Emirates Airlines", "Scandinavian Airlines" and "Air Baltic" — the page renders "No airline matches …". core.js already solves exactly this for the extension with norm() (strips spaces and punctuation, so "Air Baltic" reaches "airBaltic"), GENERIC_SUFFIX_RX (strips "Airlines/Airways/Air Lines") and TRADE_NAMES ("scandinavian airlines"→SK, "lot"→LO), none of which the site uses. This also breaks the ?q= deep link the SearchAction schema advertises. Separately the input placeholder hardcodes "Search 235 airlines" rather than rows.length.

*Fix:* Add a normalized search key per row in searchIndex — norm(name), norm(name minus generic suffix), the IATA code, and any TRADE_NAMES alias — by exporting those helpers through the bridge, then match the normalized query against that key. Drive the placeholder count off rows.length.

**[medium] starlinkRows calls a fleet "Rolling out" from the orbit token alone, contradicting the same article's FAQ**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/extension.ts:181-187

`status = leo.length ? "in service" : mixed.length ? "partial" : "announced"` reads only the orbit string, never the rollout prose. Singapore Airlines' Starlink rule carries orbit "mixed GEO/LEO" with provider text "Starlink (confirmed May 2026; installations begin Q1 2027, rollout completes end-2029)", so out/blog/which-airlines-have-starlink/index.html prints "Singapore Airlines | Rolling out | Starlink (confirmed May 2026; installations begin Q1 2027…)" while the FAQ block further down the same page lists "Singapore Airlines (installs from Q1 2027)" under "Which airlines have signed for Starlink but don't fly it yet?". Austrian ("from H2 2026"), SWISS ("from H2 2026, completing 2029") and ITA ("phased 2026-2029") land in the same bucket, against an article body that puts the Lufthansa Group in the "not carrying a single passenger" tier.

*Fix:* Gate "partial" on evidence of a first aircraft — reuse the widened future-marker regex from the providerAirlines fix — and demote a mixed-orbit rule whose only Starlink clause is a future date to "announced".

**[low] relatedAirlines returns the alphabetically first N of a class, so 67 pages share one identical "similar verdict" list**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/derive.ts:256-265

`pool.slice(0, n)` over codes() sorted by airline name. Class sizes across the registry are UNKNOWN 128, GEO 67, VARIES 24, LEO 8, PARTIAL 7, MEO 1. Probing confirms Delta, Turkish and Air India (all GEO) each render the same six links — Aeromexico, Air China, Air Côte d'Ivoire, Air Europa, Air India, Air New Zealand — and Emirates, United and British Airways (all VARIES) each render Aer Lingus, Aerolineas Argentinas, Air Arabia, Air France, Alaska, Austrian. The block reads as boilerplate and concentrates every internal link on the same handful of pages.

*Fix:* Rank the pool by something with signal (shared provider family, then same headline class, then similar access tier) and rotate deterministically off the current code so the internal links spread across the class instead of always starting at "A".

**[low] clip() truncates inside parentheses; core.js already ships a bracket-aware trimTo**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/derive.ts:201-205 and app/blog/[slug]/page.tsx:33-37 (duplicate)

clip cuts at the last space and appends an ellipsis with no bracket balancing, so shipped rows end mid-parenthesis: out/blog/which-airlines-have-starlink/index.html shows "Starlink (first flight 29 March 2026, A330 EI-EIN DUB-JFK; all Shannon transatlantic…" and "Starlink (all E175 regionals done; mainline 737 retrofits underway, 787s from fall 2026);…". core.js trimTo() (line ~297) exists precisely to "cut back to the last point where brackets balance", and cleanProvider()/providerLine() strip the parentheticals and post-semicolon rollout narrative for the extension card — none of it is reached by the site (lib/extension.ts exports providerLine but no page imports it). Edge case: when the first n chars contain no space, lastIndexOf(" ") returns -1 and cut.slice(0, -1) silently drops one char instead of truncating.

*Fix:* Bridge trimTo (and use cleanProvider/providerLine for the System columns) instead of maintaining two hand-rolled clip copies, and guard the lastIndexOf(" ") === -1 case.

**[low] schemaDates and monthLabel assume as_of is exactly YYYY-MM**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/derive.ts:277-285; app/blog/[slug]/page.tsx:222; app/sitemap.ts:11

schemaDates does `const mod = \`${asOf}-01\``, so a registry as_of of "2026-09-04" would emit dateModified "2026-09-04-01" into Article JSON-LD, and sitemap.ts does `new Date(\`${stats().asOf}-01\`)` → Invalid Date. monthLabel does MONTHS[Number(m)-1] with no bounds check: stats().asOf returns "" when no entry carries as_of, giving "undefined " in "As of {month}" copy on every provider and aircraft page. All 235 entries are currently "2026-08", so nothing is broken today — the failure is one registry edit away and silent in the JSON-LD.

*Fix:* Parse as_of with a /^(\d{4})-(\d{2})(?:-(\d{2}))?$/ match, fall back to SITE_LAUNCH when it does not match, and have monthLabel return "" rather than "undefined" on an unparseable value.

**[low] Homepage hand-copies the verdict vocabulary instead of deriving it from VERDICT_UI**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/page.tsx:10-17

The VERDICTS array duplicates core.js's VERDICT_UI labels and why-strings by hand under the heading "Every flight gets one of six honest verdicts". A scan of every chip label in out/ shows the site actually ships ten: the six listed plus "Fast enough for calls" (17), "Fast, but no calls" (10), "Voice calls only" (4) and "Wi-Fi, speed unknown". The array also pairs the label "Video calls work" with LEO's why text, though in core.js that label only appears via CALL_LABEL when an airline's call policy is known — so the page explains a label the registry never produces on its own, and omits four the reader will meet.

*Fix:* Render this section from the bridged VERDICT_UI plus CALL_LABEL so the explainer cannot drift from the chips, and drop the hardcoded "six" from the heading.

**[low] core.js slice marker fails with an unrelated error message when the section comment moves**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/extension.ts:64-71

`coreSrc.indexOf("/* ---------- hover card ----------")` returning -1 makes slice(0, -1) keep almost the whole file. I ran that exact case: `new Function` over the full source throws `ReferenceError: document is not defined`. So the failure is loud, not silent — good — but the message points at core.js's DOM code rather than at the missing marker, and the same applies to the registry slice (`lastIndexOf("};", indexOf("const VERDICTS"))` degrades to slice(i, 0) → JSON.parse("") when the VERDICTS const is renamed). Both markers are undocumented coupling to comment text in a file the extension owns.

*Fix:* Assert both offsets before slicing and throw a named error ("core.js hover-card marker not found — update lib/extension.ts"), so a rename in the extension fails the build with the cause on screen.

**[low] airBaltic's hero chip and page title ignore the call policy its own fleet table applies**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/airlines/[slug]/page.tsx:24-28 and 100 (fleetVerdict)

core.js fleetVerdict() does not apply CALL_LABEL (only verdictFor does), so the page hero and <title> take VERDICT_UI's default. Sweeping all 235 codes, one page diverges: out/airlines/airbaltic/index.html has <title>airBaltic Wi-Fi: Fast enough for calls</title> and a hero chip "Fast enough for calls" above a single fleet row chipped "Video calls work". BT is the only carrier with a LEO/MEO headline and a `calls: "yes"` policy. The <title> is what shows in search results, so the weaker of the two labels is the one that gets indexed.

*Fix:* When the fleet rolls up to a single row, take the hero chip from that row rather than fleetVerdict — or apply CALL_POLICY to the fleet chip the same way verdictFor does for LEO/MEO keys.

### copy-tone

**[high] /providers/starlink/ calls three airlines "flying Starlink" that /starlink/ files under "Signed, nothing flying yet"**  
web/lib/derive.ts:143 (FUTURE_RX) and :164 (inService), surfaced at web/app/providers/[slug]/page.tsx:55

Built HTML: /providers/starlink/ has a section "Airlines flying Starlink (27)" and an FAQ answer "As of August 2026, 27 airlines in the registry are flying Starlink: Aer Lingus, Air Canada, Air France, Air New Zealand, airBaltic, Alaska Airlines, Asiana Airlines, Austrian Airlines and more." Set-intersecting that table against /starlink/'s "Signed, nothing flying yet (16)" section yields 3 airlines on both: Asiana Airlines, El Al, Eurowings. The registry is unambiguous that none are flying: OZ provider text = "the Hanjin-group Starlink switch is planned (Korean Air first, Q3 2026 at the earliest) with no Asiana aircraft live yet"; LY = "Starlink is announced but does not enter service until 2027"; EW = "Starlink retrofit announced 13 January 2026". The /starlink/ blurb for that tier reads "A real contract exists, and not one passenger flight has it." Cause: inService is `orbitClass(active.orbit) !== "NONE" && !futureOnly`, and these rules carry orbit GEO (their legacy system) with the Starlink clause in the same provider string, while FUTURE_RX does not match phrasings like "no Asiana aircraft live yet" or "does not enter service until 2027".

*Fix:* Do not infer in-service from the rule's orbit when the matched provider clause is the announced one. Reuse starlinkRows()'s stricter test (a bare LEO orbit = flying, mixed = partial, anything else = announced) for providerAirlines, or extend FUTURE_RX to cover "no <name> aircraft live yet", "does not enter service until 20dd", "retrofit announced", "hardware installing". Either way the two pages should derive in-service from one shared function so they cannot disagree.

**[high] Airline FAQ asserts "high-orbit satellite / 600 ms" on 100 pages, including Starlink fleets and "Not verified" airlines**  
web/app/airlines/[slug]/page.tsx:61-63

The else branch writes: `Not reliably. ${name}'s wifi runs over high-orbit satellite, where the roughly 600 ms round trip breaks live calls even when browsing is fine.` It fires for every headline class that is not LEO/MEO: 67 GEO, 24 VARIES, 7 PARTIAL, 2 UNKNOWN = 100 shipped pages. On /airlines/emirates/ the fleet table on the same page reads "Panasonic/Thales GEO on unfitted aircraft; Starlink in service (33 Boeing 777 and 3 A380 flying as of Jul 2026)" and the cost line reads "Free in all cabins on Starlink-fitted aircraft", yet the FAQ says Emirates' wifi runs over high-orbit satellite. Same on /airlines/united/ ("Starlink rollout underway (about 522 of ~1,817 aircraft)"), British Airways, Lufthansa, Alaska, JetBlue. Worse for UNKNOWN: /airlines/air-niugini/ shows the chip "Not verified" and the system text "Undisclosed provider", while the FAQ invents both an orbit and a latency figure the registry never states. A2G airlines are also swept in, and air-to-ground is not satellite at all.

*Fix:* Branch on the actual class rather than using GEO as the fallback. VARIES/PARTIAL should say the fleet is split and the answer depends on the aircraft (linking to the table above); UNKNOWN should say the system is unverified and decline to name an orbit; A2G should describe a ground-based network. Reserve the 600 ms sentence for GEO.

**[high] Starlink tracker chips "Free" for airlines whose own row on the same page says paid or no wifi**  
web/app/starlink/page.tsx:90, flag computed at web/lib/extension.ts:194

The Free? column is `<Chip cls={r.free ? "fast" : "part"} label={r.free ? "Free" : "Paid tiers"} />` where free = `/\bfree\b/i.test(entry.access)` — a bare substring test. Shipped /starlink/ rows: Brussels Airlines detail "None today (the only Lufthansa Group carrier with no wifi)" chipped green "Free"; Korean Air "Panasonic, paid GEO wifi live; Starlink hardware installing since Jul 2026 but passenger service not yet" chipped "Free"; Asiana Airlines (registry access: "Paid today (roughly US$11.95/1h...)") chipped "Free"; also Lufthansa ("Messaging and tiered paid packages today"), SWISS ("full internet is paid on a tiered scale"), British Airways ("Paid GEO packages on unequipped aircraft") and Copa. The page's own FAQ contradicts its table: "Copa sells it in economy." 17 of the Starlink-mentioning airlines match this pattern.

*Fix:* Stop deriving a binary from a keyword. Either add an explicit cost field to the registry, or scope the chip to the Starlink service only and add a third state ("Free on fitted", "Paid today") so an announced-tier or paid-today airline can never render green "Free".

**[high] A380 aircraft page states no airline flies low-orbit on the type, contradicting the Emirates registry entry**  
web/app/aircraft/[slug]/page.tsx:45

/aircraft/airbus-a380/ FAQ: "No airline in the registry flies a low-orbit system on the Airbus A380 yet. The strongest current verdict on this type is \"Email & browsing\" (ANA)." The registry's EK entry says "Starlink in service (33 Boeing 777 and 3 A380 flying as of Jul 2026, ~150 aircraft by end of 2026, all 232 777s and A380s by mid-2027)". Emirates is excluded from the table because its rule is untyped, which the intro paragraph explains for the table, but the FAQ makes an absolute claim about the registry as a whole rather than about the table.

*Fix:* Scope the sentence to what the table actually covers, e.g. "No airline with a type-specific A380 entry flies a low-orbit system on it yet", and add a pointer to fleet-wide carriers. Better: check untyped mixed/LEO rules mentioning the type before asserting the negative.

**[medium] Six non-vocabulary strings ship through the verdict Chip component, and the same data gets two different chip vocabularies**  
web/app/page.tsx:122 and :124; web/app/starlink/page.tsx:90; web/app/blog/[slug]/page.tsx:108 and :112

Extracting every `<span class="v v-*">` from all 279 built pages yields 15 distinct strings. Nine are settled vocabulary; six are not: 'Free' (31), 'Rolling out' (17), 'Paid tiers' (9), 'in service' (7), 'Yes' (7), 'partial' (1). These use the identical component and identical v-fast/v-ok/v-part colours as verdict chips, so on the homepage a green "in service" chip sits on the same page as the green "Video calls work" verdict legend with nothing to distinguish them. The same Starlink status field is also chipped differently per surface: homepage renders 'in service'/'partial' (lowercase), the blog renders 'Yes'/'Rolling out' (title case) for the identical values.

*Fix:* Give status chips their own component and visual treatment (outline or neutral tone) so they are not mistakable for verdicts, and settle one status vocabulary shared by the homepage, /starlink/ and the blog table. At minimum fix the lowercase 'in service'/'partial'.

**[medium] Raw "2026-08" printed as human-facing copy on every page, while other pages format the same value as "August 2026"**  
web/components/chrome.tsx:58; web/app/page.tsx:70; web/app/starlink/page.tsx:61; web/app/methodology/page.tsx:56; web/app/airlines/page.tsx:25; web/app/airlines/[slug]/page.tsx:40 and :100

The footer prints "Last verified 2026-08." on all 279 built pages. The homepage hero prints "235 airlines · 651 official sources · last verified 2026-08", /starlink/ "last verified 2026-08", /methodology/ "Every entry carries an as-of date (currently 2026-08)", /airlines/ "last verified 2026-08". 126 airline FAQ answers read "...does not offer passenger internet on any aircraft as of 2026-08." Every airline page header also shows "· as of 2026-08". Meanwhile lib/derive.ts:277 exports monthLabel() and the aircraft, compare and provider pages already render "As of August 2026" from the same value, so the site contradicts its own formatting.

*Fix:* Route every user-facing as-of through monthLabel(). Keep the ISO string only in JSON-LD and data.json.

**[medium] Two incompatible verdict legends, neither listing the label the site renders most often**  
web/app/page.tsx:10-17 and :90; web/app/chrome-extension/page.tsx:90-99

The homepage heading is "Every flight gets one of six honest verdicts" over six chips (Video calls work, Email & browsing, Varies by aircraft, Not on every aircraft, No Wi-Fi, Not verified). /chrome-extension/ "Verdicts it shows" lists a different set of seven (the six plus "Fast, but no calls"). The built site actually renders nine distinct verdict strings. Absent from both legends: "Fast enough for calls" (17 renders across the site, and the default label for every LEO/MEO airline with no stated call policy) and "Voice calls only" (4 renders, e.g. Virgin Atlantic). A reader who lands on an airline page showing "Fast enough for calls" finds no legend entry explaining it, and the word "six" is simply wrong.

*Fix:* Publish one legend, used by both pages, covering every label the site can render, and drop the hard-coded count (or derive it). Grouping by colour class would keep it short without omitting labels.

**[medium] "Rest of fleet" is the only row on 17 airline pages, so it has no antecedent**  
web/lib/extension.ts:153

scope falls back to "Rest of fleet" for any untyped rule whose fleet is not "all". 17 airlines have exactly one rule and it is untyped and non-"all", so their whole Verdict-by-aircraft table is a single row under the "Aircraft" column reading "Rest of fleet": United, Delta, British Airways, Lufthansa, Alaska Airlines, Southwest, Copa Airlines, Iberia, Saudia, El Al, Aegean Airlines and 6 more. The FAQ repeats it: /airlines/united/ answers "Does United have Wi-Fi?" with "Yes, on part or all of the fleet. Rest of fleet: Varies by aircraft."

*Fix:* When the entry has a single row, label it by its fleet value in traveler language ("Whole fleet", "Most of the fleet", "Fleet-wide rollout"). Only use "Rest of fleet" when at least one typed row precedes it.

**[medium] "Wi-Fi" in the question, "wifi" in the answer, inside the same FAQ accordion**  
web/app/airlines/[slug]/page.tsx:57 and :62; also web/lib/derive.ts:28, web/app/page.tsx:11,13,14,26,30,34, web/app/methodology/page.tsx:32, web/app/privacy/page.tsx:30

173 shipped FAQ answers pair a question titled "Can you make video calls on <Airline> Wi-Fi?" with an answer containing lowercase "wifi" — the two strings sit inches apart in the same open accordion. The pattern repeats across the site: the homepage heading uses "Wi-Fi" while its own verdict descriptions say "ground wifi", "Every plane has wifi", "Traditional satellite wifi"; /methodology/ says "Aggregator wifi guides"; /privacy/ says "a wifi registry". Note the brand is FlightWifi and the extension's internal `why` strings use "wifi", so the source of the split is real, but it is visible to readers.

*Fix:* Pick "Wi-Fi" for all prose (it is already what every heading, title and meta description uses) and keep "wifi" only inside the brand name. The extension's tooltip strings can stay as-is since they are a separate surface.

**[medium] "this week" baked into static blog copy dated 2026-08-18**  
web/lib/blog.ts:33 and :55

Article body: "The Lufthansa Group's 850-aircraft deal begins with a single A320neo this week." FAQ answer: "The Lufthansa Group (first aircraft this week, 850+ jets through 2029)...". The article date is 2026-08-18 and the content array is a static constant, so "this week" is already ambiguous and becomes flatly wrong on every future read. The registry itself carries the precise date ("first Starlink aircraft (A320neo D-AINM) enters service 19 August 2026"), which the page renders correctly in the live table right above the prose.

*Fix:* Replace both with the absolute date the registry already states ("on 19 August 2026"). As a rule, no relative time expressions in the static content arrays.

**[medium] Chip names written as lowercase prose in sentences that claim to be naming the chips**  
web/app/chrome-extension/page.tsx:44-45; web/lib/blog.ts:40; web/app/methodology/page.tsx:46 and :52

chrome-extension hero: "adds one honest chip to every flight result: video calls work, email and browsing, varies by aircraft, or no Wi-Fi" — three of the four differ from the settled strings ("Email & browsing", "Varies by aircraft", "No Wi-Fi"). blog.ts:40 repeats it verbatim. The methodology page is the worst case: "the verdict says varies by aircraft rather than guessing. When we cannot verify, the verdict is not verified, never an estimate" — unquoted and lowercase, "the verdict is not verified" parses as a claim about the verdict's status rather than as the name of the "Not verified" chip. The blog does it correctly at blog.ts:127 ("reads \"Fast, but no calls\" instead of \"Video calls work\""), so the convention exists and is just applied inconsistently.

*Fix:* Whenever a sentence enumerates what the chips say, quote the exact strings in their exact casing, as blog.ts:127 already does.

**[low] Provider FAQ writes "Another 1 has announced or planned it" while the sibling branch spells out "One airline"**  
web/app/providers/[slug]/page.tsx:55-56

Shipped on /providers/anuvu/, /providers/intelsat/, /providers/oneweb/, /providers/panasonic/, /providers/sita-onair/: "Another 1 has announced or planned it." The template pluralizes the verb (has/have) but leaves the numeral and drops the noun. The very next line of the same template handles the singular properly: "One airline in the registry has announced it: JetBlue." (shipped on /providers/kuiper/).

*Fix:* Special-case one: "One more airline has announced or planned it." versus "Another N airlines have announced or planned it."

**[low] Provider call answer double-states the orbit: "runs at roughly 120-150 ms on MEO latency"**  
web/app/providers/[slug]/page.tsx:33, with the latency strings at web/lib/derive.ts:95 and :63,:78

The template is `${def.name} runs at ${def.latency} latency`, but three PROVIDERS entries already embed the orbit in the latency field ("roughly 120-150 ms on MEO", "roughly 600 ms and up on GEO"). Shipped on /providers/ses/: "SES / Open Orbits runs at roughly 120-150 ms on MEO latency" — the trailing noun attaches to "MEO" and the sentence reads as though MEO is a kind of latency. The same fields also render bare in the "Typical latency" spec card, where the orbit suffix is redundant against the "Orbit" card beside it.

*Fix:* Strip the orbit qualifier out of the latency strings (they already have an orbit field) or drop the trailing "latency" from the template.

**[low] Aircraft FAQ template: degenerate "ranging from X to X" and comma-only lists**  
web/app/aircraft/[slug]/page.tsx:39 and :44

When every row shares a verdict the range collapses: /aircraft/airbus-a380/ ships "with verdicts on this type ranging from \"Email & browsing\" to \"Email & browsing\"", and /aircraft/boeing-767/ has the same shape. Separately, line 44 joins names with `join(", ")` and no conjunction: "Hawaiian Airlines, Viva Aerobus run a low-orbit system on the Airbus A321", "Qatar Airways, Virgin Atlantic run...", "TUI fly, WestJet run...". Line 39 also interpolates `${rows.length} airlines` with no singular guard, while the /aircraft/ and /providers/ index pages both guard the same noun with `airline{n === 1 ? "" : "s"}` — currently latent since the smallest page has 4 rows.

*Fix:* Collapse the range to "every airline listed shows X" when first and last labels match; add an Oxford-style "and" before the final name; add the same singular guard the index pages already use.

**[low] Possessive "Emirates's wifi" on 92 airline pages**  
web/app/airlines/[slug]/page.tsx:62

`${name}'s wifi` is applied to raw registry names, 92 of which end in s. Shipped strings include "Emirates's wifi", "Qatar Airways's wifi", "British Airways's wifi", "American Airlines's wifi", "Aegean Airlines's wifi", "Aerolineas Argentinas's wifi". For plural-form company names the standard forms are "Emirates'" / "British Airways'", and the doubled sibilant is conspicuous read aloud.

*Fix:* Add a helper that appends a bare apostrophe when the name ends in s, or rephrase to avoid the possessive entirely ("The wifi on Emirates runs over...").

**[low] Directory empty state says "tell us" with no way to do so**  
web/app/airlines/AirlineDirectory.tsx:55-58

No-results copy: `No airline matches "{q}". If it flies and we missed it, tell us.` There is no link, no mailto, no GitHub pointer in that block. Every other correction invitation on the site is actionable: /about/ gives a mailto and GitHub link, /methodology/ links directly to the issues page. The straight double quotes around {q} are also the only ones on the site.

*Fix:* Link "tell us" to the GitHub issues URL or CONTACT_EMAIL already exported from lib/site.ts.

**[low] Em-dash sweep is clean except one title separator in a shipped file**  
web/public/pricing.md:1

Scanning app/, components/, lib/ and public/ for U+2014 returns exactly one hit: `# Pricing — FlightWifi`. All 279 built HTML files contain zero em dashes and zero &mdash; entities. The hit is a title separator, not a clause join, so it does not breach the stated rule, but pricing.md is served publicly and is referenced from llms.txt, so it is reader-facing.

*Fix:* Optional. If the intent is a blanket ban on the character in shipped copy, change to `# Pricing: FlightWifi` and add a CI grep for U+2014 over app/, components/, lib/ and public/ to keep the sweep clean.

### data-accuracy

**[medium] 17 airline pages whose entire fleet table is a single row labelled "Rest of fleet"**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/extension.ts:153; out/airlines/{delta,united,british-airways,lufthansa,alaska-airlines,southwest,iberia,sas,copa-airlines,gulf-air,saudia,el-al,vueling,aegean-airlines,spring-airlines,kenya-airways,royal-air-maroc}/index.html

fleetRows maps every non-"all" fleet value ("rollout", "most", "narrowbody", "widebody") to the literal string "Rest of fleet". On single-rule entries there is nothing for it to be the rest of: Delta's whole table is one row "Rest of fleet | Email & browsing | Viasat (Delta Sync)", and the FAQ says "Yes, on part or all of the fleet. Rest of fleet: Email & browsing." lib/derive.ts scopeOf() already handles this correctly ("Whole fleet", "Fleet rollout", or the fleet name), so provider pages and airline pages label the same rule differently.

*Fix:* Reuse derive.ts scopeOf() inside fleetRows instead of the inline ternary, and only emit "Rest of fleet" when typed rows precede it.

**[medium] Turkish Airlines shows two identical "Rest of fleet" rows, losing the widebody/narrowbody split**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/out/airlines/turkish-airlines/index.html

Registry TK has fleet "widebody" → Panasonic and fleet "narrowbody" → Anuvu. The page renders "Rest of fleet | Email & browsing | Panasonic" and "Rest of fleet | Email & browsing | Anuvu", so the only information distinguishing the two rows (which fleet each provider serves) is dropped. The FAQ literally repeats itself: "Rest of fleet: Email & browsing. Rest of fleet: Email & browsing." TK is the only entry with two untyped non-"all" rules, so this is the sole page hitting the duplicate case.

*Fix:* Same fix as the scope-label finding: label fleet:"widebody"/"narrowbody" rules "Widebodies"/"Narrowbodies".

**[medium] Virgin Atlantic page contradicts itself three ways on the same screen**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/out/airlines/virgin-atlantic/index.html

The <title> and header chip say "Email & browsing" (fleetVerdict's weakest-link rollup lands on the Viasat 787/A330 rules). The first table row says "A350 | Voice calls only | Starlink (all 12 A350s complete since 2 June 2026)". The FAQ then says "Virgin Atlantic permits voice calls on its fast wifi, but not video calls" — asserting fast wifi on a page whose headline chip denies it. "Airlines with a similar verdict" lists airBaltic, Qatar, ZIPAIR (all LEO), because relatedAirlines uses headlineClass (best rule) while the chip uses fleetVerdict (worst rule). Two different rollups drive one page.

*Fix:* Pick one rollup for the page identity. Either show the headline as the best-flying tier with a qualifier (e.g. "Varies by aircraft") or make relatedAirlines and the FAQ use the same fleetVerdict key the chip uses.

**[medium] airBaltic's header and directory chip disagree with its own single aircraft row**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/out/airlines/airbaltic/index.html and out/airlines/index.html; root cause lib/extension.ts fleetVerdict

airBaltic has one rule (A220, Starlink, LEO) and CALL_POLICY BT = calls "yes". The A220 row renders "Video calls work" (verdictFor applies the policy label), while the page header chip and the /airlines/ directory entry both render "Fast enough for calls" (fleetVerdict never applies CALL_POLICY). Same single fleet, two chip strings, in the built HTML: `airBaltic</span><span class="v v-fast">Fast enough for calls</span>` in out/airlines/index.html vs `<span class="v v-fast">Video calls work</span>` in the fleet table. Air Canada and Hawaiian show the mirror image (header chip carries no policy, rows say "Fast, but no calls").

*Fix:* Apply the CALL_LABEL override inside fleetVerdict for single-carrier LEO/MEO rollups, exactly as verdictFor does, so the fleet chip and the row chip come from one rule.

**[medium] Internal research notes are printed verbatim in the public "System" column**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/components/airline.tsx:26 ({r.provider} rendered raw); out/airlines/{oman-air,air-india,rwandair,xiamen-air,air-cote-d-ivoire,9-air}/index.html

core.js has cleanProvider() specifically to strip parentheticals, post-dash caveats and rollout narrative from provider strings; FleetTable bypasses it. Result: Oman Air's row reads "Inmarsat GX Aviation Ka-band (Inmarsat now owned by Viasat) - not confirmed by Oman Air itself" on a page whose own footer says "Facts on this page come only from the airline's own publications". Air India's 787 row ends "…and Google does not distinguish them", an extension-implementation note with no meaning on a web page. Also RwandAir "the platform is unverified", Xiamen Air "per the airline's own announcements", 9 Air "whether it still operates is unverified".

*Fix:* Render cleanProvider(rule.provider) in the System cell and move the caveat into a footnote or the existing "verification pending" badge.

**[medium] JetBlue's Kuiper row is presented as a current verdict for the "Rest of fleet"**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/out/airlines/jetblue/index.html

Row 1 is "Whole fleet | Email & browsing | Viasat (Fly-Fi)"; row 2 is "Rest of fleet | Varies by aircraft | Amazon Project Kuiper LEO on roughly a quarter of the fleet, installs beginning 2027 and completing 2028". Nothing is left over after "Whole fleet", and "Varies by aircraft" is defined in core.js as "Every aircraft has wifi. Whether it is the quick kind depends which one turns up" — a claim about today, applied to hardware that starts installing in 2027. derive.ts FUTURE_RX already matches "installs beginning 2027" for provider pages but fleetRows does not consult it.

*Fix:* Suppress rules whose provider clauses all match FUTURE_RX from the verdict table, or render them in a separate "Announced, not flying" row with no verdict chip.

**[medium] Home page claims "one of six honest verdicts" while the site ships nine**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/page.tsx:90 and the VERDICTS constant; out/index.html

Counting rendered verdict chips across out/ : "No Wi-Fi" (583), "Email & browsing" (520), "Varies by aircraft" (117), "Not on every aircraft" (100), "Not verified" (21), "Fast enough for calls" (17), "Video calls work" (10), "Fast, but no calls" (10), "Voice calls only" (4) — nine distinct strings. The home page explainer lists six and omits every call-policy label, so a reader who lands on out/airlines/air-canada/ ("Fast, but no calls") or out/airlines/virgin-atlantic/ ("Voice calls only") has no key for what they are seeing. The card that does appear pairs the label "Video calls work" with core.js's description of "Fast enough for calls" ("Low-orbit satellite. Quick enough to be treated like ground wifi"), conflating a policy label with a latency label.

*Fix:* Generate the explainer from VERDICT_UI + CALL_LABEL rather than hardcoding it, and change the heading to name the actual count (or drop the number).

**[medium] Access bullets truncate mid-fact on 47 airline pages and silently drop whole clauses on 5**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/extension.ts accessPoints (ACCESS_LEN 120, ACCESS_POINTS 3 inherited from core.js); out/airlines/*/index.html

The 120-char / 3-bullet caps exist for the extension's flight card and are reapplied unchanged on full-width web pages. 47 of 235 airline pages contain an ellipsised bullet. Examples: Air Canada "…on North America, Mexico and Caribbean flights since 1…" (cuts "1 May 2025" to "since 1"); Turkish "…Elite tiers 400MB in economy with unlimited free in…"; Singapore "…free for KrisFlyer members in Premium Economy…". Five airlines lose a whole clause to the 3-bullet cap, two of them material: Kenya Airways loses "As of mid-August 2026 there is no confirmation the service is actually live" and Royal Air Maroc loses "Older aircraft carry 'Wi-Fi on Stream' streaming entertainment only, not internet access".

*Fix:* Raise or remove ACCESS_LEN/ACCESS_POINTS for the site (pass overrides into accessPoints in lib/extension.ts) — the page has room for the full access string.

**[low] Starlink tracker's "in service" bucket over-promises and never lists the aircraft types it references**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/starlink/page.tsx:16-21 and lib/extension.ts:190 (detail: src.provider); out/starlink/index.html

The blurb reads "Starlink is live on the listed aircraft types. If you are on one of these types, you have it." The "Where it stands" column prints rule.provider, not rule.types, so for airBaltic it says only "SpaceX Starlink", for Hawaiian, Qatar and ZIPAIR only "Starlink" — no types are listed anywhere. And the promise is wrong for Air Canada, whose own cell says "9 equipped as of Feb 2026" out of 25 Dash 8-400s, and for Qatar, whose 787 rule elsewhere says the 787-9s are not fitted yet.

*Fix:* Print scopeOf(rule) alongside the provider text in the detail column, and soften the blurb for rows whose provider text names a partial count.

**[low] Oman Air's "Cost and access" never says the service is paid**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/out/airlines/oman-air/index.html; lib/extension.ts accessPoints

core.js accessPoints drops a bare "paid"/"free" clause because the extension shows that as a separate cost badge. The site calls accessPoints but renders no such badge, so Oman Air's registry access "Paid. Oman Air's own site lists data-capped passes…" becomes three bullets that quote prices but never state the service is paid. Oman Air is the only entry with a bare lead clause today, so the blast radius is one page, but the same filter will silently eat any future "Free." lead.

*Fix:* Either render the costOf() badge next to the "Cost and access" heading, or pass cost=null so the lead clause survives as its own bullet.

**[low] Raw enum values and awkward possessives leak into copy**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/out/index.html (Status column) and out/airlines/{emirates,singapore-airlines,turkish-airlines}/index.html (FAQ)

The home page Starlink table renders the internal status enum as the chip label: "in service" (7 rows) and "partial" (1 row), lowercase, next to a "Yes" in the Free column — while the /starlink/ page titles the same states "Flying with passengers" and "Mid-retrofit". FAQ answers build possessives with a bare +'s on names already ending in s: "Emirates's wifi", "Singapore Airlines's wifi", "Turkish Airlines's wifi". Several FAQ answers also end without a full stop because the registry access string does (Qatar, United, Air India).

*Fix:* Map status to the STATUS_META titles on the home page; add a possessive helper that emits "Emirates'" for names ending in s; append a period in buildFaq when the access string lacks terminal punctuation.

### links-ia

**[high] Four source citations return hard 404s (Delta, Allegiant, LAM Mozambique, Solaseed Air), one more soft-404s**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/extension/data/registry.js (sources[] for DL, G4, TM, 6J, LY) → rendered at /Users/priyansh/Desktop/NowOrNever/flightwifi/web/out/airlines/{delta,allegiant-air,lam-mozambique-airlines,solaseed-air,el-al}/index.html

I fetched all 625 unique external URLs in out/**/index.html (934 <a> instances) with a browser UA following redirects. 465 returned 200, 119 403 (bot walls), 29 connection failures (geo/bot blocks — not reportable), and 4 returned a genuine 404 confirmed by a second fetch reading the response title:
- https://news.delta.com/delta-takes-fast-free-wi-fi-international → "Page not found | Delta News Hub" (Delta has only 2 sources; this is 1 of them)
- https://simpleflying.com/allegiant-air-considers-in-flight-wifi/ → 404 (Allegiant, 1 of 2 sources)
- https://www.solaseedair.jp/service/inflight/solatime.html → "お探しのページが見つかりません｜ソラシドエア" (Solaseed, 1 of 3)
- https://www.lam.co.mz/en/switchlanguage/to/pt/LAM-Inflight-Entertainment-Wi-Fi → 404. This one was captured wrong at source time: it is a language-switcher URL, not a content page.
Also soft-404: https://www.elal.com/en/FrequentFlyer/Pages/hp/WiFi-TP.aspx redirects to https://www.elal.com/eng/frequentflyer/get-to-know, a generic frequent-flyer page with no Wi-Fi content. Every airline page states "Facts on this page come only from the airline's own publications and its connectivity provider's announcements", so an unreachable citation removes the only way a reader can verify the verdict.

*Fix:* Re-source the five entries in registry.js. For Delta, the current newsroom URL is under news.delta.com/... (find the live slug); for LAM replace the switchlanguage URL with the actual /en/ content page; for El Al point at the specific Wi-Fi page rather than the frequent-flyer hub. Then add a scheduled link-check over registry sources[] so citation rot surfaces before it ships.

**[high] relatedAirlines() returns the first 6 alphabetically, so 122 of 235 airline pages show the identical link block and 200 airline pages are never linked from another airline page**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/derive.ts:256-265

`relatedAirlines()` filters the pool to same headline class then does `return pool.slice(0, n)` with no randomization, proximity, or per-page rotation, so every page in a verdict class emits the same six links in registry order.
Measured over out/airlines/*/index.html: 1,404 "Airlines with a similar verdict" links resolve to only 35 distinct targets. The top six (9 Air, Aeroflot, Air Algerie, Air Astana, Air Busan, Air India Express) absorb 762 of 1,404 (54%). 122 pages carry that exact same six-link set; another 61 pages share a second identical set (Aeromexico, Air China, Air Cote d'Ivoire, Air Europa, Air India, Air New Zealand) — 78% of the site on two blocks. 200 of 235 airline pages are never a related-link target.
Downstream: 30 airline pages have exactly one inbound internal link (the /airlines/ directory) and 69 have two or fewer. Examples with 1: /airlines/easyjet/, /airlines/indigo/, /airlines/china-eastern/, /airlines/kenya-airways/, /airlines/hong-kong-airlines/.
It also reads wrong to a human: the Emirates page (Middle East, Panasonic/Starlink) offers Aer Lingus, Aerolineas Argentinas, Air Arabia, Air France, Alaska Airlines, Austrian Airlines; the Air Peace page (Nigeria) offers 9 Air, Aeroflot, Air Algerie, Air Astana, Air Busan, Air India Express.

*Fix:* Rank the pool instead of slicing it: same provider family first, then same region/alliance, then same verdict class, and break ties with a stable hash of the source code so the six rotate across pages rather than always landing on the alphabetical head. Cheapest fix that fixes both symptoms: rotate the slice window by the source airline's index into the pool (`pool[(i+k) % pool.length]`), which spreads 1,404 links across all 235 pages instead of 35.

**[medium] No airline page links to any aircraft, provider, compare, or blog page, even when the page names those entities**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/airlines/[slug]/page.tsx and /Users/priyansh/Desktop/NowOrNever/flightwifi/web/components/airline.tsx (FleetTable renders provider and aircraft as plain text)

Across all 235 out/airlines/*/index.html: 0 pages link to a /aircraft/* detail page, 0 to a /providers/* detail page, 0 to a /compare/* detail page, 0 to a /blog/* article. The only internal links are global nav/footer, the breadcrumb, /methodology/, and the six related-airline links.
The linkable entities are already on the page as text. /airlines/emirates/ renders "Panasonic/Thales GEO ... Starlink in service (33 Boeing 777 and 3 A380 ...)" while /providers/panasonic/, /providers/starlink/, /aircraft/boeing-777/ and /aircraft/airbus-a380/ all exist and are unlinked.
The links are also one-directional: /compare/qatar-airways-vs-emirates/ and /compare/air-india-vs-emirates/ both link to /airlines/emirates/, and /providers/starlink/ links to 40 airlines, but none of those airline pages link back. FleetTable's `provider` cell and `scope` cell are the natural anchors and both render as raw text.

*Fix:* In FleetTable, map the provider string through the existing PROVIDERS match regexes in lib/derive.ts and the aircraft scope through AIRCRAFT, linking each to its detail page when it resolves. Add a "Compared with" strip on airline pages built from COMPARISONS filtered by the airline's code, mirroring the reverse link that compare pages already emit.

**[medium] Strict hub-and-spoke: every aircraft, provider, compare and blog detail page has exactly one inbound internal link and zero sibling links**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/aircraft/[slug]/page.tsx, app/providers/[slug]/page.tsx, app/compare/[slug]/page.tsx, app/blog/[slug]/page.tsx

Inbound counts from the full crawl of out/ (9,019 internal <a> instances): all 12 /aircraft/* pages, all 9 /providers/* pages, all 6 /compare/* pages and all 3 /blog/* articles have exactly 1 inbound internal link — their own section hub. Nothing else on the site reaches them.
Sibling linking is zero: 0/12 aircraft pages link to another aircraft page, 0/9 providers to another provider, 0/6 compare pages to another comparison, 0/3 blog posts to another post. Cross-section detail links are also zero for aircraft, providers and compare; only blog reaches out (2 of 3 articles link to a /providers/* page).
This means a reader on /compare/united-vs-delta/ has no route to /compare/american-vs-united/ except going back to the hub, and /aircraft/boeing-787/ has no route to /aircraft/boeing-777/.

*Fix:* Add a sibling strip to each of the four detail templates ("Other comparisons", "Other aircraft", "Other providers", "More guides") built from the same COMPARISONS / AIRCRAFT / PROVIDERS / ARTICLES arrays the hubs already iterate, excluding self. That is ~4 small components and it lifts every spoke from 1 inbound link to 6-12.

**[medium] Sitemap lastmod (2026-08-01) predates the datePublished/dateModified the same pages declare in JSON-LD (2026-08-18)**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/sitemap.ts:11-16 vs /Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/derive.ts:281-284 (schemaDates)

sitemap.ts derives lastmod from `new Date(`${stats().asOf}-01`)` → 2026-08-01T00:00:00.000Z for 273 of the 276 sitemap URLs. But `schemaDates()` clamps to SITE_LAUNCH: `mod > SITE_LAUNCH ? mod : SITE_LAUNCH`, and SITE_LAUNCH is "2026-08-18" (lib/site.ts:8), so "2026-08-01" loses the comparison and every airline, aircraft, provider and compare page emits `"datePublished":"2026-08-18","dateModified":"2026-08-18"`. I confirmed all 235 airline pages emit 2026-08-18 while their sitemap rows say 2026-08-01. A lastmod 17 days before the page claims to have been published is self-contradictory and makes lastmod untrustworthy as a recrawl signal.
Related inconsistency in the same area: /starlink/ bypasses schemaDates and hardcodes `dateModified: `${s.asOf}-01`` (app/starlink/page.tsx:126), so it is the one non-blog page emitting 2026-08-18 nowhere and 2026-08-01 instead — a third value in the mix.

*Fix:* Have sitemap.ts call schemaDates(stats().asOf).dateModified for its default lastmod so both signals come from one function, and route app/starlink/page.tsx:126 through schemaDates too.

**[medium] Source citations put the URL path outside the anchor, and on 37 airline pages two links share the identical visible text "domain.com"**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/components/airline.tsx:39-57

SourceList wraps only `{domain}` in the `<a>`; the `/path/...` portion renders in a sibling `<span>` outside it. On /airlines/emirates/ the rendered line is "emirates.com /media-centre/gaining-speed-at-40000-feet…" where only "emirates.com" is clickable and the path — the part that identifies which document is being cited — is dead text. I confirmed this in the browser at localhost:3105.
Because the anchor text is the bare registrable domain, 37 airline pages carry two or more citation links with identical visible text pointing at different URLs. Examples: /airlines/azores-airlines/ has two links both reading "azoresairlines.pt" (one → /mobile-data-packages, one → /inflight-entertainment); /airlines/skymark-airlines/ two "skymark.co.jp"; /airlines/discover-airlines/ two "newsroom-en.discover-airlines.com"; /airlines/juneyao-airlines/ two "juneyaoair.com"; /airlines/airasia/ two "paxex.aero". A screen-reader link list on those pages shows the same label twice for different destinations (WCAG 2.4.4).

*Fix:* Move the closing `</a>` after the path span so the whole "domain /path" string is the link target, which fixes both the dead-path click and the duplicate-label problem in one edit.

**[low] /compare/ is absent from the footer and hidden below the md breakpoint, so on mobile the comparison hub is reachable only from the homepage**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/components/chrome.tsx (SiteNav NAV list is inside `class="hidden items-center gap-4 md:flex"`; SiteFooter Data/Project columns)

The footer lists All airlines, Starlink tracker, Providers, Aircraft, Open data (JSON), Methodology, Chrome extension, Blog, About, Privacy, GitHub, Contact — no Compare. `grep -o 'href="/compare/"' out/airlines/emirates/index.html` returns exactly 1 occurrence, the nav one. Below md the nav collapses to Airlines / Starlink / Extension only, so a phone user on any of the 235 airline pages has no visible route to /compare/ at all; the only other entry point on the whole site is the homepage body.
Same breakpoint hides Providers, Aircraft and Blog on mobile, but those three at least survive in the footer.

*Fix:* Add `<Link href="/compare/">Comparisons</Link>` to the footer Project (or Data) column. That restores mobile reachability for all four hidden nav items at zero layout cost.

**[low] All 934 external source links open in the same tab**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/components/airline.tsx:51 and the footer/store links in components/chrome.tsx

Scanning every external `<a>` in out/**/index.html: 934 instances, 0 carry `target="_blank"`. 651 have `rel="nofollow noopener"` (the citation links), 282 have no rel at all (the GitHub footer link on every page), and 1 more has none (the Chrome Web Store CTA on /chrome-extension/). Citations are reference material a reader checks and comes back from; sending them off-site in the same tab from the middle of a verdict page loses the page they were reading.

*Fix:* Add `target="_blank"` to SourceList's anchor (it already has noopener) and to the Chrome Web Store CTA. Give the bare GitHub/store links `rel="noopener"` while you are there.

**[low] No og:url on any page**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/layout.tsx:14-22 (openGraph block sets siteName, type, images but no url)

`grep -rl 'property="og:url"' --include=index.html out/` returns 0 of 276 canonicalled pages, while `rel="canonical"` is present and correct on 276/276. Pages emit og:title, og:description, og:site_name, og:image, og:type only. Social and chat unfurlers that key on og:url fall back to whatever URL was pasted, so a share of a URL with tracking or query junk is not normalized to the canonical.

*Fix:* Set `openGraph.url` per route (or `alternates.canonical` plus a shared helper) so og:url matches the canonical that is already computed correctly on every page.

**[low] Two citations use http://, one on each of two airline pages**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/out/airlines/tianjin-airlines/index.html and out/airlines/qingdao-airlines/index.html (source strings in extension/data/registry.js)

Of 625 unique external URLs, 623 are https and 2 are http:
http://www.caacnews.com.cn/1/6/202311/t20231128_1372563.html (Tianjin Airlines)
http://www.caacnews.com.cn/1/6/202105/t20210511_1323758.html (Qingdao Airlines)
Both are outbound navigations so nothing is blocked, but Chrome shows a "Not secure" interstitial-style warning on arrival, which reads badly for a page whose whole claim is source quality.

*Fix:* Try the https variant of both caacnews.com.cn URLs and update registry.js if it resolves; if the host is http-only, note that rather than leave it silent.

**[low] Footer "Open data (JSON)" uses next/link, firing a 404 RSC request before falling back to a real navigation**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/components/chrome.tsx (SiteFooter: `<Link href="/data.json">Open data (JSON)</Link>`)

Clicking it at localhost:3105 produced, in order: GET /data.json.txt?_rsc=Dh4kcTxcdOBDf9f9 → 404, then GET /data.json → 200. The router probes for an RSC payload that cannot exist for a static asset, gets a 404, then hard-navigates. The link works, but every click on all 279 pages emits a 404 to the CDN and the app's own error surface first.

*Fix:* Use a plain `<a href="/data.json">` for the JSON, the same as the GitHub and mailto links directly beside it in the footer.

**[low] llms.txt uses a non-standard entry format with site-relative paths instead of absolute markdown links**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/out/llms.txt (27 lines)

Entries are written as `- /starlink/ : which airlines actually fly Starlink today...` rather than the llmstxt.org convention `- [Starlink tracker](https://flightwifi.io/starlink/): ...`. Nothing in the file is a link, and every path is relative, so a consumer that reads llms.txt out of band has no resolvable URL. Also, /llms.txt has 0 inbound references anywhere on the site or in robots.txt, and it points at /pricing.md which does exist and serves 200 but is likewise unreferenced by any page.

*Fix:* Rewrite the bullets as markdown links with absolute https://flightwifi.io/ URLs, and add `Llms: https://flightwifi.io/llms.txt` (or at least keep it listed alongside the sitemap) in app/robots.ts so it is discoverable.

### responsive

**[high] /airlines/ directory forces the whole page 411px wide on every phone: verdict chips are clipped off-screen**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/airlines/AirlineDirectory.tsx:39-51

At viewport 390 (and 375, 360, 320) document.documentElement.scrollWidth = 411 vs clientWidth = 390. Every <li> in the directory measures 391px wide starting at left=20, so its right edge sits at 411. The verdict chip is the part pushed off: 'Not on every aircraft' spans x=245..394 and 'No Wi-Fi' x=321..394 on a 390px screen, so it renders half-cut against the right edge (see screenshot crop airlines_0.jpg). The cause is grid track minimum sizing: `<ul className="mt-6 grid gap-2 sm:grid-cols-2">` gives each `<li>` min-width:auto, and the row's min-content is the un-shrinkable sum of the nowrap airline name plus the `.v` chip (globals.css:60-69 sets `white-space: nowrap`), so the single auto track refuses to drop below 411px. /airlines/ is the only page in the site that overflows at 390px; it also overflows at 320/360/375. Side effect: because the sticky <header> is only 390px wide, panning right to read a chip slides the header left (getBoundingClientRect().left = -21 at scrollX=21) and exposes a bare 21px strip of page behind it, with row content bleeding over the header (screenshot airlines-scrolled-right.jpg).

*Fix:* Let the grid track shrink: add `min-w-0` to the `<li>` (or use `grid-cols-[minmax(0,1fr)] sm:grid-cols-2`). Verified in-browser: injecting `ul.grid > li { min-width: 0 }` drops scrollWidth from 411 to 390 and the `truncate` on the airline-name span then does its job. Optionally add `shrink-0` to the chip so it is never the thing that truncates.

**[medium] Header nav overflows on 320px-wide phones, cutting the Extension pill on every page**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/components/chrome.tsx:16-45

At viewport 320, every page measured (/, /airlines/, /starlink/, /compare/, /blog/, /methodology/, /about/, ...) reports scrollWidth 359 vs clientWidth 320. The only offending element is `nav.flex.items-center.gap-4.text-sm` at left=140 right=359, and inside it the Extension pill at left=268 right=359 — 39px of it is off-screen. The logo link carries `shrink-0` and every nav link carries `whitespace-nowrap`, so nothing in the row can give. This makes the entire site pan sideways on iPhone SE (1st gen), older Androids and split-screen views.

*Fix:* Give the row somewhere to go below ~360px: drop the `Starlink` mobile link under a `min-[360px]:inline` guard, or shorten the pill to an icon/`Get it`, or let the brand text collapse (`hidden xs:inline` on the SITE_NAME text while keeping the logo image). Verified: `header nav { flex-wrap: wrap }` + `header .shrink-0 { min-width: 0 }` takes scrollWidth from 359 to 320.

**[medium] Data tables hide their most important column on mobile with zero scroll affordance**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/globals.css:103-111 (used at app/page.tsx:106, app/starlink/page.tsx:73, app/providers/[slug]/page.tsx:99, app/aircraft/[slug]/page.tsx:70, app/blog/[slug]/page.tsx:89, components/airline.tsx:10)

`.scroller > table { min-width: 640px }` inside a 348px content box means every table is 46% off-screen at 390px, and the clipped side is always the payload. Measured column offsets inside the 348px scroller: home 'Starlink, as actually installed' — Airline 1..297, Status 297..512, Free? 512..641, i.e. the entire Free? column is invisible with no hint it exists; /compare/united-vs-delta/ Delta table — System column starts at 402, fully invisible; /airlines/emirates/ — System column spans 245..641, so 'Panasonic/Th…' truncates mid-word. There is no scroll cue of any kind: no edge fade, no shadow, no 'swipe' label (document body text never contains the word 'scroll'), and mobile browsers use overlay scrollbars that stay hidden until a swipe starts. Screenshots home_1.jpg (Status chips read 'in se', 'parti'), airlines--emirates_0.jpg and compare--united-vs-delta_0.jpg show the cut.

*Fix:* Keep the 640px floor but signal it: a right-edge gradient mask on `.scroller` that fades out at scroll end (`background-attachment: local, scroll` two-layer trick or a JS-free `mask-image` cue), plus `overscroll-behavior-x: contain`. Better for the three-column verdict tables: collapse to stacked label/value cards under 640px so the Free?/System column is never hidden.

**[medium] The /compare/ hub is unreachable from global navigation on mobile**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/components/chrome.tsx:24-36 and 60-77

The full NAV list (Airlines, Starlink tracker, Providers, Aircraft, Compare, Blog) lives in a `hidden ... md:flex` div, so below 768px only the two `md:hidden` links (Airlines, Starlink) plus the Extension pill are shown. The footer partially compensates — it links Providers, Aircraft and Blog — but has no Compare entry. Grepping the shipped HTML confirms it: out/index.html contains exactly one `href="/compare/"` (the desktop-only nav), and the footer's link set is [/airlines/, /starlink/, /providers/, /aircraft/, /data.json, /methodology/, /chrome-extension/, /blog/, /about/, /privacy/, GitHub, mailto]. A phone visitor can only reach a comparison page via an in-body link on a page that happens to have one.

*Fix:* Add `<Link href="/compare/">Compare</Link>` to the footer Data column alongside Providers and Aircraft. That single line closes the mobile gap without touching the header layout (which is already tight at 320px, see the nav-overflow finding).

**[medium] The hero proof screenshot is unreadable at mobile widths on both the home and extension pages**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/page.tsx:76-80 and /Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/chrome-extension/page.tsx:63-67

/screenshot-results.jpg is a 1067x642 desktop capture of a full Google Flights results table rendered with `className="w-full"` into a 348 CSS px box — a 0.326x scale. The verdict chips it exists to demonstrate ('Email & browsing', 'Varies by aircraft', 'Not on every aircraft') end up roughly 4 CSS px tall. Re-rendering the source at exactly 348px and magnifying 3x back (crops/hero_at_mobile_css_3x.png) shows the chip text is already at the legibility edge at 3x, so at actual mobile size it is a grey smear. Both pages put this image directly under the primary CTA as the single piece of proof that the product does what the headline claims. On /chrome-extension/ it also has no caption, so nothing recovers the meaning in text (home at least captions it 'A live Delhi to London search with the extension installed').

*Fix:* Ship a second, cropped asset for small screens: two or three flight rows with the chips at near-native scale, swapped in via `<picture>`/`media` (or a `sm:hidden` / `hidden sm:block` pair of `<Image>` tags). Add the home page's caption line under the /chrome-extension/ image as well.

**[low] The two comparison tables on /compare/* have different column widths, so they cannot be read against each other on a phone**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/compare/[slug]/page.tsx (tables rendered via components/airline.tsx:10)

On /compare/united-vs-delta/ at 390px the United table's column boundaries fall at x=95 and x=246 inside the scroller, the Delta table's at x=169 and x=402 — auto table layout sizes each independently from its own cell content. Each table is its own scroll container, so the reader must horizontally scroll table A, remember the value, scroll table B to a different offset, and compare from memory. On desktop the two tables at least align visually within one viewport; on mobile the misalignment plus independent scrolling removes the side-by-side affordance entirely, which is the whole premise of the page ('Same route, different metal. The tables below are the two carriers' live registry entries').

*Fix:* Add `table-layout: fixed` with shared `<col>` widths for the compare page's tables so both render identical column geometry, and consider syncing their scrollLeft (or merging them into one three-column table with a carrier column) so one swipe moves both.

**[low] Horizontal table scrollers can trigger the browser's back-swipe gesture**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/globals.css:103-106

`.scroller { overflow-x: auto; -webkit-overflow-scrolling: touch; }` with no `overscroll-behavior-x`. Because these scrollers start at scrollLeft 0 and hold 640px of content in a 348px box, the natural first gesture is a right-to-left swipe — but any overshoot back to the left edge chains to the document and fires the iOS Safari / Chrome Android back-navigation gesture, taking the reader off the page mid-table. Every content page except /chrome-extension/ and /methodology/ has at least one of these.

*Fix:* Add `overscroll-behavior-x: contain;` to the `.scroller` rule.

**[low] Footer and article table-of-contents links are 17-20px tall at 24-26px pitch**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/components/chrome.tsx:61-77 and /Users/priyansh/Desktop/NowOrNever/flightwifi/web/components/ArticleSectionNav.tsx

Measured at 390px: footer links are 20px tall on a 26px vertical pitch (`grid gap-1.5`); the blog 'On this page' links are 17px tall on a 24px pitch. Both sit exactly at the WCAG 2.2 SC 2.5.8 spacing-exception floor of 24px with no margin, and both are well under the 44px Apple / 48px Material comfortable-thumb target. The footer is the only mobile route to Providers, Aircraft, Methodology and Open data, so mistaps there are costly. Elsewhere the site is fine: FAQ `<summary>` rows are 53-79px, directory cards ~46px, the search input 52px, and the search input's 16px font size correctly avoids iOS focus zoom.

*Fix:* Raise the footer column gap to `gap-3` and the TOC list spacing to ~32px pitch, or give each link `py-1.5 -my-1.5` so the hit box grows without changing visual rhythm.

### ui-visual

**[high] Compare pages: both fleet tables are clipped mid-word at desktop widths**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/compare/[slug]/page.tsx:94 + /Users/priyansh/Desktop/NowOrNever/flightwifi/web/components/airline.tsx:10 + /Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/globals.css (.scroller > table) — region: the two-up card grid on all 6 /compare/* pages

Section wraps the grid in max-w-5xl px-5 = 984px of content; `grid gap-8 lg:grid-cols-2` gives each Side a 476px column; `.scroller > table { min-width: 640px }` forces every FleetTable 164px wider than its card. In compare--united-vs-delta.jpg the SYSTEM column is cut mid-word ("1,000 targe", "complete by summe", "Viasat/Panasonic on unconverte", Delta's "Viasat (D"), and in compare--british-airways-vs-virgin-atlantic.jpg the same ("on most aircraf", "on five Bo", "Starlink live on the A350s, Viasa", "fleet-wide by e"). The cards' right borders are missing because the table overflows the rounded edge, and macOS overlay scrollbars give no affordance that the content scrolls. All 6 vs pages are affected.

*Fix:* Do not apply the 640px floor inside the two-up grid: either give the compare tables a variant (e.g. `.scroller--fluid > table { min-width: 0 }`) so the SYSTEM cell wraps like it does on airline pages, or stack the two Side cards vertically (drop lg:grid-cols-2) since two 640px tables plus a 32px gap need ~1312px of content width, which max-w-5xl never provides.

**[medium] Verdict legends disagree with each other and omit three shipped chips**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/page.tsx:10-16 (home, "Every flight gets one of six honest verdicts") vs /Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/chrome-extension/page.tsx:90-98 ("Verdicts it shows")

Home renders 6 verdicts as description cards; /chrome-extension renders 7 as bare pills (it adds "Fast, but no calls"). Neither legend contains "Fast enough for calls" or "Voice calls only", yet the built site ships those chips on 12 and 4 pages respectively (e.g. providers/starlink VERDICT column, airlines/virgin-atlantic fleet table). A reader who meets a green "Voice calls only" chip has no legend anywhere that explains it, and the two explainer sections present the same system in two different visual formats with two different counts.

*Fix:* Drive both legends from one shared list of the settled vocabulary, render them in the same format (cards or pills, not one of each), and update the home heading so it no longer hardcodes "six".

**[medium] Footer is not pinned to the bottom, so short pages end in dead space**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/layout.tsx:28 (`<body className="min-h-screen antialiased">`, `<main>` has no flex-1) — region: below the footer on 404, /about, /privacy, /blog

404.jpg is exactly 1440x900, i.e. the document is only as tall as the viewport because of min-h-screen. The footer's top border lands at y~502 and its last link row ends at y~760, leaving ~140px of empty background under the footer. about.jpg is 944px tall and blog.jpg 1107px, so the same gap appears on any viewport taller than those. The footer has no background of its own (mt-16 + border-t only), so it reads as a stranded band floating above nothing.

*Fix:* Make the shell a column: `<body className="flex min-h-screen flex-col antialiased">` with `<main className="flex-1">`.

**[medium] Long-form pages have three different left edges**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/components/ui.tsx:39 (Breadcrumbs, max-w-5xl) vs /Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/blog/[slug]/page.tsx:162, /Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/methodology/page.tsx:18,21, /Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/about/page.tsx:17,20, /Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/privacy/page.tsx:14,18 (max-w-[46rem])

Breadcrumbs centre a 1024px column while the article centres a 736px column, so at 1440px the breadcrumb sits at x=229 and the H1/body at x=372 — a 143px step. Measured in about.jpg ("Home / About" at 229, "About FlightWifi" at 372), methodology.jpg, and blog--which-airlines-have-starlink.jpg, where the trailing FAQ block and CTA card snap back to x=229 while the article stays at 372, giving one page three competing left edges. Every other template aligns everything to 229.

*Fix:* Wrap the whole prose page (breadcrumb, header, article, FAQ, CTA) in a single max-w-[46rem] column, or left-align the reading column inside the max-w-5xl gutter instead of centring it.

**[medium] Aircraft pages truncate the SYSTEM column mid-sentence with 200px of unused width**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/lib/derive.ts:226 (`clip(typed.provider ?? "", 120)`) — region: SYSTEM column on /aircraft/* pages, e.g. aircraft--boeing-787.jpg

16 of the ~40 rows on /aircraft/boeing-787/ end in an ellipsis: EgyptAir ("...AeroMobile, a Panasonic subsidiary, handles onboard…"), LATAM ("Amara's LEO…"), Royal Jordanian ("E2 jets were first to fly…"), Qantas ("ViaSat-3…"), China Airlines ("the connectivity supplier has…"), TAAG ("at any stage of the flight';…"). The column is ~580px wide, rows already wrap to two lines, and the table is full-width here, so nothing in the layout forces the cut — the clipped tail is exactly the caveat the page exists to convey.

*Fix:* Raise or drop the 120-char clip for the aircraft template (keep it for the narrower in-article blog table at app/blog/[slug]/page.tsx:111), since the cell wraps freely at this width.

**[medium] Verdict chip styles are reused for status/price values, one of them in the wrong colour**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/page.tsx:122 (home "Starlink, as actually installed" STATUS column), /Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/starlink/page.tsx (FREE? column), /Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/blog/[slug]/page.tsx:105 (in-article table)

Built HTML: index.html contains `<span class="v v-fast">in service</span>` x7 and `<span class="v v-ok">partial</span>`; starlink/index.html contains `v v-fast">Free` x31 and `v v-part">Paid tiers` x9; the blog post contains `v v-ok">Rolling out`. Two problems. (a) "in service" and "partial" are lowercase while every other chip on the site is sentence case, so the home page shows lowercase pills two sections below sentence-case verdict chips. (b) "partial" is painted v-ok blue, the identical blue used for the "Email & browsing" verdict, even though the amber v-part class is exactly the partly-true colour and is used for "Paid tiers" one page away. The same green therefore means "fast", "in service" and "free" depending on the table.

*Fix:* Give status and price pills their own neutral chip class so the five verdict colours keep one meaning site-wide; at minimum capitalize the labels and map "partial" to v-part.

**[medium] Four different green chips share one column, including the one that states a restriction**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/globals.css:70 (.v-fast) — region: VERDICT column on providers--starlink.jpg, and the "Verdicts it shows" row on chrome-extension.jpg

providers/starlink/index.html renders v-fast for "Fast enough for calls" (1), "Fast, but no calls" (3), "Video calls work" (2) and "Voice calls only" (1). Colour therefore carries no information down that column: Air Canada's "Fast, but no calls" is the same green as airBaltic's "Video calls work". On /chrome-extension those two labels sit adjacent in the legend in identical green, which makes the section that is supposed to teach the palette the clearest demonstration that it does not encode anything.

*Fix:* Reserve green for the permissive labels and move "Fast, but no calls" (and arguably "Voice calls only") to the amber v-part treatment, or add a secondary cue (dot/icon) so a scanner can tell the restricted ones apart at a glance.

**[low] Fleet table AIRCRAFT column collapses to min-content and wraps two-word values**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/components/airline.tsx:22 (FleetTable first cell) + /Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/globals.css (th,td) — region: "Verdict by aircraft" table on airline pages

In airlines--emirates.jpg the single row's scope "Whole fleet" breaks onto two lines, and in airlines--virgin-atlantic.jpg "Rest of fleet" does the same. Auto table layout hands almost all of the 982px row to the long SYSTEM string and squeezes column 1 down to the width of the "AIRCRAFT" header, so a 11-character value wraps while ~400px of the row is unused whitespace in the Emirates case.

*Fix:* Add `white-space: nowrap` (or a min-width) to the first column of the fleet table, as the blog's Starlink table already does with `whitespace-nowrap` on its airline cell.

**[low] Hero screenshot asset is cropped mid-row**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/public/screenshot-results.jpg (1067x642) — region: hero figure on home.jpg and chrome-extension.jpg

The asset itself ends part-way through the final result row: the Air India / $399 row has its top half only, with the row's bottom padding and the results container's bottom border missing. Inside the rounded `.card overflow-hidden` frame the flight list appears to be sliced off rather than deliberately cropped, on the single most prominent image on the site (used twice).

*Fix:* Re-crop the source screenshot to end on a row boundary, or shorten the frame and add a soft bottom fade so the cut reads as intentional.

**[low] Top nav gives no current-page indication**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/components/chrome.tsx:24-30 — region: header on every page

Every NAV entry is rendered with the same `text-[var(--muted)]` class and there is no pathname check or aria-current anywhere in the component, so on airlines.jpg, starlink.jpg and blog.jpg the link for the page you are on looks identical to the other five. The only emphasized item is the always-on "Extension" pill, so the header never reflects position.

*Fix:* Compare the pathname per link and give the active one `text-[var(--ink)]` plus `aria-current="page"`.

**[low] Blog index is the only hub page missing the closing CTA**  
/Users/priyansh/Desktop/NowOrNever/flightwifi/web/app/blog/page.tsx — region: bottom of blog.jpg

Grepping the built output for "See these verdicts while you book": present in index.html, airlines/, starlink/, aircraft/, providers/, compare/ index pages; absent from blog/index.html. Visually the page stops after three cards at y=728 and hands straight to the footer, so the template's usual closing block is simply gone on the one hub with the most empty vertical space.

*Fix:* Add `<Cta />` before the footer on /blog to match every other index page.
