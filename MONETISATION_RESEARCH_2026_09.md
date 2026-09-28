# How FlightWifi could make money

Written 21 September 2026. Seven parallel research threads (flight affiliates, connectivity
affiliates, data licensing, consumer subscriptions, advertising, precedents, demand sizing) plus
first-party measurement from Search Console, the Chrome Web Store and the live site.

Claims are marked **verified** where a primary source states them, **reported** where only
secondary sources do, and **estimate** where the number is constructed from assumptions. No
revenue figure in this document is a promise.

---

## The short answer

Nothing monetises at today's scale, and the gap is not small: every revenue model examined needs
between 50x and 1,000x the current audience to clear $1,000 a month. The useful output of this
research is therefore not "pick a model", it is:

1. **One revenue line is joinable today and costs nothing to start**: eSIM affiliate links on the
   website only. It earns pennies now and roughly $125-500 a month at 50,000 sessions.
2. **The cheapest growth available is already in the Search Console**: 463 queries rank at
   positions 4-10 and convert at 0.43%. Fixing that is a 5x on clicks with no new content and no
   new links.
3. **The question the product answers has a clock on it.** For US majors the "does it have Wi-Fi"
   framing has 12-18 months left. The "is it fast enough to work on" framing has 3-5 years.
4. **Two of the obvious paths are closed by policy, not by scale**, and no amount of growth opens
   them: flight affiliates inside the extension, and enterprise amenity-data licensing.

---

## 1. The numbers this has to survive

All measured on 20-21 September 2026 from first-party data.

| | value | source |
|---|---|---|
| Site impressions, 7 days (7-13 Sep) | 8,852 | GSC export |
| Site clicks, same week | **51** | GSC export |
| Site CTR | 0.58% | GSC export |
| Median position | 10.5 | GSC export |
| Clicks at positions 4-10 | 9, from 2,070 impressions (**0.43%**) | GSC export |
| Monthly run rate | ~38,000 impressions, ~220 clicks | derived |
| Google AI-surface impressions, 28 days | 737, no clicks column exists | GSC AI-features export |
| Top country split | US 1,910 / UK 818 / CA 647 / NL 343 / IN 299 impressions | GSC export |
| Query mix | 36% "does X have wifi", 6% mention price or cost | GSC, top 1,000 queries |
| Pages earning impressions | 230, of which 194 airline pages (94% of impressions) | GSC export |
| Extension users | **47** (was 15 on 13 Sep) | Chrome Web Store listing |
| GetStopover extension users | 25 | Chrome Web Store listing |
| Dataset | 235 airlines, 326 sub-fleet rules, 158 sourced, 662 source URLs | registry.js |
| Flight-number checker | **dark**: `/api/flight/` returns `{"error":"unavailable"}` | live request |

Two self-imposed constraints, both reversible but not free:

- The privacy page states "no advertisers, because there are none" and promises cookieless
  analytics. Display advertising contradicts both.
- The standing rule is that extension links never carry affiliate tags. Chrome Web Store policy has
  since made that rule mandatory anyway (see §3.1).

---

## 2. The finding that reframes the question

**The pages rank and are not clicked.** 463 queries sit at positions 4-10 and returned nine clicks
from 2,070 impressions. A normal CTR in that band is 2-9%. The site is not failing to rank, it is
failing to be clicked, by a factor of roughly ten.

The query mix explains it: 36% of queries are of the form "does *X* have wifi", which is exactly
the shape Google now answers in the result page itself. The AI-features export shows 737
impressions in 28 days and has no clicks column at all, because these surfaces do not report
clicks.

This matters more than any commission rate, because **advertising and affiliate revenue both
depend on the click channel that is closing for this query family.** Any plan that assumes
"grow SEO traffic, then monetise it" is betting against the direction of the channel.

---

## 3. Path by path

### 3.1 Flight affiliates: closed by policy

- **Travelpayouts** (Aviasales, Kiwi, WayAway, Trip.com) bans toolbar traffic in its own referral
  terms unless directly permitted. **verified**, support.travelpayouts.com.
- **Skyscanner's** affiliate programme, on Impact, excludes "coupon / discount / network /
  subnetwork / market performance agencies and technology partners". **verified**,
  partners.skyscanner.net.
- **Kiwi Tequila** API partnerships are invitation-only as of 2026. **reported**.
- **Kayak** is application-based; it does not publish commission or cookie terms. **verified** that
  they are unpublished.
