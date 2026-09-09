# FlightWifi: next blog topic research (8 September 2026)

Question answered: which single blog post should FlightWifi write next so that it rides a topic that is rising in Google right now and answers what people actually want?

Sources used (all pulled 8 September 2026):

- Google Trends, 12-month and 5-year, US, worldwide, India, UK (interest indices, related and rising queries).
- Google autocomplete: 447 seed prefixes across US, India and UK, about 3,000 unique suggestions.
- Reddit, official API, 24 subreddits, 12 months: 2,519 posts mentioning Wi-Fi terms, 1,326 about in-flight Wi-Fi after filtering, 166 phrased as questions.
- Google Search Console for flightwifi.app, 18 August to 5 September 2026 (the site's first three weeks of impressions).
- Targeted page checks: airline pages, trackers, and the competing tools that already rank for the winning topic.
- The FlightWifi registry (235 airlines, 43 with a Starlink field) and the four published posts.
- Four web research passes (news and rollout timeline, search-results gap across 26 queries, real user questions on FlyerTalk, TripAdvisor, Quora and vendor forums, regional demand outside the US), condensed in the appendix.

## Verdict

Write: **"Will my flight have Wi-Fi (or Starlink)? How to check any flight before you book."**

One sentence why: the single most common question travellers ask about in-flight Wi-Fi in 2026 is no longer "does this airline have Wi-Fi" but "will MY flight, on THIS date, have it, and which system", and nobody has written the guide, while FlightWifi's whole product is the answer.

The evidence stacks four ways:

1. Google already autocompletes the question. Typing "will my flight have" returns wifi, starlink, free wifi, "starlink united" and internet among the ten suggestions in the US, UK and India. "How to check if my flight has starlink" returns a full ten-suggestion set (united, qatar, emirates, alaska, wifi, plane). "How to know if my flight has wifi" returns delta, united, american airlines and southwest variants. "Which planes have starlink" returns united, qatar, emirates, flights. "United starlink tracker" alone has ten variants (rollout, install, fleet, progress, plane tracker). A query family with this much autocomplete depth is established demand, not a guess.
2. It is the dominant question shape on Reddit. Of 166 question-phrased Wi-Fi threads in 12 months, the recurring form is a specific flight, route, aircraft or even tail number: "Will my flight have starlink?", "Does the ORD-DXB flight (777-300 ER) now have Starlink?", "Does A6-EGA have starlink?", "DXB -> SFO Has starlink?", "Can you find out if a plane has Starlink", "Will my flight have Starlink or how do I check?", "Is AI144 updated with WiFi", "CRJ900 WiFi?", "Does SFO-PVG flight have internet onboard?". The "which plane or aircraft has it" cluster holds 230 posts and 81% of them are from 2026. A thread titled "How to Physically Identify a Starlink Equipped Aircraft" reached 101 points on r/SouthwestAirlines on 24 August 2026.
3. The trend is up and the reason is structural. "united wifi" nearly doubled between 2025 and 2026 in Google Trends, "southwest wifi" is at a 12-month high since June, "airplane wifi" is up 23% year on year, and the worldwide rising query for "starlink flight" is "united transatlantic starlink flight" (Breakout). Mid-retrofit fleets are the cause: United had 563 of 1,658 aircraft converted on 7 September 2026 (34%), Emirates roughly 36 of 232, British Airways 5 of 30 787s, Southwest a handful of 737s, Lufthansa one A320neo. When the same flight number can be Starlink on Tuesday and a 2015 satellite system on Wednesday, "does the airline have it" stops being a useful question. This will stay true through 2027.
4. The gap is real and specific. Demand has already spawned tools, which proves the appetite: a Show HN "Will my flight have Starlink?" (stardrift.ai) got 276 points and 362 comments around April 2026; unitedstarlinktracker.com offers flight-number lookup for United; starlinkflights.com claims probability scores for 45 airlines; doesmyflighthavestarlink.com launched 8 December 2025 and still only matches the airline; lufthaven.app/starlink is a static list updated March 2026; SeatWiFi covers a few dozen flights. Every one of them is Starlink-only or thin, and every one is a post-booking lookup. There is no publisher guide that (a) covers all Wi-Fi systems, not just Starlink, (b) explains each airline's own tell (Delta's "FREE WIFI FOR SKYMILES MEMBERS" badge on delta.com search results, United's pre-departure notification, the aircraft-type rules at Qatar, Emirates, American, Air France, BA, Air India), (c) explains how to find the aircraft sub-type and tail number, and (d) covers the pre-booking moment inside Google Flights. That last part is FlightWifi's extension, so the post is also the cleanest funnel the site can publish.

What it is not: it is not a fifth "which airlines have Starlink" list. The existing post and /starlink page already do that and get linked from the new post. This one is a method, organised by the four places the answer hides.

What the four research passes add. None of them had the autocomplete or Reddit data, and each picked a different favourite from its own slice: the news pass picked Korean Air's free Starlink launch (1 September 2026), the search-results pass picked the texting and WhatsApp cluster, the questions pass picked connection troubleshooting, the regional pass picked Air India's switch to paid Wi-Fi (1 August 2026). Read together they strengthen the verdict rather than replace it: the search-results pass found that a per-flight or per-aircraft answer is absent from page one for 19 of the 26 queries it audited, and its own template for the airline queries ("Does United have free Wi-Fi? Yes on Starlink planes, not yet on the rest: how to tell which you're on") is this post's method applied to one airline. Every dated item the news pass surfaced (United's first widebody Starlink flight on 22 June, Southwest's first on 22 June, Lufthansa's on 19 August, Qatar's 787-9 on 26 August, Korean Air on 1 September, BA's pause until late October) is another row in the post's airline table, which is also why the post will not go stale the way a news piece would. Their picks are ranked below as runners-up, and the facts they found that contradict the live site are listed in their own section, because two of them need fixing whatever gets written next.

