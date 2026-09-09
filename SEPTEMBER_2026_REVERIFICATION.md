# September 2026 re-verification of the airline Wi-Fi registry

Checked 5 September 2026. Registry `as_of` was 2026-08 on all 235 entries.

Scope: the 40 Starlink airlines (19 flying, 21 announced), the 54 entries whose text names a date on or before September 2026, and a sweep of the other providers (Viasat, Panasonic, SES/Intelsat, Amazon Leo, Hughes, OneWeb). Official airline and provider pages first, trade press for corroboration. Third-party rollout trackers are noted where they are the only source of a number, and are not treated as verification.

The sitewide "last verified" label is the newest `as_of` in the registry (`stats().asOf` takes the max), so it flips to 2026-09 as soon as one entry moves. Per-airline pages carry their own date. Only entries actually re-checked below should move.

Source of truth is `extension/data/registry.js`; `web/scripts/gen-data.mjs` regenerates `web/public/data.json` before every build.

---

## A. Status changes

### LH Lufthansa: Starlink announced → flying
- First Starlink passenger flight 19 August 2026, LH234 Frankfurt–Rome, A320neo D-AINM.
- Up to ten more A320-family aircraft at Lufthansa and Lufthansa City Airlines by end of 2026. Around 850 Lufthansa Group aircraft by 2029.
- Free for Miles & More customers and Travel ID users in every travel class. No pricing published for others.
- SWISS, Austrian and Brussels Airlines are "next"; ITA, Edelweiss, Discover, Air Dolomiti, Lufthansa City Airlines and Eurowings are "preparing". No dates given for any of them.
- Sources: [Lufthansa Group newsroom, 19 Aug 2026](https://newsroom.lufthansagroup.com/en/lufthansa-takes-off-with-starlink-high-speed-internet-for-the-first-time/) · [Lufthansa Group, 10 Aug 2026](https://newsroom.lufthansagroup.com/en/lufthansa-group-launches-free-high-speed-internet-from-starlink/)

### KE Korean Air / OZ Asiana: stays announced, launch is "this month"
- Seoul Economic Daily, 4 Sep 2026: Korean Air "will begin phasing in Starlink-based in-flight Wi-Fi this month" on the 777-300ER and A350-900, free in every seat, fleetwide by end of 2027.
- LoyaltyLobby, 2 Sep 2026: the group "has started to roll out Starlink hardware to its aircraft starting September 1st".
- No source confirms a revenue flight with Starlink switched on as of 5 September. Do not flip to flying yet. Re-check in two weeks.
- The registry's current "hardware installing since Jul 2026" line is not supported by any source found; the group's own framing is installation from September.
- Sources: [Seoul Economic Daily, 4 Sep 2026](https://en.sedaily.com/finance/2026/09/04/korean-air-to-offer-free-starlink-wi-fi-on-long-haul) · [LoyaltyLobby, 2 Sep 2026](https://loyaltylobby.com/2026/09/02/korean-air-group-airlines-rolling-out-free-starlink-internet-from-september-1-2026/) · [Korea Herald](https://www.koreaherald.com/article/10630658)

---

## B. Claims that were wrong or have expired

### BR EVA Air: free-browsing promotion ends 31 October, not 31 August
- EVA's own connectivity page: "from now to October 31, 2026, passengers can enjoy complimentary full-flight Unlimited Web Browsing" on 787, 777-300ER and A330-300 (Panasonic). No video streaming, voice calls, VPN or video conferencing.
- From 1 November 2026: Business Class gets Unlimited Web Browsing for everyone; in Economy, Diamond/Gold get Unlimited Web Browsing, Silver and Green get Unlimited Text, non-members get nothing free.
- Registry says the promotion covers "some routes until 31 Aug 2026". Wrong date and wrong scope.
- Source: [EVA Air connectivity page](https://www.evaair.com/en-global/fly-prepare/flying-with-eva/inflight-entertainment-service/connectivity-and-power/)

### KQ Kenya Airways: July 2026 launch did not happen, slipped to Q2 2027
- allAfrica, 26 Aug 2026: one 777-300ER has Wi-Fi hardware fitted but is waiting on a connectivity slot; nothing is live. Installation across the long-haul fleet now starts Q2 2027 (London, Paris, New York, China, Amsterdam first). Total cost US$20–22M.
- Registry says "as of mid-August 2026 there is no confirmation the service is actually live". Now confirmed not live, with a new date.
- Source: [allAfrica, 26 Aug 2026](https://allafrica.com/stories/202608260278.html)

### QF Qantas: ViaSat-3 F3 switch-on happened
- Registry: "ViaSat-3 F3 APAC switch-on targeted Sep 2026". Viasat announced F3 entered service across Asia-Pacific on 31 August 2026.
- Source: [Viasat via GlobeNewswire, 31 Aug 2026](https://www.globenewswire.com/news-release/2026/08/31/3353252/0/en/viasat-3-f3-satellite-enters-service-across-asia-pacific.html)

### RS Air Seoul: "installation from Q3 2026" is not supported
- Korea Herald on the Hanjin deal: Jin Air will equip its 737-8s first; Air Busan and Air Seoul "will review" their fleets to decide installation priority. No Q3 2026 date for Air Seoul.
- Source: [Korea Herald](https://www.koreaherald.com/article/10630658)

---

## C. Same verdict, numbers moved

### QR Qatar Airways (official, 20 Aug 2026)
- 150 Starlink-equipped widebodies. 777, A350 and 787-8 programmes complete (787-8 done in seven months). First Starlink 787-9 in service; more than half the 787 fleet equipped; 787 fleet complete by end of 2026. Programme past 83% of the widebody fleet. Up to 323 Starlink flights a day; 23M passengers connected since October 2024.
- Registry is close ("787-9 fitting under way, world first, August 2026") but should now say the 787-9 is in service and give the 150 / 83% figures.
- Source: [Qatar Airways newsroom, 20 Aug 2026](https://www.qatarairways.com/press-releases/en-WW/269475-qatar-airways-150-starlink-equipped-widebody-aircraft-now-include-world-s-first-starlink-equipped-boeing-787-9/)

### SK SAS (official, 1 Sep 2026)
- All 81 A320neos equipped, six months after the March launch. Widebodies and regional types scheduled before the end of 2026. Free for EuroBonus members via 3.
- Source: [SAS press releases, 1 Sep 2026](https://www.sasgroup.net/newsroom/press-releases/)

### GF Gulf Air (secondary, 3 Sep 2026)
- Six aircraft equipped, all A320neo family, about 75% of the A320neo fleet, roughly 1,000 Starlink flights a month. 787-9s still on the legacy Falcon Wi-Fi pending certification.
- Sources cite Gulf Air social posts, not a press release. Update the text, keep `needs_verification`.
- Sources: [TTN](https://www.ttnworldwide.com/ArticleTA/467516/gulf-air-equips-75pc-of-a320neo-fleet-with-starlink-connectivity) · [The Traveler, 3 Sep 2026](https://www.thetraveler.org/gulf-air-expands-starlink-wi-fi-across-a320neo-fleet/)

### UA United
- Official (23 Jun 2026): "more than 400" equipped, "close to 1,000 by year-end", widebodies complete summer 2027.
- Public trackers late Aug / 4 Sep: 540–555 equipped. Registry's "about 522 as of mid-Aug 2026" is the same kind of figure. Keep the tracker count only if you are comfortable with that provenance; the official number is "more than 400 as of June".
- Sources: [Aerospace Global News, 23 Jun 2026](https://aerospaceglobalnews.com/news/united-starlink-1000-aircraft-end-2026/) · [unitedstarlinktracker.com](https://unitedstarlinktracker.com/)

### Checked, no newer official figure, registry text still correct
- **EK Emirates**: 33 × 777 and 3 × A380 as of 2 July 2026, about 14 aircraft a month, all 232 by mid-2027. No newer Emirates release. ([Emirates, 2 Jul 2026](https://www.emirates.com/media-centre/one-million-connections-and-counting-emirates-customers-embrace-starlink-wi-fi/))
- **AF Air France**: nearly 60% of the fleet by June, fleetwide by end of 2026. ([OMAAT](https://onemileatatime.com/news/air-france-free-starlink-wi-fi/))
- **BA British Airways**: five 787-8s, installations paused until the end of October 2026, then seven more 787-8s and the 18 787-9s. A tracker's "all 12 787-8s" contradicts BA's own pause and should be ignored. ([Simple Flying](https://simpleflying.com/british-airways-suspends-starlink-installations-later-this-year/))
- **AS Alaska / HA Hawaiian**: E175s complete, 737 retrofits under way, 787-9s "this fall", about 150 aircraft across the combined fleet per the July release. ([Alaska newsroom](https://news.alaskaair.com/guest-experience/atmos-rewards-members-unlock-free-inflight-wi-fi-on-alaska-hawaiian-airlines-thanks-to-t-mobile/))
- **VS Virgin Atlantic**: A350s done 2 June; 787-9s in H2 2026 with two-thirds by year-end; A330neo through 2027. ([Virgin Atlantic corporate](https://corporate.virginatlantic.com/gb/en/media/press-releases/wi-fly-update-virgin-atlantic-accelerates-starlink-rollout-for-take-off.html))
- **CM Copa**: first aircraft 4 July (HP-9901CMP, 737 MAX 9), fleet complete Q1 2027. ([Copa](https://www.copaair.com/en-gs/news/copa-airlines-redefines-onboard-connectivity-in-latin-america-with-starlink/))
- **IB Iberia**: one aircraft (A330 EC-MAA, 23 June), 35% of long-haul by end of 2026. ([Iberia](https://grupo.iberia.com/news/24062026/iberias-first-aircraft-with-free-high-speed-starlink-wi-fi-takes-off))
- **EI Aer Lingus**: CAPA puts long-haul completion at Q1 2027; registry says end of 2026. Minor; keep, or soften to "by early 2027". ([CAPA](https://centreforaviation.com/news/aer-lingus-launches-first-aircraft-equipped-with-starlink-1353510))
- **AC Air Canada**: Starlink on 25 Dash 8-400s only; mainline is Intelsat/Bell. Registry already says so.
- **WN Southwest**: first aircraft 22 June, 300 by end of 2026. No public count since.
- **JQ Jetstar**: Viasat Amara on 787s since April 2026, 11 aircraft through mid-2027. ([Viasat](https://www.viasat.com/news/latest-news/aviation/2026/jetstar-selects-viasat-inflight-connectivity-long-haul-international-routes/))

---

## D. Announced airlines confirmed still future

All start in 2027 or have no date. Registry text is already correct; only `as_of` moves.

| Code | Airline | Confirmed | Source |
|---|---|---|---|
| AA | American | 500+ Airbus narrowbodies from Q1 2027 | [AA newsroom](https://news.aa.com/news/news-details/2026/American-to-install-Starlink-the-fastest-Wi-Fi-in-the-sky-MKG-OB-05/default.aspx) |
| SQ | Singapore | 53 aircraft (A350-900 LH/ULR, A380) from Q1 2027, free | [SIA](https://www.singaporeair.com/en_UK/sg/corporate/newsroom/press-release/2026/april---june-2026/sia_starlink/) |
| F9 | Frontier | first aircraft early 2027 | [Frontier](https://news.flyfrontier.com/frontier-airlines-to-offer-starlink-the-fastest-wifi-in-the-sky/) |
| W6 | Wizz Air | neo fleet from 2027 | [RTE](https://www.rte.ie/news/business/2026/0608/1577345-wizz-air-to-offer-starlink-internet/) |
| LY | El Al | from 2027, free | [Runway Girl](https://runwaygirlnetwork.com/2026/06/el-al-to-roll-out-starlink-inflight-wi-fi-starting-in-2027/) |
| Y4 / JA / 5J | Volaris, JetSMART, Cebu Pacific | Indigo Partners group, from 2027 | [PR Newswire](https://www.prnewswire.com/apac/news-releases/cebu-pacific-to-become-southeast-asias-first-low-cost-airline-to-introduce-starlink-the-fastest-wi-fi-in-the-sky-302824918.html) |
| VJ | Vietjet | no date | as before |
| FZ | flydubai | no in-service aircraft found; Nov 2025 announcement still the latest | [flydubai](https://news.flydubai.com/flydubai-announces-starlink-as-its-inflight-connectivity-partner) |
| LX / OS / SN | SWISS, Austrian, Brussels | "next" after Lufthansa, no dates | LH Group, 10 Aug 2026 |
| AZ / EW | ITA, Eurowings | "preparing", no dates | LH Group, 10 Aug 2026 |
| WK | Edelweiss | first new-cabin A350 with Starlink December 2026 | [Edelweiss newsroom](https://newsroom.flyedelweiss.com/en/more-space-to-feel-good-edelweiss-presents-the-new-cabin-in-the-airbus-a350/) |
| LJ | Jin Air | 737-8s first after Korean Air long-haul | Korea Herald |

Other dated claims confirmed unchanged: **PK** (PTA consultation closed 31 May 2026, no licence), **BC** Skymark (no activation announced), **CI** China Airlines (787s: complimentary Wi-Fi for Business and Premium Economy, supplier still unconfirmed), **AI** Air India (Hughes from 2027, 787-8s by late 2027), **6E** IndiGo (none; A321XLR trial pending).

---

## E. Gaps in the registry

1. **BX Air Busan has no Starlink flag.** It is one of the five Hanjin airlines in the December 2025 deal. Add `starlink: { status: "announced", access: "free" }` and a line in the rule text.
2. **DL Delta has no mention of Amazon Leo.** Delta signed 31 March 2026 for an initial 500 aircraft from 2028, free for SkyMiles members. Not a verdict change, but the page should say it. ([Delta News Hub](https://news.delta.com/delta-amazon-leo-sign-agreement-deliver-next-era-connected-travel-and-digital-experiences))
3. **B6 JetBlue still says "Amazon Project Kuiper".** The service is now branded Amazon Leo; rollout still 2027.

---

## F. Not re-checked

Roughly 185 entries with no Starlink involvement and no dated claim were not opened. They keep `as_of: 2026-08`. Also unchanged from the earlier finding: `isOfficial()` still labels `unitedstarlinktracker.com` and a handful of news domains as the airline's own pages.

---

## G. Proposed registry edits

Exact replacement strings. `as_of` moves to `2026-09` on every entry in this section and on every entry in section D.

**LH**
- `starlink.status`: `flying`
- rule provider: `FlyNet (GEO) on most aircraft; Starlink in passenger service since 19 August 2026 (first aircraft A320neo D-AINM, LH234 Frankfurt-Rome), up to ten more A320-family aircraft at Lufthansa and Lufthansa City Airlines due by end of 2026, around 850 group aircraft by 2029`
- access: `Messaging and tiered paid packages on FlyNet aircraft; Starlink is free for Miles & More and Travel ID users in every class on fitted aircraft`
- sources: add the two Lufthansa Group URLs above

**QR**
- 787 rule provider: `787-8 sub-fleet fully equipped (completed in seven months); first Starlink 787-9 in service, more than half the 787 fleet equipped and the type due to complete by end of 2026; Inmarsat GX/SITA OnAir until fitted`
- rest-of-fleet rule provider: `Starlink on 150 widebodies as of 20 August 2026: the 777, A350 and 787-8 programmes are complete and more than 83% of the widebody fleet is connected`
- sources: add the Qatar newsroom URL

**KE**
- A350 rule provider: `Panasonic, paid GEO wifi live; Starlink installation under way, with Korean Air saying passenger service starts in September 2026 on the 777-300ER and A350-900, free in every seat; not confirmed live as of 5 September 2026`
- keep `starlink.status: announced`, keep `needs_verification`

**OZ**
- A350 rule provider: `Panasonic Avionics; Starlink is being installed on the 777-300ER and A350-900 first alongside Korean Air, with group service due from September 2026; no Asiana aircraft confirmed live yet`

**LJ**
- rule provider: `none in service; Starlink announced December 2025 under the Hanjin Group deal, with Jin Air's Boeing 737-8s first in line after Korean Air's long-haul fleet`

**RS**
- rule provider: `None in service; Starlink announced December 2025 across the Hanjin/Korean Air group; Air Seoul's installation order is still to be decided (the group says Air Busan and Air Seoul will review their fleets), completion targeted by end of 2027`

**BX** (new Starlink flag)
- `starlink: { status: "announced", access: "free" }`
- rule provider: `None in service; Starlink announced December 2025 under the Hanjin Group five-airline deal, with Air Busan's installation timing still to be decided`
- access: `No inflight internet today; the group Starlink product is to be free once fitted.`
- sources: add Korea Herald

**BR**
- access: `Since 1 October 2025 wifi is complimentary for Business Class and Diamond/Gold Infinity MileageLands members and paid otherwise (from about US$2 for 30 minutes up to US$39.95 for 1GB). A limited-time promotion gives every passenger complimentary full-flight Unlimited Web Browsing until 31 October 2026 (no video streaming, calls or VPN). From 1 November 2026 Business Class keeps unlimited browsing for everyone; in Economy, Diamond/Gold get unlimited browsing, Silver and Green get unlimited text, non-members pay.`
- sources: add the EVA connectivity page

**KQ**
- access: `No inflight Wi-Fi in service. The Nairobi-London launch promised for July 2026 did not happen: one 777-300ER has the hardware fitted but is waiting on a connectivity slot, and Kenya Airways now says installation across the long-haul fleet starts in Q2 2027 (London, Paris, New York, China and Amsterdam routes first) at a cost of US$20-22M; pricing and provider undisclosed.`
- keep `needs_verification`; sources: add allAfrica

**QF**
- widebody rule provider: `Viasat/ViaSat-3 Ka international; 787 fleet complete July 2026, A380 retrofits underway into early-mid 2027; ViaSat-3 F3 (Asia-Pacific) entered service 31 August 2026; A380s still largely unequipped`
- sources: add the Viasat release

**SK**
- rule provider: `Starlink live since March 2026; all 81 A320neos equipped as of 1 September 2026, with the A330/A350 widebodies and regional types scheduled before the end of 2026; legacy Viasat/Panasonic/GX until converted`
- sources: add the SAS release

**GF**
- rule provider: `Starlink, progressive fleet rollout (first aircraft May 2026; six A320neo-family aircraft equipped, about 75% of the A320neo fleet, as of early September 2026); 787-9s still on the legacy Falcon Wi-Fi pending certification; a given flight may not be fitted yet`
- keep `needs_verification`

**UA**
- rule provider: `Starlink rollout underway (United said more than 400 aircraft in June 2026 and close to 1,000 by end of 2026; public trackers count roughly 540 in late August; widebodies complete by summer 2027); legacy Viasat/Panasonic on unconverted tails`

**VS**
- 787 rule provider: `Viasat; Starlink retrofits from H2 2026 with two-thirds of the 787-9s due by end of 2026, no 787 in Starlink service confirmed yet`

**BA**
- rule provider: `Legacy GEO wifi on most aircraft; Starlink in service since 19 March 2026 on five Boeing 787-8s (installations paused for summer, resuming end of October 2026 with the remaining seven 787-8s, then the 18 787-9s), free in every cabin on equipped aircraft`

**CI**
- 787 rule provider: `787s entering service from June 2026 offer complimentary Wi-Fi to Business and Premium Economy passengers across the 24-jet order; the connectivity supplier has not been confirmed`

**DL** (new rule)
- add rule: `{ fleet: "rollout", orbit: "mixed GEO/LEO", provider: "Amazon Leo LEO agreed 31 March 2026 for an initial 500 aircraft with installation from 2028, free for SkyMiles members; Viasat GEO until then" }`
- sources: add Delta News Hub

**B6**
- rule provider: replace `Amazon Project Kuiper LEO` with `Amazon Leo (formerly Project Kuiper) LEO`

**as_of only** (text unchanged): EK, AF, AS, HA, CM, IB, AC, WN, EI, JQ, AA, SQ, F9, W6, LY, Y4, JA, 5J, VJ, FZ, LX, OS, SN, AZ, EW, WK, PK, BC, AI, 6E.

Total entries moving to 2026-09: 48.
