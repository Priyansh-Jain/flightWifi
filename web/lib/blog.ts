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
}

// Same shape as GetStopover's blog: content is an array of paragraphs, "## " starts a section,
// **bold** renders inline, [text](href) renders a link. Lines that are {{tokens}} render live
// blocks (registry tables, screenshots) so a data article can never go stale.
export const ARTICLES: Record<string, BlogArticle> = {
  "which-airlines-have-starlink": {
    title: "Which Airlines Have Starlink Wi-Fi? The Complete August 2026 Guide",
    seoTitle: "Which Airlines Have Starlink Wi-Fi?",
    excerpt:
      "An audit of 235 airlines against official sources: who really has Starlink in the air, who is halfway through, and whose Wi-Fi is secretly a movie server.",
    date: "2026-08-18",
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
    title: "Which Airlines Offer Free Wi-Fi in 2026? The Honest List",
    seoTitle: "Which Airlines Offer Free Wi-Fi in 2026?",
    excerpt:
      "Free for everyone, free behind a loyalty sign-up, free messaging only, and the airlines whose free Wi-Fi is a movie server: the real tiers, from official sources.",
    date: "2026-08-18",
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
      "Every \"free on fitted aircraft\" line above hides the same variable: which physical plane you get. Airlines convert one aircraft at a time, so a mid-rollout fleet gives one flight free Starlink and the next flight a paid system from 2015. The [FlightWifi extension](/chrome-extension/) resolves this per flight, on the exact aircraft, before you book, and the [Starlink tracker](/starlink/) shows how far each rollout has actually got.",
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
    title: "Can You Actually Work on Plane Wi-Fi? What Latency Decides",
    seoTitle: "Can You Work on Plane Wi-Fi?",
    excerpt:
      "Video calls, VPNs, cloud docs and SSH at 35,000 feet: why the orbit above your plane matters more than the speed number, and which airlines ban calls even on fast Wi-Fi.",
    date: "2026-08-18",
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