### Target queries

Primary (title and H1): "will my flight have wifi", "how to check if my flight has wifi", "does my flight have wifi".
Secondary (H2s and FAQ): "will my flight have starlink", "how to check if my flight has starlink", "how to tell if a plane has starlink", "which planes have starlink", "united starlink tracker", "does my flight have starlink united / qatar / emirates", "how to know if my delta flight has wifi", "how to know if my united flight has wifi", "flight wifi checker", "does google flights show wifi".

### Title, kicker, metadata

- H1: Will my flight have Wi-Fi (or Starlink)? How to check any flight before you book
- seoTitle (57 chars): Will My Flight Have Wi-Fi? How to Check Before You Book
- Category: GUIDE. Read time: about 9 minutes. Date: publication day.
- Excerpt: The airline having Wi-Fi does not mean your flight has it. Four places the real answer hides, airline by airline, plus the one check you can run while you are still on Google Flights.

### Outline

1. The 30-second version. Airline has Wi-Fi is not the same as your flight has Wi-Fi. Four places to look: the airline's own booking signal, the aircraft sub-type, a tail-number tracker, and the search results page. One paragraph on why 2026 is the year this matters (the retrofit percentages above, with dates).
2. Place 1: the airline's own signal. Airline-by-airline, with the exact wording and where it appears.
   - Delta: "FREE WIFI FOR SKYMILES MEMBERS" badge on delta.com search results, Fly Delta app notifications, pre-flight emails, the decal by the boarding door; paid on 717, CRJ-700, CRJ-900, ERJ-170 and ERJ-175 on select aircraft (delta.com onboard Wi-Fi page).
   - United: a notification before departure when the flight is Starlink-equipped and a banner on the flight status page (already sourced in the free Wi-Fi post; re-verify wording before publishing).
   - American: no Starlink yet; free AAdvantage Wi-Fi on the whole narrowbody and dual-class regional fleets, so the aircraft type is the tell, and a 777 or Panasonic 787 means paid.
   - Qatar Airways: 777, A350 and 787-8 complete, 787-9 more than half done and finishing by end of 2026 (150 widebodies on 20 August 2026), A380 and A330 legacy, A320 family none. Aircraft type answers it.
   - Emirates: 777 and A380 subsets only; tail matters, so this airline needs a tracker.
   - Air France: 777-300ER and A350 nearly complete, A220 mostly, A320 barely started (June 2026 figures).
   - British Airways: five 787-8s, installs resume end of October 2026.
   - Alaska and Hawaiian: all E175s and all Hawaiian Airbus done, 737s mid-retrofit, 787s from autumn 2026; Atmos Rewards login, under-18 rule.
   - Southwest: rollout since June 2026, still a small share of the 737 fleet; free for Rapid Rewards members either way.
   - Virgin Atlantic (all 12 A350s), SAS (all 81 A320neos since 1 September 2026), Lufthansa (one A320neo since 19 August 2026), Iberia, Aer Lingus, WestJet, Air Canada (Dash 8-400s only), airBaltic, ZIPAIR, Gulf Air: one line each.
   - Korean Air group: free Starlink phasing in from 1 September 2026 on 777-300ERs and A350-900s first, replacing the old paid product; Asiana, Jin Air, Air Busan and Air Seoul follow; fleet-wide by end 2027. Aircraft type is the tell for now.
   - Copa (Starlink since 4 July 2026 on the first 737 MAX 9, but free only for Business and ConnectMiles Gold and above), Gulf Air (free Starlink since May 2026 on A320neo, A321neo and 787-9), flydubai (Starlink across the 737 fleet, verify count): one line each.
   - Air India: Wi-Fi on the A350-900, ex-Vistara 787-9 and A321neo and select 777-300ERs only (28 aircraft, 55 or so daily flights), 787-8 and the rest none; paid since 1 August 2026 except by cabin or Maharaja Club tier. IndiGo (none until the A321XLR trial), Ryanair, easyJet, Wizz Air, Jet2 (none): the "do not bother checking" group, linking to /no-wifi. Note for Indian and Gulf routes: Starlink and Inmarsat GX service is switched off over Indian airspace under the DoT rules, so even an equipped Emirates, Qatar or Singapore flight drops out over India (one line, verify the regulatory basis).