- **Chrome Web Store affiliate-ads policy**, announced March 2025, enforced from 10 June 2025:
  an extension must not add, modify or replace affiliate links unless the programme is disclosed
  on the listing, in the UI and before install, *and* the user takes an action before any tag is
  applied, *and* the link carries a direct benefit at that moment. The policy's own violation
  example is "an extension that continuously injects affiliate links in the background without
  related user action". **verified**, developer.chrome.com. This was Google's response to the
  Honey/PayPal affiliate-overwrite scandal.
- Reported commissions, none company-confirmed: Aviasales ~1.1-1.3% of ticket price; Kiwi ~3%
  (~$13.50 on a $450 ticket); metasearch CPC $0.20-2.00 per click. No programme publishes an EPC
  for flight metasearch.

**Verdict: dead, at any scale, inside the extension.** On the website it is technically possible
but the traffic has informational intent (6% of queries mention price), so the conversion base is
weak. Not worth the disclosure burden.

### 3.2 eSIM affiliates: the one line joinable today

Joinable now, no traffic minimums, instant onboarding via Impact or Awin (**verified** from each
programme's own page, 21 Sep 2026):

| programme | commission | notes |
|---|---|---|
| Maya Mobile | 20% | Impact, aimed at travel creators |
| Saily (Nord Security) | 15% | Awin; no PPC, no paid social, no standalone email |
| Jetpac | up to 15% | plus free test data |
| Airalo | 10% | Impact, ~30-day cookie, the recognised brand |
| Holafly | 10-20% | **explicitly prohibits browser extensions** |
| Nomad, Ubigi, aloSIM, Yesim, GigSky | ~10% (aloSIM also flat $5) | cookie windows mostly unpublished |

Average order value is not published by any of them; market pricing for a single-country week-long
plan runs roughly $10-25, so a sale is worth **$1.50-4.00**.

No credible published RPM exists for eSIM affiliate traffic. Constructing one honestly: if 3-8% of
visitors on a relevant page click through and 1-5% of those buy, that is 0.03-0.4% of sessions
converting, or **$2.50-10 per 1,000 sessions (estimate)**. That is in the same band as display
advertising, without the privacy-page cost, the third-party scripts or the Core Web Vitals damage.

The honest placement is not "buy an eSIM for your flight", because an eSIM does nothing at 38,000
feet. It is "you are landing in Istanbul without data", on international airline pages and on the
no-Wi-Fi pages. Anything else reads as spam on a site whose entire value is being believed.

**Extension: closed.** Holafly bans extensions outright, and the June 2025 Chrome policy blocks
passive injection regardless of any programme's terms.

### 3.3 Inflight Wi-Fi providers: confirmed dead end

Gogo, Viasat, Panasonic Avionics, Anuvu, Intelsat and Starlink Aviation sell to airlines, not to
passengers, and run no consumer affiliate or referral programmes. No airline pays for Wi-Fi
day-pass referrals. The nearest thing is a credit-card perk (United's card refunds 25% of Wi-Fi
charges), which is not a referral mechanism. **verified** by checking each vendor.

Telecom sponsorship of inflight Wi-Fi is real money but operates at fleet scale: T-Mobile is the
presenting partner for Alaska and Hawaiian's free Starlink, AT&T sponsors American's free Wi-Fi
across ~90% of its fleet from January 2026. No financial terms are public, and these are airline
partnerships, not publisher deals.

### 3.4 Display advertising: not reachable, and it costs the privacy page

Entry bars, checked 21 September 2026:

| network | minimum | notes |
|---|---|---|
| Journey by Mediavine | 1,000 Tier-1 sessions/month (since 15 Jan 2026) | the lowest real bar |
| Monumetric | 10,000 pageviews | $99 setup below 80k |
| Raptive | 25,000 pageviews, 50% Tier-1 | lowered from 100k |
| Ezoic | 250,000 monthly users for new signups (**reported**, Feb 2026) | previously 10k |
| AdSense | no published minimum | approval is content-based |

Travel RPM is dominated by geography, not by network: US traffic is reported at $15-100+, India
and South-East Asia at $1-4 on the same content. Travel-specific reported RPMs are $18-26
(Raptive) and $14-22 (Mediavine) for majority-Tier-1 audiences.

Arithmetic for a blended audience (**estimate**): 10,000 sessions $50-100/month; 50,000
$400-750; 100,000 $1,000-1,800; 500,000 $6,000-10,000.

At 220 sessions a month the site does not qualify for the lowest tier in the market, and the
revenue would be under $2. Ads also cost the "no advertisers, because there are none" promise, part
of the 91/96 Lighthouse score, and arguably the clean-source positioning that gets a page cited by
AI answer engines.

**Verdict: revisit at 50,000 sessions, and even then compare against a single sponsor slot.**

### 3.5 Consumer subscription: the right feature, the wrong time

Every comparable tool charges for **alerts**, never for lookups. **verified** from each pricing
page: Flighty ~$48/year, ExpertFlyer $5.99-19.99/month tiered purely by alert volume (including
aircraft-swap alerts), Seats.aero Pro $9.99/month, point.me $12/month, AwardFares $9.99-19.99,
TripIt Pro $49/year, aeroLOPA's app $5/month, Flightradar24 $3-8/month.

Conversion reality: Chrome extension free-to-paid is documented at **0.5-2%**, not the 3.7% SaaS
median. One disclosed ExtensionPay rollout converted at 0.8% and made $31 MRR. At $3-8/month:
1,000 users is $15-160/month, 10,000 is $150-1,600, 100,000 is $1,500-16,000.

Chrome's own payments died in 2021; third-party paywalls are permitted if priced before install.
ExtensionPay takes 5% plus Stripe fees, Paddle 5% + $0.50 with tax handled.

The alerting feature itself is cheap: **AeroDataBox is already integrated in this codebase** and
costs $5.35/month at the Pro tier, with `aircraft.model` and `aircraft.reg` available on scheduled
flights. Airlines only finalise the airframe 48-72 hours out, so no API can beat that lead time.
Alternatives are worse: OAG starts at $249/month, Cirium is quote-only, Amadeus Self-Service shut
down entirely in July 2026.

Counter-evidence worth holding: App in the Air shut down in 2024 despite subscriptions plus
booking commissions, and only 17.2% of subscription apps industry-wide clear $1,000/month.

**Verdict: build aircraft-swap alerting now and give it away.** It is the only feature in this
category anyone pays for, it costs $5/month to run, and it is the reason someone would keep the
extension installed. Gate it only when there are 10,000+ engaged installs.

### 3.6 Data licensing: a real category, already consolidated

- **Routehappy** is the incumbent and, uncomfortably, the upstream: Google Flights' own Wi-Fi and
  power icons come from Routehappy's API. **verified**, and reconfirmed after the acquisition.
- ATPCO acquired Routehappy on 1 February 2018, its first acquisition in 53 years, terms
  undisclosed. Pre-acquisition it was profitable and monetised through airline and OTA
  subscriptions. **verified** (GlobeNewswire) plus **reported** (PaxEx.Aero) on the revenue growth.
- Amadeus and Sabre both signed agreements to redistribute Routehappy content. So OTAs and GDS
  channels already receive a Wi-Fi flag they consider paid for.
- Cirium and OAG have **no** dedicated inflight-connectivity product. That is a genuine gap, but
  it is a gap in the schedule aggregators, not in the market.
- No documented instance was found of a TMC, duty-of-care or expense tool buying third-party
  amenity data. The sale would be "displace something they already get bundled", which is the
  hardest kind.
- The one comparable independent product is **Valour Consultancy's IFC Tracker at £4,000/year**,
  sold to manufacturers and analysts, far coarser than per-sub-fleet mapping. **verified**. It
  proves four-figure annual pricing exists for structured connectivity data.
- Self-serve: a niche travel data API is reported at roughly $5 per 1,000 calls at low volume. No
  credible revenue figures exist for any niche aviation API on RapidAPI. Plausible ceiling is low
  four figures a month **at maturity**, and that is an estimate with no comparable behind it.
- AI licensing: OpenAI has ~24 announced publisher deals, Anthropic has disclosed none, Perplexity
  shares ad revenue with cited publishers. Nothing ties an inflight-Wi-Fi dataset to any lab deal.
  Datarade lists travel-data vendors and is a low-friction place to be listed.

**Verdict: enterprise licensing is not a path for a one-person product.** Listing the dataset on
RapidAPI and Datarade costs a day and creates a revenue floor plus inbound signal. Treat AI
licensing as free optionality, not a plan.

---

## 4. What each path needs to clear $1,000 a month

| path | requirement | multiple of today |
|---|---|---|
| eSIM affiliate (site) | 100,000-400,000 sessions/month | 450-1,800x |
| Display advertising | 55,000-100,000 sessions/month | 250-450x |
| Subscription at $4/month | ~250 subscribers = 12,500-50,000 engaged installs | 265-1,060x |
| Self-serve API | unknown; plausibly fewer users, unproven | n/a |
| Sponsorship (one slot) | an audience worth naming, realistically 25,000+ sessions | 110x |

Today: ~220 site clicks a month and 47 extension users.

The paths differ by a factor of four in difficulty, which is noise next to the factor of several
hundred that all of them share. **The monetisation question is a distribution question wearing a
disguise.**

---

## 5. What the competitors prove

Four sites answer the same question: willitwifi.com, seatwifi.com, starlinkflights.com and
airlinestarlinktracker.com. Checked directly on 21 September 2026:

- **None of them run advertising or affiliate links.** No ad network scripts, no affiliate
  networks, no sponsored placements in the served HTML.
- willitwifi.com also ships a Chrome extension: **5 users**, against FlightWifi's 47.
- airlinestarlinktracker.com is the open-source `martinamps/ua-starlink-tracker`, one of a family
  of free per-airline trackers.

That several independent builders keep making this tool is evidence the question is felt. That none
of them monetises is evidence that nobody has found money in it directly, which is consistent with
everything above rather than a reason to despair: it means the category is uncontested on the
revenue side, and that whoever wins it wins it on distribution and data quality, not on a clever
ad unit.

---

## 6. The clock

- **US majors have solved the binary question.** Free Wi-Fi in some form: Southwest since October
  2025, Delta for SkyMiles on 75% of the fleet by December 2025, American for AAdvantage members
  from January 2026 across ~90% of its fleet, JetBlue and Hawaiian free to everyone, United rolling
  out. For a US domestic traveller, "does my flight have Wi-Fi" stops being a question within
  roughly 12-18 months.
- **The global fleet does not follow.** Valour Consultancy put 55% of aircraft as connectivity-
  equipped in 2024; Euroconsult/Novaspace project roughly 21,000 connected aircraft and ~58%
  penetration by 2030-31. Equipped is not fast: legacy GEO systems stay mixed in with Starlink for
  years.
- **Therefore the durable question is "is it fast enough to work on", not "does it exist".** That
  is already the product's framing, and it has 3-5 years.
- **The best hedge is the adjacent question**: eSIM and roaming. 1.2 billion eSIM connections in
  2024, up from 800 million in 2023, same audience, opposite trend line.

---

## 7. What I would do

**Now, costs nothing, unblocks everything else**

1. **Fix the click-through rate.** 463 queries at positions 4-10 converting at 0.43% is the
   cheapest 5x available. Titles and descriptions currently answer the query in the SERP instead of
   earning the click. The page should promise something the snippet cannot deliver: the specific
   aircraft, the check date, the cost.
2. **Turn the checker back on.** `AERODATABOX_KEY` is unset on Vercel, so the one feature that
   makes this a tool rather than a reference site returns `{"error":"unavailable"}`. $5.35/month.
3. **Ship aircraft-swap alerting, free.** It is the only feature this category charges for anywhere,
   it runs on the API already wired up, and it converts a one-time lookup into a reason to stay
   installed.

**Next, the only revenue line available**

4. **eSIM affiliate on the website only.** Apply to Maya (20%) and Airalo (10%, the recognised
   brand). Place on international airline pages and no-Wi-Fi pages, labelled, never affecting a
   verdict, never in the extension. Expect a few dollars a month at current traffic. It is worth
   doing now anyway, because it is the only line whose ceiling rises with everything else you do.
5. **List the dataset on RapidAPI and Datarade.** A day of work, a revenue floor, and inbound
   signal about who wants this data.

**Later, gated on traffic**

6. At 25,000 sessions: approach one sponsor rather than an ad network.
7. At 50,000 sessions: reconsider Journey by Mediavine, and accept the privacy-page rewrite
   honestly if you take it.
8. At 10,000 engaged installs: gate alerting behind $3-5/month via ExtensionPay or Paddle.

**Do not**

- Put affiliate links in the extension. Policy forbids the passive version and the click-gated
  version is not worth the disclosure burden at this scale.
- Sell amenity data to OTAs or TMCs. That race was run and won by ATPCO in 2018.
- Add display advertising before 50,000 sessions.
- Build a paywall before there is something to gate and an audience to gate it from.

---

## 8. What the precedents say, and why it reorders the plan

Twelve comparable products, checked for how they made money and how they ended.

**What actually paid, in every case**

| product | model | outcome |
|---|---|---|
| Routehappy | B2B data licensing: flight scores and amenity data by API to airlines, OTAs and GDS, 65+ customers including Expedia, Google, Sabre, United | raised $8.13M, acquired by ATPCO Feb 2018, price undisclosed |
| FlightAware | free consumer tier + usage-based AeroAPI at $0.002/query + enterprise Firehose feed | bootstrapped, profitable from 2006, acquired by Collins Aerospace Nov 2021 |
| Skytrax | consumer rankings free and unsponsored; revenue from **paid audits and certifications sold to the airlines being rated** | private, still running |
| Flightradar24 | subscriptions + advertising + B2B data sales | SEK 420M (~$41.4M) revenue 2024, 52% margin, 35% stake sold to Sprints Capital Sept 2025 at ~$500M, after 15 bootstrapped years |

**What never paid**

SeatGuru, aeroLOPA, SeatMaestro: consumer ad and affiliate monetisation of an aviation dataset never produced a self-sustaining business in any documented case. It produced an *acquirable traffic asset*. One observer on aeroLOPA's niche called it "a crazy thing to try and monetize"; SeatMaestro degraded into pop-up advertising.

**How these products die: acquisition, then neglect**

- SeatGuru: acquired by TripAdvisor in 2007, data updates stopped March 2020, site fully shut 31 October 2025.
- GateGuru: acquired by TripAdvisor June 2013, shut January 2019.
- Farecast: acquired by Microsoft for **$115M** in April 2008, became Bing Travel, killed by 2014.

Three different prices, one pattern: bought for the traffic, deprioritised, switched off three to six years later. A disclosed nine-figure price did not protect Farecast.

**The extension is the copyable half**

Points Path reports 200,000 users and a $1M seed (self-reported). Seats.aero, bootstrapped to a reported $1.5M ARR on a $9.99/month subscription, **launched its own Google Flights overlay in July 2026** and extended it to Chase Travel within three weeks. Overlay ideas get cloned within months once proven. The dataset is the part a competitor cannot rebuild over a weekend: 235 airlines of hand-verified sub-fleet mapping with 662 sources is slow, unglamorous work.

**The ceiling, in numbers**

2026 multiples for content and affiliate sites run 28-42x monthly net profit, 45-60x for authority assets. A site clearing $2-5k a month sells for roughly $60-200k. The B2B route is an order of magnitude different: Pruvo, a narrow travel-data automation tool, sold to WebBeds for **~$17.4M in June 2026** (disclosed).

**Nobody has proven this specific niche in either direction.** SeatWiFi and Starlink Flights have no public business model, revenue or funding coverage at all. FlightWifi would be establishing the category, not following a playbook.

### How this changes the ordering

The research on data licensing (§3.6) said enterprise amenity sales are not a path for one person, and that stands: ATPCO consolidated that market in 2018 and Routehappy needed $8.13M of venture money to get there. But the precedents say something sharper: **consumer advertising and affiliate revenue has never once carried a product of this shape**, while every product that did carry itself sold structured data to someone whose business depended on it.

So the API and dataset work moves up. Not as an enterprise sales motion, which would fail, but as: keep the data the best in the world, make it trivially consumable (self-serve API, MCP, listings), and let the buyers find it. That is the FlightAware shape, not the Routehappy shape.

One model nobody else on this list used is worth naming because it fits uncomfortably well: **Skytrax sells audits to the airlines it rates**, keeping the consumer side free and unsponsored. An airline connectivity benchmark, sold to airlines and IFC vendors who currently have no independent verification of what their fleet actually delivers, is the same trade. It is also the fastest way to destroy the trust the verdicts depend on if the firewall between the two sides ever leaks, which is precisely the criticism Skytrax attracts.

## 8. The honest summary

FlightWifi is not currently a business and will not become one by choosing a better revenue model.
It is a well-built asset with a real dataset, a defensible framing, and no audience yet. The
research says the sequencing is: earn the clicks you already rank for, give away the one feature
people pay for elsewhere, take the one affiliate line that is open, and leave the rest until the
numbers justify the trade-offs they carry.

The upside case is not advertising revenue. No product of this shape has ever been carried by
advertising: SeatGuru, aeroLOPA and SeatMaestro all tried and all ended as traffic assets or
pop-up farms. The ones that paid their own way sold structured data to people whose business
depended on it, and the two clean examples (FlightAware, Flightradar24) took a decade or more of
bootstrapping to get there.

So the honest framing is a fork. The consumer path leads, at best, to a content-site sale in the
tens to low hundreds of thousands, and the precedents say it then gets neglected and switched off.
The data path leads toward the Pruvo and Routehappy outcomes, an order of magnitude higher, and it
asks for exactly what is already being built: the best verified answer to a question that stays
open for three to five more years, kept current every month, and made trivially easy for someone
else's product to consume.
