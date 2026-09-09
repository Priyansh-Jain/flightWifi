export interface BlogArticle {
  title: string;
  // used for <title> only, when the headline is too long for a search result line
  seoTitle?: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  content: string[];
  faqs?: { q: string; a: string }[];
  // The index card art. There are no stock illustrations here, so a card shows the verdicts the
  // article is actually about, drawn with the same chips the extension puts on a flight.
  art?: { cls: string; label: string }[];
  image?: string;
}

// Same shape as GetStopover's blog: content is an array of paragraphs, "## " starts a section,
// **bold** renders inline, [text](href) renders a link. Lines that are {{tokens}} render live
// blocks (registry tables, screenshots) so a data article can never go stale.
export const ARTICLES: Record<string, BlogArticle> = {
  "how-to-get-free-inflight-wifi": {
    image: "/images/blog/how-to-get-free-inflight-wifi.jpg",
    title: "How to Get Free In-Flight Wi-Fi on 13 Popular Airlines (and Actually Connect)",
    seoTitle: "How to Get Free In-Flight Wi-Fi on 13 Airlines",
    excerpt:
      "Who flies free, what the free tier really includes, the network name and portal address, and the one step to do before boarding, for Emirates, Qatar, Singapore, Lufthansa, United and eight more. Checked against each airline's own pages.",
    date: "2026-09-04",
    readTime: "10 min",
    category: "GUIDE",
    art: [
      { cls: "fast", label: "Free" },
      { cls: "fast", label: "Free with account" },
      { cls: "ok", label: "Free messaging" }
    ],
    content: [
      "Every airline now says it has Wi-Fi. Fewer say plainly who gets it free, and almost none tell you the two things that decide whether you are online ten minutes after take-off or still staring at a spinning login page: the exact network to join, and the one step you needed to do before you left home.",
      "This guide covers 13 airlines people ask about most. For each one: who flies free, what the free tier actually includes, the network name and portal address from the airline's own instructions, and the catch. Every connection step was checked against the airline's own Wi-Fi pages in September 2026, and each airline's name links to its FlightWifi page, where the per-aircraft verdict updates as the registry changes.",
      "**Two rules apply to almost every airline below.** Free usually means free for members of a loyalty programme that costs nothing to join, so join on the ground. And free does not mean fast: on most of these airlines the free tier runs over high-orbit satellite, which is fine for mail and browsing and useless for a video call. The exceptions are the Starlink-fitted aircraft, and those are marked.",
      "## Before you board: the three-minute checklist",
      "- Join the airline's free loyalty programme now, not from seat 34C over satellite. Every free tier below except Qantas, Air India, Japan Airlines' first hour and the first 45 minutes on Qatar is a member perk.",
      "- Add your membership number to the booking. Singapore Airlines wants it at least 1.5 hours before departure, Emirates before the flight, Cathay Pacific at booking or check-in. Without it the portal does not know you qualify.",
      "- Save the portal address for your airline from the list below. When the login page fails to appear, typing it is the fix nine times out of ten.",
      "- Know which system your aircraft carries. On a mid-rollout airline the same flight number can be Starlink on Tuesday and a 2015 satellite system on Wednesday. The [FlightWifi extension](/chrome-extension/) shows this on the exact aircraft while you search.",
      "## Emirates",
      "[Emirates](/airlines/emirates/) runs two very different products depending on the aircraft. On Starlink-fitted 777s and A380s the Wi-Fi is free for everyone in every cabin, and Emirates itself lists video calls among the things it is for. As of July 2026 that meant 33 Boeing 777s and 3 A380s, with the airline converting roughly 14 aircraft a month toward all 232 widebodies by mid-2027.",
      "On the rest of the fleet the older OnAir system is tiered by Emirates Skywards status. Members travelling in First or Business get free Wi-Fi for the whole flight, Platinum members get it in any cabin, and Blue, Silver and Gold members in Premium Economy and Economy get free unlimited chat covering WhatsApp, Messenger and similar apps. Children's Skysurfers accounts are excluded. Paid full-flight plans run US$9.99 to US$19.99 depending on flight length, and Emirates notes that streaming is restricted on this system.",
      "- Add your Emirates Skywards number to the booking in the app or through Manage your booking before you fly. Emirates says this is required for the free tiers.",
      "- After take-off, connect to the OnAir network on a legacy aircraft, or the Starlink network on a fitted one.",
      "- Log in with your Skywards details, then pick the free option or a paid plan.",
      "## Qatar Airways",
      "[Qatar Airways](/airlines/qatar-airways/) has the largest Starlink widebody fleet in the world: all of its 777s, A350s and 787-8s plus the first 787-9s, 150 aircraft as of 20 August 2026, with the remaining 787-9s due by the end of the year. On those aircraft everyone gets 45 minutes free and Privilege Club members get the whole flight, gate to gate at selected airports. Joining Privilege Club is free and can be done from the portal.",
      "The catch is the aircraft. Qatar's A380s and A330s still carry the older Inmarsat GX system, where Privilege Club members get a free one-hour pass and everyone else pays, and its A320-family narrowbodies have no Wi-Fi at all until the final phase of the Starlink programme.",
      "- On board, connect to the onboard Wi-Fi network and open the portal.",
      "- Take the 45 free minutes, or sign in with your Privilege Club details for the full flight. Not a member? Join from the portal.",
      "- Check the aircraft type on your booking: 777, A350 or 787 means Starlink, A380 or A330 means the legacy system.",
      "## Singapore Airlines",
      "[Singapore Airlines](/airlines/singapore-airlines/) gives unlimited free Wi-Fi to Suites, First and Business passengers, to PPS Club members and their supplementary cardholders, and to KrisFlyer members in Premium Economy and Economy. Non-members pay US$3.99 for an hour, US$8.99 for three hours or US$15.99 for the flight. The system is high-orbit satellite today, so it suits messaging, mail and browsing rather than calls. Starlink installations on the A350 and A380 begin in the first quarter of 2027.",
      "- Add your KrisFlyer number to the booking under Manage Booking at least 1.5 hours before departure, or at the check-in counter at the latest. Singapore Airlines is explicit about this deadline.",
      "- Above 10,000 feet, about 15 minutes after take-off, select the KrisWorld network. The portal should open by itself; if not, type kw.sq.com.",
      "- Choose the complimentary plan. Not a member yet? The portal has a Join KrisFlyer form that issues a Wi-Fi code on the spot.",
      "- Turn on Auto-Join for the KrisWorld network so your device does not drop off mid-flight.",
      "## Turkish Airlines",
      "[Turkish Airlines](/airlines/turkish-airlines/) makes the free tier a function of cabin and Miles&Smiles status on international flights. Business Class passengers with Elite or Elite Plus status get unlimited internet, and Business Class otherwise gets 1 GB. In economy, Elite and Elite Plus members get 400 MB, Classic Plus members 250 MB, and Classic members messaging only. Unlimited messaging is included at every tier. Paid passes can only be bought during the flight, and the airline notes that both free and paid quotas vary with flight time and aircraft type.",
      "- Join Miles&Smiles before you fly, or use the membership form on the Wi-Fi login page on board. Turkish Airlines says the form is enough to unlock messaging.",
      "- Above 10,000 feet, switch to airplane mode, turn Wi-Fi on and open the login page.",
      "- Sign in with your Miles&Smiles details to draw down your free quota.",
      "## Lufthansa",
      "[Lufthansa](/airlines/lufthansa/) is the newest entry here. Since 19 August 2026 its first Starlink aircraft, an A320neo, has been flying with Lufthansa Group Wi-Fi: free in every travel class for anyone with a Travel ID or Miles & More number, gate to destination. Up to ten more A320-family aircraft follow by the end of 2026 and around 850 group aircraft by 2029. Everything else still carries FlyNet, where messaging and internet are sold in tiered packages.",
      "- Create a free Travel ID on lufthansa.com before you fly, or use your Miles & More number.",
      "- On a Starlink aircraft, connect to the Lufthansa Group Wi-Fi network and sign in with that ID. Lufthansa says one login will work across all group airlines as they convert.",
      "- On a FlyNet aircraft, the same portal sells the messaging and internet packages.",
      "## Air France",
      "[Air France](/airlines/air-france/) offers free, unlimited Starlink Wi-Fi in every cabin, reserved for Flying Blue members. Joining is free and can be done on board in a few clicks. By June 2026 nearly 60% of the fleet was converted, with the rest due by the end of the year. Aircraft still waiting carry the older paid system.",
      "- Turn airplane mode on and, if you use a VPN, turn it off before you log in. Air France's own instructions say so.",
      "- Select the AirFranceWifi network. If the login portal does not open, type wifi.airfrance.com.",
      "- Sign in with your Flying Blue email or membership number and password.",
      "## United",
      "[United](/airlines/united/) gives free Starlink Wi-Fi to MileagePlus members only, on flights operated by Starlink-equipped aircraft. MileagePlus is free to join. United said more than 400 aircraft were equipped in June 2026 and expects close to 1,000 by the end of the year, with widebodies finishing in summer 2027. Aircraft not yet converted still use United's older providers, where MileagePlus members get a discount and can pay with miles rather than flying free. Voice and video calls are prohibited on United Wi-Fi whatever the system.",
      "- Join MileagePlus before you fly.",
      "- United says you will get a notification before departure if the flight is Starlink-equipped, and the flight status page shows a banner.",
      "- On board, connect to United's Wi-Fi network and sign in with your MileagePlus account. On Starlink aircraft every device can be online at once.",
      "## Delta",
      "[Delta](/airlines/delta/) makes Delta Sync Wi-Fi free for SkyMiles members on more than 800 aircraft, covering most domestic and international flights, with no limit on the number of devices. It is not available on Asia routes yet, coverage over Alaska is limited, and some regional jets still charge on select routes. Non-members can buy a Flight Pass on board. The system is high-orbit Viasat, good for mail and browsing; Delta's low-orbit Amazon Leo service does not start until 2028. Voice and video calls are not allowed.",
      "- Switch to airplane mode, turn Wi-Fi on and choose the DeltaWiFi.com network.",
      "- If the sign-in page does not open, go to deltawifi.com in your browser.",
      "- Enter your SkyMiles number and password, or choose Join for Free.",
      "## British Airways",
      "[British Airways](/airlines/british-airways/) is between two systems. On its five Starlink-equipped 787-8s the Wi-Fi is free in every cabin. Installations paused for the summer and resume at the end of October 2026, with the remaining 787-8s and then the 787-9s next. On the rest of the fleet the free tier is messaging only, for members of The British Airways Club: WhatsApp, iMessage, Messenger, Teams chat and text-only email. Non-members pay £1.99 to £2.99 for messaging on short-haul and £2.99 to £4.99 on long-haul, and browsing or streaming is a paid package for everyone.",
      "- Join the BAWi-Fi network, then enable Flight Mode once cruising above 10,000 feet.",
      "- Pick your device carefully. BA does not let you switch a session between devices.",
      "- The .air homepage should load; if not, type shop.ba.com. Tap the free messaging banner and sign in or sign up to the Club.",
      "## Japan Airlines",
      "[Japan Airlines](/airlines/japan-airlines/) is unusually generous with no membership required. On international flights every passenger gets the one-hour plan free, and First and Business passengers get unlimited free Wi-Fi. Longer plans cost US$14.40 for three hours or US$18.80 for the flight, with no data limits, and JAL Card holders pay a little less. Domestic flights are free for everyone.",
      "- Turn on airplane mode, then Wi-Fi, and select the Japan Airlines or JAL-WiFi network.",
      "- If the portal does not appear, type jal-wifi.com. Or tap Inflight Wi-Fi Connection in the JAL app, updated before boarding.",
      "- Choose the free one-hour plan. The hour counts from first login.",
      "## Cathay Pacific",
      "[Cathay Pacific](/airlines/cathay-pacific/) is free for First and Business passengers, for Diamond members, for Gold members in any cabin since December 2025, and for Premium Economy passengers who attach a Cathay membership number to the booking. Everyone else pays: US$3.95 for messaging, US$9.95 for an hour, US$12.95 for a full flight under six hours and US$19.95 to US$24.95 for longer ones, with no data caps.",
      "- Add your Cathay membership number when you book or at check-in. That is what unlocks the Premium Economy free tier.",
      "- In airplane mode, connect to the Cathay Pacific network. If no page pops up, enter wifi.cathaypacific.com.",
      "- Cathay emails a receipt with login details, which you can use to move the session to another device.",
      "## Qantas",
      "[Qantas](/airlines/qantas/) is the simplest entry here: free for every passenger in every cabin on Wi-Fi-connected aircraft, unlimited data, no login and no loyalty number. Domestic 737s and A220s have it, the international 787 fleet was completed in July 2026, and A380 retrofits run into 2027. Outside Australia and New Zealand Qantas describes the connection as varied, meaning messaging and browsing work but video streaming may not, though the ViaSat-3 satellite covering Asia-Pacific entered service on 31 August 2026.",
      "- Check the Qantas app 24 to 48 hours before departure to see whether your flight has Wi-Fi.",
      "- Enable Flight Mode and select the Qantas Free Wi-Fi network.",
      "- Follow the prompts on the You're connected screen. If nothing loads, type wifi.qantas.com.",
      "## Air India",
      "[Air India](/airlines/air-india/) offers free Wi-Fi, described as complimentary for an introductory period, on flights operated by its A350s, Boeing 787-9s and select A321neos, domestic and international. The 787-8s, the 777s and the rest of the fleet have no Wi-Fi until the Hughes rollout starting in 2027, so the aircraft type on your booking decides everything.",
      "- Open Wi-Fi settings and select the Air India Wi-Fi network.",
      "- On the portal, enter your PNR and last name.",
      "- Connect. There is no membership or payment step.",
      "## The habits that actually get you online",
      "Across all 13 airlines the failures are the same four.",
      "- The portal never opened. Airplane mode first, then Wi-Fi, then open a browser and type the portal address: kw.sq.com, wifi.airfrance.com, deltawifi.com, shop.ba.com, jal-wifi.com, wifi.cathaypacific.com or wifi.qantas.com.",
      "- The free tier is not showing. Your loyalty number is not on the booking. Singapore Airlines, Emirates and Cathay all say it has to be there before the flight.",
      "- Login fails. Turn the VPN off to sign in, then reconnect it. Air France calls this out explicitly.",
      "- You are online and the call drops. Not a fault. High-orbit systems add around 600 ms of delay, and Delta and United prohibit calls even on fast Wi-Fi. [Here is what latency decides](/blog/can-you-work-on-plane-wifi/).",
      "## One more thing: free on which plane?",
      "Eight of the 13 airlines above are somewhere between two systems. The same route can be a Starlink aircraft one day and a decade-old satellite system the next, and the airline's Wi-Fi page describes both as if you will get the better one. The [FlightWifi extension](/chrome-extension/) reads the exact aircraft on every Google Flights, Skyscanner and Soar result and shows which one you are actually booking. It is free, collects nothing, and the [dataset behind it is open](/data.json).",
      "Method: every connection step above comes from the airline's own Wi-Fi instructions or newsroom, read in September 2026. The fleet and pricing facts come from the same registry that powers the extension, with sources listed on each airline's page."
    ],
    faqs: [
      {
        q: "Which airlines give free Wi-Fi with no loyalty account at all?",
        a: "Qantas on all Wi-Fi-connected aircraft, Japan Airlines for the first hour on international flights and all of domestic, Air India on its A350, 787-9 and select A321neo flights, Qatar Airways for 45 minutes on Starlink aircraft, and Emirates and British Airways on their Starlink-fitted aircraft. Everywhere else, free means free for members of a programme that costs nothing to join."
      },
      {
        q: "Do I have to add my frequent flyer number before the flight?",
        a: "On Singapore Airlines yes, at least 1.5 hours before departure or at check-in. Emirates says to add it before the flight, and Cathay Pacific needs it at booking or check-in for the Premium Economy free tier. United, Delta, Air France, Lufthansa, British Airways and Turkish let you sign in on the portal instead."
      },
      {
        q: "Why won't the Wi-Fi login page open?",
        a: "Usually airplane mode was not on before Wi-Fi, a VPN is intercepting the redirect, or the captive portal simply did not fire. Turn airplane mode on, then Wi-Fi, turn the VPN off, and type the airline's portal address: kw.sq.com, wifi.airfrance.com, deltawifi.com, shop.ba.com, jal-wifi.com, wifi.cathaypacific.com or wifi.qantas.com."
      },
      {
        q: "Is free airline Wi-Fi good enough for video calls?",
        a: "Only on low-orbit Starlink aircraft, and only where the airline allows calls. Emirates, Qatar Airways and British Airways Starlink aircraft can carry a call. Delta and United prohibit voice and video calls on any system. The high-orbit systems that Singapore Airlines, Turkish, JAL, Cathay and Delta run today handle mail and browsing but not live calls."
      }
    ]
  },

  "which-airlines-have-starlink": {
    image: "/images/blog/which-airlines-have-starlink.jpg",
    title: "Which Airlines Have Starlink Wi-Fi? The Complete August 2026 Guide",
    seoTitle: "Which Airlines Have Starlink Wi-Fi?",
    excerpt:
      "An audit of 235 airlines against official sources: who really has Starlink in the air, who is halfway through, and whose Wi-Fi is secretly a movie server.",
    date: "2026-09-04",
    readTime: "9 min",
    category: "DATA",
    art: [
      { cls: "fast", label: "Video calls work" },
      { cls: "ok", label: "Varies by aircraft" },
      { cls: "none", label: "No Wi-Fi" }
    ],
    content: [
      "An airline announcing Starlink doesn't mean your flight has Starlink. That's the mistake thousands of travelers make every week.",
      "**Airlines announce deals. Planes get upgraded one aircraft at a time. Your ticket is for one specific aircraft, not for a press release.**",
      "After auditing 235 airlines, I realized there was no easy way to know whether your specific flight would actually have Starlink or an older satellite system. That's why I built [FlightWifi](/chrome-extension/), a free Chrome extension that shows flight Wi-Fi quality directly inside Google Flights before you book. This site is the dataset behind it.",
      "The audit reads airline documentation and connectivity-provider announcements first, and falls back to established aviation trade reporting for the minority of carriers that publish nothing about wifi. Every entry says which it rests on. Here is what it holds in August 2026, live from the registry:",
      "{{starlink-table}}",
      "## The full-coverage club",
      "These are the airlines where you don't need luck: every plane, or every plane of the listed type, has it. [Qatar Airways](/airlines/qatar-airways/) finished its 777, A350 and 787-8 widebodies. [airBaltic](/airlines/airbaltic/) and [ZIPAIR](/airlines/zipair/) cover their entire fleets, free for everyone with no account. [Virgin Atlantic](/airlines/virgin-atlantic/) completed all 12 A350s in June, while its 787s and A330s wait for their retrofits on the old paid system.",
      "## The coin-toss tier",
      "This is the tier that generates the viral praise and the angry follow-up posts. The system is genuinely flying, on some of the planes. [United](/airlines/united/) is at about 522 of 1,817 aircraft, converting dozens more each month. [Emirates](/airlines/emirates/) has 33 Boeing 777s and 3 A380s flying it, on the way to all 232 widebodies by mid-2027. [Air France](/airlines/air-france/) has done most widebodies but only 3 of 28 A320s. **On these fleets the honest verdict is the one the extension shows: varies by aircraft.**",
      "## Signed, celebrated, and not carrying a single passenger",
      "Every airline in the announced tier has a real Starlink contract and nothing in the air. The Lufthansa Group's 850-aircraft deal begins with a single A320neo on 19 August 2026. [Korean Air](/airlines/korean-air/) has hardware installed and switched off. [flydubai](/airlines/flydubai/) is the cautionary tale: it announced Starlink and removed its old Wi-Fi in the meantime, so today it flies with nothing.",
      "## The biggest lie in airline Wi-Fi",
      "Your phone shows full Wi-Fi bars. Your messages do not send.",
      "Because the \"Wi-Fi\" isn't connected to the internet. It's a movie server. Dozens of airlines advertise onboard Wi-Fi that is a local streaming network: films, a menu, a moving map, and no connection to the ground. easyJet, Transavia, Nok Air, Drukair, Vietjet and many others fall in this bucket today, and aggregator sites list them all as \"has Wi-Fi\".",
      "## Fast without Starlink",
      "Starlink isn't the only low-orbit game. [Amazon's Kuiper](/providers/kuiper/) reaches JetBlue from 2027. [Eutelsat OneWeb](/providers/oneweb/) capacity is already flying in a multi-orbit setup at [Avianca](/airlines/avianca/), which had 10 A320-family aircraft live as of December 2025. [SES's mid-orbit O3b mPOWER](/providers/ses/) already flies at [Thai Airways](/airlines/thai-airways/) and is coming to Air Astana. And the old guard's [high-orbit systems](/providers/viasat/) remain perfectly fine for mail and browsing, just not for a video call.",
      "## Want to know before you book?",
      "Fleet-level truth does not survive the booking screen. That's why the [FlightWifi extension](/chrome-extension/) reads the exact aircraft on every Google Flights, Skyscanner and Soar result and shows the verdict inline: video calls work, email and browsing, varies by aircraft, or no Wi-Fi at all.",
      "{{image:tooltip}}",
      "Method: every claim traces to a source listed on that airline's page, checked airline by airline, with the airline's own publications preferred over anything written about them. The live tables on this page update with the registry, and the [full dataset is open](/data.json). Spotted something that has since changed? Tell me and I'll correct it."
    ],
    faqs: [
      {
        q: "Which airlines have Starlink right now?",
        a: "As of August 2026, Starlink carries passengers on Qatar Airways, United, Emirates, Hawaiian, WestJet, SAS, Air France, Aer Lingus, Iberia, Virgin Atlantic, airBaltic, ZIPAIR, British Airways, Southwest, Alaska, Copa, Gulf Air and more. Many are mid-retrofit, so whether your specific plane has it varies by aircraft."
      },
      {
        q: "Is Starlink free on planes?",
        a: "Usually yes. Qatar, Emirates, airBaltic, ZIPAIR, Aer Lingus, Iberia and Gulf Air make it free for everyone on fitted aircraft; United, Air France, SAS, Southwest, Alaska, WestJet and Virgin Atlantic require a free loyalty account. Copa sells it in economy."
      },
      {
        q: "Which airlines have signed for Starlink but don't fly it yet?",
        a: "The Lufthansa Group (first aircraft 19 August 2026, 850+ jets through 2029), Korean Air and its group airlines, Singapore Airlines (installs from Q1 2027), El Al, flydubai, Frontier, Wizz Air, Volaris, JetSMART, Cebu Pacific and Vietjet. An announced deal delivers nothing on your flight today."
      },
      {
        q: "How fast is Starlink on a plane?",
        a: "The property that matters is latency: low orbit puts it around 20 to 50 ms, so video calls and live work behave like ground broadband. Throughput varies with load, which is why serious datasets do not quote speed numbers per flight."
      }
    ]
  },

  "which-airlines-offer-free-wifi": {
    image: "/images/blog/which-airlines-offer-free-wifi.jpg",
    title: "Which Airlines Offer Free Wi-Fi in 2026? The Honest List",
    seoTitle: "Which Airlines Offer Free Wi-Fi in 2026?",
    excerpt:
      "Free for everyone, free behind a loyalty sign-up, free messaging only, and the airlines whose free Wi-Fi is a movie server: the real tiers, from official sources.",
    date: "2026-09-04",
    readTime: "8 min",
    category: "DATA",
    art: [
      { cls: "fast", label: "Free" },
      { cls: "fast", label: "Free with account" },
      { cls: "part", label: "Paid" }
    ],
    content: [
      "\"Free airline Wi-Fi\" is four different products wearing one name. Some airlines give every passenger real internet with no strings. Some give it to anyone who creates a free loyalty account in the signup form on the portal. Some give you free messaging and charge for everything else. And some advertise free Wi-Fi that is not internet at all.",
      "**Knowing which tier your airline sits in is the difference between planning to work at 35,000 feet and staring at a login page that wants your credit card.** This list comes from the same registry that powers the FlightWifi extension: 235 airlines, each with its sources listed.",
      "## Free for every passenger, no account",
      "The shortest and best list. [airBaltic](/airlines/airbaltic/) gives free Starlink to everyone from boarding, no tier, no signup. [ZIPAIR](/airlines/zipair/) has done the same on its whole 787 fleet for years. [JetBlue](/airlines/jetblue/)'s Fly-Fi has been free at every seat since 2013. [Qantas](/airlines/qantas/) is free with no fare-class or loyalty gating, domestically and on switched-on international aircraft. [Aer Lingus](/airlines/aer-lingus/), [Iberia](/airlines/iberia/) and [Gulf Air](/airlines/gulf-air/) make Starlink free for everyone on fitted aircraft, and [Qatar Airways](/airlines/qatar-airways/) and [Emirates](/airlines/emirates/) do the same on their converted widebodies.",
      "[Air New Zealand](/airlines/air-new-zealand/) is free and unlimited after a one-off registration. [Porter](/airlines/porter-airlines/) is free gate to gate with a twist: members watch one 30-second ad for the whole flight, non-members watch one every half hour.",
      "## Free with a free account",
      "The biggest tier, and the catch is mild: the airline wants your email, not your money. [United](/airlines/united/) needs a MileagePlus account for its Starlink aircraft. [Delta](/airlines/delta/) needs SkyMiles. [American](/airlines/american-airlines/) went free in January 2026 with AAdvantage, with one sharp exception covered below. [Alaska](/airlines/alaska-airlines/) and [Hawaiian](/airlines/hawaiian-airlines/) need a free Atmos Rewards account, sponsored by T-Mobile. [Southwest](/airlines/southwest/) is free for Rapid Rewards members and a flat $8 for everyone else. [WestJet](/airlines/westjet/), [Air Canada](/airlines/air-canada/) (with Bell), [Air France](/airlines/air-france/) (Flying Blue), [SAS](/airlines/sas/) (EuroBonus), [Virgin Atlantic](/airlines/virgin-atlantic/) (Flying Club) and [KLM](/airlines/klm/) on European flights all follow the same pattern.",
      "**None of these accounts cost anything.** Two minutes of signup before the flight beats doing it through a seatback portal over satellite.",
      "## Free messaging, paid everything else",
      "A large middle tier gives away WhatsApp-class messaging and sells the rest. [Turkish Airlines](/airlines/turkish-airlines/) gives Miles&Smiles members free unlimited messaging. [Etihad](/airlines/etihad-airways/)'s chat tier is free through a free Etihad Guest sign-in. [Finnair](/airlines/finnair/) gives all Finnair Plus members free messaging on European flights. [Malaysia Airlines](/airlines/malaysia-airlines/) gives every passenger free messaging and social media after an email registration, and [Philippine Airlines](/airlines/philippine-airlines/) and the [Lufthansa](/airlines/lufthansa/) group's FlyNet messaging tier work the same way. [EgyptAir](/airlines/egyptair/) added unlimited free messaging plus two hours of browsing in April 2026.",
      "## The exceptions inside the free tiers",
      "Free-with-account has fine print worth knowing. **American's free AAdvantage Wi-Fi excludes its Boeing 777s and Panasonic-fitted 787s**, which are exactly the planes on its longest routes; those stay paid until their retrofits. Emirates is free in all cabins on Starlink-fitted aircraft, but on its unconverted planes the free tier is Skywards messaging and full access is paid or premium-cabin. Southwest's free tier is member-only, and the $8 flat fee still applies to everyone else.",
      "## \"Free Wi-Fi\" that is not internet",
      "The trap tier. Dozens of airlines advertise free onboard Wi-Fi that is a local entertainment server: movies, a menu, a moving map, and no connection to the world. easyJet, Transavia, Nok Air, Vietjet, Volotea and Aeroflot all fall here today. (Ryanair and IndiGo are a different case: they carry no onboard network at all, so there is nothing to connect to.) **Your phone shows full bars and your messages do not send.** Aggregator sites list every one of these as \"has Wi-Fi\", which is how the myth survives.",
      "## The aircraft catch",
      "Every \"free on fitted aircraft\" line above hides the same variable: which physical plane you get. Airlines convert one aircraft at a time, so a mid-rollout fleet gives one flight free Starlink and the next flight a paid system from 2015. The [FlightWifi extension](/chrome-extension/) resolves this per flight, on the exact aircraft, before you book, and the [Starlink page](/starlink/) shows how far each rollout has actually got.",
      "**The one-line summary: real free-for-all Wi-Fi exists and is growing, most \"free\" needs a free account, and the worst case is not paid Wi-Fi, it is fake Wi-Fi.**"
    ],
    faqs: [
      {
        q: "Which airlines have completely free Wi-Fi with no account?",
        a: "airBaltic, ZIPAIR, JetBlue, Qantas, and on fitted aircraft Aer Lingus, Iberia, Gulf Air, Qatar Airways and Emirates. Air New Zealand is free after a one-off registration, and Porter is free with ads."
      },
      {
        q: "Is United Wi-Fi free?",
        a: "On Starlink-fitted aircraft, yes, with a free MileagePlus account. About 522 of United's 1,817 aircraft were converted as of mid-August 2026, so whether your flight has it depends on the plane."
      },
      {
        q: "Why do airlines make free Wi-Fi require a loyalty account?",
        a: "The account is the price. Airlines fund free Wi-Fi partly through loyalty enrollment and sponsor deals (T-Mobile at Alaska and Hawaiian, Bell at Air Canada), so the free tier doubles as a signup channel. The accounts themselves cost nothing."
      },
      {
        q: "Is free airline Wi-Fi good enough to work on?",
        a: "It depends on the system, not the price. Free Starlink handles video calls and live work. Free tiers on high-orbit satellite handle mail and browsing but not calls, because latency there runs around 600 ms."
      }
    ]
  },

  "can-you-work-on-plane-wifi": {
    image: "/images/blog/can-you-work-on-plane-wifi.jpg",
    title: "Can You Actually Work on Plane Wi-Fi? What Latency Decides",
    seoTitle: "Can You Work on Plane Wi-Fi?",
    excerpt:
      "Video calls, VPNs, cloud docs and SSH at 35,000 feet: why the orbit above your plane matters more than the speed number, and which airlines ban calls even on fast Wi-Fi.",
    date: "2026-09-04",
    readTime: "7 min",
    category: "EXPLAINER",
    art: [
      { cls: "fast", label: "20-50 ms" },
      { cls: "ok", label: "600 ms" },
      { cls: "part", label: "Calls banned" }
    ],
    content: [
      "The question every remote worker asks before a long flight is the one airline marketing never answers: **can I actually work on this Wi-Fi, or will I lose the day?**",
      "The honest answer has almost nothing to do with megabits. It hangs on one number the Wi-Fi page never prints: how far away the satellite is.",
      "## Latency decides, not speed",
      "Every satellite Wi-Fi system on earth belongs to one of three orbits. Traditional systems use geostationary satellites parked about 36,000 km up; the round trip alone adds roughly 600 ms before any congestion. Medium-orbit systems like [SES's O3b mPOWER](/providers/ses/) sit around 8,000 km and land near 120 to 150 ms. Low-orbit constellations like [Starlink](/providers/starlink/) fly at about 550 km and deliver 20 to 50 ms, which is home-broadband territory.",
      "**Bandwidth tells you how fast a page loads. Latency tells you whether a live conversation is possible.** A high-orbit link can stream a movie beautifully and still make a video call unusable, because half a second of lag breaks the rhythm of human speech.",
      "## What works on which system",
      "On a low-orbit link, essentially everything works: video calls, screen shares, cloud documents, SSH sessions, pushing code. On a high-orbit link, asynchronous work is fine: email queues and sends, documents save, Slack messages arrive with a beat of delay. What fails is anything interactive in real time. Calls stutter and talk over themselves, remote desktops feel like wading, and every keystroke of an SSH session takes a detectable round trip.",
      "A VPN deserves its own line: it usually connects on either system, but on high orbit every handshake pays the 600 ms toll, so corporate VPNs feel dramatically slower than the raw connection. A few airlines also exclude VPN traffic from promotional free tiers, so if the VPN is mandatory for your work, check the fine print of the free package.",
      "## The airlines that ban calls on fast Wi-Fi",
      "Here is the wrinkle the latency table misses: **some airlines have fast Wi-Fi and prohibit calls anyway**, as cabin policy rather than a technical limit. Delta, United, WestJet, SAS and Air New Zealand state it outright, and several more are reported to. [Virgin Atlantic](/airlines/virgin-atlantic/) permits voice calls but not video. [British Airways](/airlines/british-airways/), [Qatar Airways](/airlines/qatar-airways/) and [Aer Lingus](/airlines/aer-lingus/) let calls happen. The FlightWifi verdict chips carry this distinction: fast Wi-Fi with a call ban reads \"Fast, but no calls\" instead of \"Video calls work\".",
      "## Same airline, different day, different office",
      "The final trap is fleet variance. On a mid-retrofit airline, Tuesday's flight has a low-orbit system and Wednesday's identical flight number has the 2015 one, because airlines convert one aircraft at a time. [United](/airlines/united/) is around 29% converted; [Emirates](/airlines/emirates/) has 36 widebodies done of 232. **The plane decides your workday, not the airline logo**, which is why per-aircraft verdicts exist at all.",
      "## How to plan a working flight",
      "Treat it like choosing a desk. Check the [airline's page](/airlines/) for its per-aircraft verdict, or let the [extension](/chrome-extension/) show it inline while you search. If the verdict is \"Varies by aircraft\", assume the slow case and be pleasantly surprised. Download the heavy files before boarding, queue the async work for high-orbit legs, and save the calls for flights where the verdict actually says calls work.",
      "**The airlines can't tell you which plane you'll get. The data can tell you what each plane carries. Plan against the second thing.**"
    ],
    faqs: [
      {
        q: "Can you make video calls on plane Wi-Fi?",
        a: "Only on low-orbit systems like Starlink, where latency is 20 to 50 ms, and only on airlines that permit calls. Traditional high-orbit Wi-Fi adds roughly 600 ms of lag, which breaks live calls even when bandwidth is fine, and several airlines ban calls as cabin policy regardless."
      },
      {
        q: "Does a VPN work on airplane Wi-Fi?",
        a: "Usually yes on both orbit classes, but on high-orbit systems every round trip pays about 600 ms, so VPN-tunneled work feels much slower. A few airlines exclude VPN traffic from free promotional tiers, so check the package terms if a VPN is mandatory for you."
      },
      {
        q: "Is plane Wi-Fi fast enough for Zoom?",
        a: "On Starlink-equipped aircraft, yes, when the airline permits calls. On geostationary-satellite Wi-Fi, no: the lag makes participants talk over each other even when the connection streams video smoothly."
      },
      {
        q: "Why do some airlines ban calls even with fast Wi-Fi?",
        a: "Cabin experience policy: airlines like Delta, United, WestJet, SAS and Air New Zealand prohibit voice and video calls so passengers are not stuck next to an hour-long meeting. The restriction is enforced as policy, not by the technology."
      }
    ]
  }
};