3. Place 2: the aircraft sub-type. How to read it on the confirmation email, the seat map, the Google Flights expanded result, and the airline app. Why sub-type matters (787-8 vs 787-9 at Qatar and Air India, A350 vs 787 at Virgin Atlantic, E175 vs 737 at Alaska). A compact table generated from the registry: airline, fleets done, fleets in progress, fleets with nothing, as-of date.
4. Place 3: tail-number trackers. What unitedstarlinktracker.com, starlinkflights.com, stardrift.ai and SeatWiFi actually do, how they source data (enthusiast spreadsheets, schedule feeds), and their honest limits: last-minute aircraft swaps (the most asked question in the Show HN thread), regional jets, "installed but not switched on" (the r/unitedairlines "Starlink or bluff???" thread), and data lag. When to check: 24 hours out, and again at the gate.
5. Place 4: while you are still searching. Google Flights amenity chips come from airline-supplied data and say "Wi-Fi for a fee" or "Free Wi-Fi" without distinguishing Starlink from a decade-old system. The FlightWifi extension reads the exact aircraft on every Google Flights, Skyscanner and Soar result and shows the verdict per flight. One screenshot, one sentence, no hard sell. This is the InlineCta slot.
6. What can still go wrong after all four checks. Swaps, membership requirements (MileagePlus, Atmos Rewards 18+, Privilege Club for the full flight, Flying Blue), the 10,000-feet rule versus gate-to-gate, and the no-calls policies at Delta and United. Link to the latency post.
7. FAQ (each answers an autocomplete phrasing): Will my flight have Starlink? How do I know if my United flight has Starlink? How do I know if my Delta flight has free Wi-Fi? How can you tell from the outside whether a plane has Starlink? Does Google Flights show whether a flight has Wi-Fi? What happens if the plane is swapped? Can I still buy the regular Wi-Fi if Starlink is not on my aircraft?

Internal links: /starlink, /chrome-extension, /no-wifi, the airline pages named above, the aircraft pages for 787-8, 787-9, A350, A380, 777-300ER, E175, the Starlink list post and the free Wi-Fi post.

### Facts to verify on official pages before publishing

- United's exact notification and flight-status wording for Starlink flights (united.com timed out during this research).
- Emirates A380 status: a Runway Girl Network item from April 2026 reports the three-antenna A380 installation completed, the registry says three A380s flying in July 2026, and an r/emirates thread on 30 August 2026 reports LHR to DXB on an A380 with Starlink. Confirm the current A380 count on the Emirates media centre.
- Southwest's current Starlink aircraft count (southwest.com only says "Starlink is here"; r/SouthwestAirlines reported about ten aircraft on 23 August 2026).
- American's booking-page indicator for Wi-Fi (aa.com blocked automated fetches; check by hand).
- Tracker figures quoted (563 of 1,658 United aircraft on 7 September 2026) should be re-read on publication day.

## Runners-up, in order

| Rank | Topic | Why it is close | Why it loses this round |
|---|---|---|---|
| 2 | Plane Wi-Fi says connected but nothing loads: the airline-by-airline fix list | Fastest-rising sub-intent in Trends: deltawifi com +2,250%, delta wifi.com login +1,400%, getconnected southwest wifi login +190%, how to connect to united wifi +100%; "airplane wifi not working on iphone" is a repeated autocomplete; "airplane wifi not working" hit its 12-month peak the week of 6 September 2026. The connect/login cluster has the highest 2026 share on Reddit (86%), and the questions pass ranked it first: American's "Free WiFi Rollout Issues" FlyerTalk thread runs past 18 pages since January 2026, and nobody online covers per-airline portal hostnames, iCloud Private Relay, Android private DNS, MAC randomisation, corporate VPN clients or the AAdvantage login loop. | The free Wi-Fi post already carries portal addresses and a four-failure troubleshooting section, so the new post must go a level deeper (device settings, provider-specific failures, refunds) or it overlaps; and the pure login queries are navigational (people want deltawifi.com itself). The natural post after this one. |
| 3 | Do T-Mobile, Verizon, AT&T or Google Fi still get you free plane Wi-Fi in 2026? | United's T-Mobile deal ended 13 April 2026 and American dropped out the same month; "t mobile united wifi" is up 250% and "t mobile in flight wifi changes" autocompletes; Reddit asked "Tmobile WiFi is back?" in May; T-Mobile's own customers call its airline page a "half-truth" on the T-Mobile Community forum; American's "sponsored by AT&T" wording makes people think they need AT&T. Delta, Alaska, Hawaiian and Southwest remain. | Simple Flying, One Mile at a Time, TheStreet and tmo.report covered it in April; the news is five months old, and "verizon inflight wifi" is a dead query. Worth a carrier-perk matrix inside the airline pages plus an FAQ entry in the new post, not a flagship. |
| 4 | How much Wi-Fi costs on every airline (2026 price table) | Price is the second-fastest riser: united wifi price +300%, american airlines wifi price +80%, british airways wifi price +80%, singapore airlines wifi cost +60%; India autocompletes "flight wifi charges". | Prices are dynamic and route-dependent, so a blog post goes stale in weeks; it belongs in the registry and the airline pages, where Search Console already shows "wifi price" and "wifi cost" impressions for 80 queries. |
| 5 | Delta Wi-Fi: why it is slow and when it gets fast | "delta wifi" is the largest airline Wi-Fi term in the US and grew every year since 2021; r/delta threads "Delta WiFi Sucks" (357 points) and the Accenture 2.2% consistency stat show heat; Amazon Leo installs start 2028. | Single-airline, and Delta's own pages plus The Points Guy own the head term. Better as a section in the Delta airline page. |
| 6 | Air India Wi-Fi is no longer free: prices, who still gets it free, which aircraft have it | Changed 1 August 2026 (chat INR 399, browsing INR 299 an hour to 1,199 a flight, streaming INR 2,699; free by cabin or Maharaja tier); India "flight wifi" interest is at a nine-month high this fortnight; Indian autocomplete already asks "air india wifi charges / price / plans"; only pricing recaps (Live From A Lounge, InsideFlyer) and thin OTA blogs compete; Diwali travel is in October. The regional pass scored India 5 out of 5. | India is 790 of 22,800 Search Console impressions, "air india wifi" interest is a fifth below 2025, and the equipped fleet is 28 aircraft. Strong second post for October, and the airline page must be corrected now either way. |
| 7 | Can you text or WhatsApp on a plane? Free-messaging rules airline by airline | The search-results pass scored both queries 5 out of 5: page one is Quora, YouTube, remittance firms and a 2023 article that still says texting on American and United is paid. The answer is per airline (free chat tiers at Delta, Alaska, BA, Emirates, Turkish, Air France, KLM, Qatar's first hour) and per provider. | Low absolute volume: over five years "text on a plane" averages about a twentieth of "delta wifi" in the US, and "whatsapp on plane" barely registers. A good evergreen third or fourth post, and the messaging tier belongs in the airline pages meanwhile. |
| 8 | Korean Air group free Starlink, which aircraft first | Launched 1 September 2026, thin English coverage, and "korean air starlink wi-fi availability" is already the site's single largest Starlink query in Search Console (61 impressions). | Single airline, small audience for this site. Update the Korean Air airline page and the Starlink list this week; the new post covers it as a row. |
| 9 | Can you stream Netflix on plane Wi-Fi? Only on these providers | Junk page one (video-downloader software, 2015 news); the answer is the speed class FlightWifi already stores; "netflix on plane" is the largest use-case term in the US and spikes every December. | Overlaps the latency post in the reader's mind even though the intent differs; better timed for late November before the holiday spike. |

## Corrections the research found in the live site

These came out of the news and regional passes while checking the four posts and the registry. Each needs an official-source check before the change, per the usual rule.

- Air India is described as free (introductory) in the free Wi-Fi list, the 13-airline how-to and the registry access line. It has been paid since 1 August 2026: Chat and Text INR 399 per flight; Browsing INR 299 for one hour, 699 for three, 1,199 for the flight; Streaming INR 2,699; Business gets one hour of browsing plus chat, Maharaja Club Red and Silver one hour of chat, Gold one hour of browsing plus unlimited chat, Platinum unlimited; bought per segment, UPI accepted (Live From A Lounge, 2 August 2026). Confirm on airindia.com.
- Korean Air group is "announced" in the registry; free Starlink service began 1 September 2026 on long-haul 777-300ERs and A350-900s, with Asiana, Jin Air, Air Busan and Air Seoul to follow (Seoul Economic Daily, 4 September 2026; Loyalty Lobby, 2 September 2026). The "free" claim rests on headlines; confirm on koreanair.com.
- flydubai is "announced" in the registry; Gulf News (16 June 2026) reports Starlink in service across the 737 fleet, free. Verify.
- Copa is live since 4 July 2026 but free only for Business and ConnectMiles Gold and above; the registry's "paid" access is right, the Starlink list should not imply free.
- The Starlink list post (August 2026) is stale on Lufthansa (in service 19 August), Qatar 787-9 (26 August), Korean Air (1 September), the United count (563 of 1,658 on 7 September), the Alaska and Hawaiian count (142 of 400 per starlinkflights.com), and BA's pause at five aircraft until late October.
- The 13-airline how-to should not carry any T-Mobile step for United or American; both left the T-Mobile perk on 13 April 2026 and United's paid price is now USD 8 with MileagePlus or USD 10 without (tmo.report, April 2026). Delta, Alaska, Hawaiian and Southwest still carry T-Mobile sponsorship.
- Per-route caveat worth adding to every "free Wi-Fi" claim: Starlink and Inmarsat GX service is switched off over Indian and Chinese airspace (Mainly Miles, 30 May 2026), so Emirates, Qatar and Singapore Airlines Wi-Fi drops there. Verify the regulatory basis (DoT in-flight and maritime connectivity rules) before publishing.
- Wizz Air is an Indigo Partners airline; the registry already marks it "announced", consistent with the 15 July 2026 Indigo Partners Starlink deal. Nothing to change, but the "no Wi-Fi" group in the new post should say "none flying yet" for Wizz rather than "none planned".

## Evidence 1: Google Trends

### US, five years, weekly averages by year (index relative to the peak term)

| Term | 2021 | 2022 | 2023 | 2024 | 2025 | 2026 | Peak week |
|---|---|---|---|---|---|---|---|
| delta wifi | 18 | 28 | 37 | 43 | 62 | 75 | 17 to 23 May 2026 |
| united wifi | 14 | 20 | 23 | 25 | 37 | 69 | 21 to 27 June 2026 |
| airplane wifi | 6 | 9 | 10 | 11 | 13 | 16 | 14 to 20 June 2026 |
| netflix on plane | 4 | 5 | 5 | 5 | 6 | 6 | June 2025 |
| text on a plane | 1 | 2 | 2 | 2 | 3 | 4 | May 2026 |

Reading: interest in airline-specific Wi-Fi has roughly doubled in two years. "united wifi" nearly doubled between 2025 and 2026 alone, which lines up with the Starlink rollout. Generic how-to questions (Netflix, texting) are flat.

### US, 12 months, rising related queries

| Seed | Rising queries (Trends label) |
|---|---|
| delta wifi | deltawifi com (+2,250%), delta wifi.com login (+1,400%), deltawifi (+1,250%), flyfi (+350%), delta wifi connect (+130%), delta wifi not working (+70%) |
| united wifi | united wifi price (+300%), t mobile united wifi (+250%), how to connect to united wifi (+100%), connect to united wifi (+70%) |
| southwest wifi | getconnected southwest wifi login (+190%), southwest wifi portal (+160%), southwest wifi login (+90%), is southwest wifi free (+60%) |
| american airlines wifi | american airlines wifi price (+80%); "american airlines free wifi 2026" (+600%) |
| airplane wifi | top related: t mobile airplane wifi, how does airplane wifi work |
| starlink flight (90 days, worldwide) | united transatlantic starlink flight (Breakout) |

Reading: the fastest-growing sub-intents are (a) connecting and logging in, (b) price, (c) the T-Mobile perk, (d) whether a specific flight has Starlink. Interest in "united starlink" as a news term peaked in June 2026 and is now a quarter of that peak; "united wifi" stayed high, so the story moved from news to usage.

### Other 12-month readings

- US "southwest wifi": 2026 average 84 against 76 in 2025, peak 19 to 25 July 2026 (Starlink installs began in June).
- US "united free wifi": 2026 average 68 against 45 in 2025, peak 28 June to 4 July 2026.
- US "american airlines free wifi": peak 4 to 10 January 2026 (launch week), 2026 average 41 against 27.
- US "airplane wifi not working": at its 12-month peak in the week of 6 to 12 September 2026 (small absolute volume).
- India "flight wifi": last two weeks are the highest since the December 2025 peak (37 and 41 against a 12-month baseline near 30). Top regions Delhi, Punjab, Chandigarh, Haryana.
- India "air india wifi": peaked 30 November to 6 December 2025, 2026 average 40 against 52 in 2025 (falling).
- Worldwide "emirates wifi" (index 62) and "qatar airways wifi" (35) are both lower in 2026 than 2025; "british airways wifi price" (+80%) and "singapore airlines wifi cost" (+60%) are rising.
- US "wifi calling on plane", "whatsapp on plane" and "vpn on plane" register near zero against "netflix on plane" and "text on a plane".

## Evidence 2: Google autocomplete (what people start typing)

Most repeated suggestions across the US seed set (count of seeds that produced them): "can you use wifi on a plane" (6), "delta wifi not working" (5), "airplane wifi not working on iphone" (5), "airplane wifi not working" (5), "airplane wifi speed" (5), "is airplane wifi good" (5), "why is wifi on planes so bad" (4), "t mobile delta wifi" (4), "what happens if you use wifi on a plane" (4).

The winning family, verbatim from the US feed (identical in the UK and India feeds):

- will my flight have: turbulence, a meal, a tv, wifi, starlink, free wifi, food, starlink united, screens, internet
- will my flight have starlink: will my flight have starlink united, does my flight have starlink, does my flight have starlink united, does my flight have starlink qatar, does my flight have starlink wifi, will my plane have starlink, does my flight have starlink emirates, does my plane have starlink, will my ba flight have starlink
- how to check if my flight has starlink: wifi, qatar, united, how to know, how to tell, my plane, emirates, my united flight has starlink wifi, my alaska flight
- how to know if my flight has wifi: delta, my united flight, how to check if the flight has wifi, my american airlines flight, how do i know if my plane has wifi, my southwest flight, is wifi available in flight
- how to check if flight has wifi: united, delta, westjet, qantas, virgin, ba, alaska
- which planes have starlink: united, wifi, qatar, emirates, which airlines have starlink, which flights have starlink, which flights have starlink united
- united starlink tracker: reddit, rollout tracker, wifi tracker, install tracker, fleet tracker, progress tracker, plane tracker, installation tracker
- how to tell if plane has starlink: how to know if plane has starlink united, how to tell if your plane has starlink, my alaska flight, my united flight has starlink wifi
- flight wifi checker: flight wifi check, how do i know if my flight has wifi, do planes have wifi now

Other intent families visible in the suggestions:

- Does X have Wi-Fi: every major airline seed returns a full set of ten, always including "on international flights", "on domestic flights", "for free" and, for US carriers, "with t mobile".
- Not working and login: "airplane wifi not working on iphone / laptop", "delta wifi not working on iphone / android / ipad / mac", "delta wifi login", "delta wifi connect", "delta wifi err_connection_reset", "inflight wifi login", "united wifi app", "wifi on plane not working".
- Price: "how much is wifi on united / american airlines / delta / southwest / etihad", "airplane wifi cost", "in flight wifi charges" (India), "plane wifi price" (UK).
- Use cases: "imessage on plane wifi", "facetime on plane wifi", "zoom on delta wifi", "netflix on delta wifi", "is airplane wifi good enough to stream / for zoom / for gaming".
- India (gl=in): "air india wifi on flight cost / charges / plans / password / connect / speed", "indigo wifi password / plans / login / price", "does indigo have wifi on domestic / international flights", "inflight wifi airtel", "flight wifi checker".
- UK (gl=gb): "british airways wifi cost / refund / login / free / speed", "ryanair wifi", "easyjet wifi", "virgin atlantic wifi packages / voucher / login", "plane wifi tui", "plane wifi jet2".

## Evidence 3: Reddit, 12 months, 24 subreddits

Volume: 1,326 in-flight Wi-Fi posts. Monthly count roughly doubled from late 2025 (49 to 81 per month) to 2026 (99 to 154 per month, August 2026 the highest at 154). Subreddits by volume: r/unitedairlines 206, r/delta 138, r/americanairlines 138, r/AlaskaAirlines 108, r/SouthwestAirlines 97, r/Flights 92, r/qatarairways 80, r/travel 75, r/emirates 66, r/BritishAirways 51, r/digitalnomad 50.

Intent clusters (posts can match more than one):

| Cluster | Posts | 2026 share | Note |
|---|---|---|---|
| Starlink named | 384 | 81% | Largest and fastest growing |
| Free eligibility and T-Mobile | 309 | 73% | |
| Price and worth it | 279 | 81% | |
| Speed and quality | 276 | 80% | Delta complaints dominate |
| Which plane or aircraft has it | 230 | 81% | The FlightWifi question |
| Calls, Zoom, work | 178 | 75% | Etiquette debates on Starlink flights |
| International and over ocean | 178 | 77% | |
| Messaging | 162 | 75% | |
| Connect, login, not working | 131 | 86% | Highest 2026 share of any cluster |
| Streaming | 120 | 79% | |

The 166 question-phrased titles, most recent first, are dominated by one shape: "will my specific flight have it?"

- "Will my flight have starlink?" (r/unitedairlines, 24 Aug 2026)
- "How to Physically Identify a Starlink Equipped Aircraft" (r/SouthwestAirlines, 24 Aug 2026, 101 points)
- "Can you find out if a plane has Starlink" (r/AlaskaAirlines, 21 Jul 2026)
- "Does the ORD-DXB flight (777-300 ER) now have Starlink?" and "Does A6-EGA have starlink?" (r/emirates, July 2026)
- "DXB -> SFO Has starlink?" (r/emirates, 3 Sep 2026)
- "Will my flight have Starlink or how do I check?" (r/qatarairways, Jan 2026)
- "Does SFO-PVG flight have internet onboard?" (r/unitedairlines, 4 Sep 2026)
- "CRJ900 WiFi?" (r/delta, 1 Sep 2026)
- "Is AI144 updated with WiFi" (r/airindia, Jul 2026)
- "Starlink or bluff???" and "Starlink installed on the tarmac?" (r/unitedairlines, Aug and Sep 2026)
- "Can I still purchase regular WiFi on my flight to Rome if Starlink is not available?" (r/AlaskaAirlines, 4 Sep 2026)
- "got lucky, apparently only 10 planes have starlink so far" (r/SouthwestAirlines, 23 Aug 2026)

Second shape, connection failures: "I have the latest iPhone and am constantly unable to connect with Delta's WiFi" (22 Aug 2026), "WiFi on AA never loads the ad. Suggestions?" (20 Aug 2026, 46 comments), "Can't access United wifi in flight", "Trouble accessing starlink internet?", "Why can't they fix the WiFi!!" (Southwest).

Most engaged threads since mid-July 2026: "United now has 205+ mainline aircraft equipped with Starlink" (29 Aug, 402 points), "420 Mbps at 38,000 ft over the Atlantic, Starlink on UA 31" (14 Aug), "Delta WiFi Sucks" (26 Aug, 357 points, 118 comments), "Delta is on a journey to bring fast, free wifi to every flight" (30 Aug), "According to Accenture, Delta's wifi consistency is 2.2%" (29 Jul), "Phone calls in flight" (r/delta, 6 Aug, 147 comments), "My Experience with Starlink on Emirates b777 (It was FREE, 120 Mbps)" (8 Aug), "LHR TO DXB (A380) finally has starlink" (30 Aug), "DEF CON dingus suspected of trying to take over Delta in-flight Wi-Fi" (11 Aug).

## Evidence 4: Search Console, flightwifi.app, 18 August to 5 September 2026

Totals: 22.8K impressions, 108 clicks, average position 12.1, CTR 0.5%.

| Query slice (contains) | Queries | Impressions | Clicks |
|---|---|---|---|
| does | 403 | 3,100 | 5 |
| free | 182 | 614 | 2 |
| starlink | 37 | 123 | 1 |
| price | 37 | 109 | 2 |
| cost | 44 | 107 | 0 |
| login | 7 | 20 | 0 |
| not working | 0 | 0 | 0 |

Top impressions are "does {smaller airline} have wifi" (Caribbean Airlines 117, Viva Aerobus 105, Flair 90, Batik Air 69, Norse Atlantic 57, Air Premia 51) and the single largest Starlink query is "korean air starlink wi-fi availability" (61). Top pages are airline pages (Flair 1,001 impressions, Norse 701, Air China 518) and /no-wifi (549). Countries: United States 4,741 impressions, United Kingdom 2,233, Canada 1,481, India 790, Australia 765.

Reading: the site's early footprint is the long tail of "does X have wifi" for carriers that big publishers ignore, which is the same intent as the winning topic one level up. It has no footprint yet on the high-volume US carrier queries and none on troubleshooting queries. A blog post cannot win "delta wifi" head-on in its first months; it can win a question that nobody has answered well.

## Evidence 5: who already answers the winning question

| Page | What it is | Limits |
|---|---|---|
| unitedstarlinktracker.com | Live tracker: 563 of 1,658 United aircraft (34%) on 7 September 2026, mainline 216 of 1,151, Express 347 of 507, 48 installs in 30 days, flight-number lookup | United only |
| starlinkflights.com | Probability scores by flight number, claims 9,200 aircraft across 45 airlines, has a "How to Check If Your Flight Has Starlink WiFi (2026 Guide)" page | Starlink only; blocks automated fetches so its guide could not be read |
| stardrift.ai/starlink | Show HN "Will my flight have Starlink?", 276 points, 362 comments, about April 2026; uses aircraft type and tail assignments from enthusiast spreadsheets | Starlink only; comments centre on swaps and data freshness |
| doesmyflighthavestarlink.com | Launched 8 December 2025 | Still only matches the airline, not the aircraft |
| lufthaven.app/starlink | Static list of 23 committed airlines, updated March 2026 | No checker, no non-Starlink coverage |
| seatwifi.com | "Does My Flight Have WiFi? Check 23+ Flights" | Tiny coverage |
| FlyerTalk and TechRadar | 2015-era Google Flights amenity coverage, JetBlue Fly-Fi threads | Dated |

None covers the airline booking signals, the sub-type rules across systems, or the pre-booking moment. That is the post.

## Evidence 6: what the site can uniquely add

The registry already carries per-fleet Starlink status for 43 airlines with in-service counts and dates, for example Qatar (150 widebodies, 777, A350 and 787-8 complete, narrowbodies none), Emirates (33 777s and 3 A380s in July 2026, about 14 conversions a month), United (more than 400 in June 2026, trackers near 560 in early September, close to 1,000 targeted by year end), Air France (28 of 31 777-300ERs, 30 of 41 A350s, 45 of 56 A220s), Alaska (all E175s, 737s mid-retrofit), Southwest (rollout since June 2026), Virgin Atlantic (all 12 A350s, 787s from H2 2026), SAS (all 81 A320neos as of 1 September 2026), Lufthansa (first A320neo since 19 August 2026), Iberia, Aer Lingus, WestJet, Hawaiian, Air Canada (Dash 8-400s only), airBaltic, ZIPAIR, Gulf Air. The extension reads the exact aircraft on Google Flights, Skyscanner and Soar results. No competitor page combines "how to check your flight" with per-fleet status across airlines and systems.

## Appendix: the four web research passes, condensed

All four used web search and page fetches only, no browser, and marked unverified items. Reddit was unreachable for them (it was covered separately through the official API above). Blocked pages included starlinkflights.com, seatwifi.com, LoyaltyLobby, aa.com, Air India's own site and several forum bodies, so some quotes are indexed thread titles rather than body text.

### A. News and rollout timeline, 1 June to 8 September 2026

| Date | Who | What changed | Coverage |
|---|---|---|---|
| 6 Jun 2026 | British Airways | Starlink retrofits paused after five 787-8s (first flight 19 March 2026); resume after the IATA summer season, late October | Trade and points blogs |
| 22 Jun 2026 | Southwest | First Starlink 737-800 in service (DAL to ABQ); target 300 or more of about 800 aircraft by end 2026; free for Rapid Rewards members | Mainstream |
| 22 Jun 2026 | United | UA14 Newark to London is the first Starlink widebody flight (777-200); about 60 widebodies by end 2026, all by summer 2027 | Mainstream |
| 4 Jul 2026 | Copa | First Starlink 737 MAX 9, first in Latin America; most passengers pay; fleet complete Q1 2027 | Trade |
| Jul 2026 | Emirates | One million Starlink connections in seven months; first 777 flight 23 November 2025, first A380 27 April 2026; 150 aircraft by end 2026 | Press release, Gulf mainstream |
| 1 Aug 2026 | Air India | Wi-Fi goes paid (prices above); 28 aircraft, 55 or more daily flights; one million users June 2025 to June 2026 | Indian mainstream |
| Aug 2026 | Viasat | ViaSat-3 F3 enters service (GEO capacity, not latency) | Trade |
| Aug 2026 | Starlink India | Reapplies for Gen-2 constellation approval including direct-to-device | Trade |
| 11 Aug 2026 | Delta | Passenger allegedly ran a fake Wi-Fi network on Las Vegas to Atlanta; investigation | Mainstream |
| 19 Aug 2026 | Lufthansa | First Starlink passenger flight, A320neo Frankfurt to Rome; up to ten more A320-family aircraft by end 2026; about 850 group aircraft by 2029; free with Miles and More or Travel ID; calls banned | European mainstream |
| 26 Aug 2026 | Qatar Airways | 150 Starlink widebodies; 787-8 sub-fleet done in seven months; first Starlink 787-9; about 175 aircraft when the 787-9s finish by end 2026 | Press release, trade |
| 1 Sep 2026 | Korean Air group | Free Starlink phasing in on long-haul 777-300ERs and A350-900s, replacing a USD 20.95 fee; Asiana, Jin Air, Air Busan, Air Seoul to follow; fleet-wide by end 2027 | Korean mainstream, points blogs |
| 7 Sep 2026 | United | Tracker count 563 of 1,658 aircraft (34%) | Tracker |

Pre-window context: Delta chose Amazon Leo for 500 aircraft from 2028 (6 April 2026); T-Mobile dropped United and American (13 April 2026); Singapore Airlines chose Starlink for Q1 2027 to 2029 (4 May 2026); American chose Starlink for 500 or more Airbus narrowbodies from 2027 (May 2026); Virgin Atlantic A350 Starlink and Air Canada's free Bell Wi-Fi on North American routes (May 2026); Air France 60 to 75% converted by mid-2026.

Upcoming through 31 December 2026: Korean Air phase-in and Asiana; Hawaiian 787 installs from autumn; BA restart around 24 October; Air Canada long-haul free Wi-Fi (date unverified); Lufthansa's next ten A320s; Qatar 787-9s complete; Emirates 150; Air France fleet-wide; Southwest 300 or more; United about 60 widebodies (the 1,000-aircraft year-end target looks unreachable at 563 today); WestJet 787-9s; Aer Lingus long-haul complete. The pass ranked Korean Air, Lufthansa, United widebodies, Southwest, Air India pricing, the T-Mobile shift, BA's restart and Qatar's 787-9 as the eight likeliest trending topics for the next eight weeks.

### B. Search-results gap, 26 queries

Gap score 5 (stale or forum-led page one): how to text on a plane; can you use whatsapp on a plane; wifi calling on a plane; can you stream netflix on plane wifi. Gap 4: does united have free wifi; why is airplane wifi so slow; verizon inflight wifi; air india wifi; indigo wifi (entity confusion with unrelated Indigos); wifi on international flights (seven airline help pages, no publisher). Gap 3: free wifi on planes; delta free wifi; southwest wifi; jetblue wifi; how does airplane wifi work (the number-one result, AAA on 28 July 2026, omits low-orbit systems entirely); t-mobile inflight wifi; emirates wifi; qatar airways wifi; british airways wifi; ryanair wifi. Gap 2 (fresh, strong incumbents): which airlines have free wifi; united starlink (two tracker sites own the count); american airlines free wifi (NerdWallet updated 31 July 2026); vpn on airplane wifi; is airplane wifi safe; starlink airlines list.

Where a per-flight or per-aircraft answer is absent from page one: 19 of the 26 queries. Where it is present, it is a competitor: unitedstarlinktracker.com and starlinkflights.com (United, Starlink lists), SeatWiFi (Emirates "77 aircraft tracked", JetBlue, IndiGo), flyfi.app (JetBlue), airlinestarlinktracker.com. The pass's own pick was the messaging cluster; its per-airline template ("Does United have free Wi-Fi? Yes on Starlink planes, not yet on the rest: how to tell which you're on") is the verdict's method applied to one airline.

### C. Real user questions, September 2025 to September 2026 (FlyerTalk, TripAdvisor, Quora, Apple, Samsung, T-Mobile Community, Google Fi, Jamf, Blind)

Top clusters by evidence: (1) connected but nothing loads, American's "Free WiFi Rollout Issues" thread past 18 pages since January 2026 and "Am I the only one who can NEVER get WiFi to work onboard"; (2) United Starlink, a 26-page "Free Starlink WiFi on flight" thread asking which flights have it; (3) American's Panasonic-fitted aircraft excluded from free Wi-Fi; (4) whether T-Mobile's perk still works, with T-Mobile's own page called a "half-truth" by customers; (5) Zoom, FaceTime and Wi-Fi calling, where Simple Flying, FlyerTalk users and airline terms contradict each other; (6) free messaging specifics (photos over iMessage fail on chat-only tiers, Air Canada's six-page Aeroplan messaging thread); (7) is it worth paying; (8) why so slow; (9) over-ocean and polar dropouts; (10) loyalty-number gating on Cathay, Singapore, JAL, Qatar and Etihad. Questions that only appeared in 2026: American's launch failures, KLM's free European Wi-Fi from 22 January 2026 on A321neo, 737-800 and E295, Alaska's 737 Starlink from April 2026 and the loss of free seatback movies on Starlink aircraft, United's under-16 consent gate for Starlink, BA Starlink timing. Weakest-answered clusters: troubleshooting, carrier perks after the Gogo exit, calls policy versus reality, loyalty-number gating, kids and multi-device limits. The pass's pick was the troubleshooting fix list.

### D. Regional demand outside the US

- India, 5 of 5: Air India paid since 1 August 2026 (details in the corrections section); 28 equipped aircraft in a mostly unequipped fleet; Starlink not operational on any Indian carrier and reapplying for approval; IndiGo's first Wi-Fi expected on the A321XLR after a Q3 2026 trial; Starlink and GX switched off over Indian airspace; "IndiGo Starlink" searches return the unrelated Indigo Partners deal. Coverage is pricing recaps only.
- UK and Europe, 3 of 5: only 21% of European short and medium-haul jets have Wi-Fi and 48 aircraft have Starlink (CAPA, 30 January 2026); Ryanair, easyJet and Pegasus opted out; Lufthansa live 19 August; BA paid from GBP 2.99 messaging to GBP 21.99 a flight with free messaging for Club members; Virgin Atlantic A350s done 2 June 2026; airBaltic free with no login; KLM Viasat free for Flying Blue rolling out. Coverage is heavy (One Mile at a Time, AwardWallet, Business Traveller, TravelSupermarket, the tracker sites). Gap: a UK-framed "which airlines from UK airports have Wi-Fi" page.
- Middle East, 2 of 5 (4 of 5 framed for Indian passengers): Emirates free for all cabins, 33 aircraft in May 2026, 232 by mid-2027; Qatar 150 and rising; Gulf Air free since May 2026; flydubai across the 737 fleet; Etihad on Viasat, no Starlink; Saudia free Wi-Fi on 20 aircraft since 1 November 2025 (unverified). Gulf News ran a good roundup on 16 June 2026.
- Asia-Pacific and Australia, 3 of 5: Korean Air group from 1 September 2026; ZIPAIR fleet complete May 2026, free with no login; Singapore Airlines Starlink Q1 2027 to 2029 on A350 long-haul and A380 only, today 4 to 9 Mbps free for KrisFlyer members; Qantas Viasat free for all, A380s by about April 2027; Jetstar paid AUD 7 per device since March 2026; Virgin Australia 90% of 737s by end 2026; Cebu Pacific Starlink from 2027.
- Canada and Latin America, 3 of 5: Air Canada free for Aeroplan on North America and Sun routes since 1 May 2025, long-haul "in 2026" with no date; WestJet free Starlink, widebodies by end 2026; Copa live but free only for elites; Avianca OneWeb since December 2025 (unverified).
- The pass's top regional topics: Air India pricing; why Wi-Fi switches off over India; UK and European airlines with and without Wi-Fi; Korean Air and Asiana Starlink; Air Canada versus WestJet on long-haul.
