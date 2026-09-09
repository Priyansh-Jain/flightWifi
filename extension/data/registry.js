const WIFI_REGISTRY = {
  "TK": {
    "airline": "Turkish Airlines",
    "rules": [
      {
        "fleet": "widebody",
        "provider": "Panasonic",
        "orbit": "GEO"
      },
      {
        "fleet": "narrowbody",
        "provider": "Anuvu",
        "orbit": "GEO"
      }
    ],
    "access": "Gated by cabin + Miles&Smiles tier; Classic gets free unlimited messaging, Classic Plus adds 250MB and Elite tiers 400MB in economy with unlimited free in business; paid international passes $5-35",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.turkishairlines.com/en-us/miles-and-smiles/miles-features/onboard-wi-fi-with-miles/",
      "https://awardwallet.com/airlines/turkish-airlines-wifi/",
      "https://www.anuvu.com/our-company/press-releases/detail/308/anuvu-airlines-aircraft"
    ]
  },
  "EK": {
    "starlink": {
      "status": "flying",
      "access": "free",
      "progress": {
        "done": 36,
        "of": 232,
        "scope": "777 and A380 fleet",
        "as_of": "2026-07",
        "basis": "airline",
        "source": "https://www.emirates.com/media-centre/one-million-connections-and-counting-emirates-customers-embrace-starlink-wi-fi/"
      },
      "milestones": [
        {
          "date": "2026-07",
          "text": "One million Starlink connections; 33 Boeing 777s and 3 A380s flying",
          "source": "https://www.emirates.com/media-centre/one-million-connections-and-counting-emirates-customers-embrace-starlink-wi-fi/"
        },
        {
          "date": "2026-04",
          "text": "First A380 enters service with Starlink, using a three-antenna installation",
          "source": "https://www.emirates.com/media-centre/its-time-emirates-iconic-a380-returns-to-dubai-with-world-first-starlink-wi-fi-onboard/"
        }
      ]
    },
    "airline": "Emirates",
    "rules": [
      {
        "fleet": "all",
        "provider": "Panasonic/Thales GEO on unfitted aircraft; Starlink in service (33 Boeing 777 and 3 A380 flying as of Jul 2026, ~150 aircraft by end of 2026, all 232 777s and A380s by mid-2027)",
        "orbit": "mixed GEO/LEO"
      }
    ],
    "access": "Free in all cabins on Starlink-fitted aircraft; on GEO aircraft, free tiers for Skywards members with full access paid or premium-cabin.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://www.emirates.com/media-centre/gaining-speed-at-40000-feet-emirates-set-to-operate-the-worlds-largest-starlink-enabled-international-wide-body-fleet-bringing-ultra-fast-connectivity-on-232-boeing-777-and-a380-aircraft/",
      "https://awardwallet.com/airlines/emirates-wifi/",
      "https://gulfnews.com/business/aviation/dubais-emirates-to-offer-free-starlink-wi-fi-on-150-aircraft-by-end-of-2026-1.500423320"
    ]
  },
  "QR": {
    "starlink": {
      "status": "flying",
      "access": "free_with_account",
      "progress": {
        "done": 150,
        "pct": 83,
        "scope": "widebody fleet (777, A350, 787)",
        "as_of": "2026-08-20",
        "basis": "airline",
        "source": "https://www.qatarairways.com/press-releases/en-WW/269475-qatar-airways-150-starlink-equipped-widebody-aircraft-now-include-world-s-first-starlink-equipped-boeing-787-9/"
      },
      "milestones": [
        {
          "date": "2026-08-20",
          "text": "150 Starlink widebodies; 787-8 sub-fleet complete and the first 787-9 in service",
          "source": "https://www.qatarairways.com/press-releases/en-WW/269475-qatar-airways-150-starlink-equipped-widebody-aircraft-now-include-world-s-first-starlink-equipped-boeing-787-9/"
        }
      ]
    },
    "airline": "Qatar Airways",
    "rules": [
      {
        "types": "777|A350|787",
        "provider": "Starlink",
        "orbit": "LEO"
      },
      {
        "types": "787",
        "provider": "787-8 sub-fleet fully equipped (completed in seven months); first Starlink 787-9 in service, more than half the 787 fleet equipped and the type due to complete by end of 2026; Inmarsat GX/SITA OnAir until fitted",
        "orbit": "mixed GEO/LEO"
      },
      {
        "types": "A380|A330",
        "provider": "Inmarsat GX / SITA OnAir",
        "orbit": "GEO"
      },
      {
        "fleet": "narrowbody",
        "provider": "None yet on the A320 family (final phase of the Starlink programme)",
        "orbit": "NONE"
      },
      {
        "fleet": "all",
        "provider": "Starlink on 150 widebodies as of 20 August 2026: the 777, A350 and 787-8 programmes are complete and more than 83% of the widebody fleet is connected",
        "orbit": "mixed GEO/LEO"
      }
    ],
    "access": "Starlink on the 777, A350 and 787 is free, but only 45 minutes for a passenger who is not a Privilege Club member; members get the whole flight and joining is free. Gate-to-gate at select airports only. Legacy widebodies tiered (free 1-hour pass for Privilege Club members, paid from $10); narrowbodies have no wifi yet",
    "confidence": "sourced",
    "needs_verification": true,
    "as_of": "2026-09",
    "sources": [
      "https://www.qatarairways.com/press-releases/en-WW/269475-qatar-airways-150-starlink-equipped-widebody-aircraft-now-include-world-s-first-starlink-equipped-boeing-787-9/",
      "https://www.qatarairways.com/en/onboard/connectivity.html",
      "https://www.qatarairways.com/press-releases/en-WW/259315-qatar-airways-launches-world-s-first-starlink-equipped-boeing-787-and-completes-airbus-a350-starlink-rollout-connecting-over-11-millio/",
      "https://onemileatatime.com/news/qatar-airways-free-starlink-wi-fi/",
      "https://awardwallet.com/airlines/qatar-airways-wifi/"
    ]
  },
  "UA": {
    "starlink": {
      "status": "flying",
      "access": "free_with_account",
      "progress": {
        "done": 563,
        "of": 1658,
        "scope": "mainline and United Express fleet",
        "as_of": "2026-09-07",
        "basis": "tracker",
        "source": "https://unitedstarlinktracker.com/"
      },
      "milestones": [
        {
          "date": "2026-06-22",
          "text": "First Starlink widebody flight, UA14 Newark to London on a 777-200",
          "source": "https://www.united.com/en/us/newsroom/announcements/cision-125469"
        },
        {
          "date": "2026-06",
          "text": "More than 400 aircraft equipped; close to 1,000 targeted by end of 2026",
          "source": "https://aerospaceglobalnews.com/news/united-starlink-1000-aircraft-end-2026/"
        }
      ]
    },
    "airline": "United",
    "rules": [
      {
        "fleet": "rollout",
        "provider": "Starlink rollout underway (United said more than 400 aircraft in June 2026 and close to 1,000 by end of 2026; public trackers count roughly 540 in late August; widebodies complete by summer 2027); legacy Viasat/Panasonic on unconverted tails",
        "orbit": "mixed LEO/GEO"
      }
    ],
    "access": "Free with MileagePlus (free signup) on Starlink-fitted aircraft",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://onemileatatime.com/news/united-airlines-free-starlink-wi-fi/",
      "https://unitedstarlinktracker.com/",
      "https://aerospaceglobalnews.com/news/united-starlink-1000-aircraft-end-2026/"
    ]
  },
  "AI": {
    "airline": "Air India",
    "rules": [
      {
        "types": "A350",
        "provider": "Panasonic Avionics (Nelco/Intelsat), free",
        "orbit": "GEO"
      },
      {
        "types": "787",
        "provider": "Free Panasonic wifi on the 787-9s only; the 787-8s are unfitted until the Hughes rollout from 2027, and Google does not distinguish them",
        "orbit": "mixed GEO/none"
      },
      {
        "types": "A321",
        "provider": "Free Panasonic wifi on select A321neos only",
        "orbit": "mixed GEO/none"
      },
      {
        "fleet": "all",
        "provider": "None on the 777s and the rest of the fleet until the Hughes rollout from 2027",
        "orbit": "NONE"
      }
    ],
    "access": "Free on wifi-fitted A350/787-9/select A321neo",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://www.airindia.com/in/en/newsroom/press-release/Air-India-becomes-the-first-Indian-airline-to-offer-wi-fi-on-domestic-flights.html",
      "https://livefromalounge.com/hughes-to-power-air-india-in-flight-connectivity-2027-onwards/"
    ]
  },
  "6E": {
    "airline": "IndiGo",
    "rules": [
      {
        "fleet": "all",
        "provider": "None",
        "orbit": "NONE"
      }
    ],
    "access": "IndiGo has no inflight wifi today; first A321XLR wifi trials expected late 2026",
    "confidence": "reported",
    "as_of": "2026-09",
    "sources": [
      "https://www.happyfares.in/blog/inflight-wifi-indian-airlines-2026/"
    ]
  },
  "EY": {
    "airline": "Etihad Airways",
    "rules": [
      {
        "fleet": "all",
        "provider": "Viasat",
        "orbit": "GEO"
      }
    ],
    "access": "Wi-Fly Chat free for all passengers via Etihad Guest sign-in (free to join); Surf US$9.99 on flights under 7h and US$19.99 over 7h, free in First and for Guest Platinum and Exclusive tiers, 25% off for Gold",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.etihad.com/en/news/etihad-launches-new-wifly-with-free-chat-packages-and-unlimited-data",
      "https://www.etihad.com/en/plan/fly-with-etihad/onboard-services"
    ]
  },
  "DL": {
    "airline": "Delta",
    "rules": [
      {
        "fleet": "most",
        "provider": "Viasat (Delta Sync)",
        "orbit": "GEO"
      },
      {
        "fleet": "rollout",
        "provider": "Amazon Leo LEO agreed 31 March 2026 for an initial 500 aircraft with installation from 2028, free for SkyMiles members; Viasat GEO until then",
        "orbit": "mixed GEO/LEO"
      }
    ],
    "access": "Free for SkyMiles members (free signup); nearly all domestic + transatlantic fitted, transpacific completing through 2026",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://www.delta.com/us/en/onboard/inflight-entertainment/onboard-wifi",
      "https://traveltomorrow.com/delta-installs-free-wi-fi-on-1000th-plane-entire-fleet-to-be-equipped-in-2026/",
      "https://news.delta.com/delta-amazon-leo-sign-agreement-deliver-next-era-connected-travel-and-digital-experiences"
    ]
  },
  "BA": {
    "starlink": {
      "status": "flying",
      "access": "free",
      "progress": {
        "done": 5,
        "of": 30,
        "scope": "787 fleet, first phase (12 787-8s, then 18 787-9s)",
        "as_of": "2026-06",
        "basis": "trade",
        "source": "https://simpleflying.com/british-airways-suspends-starlink-installations-later-this-year/"
      },
      "milestones": [
        {
          "date": "2026-06",
          "text": "Installations paused for the summer after five 787-8s; resume at the end of October",
          "source": "https://simpleflying.com/british-airways-suspends-starlink-installations-later-this-year/"
        },
        {
          "date": "2026-03-19",
          "text": "First Starlink flight, a 787-8 to Houston",
          "source": "https://mediacentre.britishairways.com/news/19032026/british-airways-first-starlink-flight-takes-off-making-the-airline-the-first-in-the-uk-to-launch-the-fastest-wi-fi-in-the-sky"
        }
      ]
    },
    "airline": "British Airways",
    "rules": [
      {
        "fleet": "rollout",
        "provider": "Legacy GEO wifi on most aircraft; Starlink in service since 19 March 2026 on five Boeing 787-8s (installations paused for summer, resuming end of October 2026 with the remaining seven 787-8s, then the 18 787-9s), free in every cabin on equipped aircraft",
        "orbit": "mixed GEO/LEO"
      }
    ],
    "access": "Paid GEO packages on unequipped aircraft with free messaging for Executive Club members; free full wifi in all cabins on Starlink-equipped aircraft.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://mediacentre.britishairways.com/news/06112025/british-airways-signs-major-deal-with-starlink-to-provide-every-customer-in-every-cabin-free-wi-fi-that-feels-like-home-another-big-investment-for-the-airline-as-part-of-its-7bn-transformation-journey",
      "https://mediacentre.britishairways.com/news/19032026/british-airways-first-starlink-flight-takes-off-making-the-airline-the-first-in-the-uk-to-launch-the-fastest-wi-fi-in-the-sky"
    ]
  },
  "LH": {
    "starlink": {
      "status": "flying",
      "access": "free_with_account",
      "progress": {
        "done": 1,
        "of": 11,
        "scope": "A320-family launch batch due by end of 2026",
        "as_of": "2026-08-19",
        "basis": "airline",
        "source": "https://newsroom.lufthansagroup.com/en/lufthansa-takes-off-with-starlink-high-speed-internet-for-the-first-time/"
      },
      "milestones": [
        {
          "date": "2026-08-19",
          "text": "First Starlink passenger flight, A320neo D-AINM on LH234 Frankfurt to Rome",
          "source": "https://newsroom.lufthansagroup.com/en/lufthansa-takes-off-with-starlink-high-speed-internet-for-the-first-time/"
        }
      ]
    },
    "airline": "Lufthansa",
    "rules": [
      {
        "fleet": "rollout",
        "provider": "FlyNet (GEO) on most aircraft; Starlink in passenger service since 19 August 2026 (first aircraft A320neo D-AINM, LH234 Frankfurt-Rome), up to ten more A320-family aircraft at Lufthansa and Lufthansa City Airlines due by end of 2026, around 850 group aircraft by 2029",
        "orbit": "mixed GEO/LEO"
      }
    ],
    "access": "Messaging and tiered paid packages on FlyNet aircraft; Starlink is free for Miles & More and Travel ID users in every class on fitted aircraft",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://aerospaceglobalnews.com/news/lufthansa-group-starlink-in-flight-wifi-global-fleet/",
      "https://liveandletsfly.com/lufthansa-starlink-wi-fi/",
      "https://runwaygirlnetwork.com/2026/08/lufthansa-a320neo-to-debut-starlink-inflight-wi-fi-on-august-19/",
      "https://newsroom.lufthansagroup.com/en/lufthansa-takes-off-with-starlink-high-speed-internet-for-the-first-time/",
      "https://newsroom.lufthansagroup.com/en/lufthansa-group-launches-free-high-speed-internet-from-starlink/"
    ]
  },
  "AA": {
    "starlink": {
      "status": "announced",
      "access": "unannounced",
      "milestones": [
        {
          "date": "2026-05",
          "text": "Starlink selected for 500-plus Airbus narrowbodies, installs from 2027",
          "source": "https://www.cnbc.com/2026/05/26/american-airlines-spacex-starlink.html"
        }
      ]
    },
    "airline": "American Airlines",
    "rules": [
      {
        "fleet": "most",
        "types": "737|A319|A320|A321|787|Embraer 175|ERJ-175|E175|CRJ900",
        "provider": "Viasat and Intelsat high-speed satellite Ka/Ku",
        "orbit": "GEO"
      },
      {
        "types": "777",
        "orbit": "GEO",
        "provider": "Panasonic Ku, paid packages - the 777s (and Panasonic-fitted 787s) are excluded from the free AAdvantage program"
      }
    ],
    "access": "Free since January 2026 for AAdvantage members (free to join, can enroll onboard), sponsored by AT&T, across the entire narrowbody and dual-class regional fleets; 777s and Panasonic-fitted 787s keep paid Panasonic wifi; Starlink announced May 2026 for 500+ Airbus narrowbodies with installs from 2027.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://news.aa.com/news/news-details/2026/American-Airlines-launches-FREE-high-speed-Wi-Fi-sponsored-by-ATT-available-on-more-aircraft-than-any-other-carrier-in-the-world/default.aspx",
      "https://about.att.com/aboutus/pressrelease/2026/american-airlines-launches-free-wifi.html",
      "https://news.aa.com/news/news-details/2025/Connecting-the-world-American-Airlines-to-provide-complimentary-inflight-Wi-Fi-sponsored-by-ATT-MKG-OB-04/default.aspx",
      "https://www.cnbc.com/2026/05/26/american-airlines-spacex-starlink.html"
    ]
  },
  "AS": {
    "starlink": {
      "status": "flying",
      "access": "free_with_account",
      "progress": {
        "done": 142,
        "of": 400,
        "scope": "Alaska and Hawaiian combined fleet",
        "as_of": "2026-09",
        "basis": "tracker",
        "source": "https://www.starlinkflights.com/airlines/as"
      },
      "milestones": [
        {
          "date": "2026-07",
          "text": "All E175 regional jets equipped; 737 retrofits under way, 787s from autumn 2026",
          "source": "https://www.futuretravelexperience.com/2026/07/alaska-airlines-and-hawaiian-airlines-accelerate-starlink-wifi-rollout-across-combined-fleet/"
        },
        {
          "date": "2026-07",
          "text": "Free Atmos Rewards membership now required for free Starlink on Alaska and Hawaiian",
          "source": "https://news.alaskaair.com/guest-experience/atmos-rewards-members-unlock-free-inflight-wi-fi-on-alaska-hawaiian-airlines-thanks-to-t-mobile/"
        }
      ]
    },
    "airline": "Alaska Airlines",
    "rules": [
      {
        "fleet": "rollout",
        "provider": "Starlink (all E175 regionals done; mainline 737 retrofits underway, 787s from fall 2026); legacy GEO paid wifi on unconverted 737s",
        "orbit": "mixed GEO/LEO"
      }
    ],
    "access": "Free on Starlink-equipped aircraft, sponsored by T-Mobile; since mid-July 2026 a free Atmos Rewards membership is required (under-18s can connect with reservation details). Non-Starlink aircraft remain paid.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://news.alaskaair.com/guest-experience/atmos-rewards-members-unlock-free-inflight-wi-fi-on-alaska-hawaiian-airlines-thanks-to-t-mobile/",
      "https://www.futuretravelexperience.com/2026/07/alaska-airlines-and-hawaiian-airlines-accelerate-starlink-wifi-rollout-across-combined-fleet/"
    ],
    "needs_verification": true
  },
  "B6": {
    "airline": "JetBlue",
    "rules": [
      {
        "fleet": "all",
        "provider": "Viasat (Fly-Fi)",
        "orbit": "GEO"
      },
      {
        "fleet": "rollout",
        "provider": "Amazon Leo (formerly Project Kuiper) LEO on roughly a quarter of the fleet, installs beginning 2027 and completing 2028, running alongside Viasat as a hybrid GEO/LEO network",
        "orbit": "mixed GEO/LEO"
      }
    ],
    "access": "Free for every passenger at every seat with no loyalty membership or purchase required, and has been since 2013.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://investors.viasat.com/news-releases/news-release-details/jetblue-becomes-only-airline-free-high-speed-wi-fi-every-seat",
      "https://www.cnbc.com/2025/09/04/jetblue-in-flight-wifi-amazon-kuiper-satellite.html",
      "https://aerospaceglobalnews.com/news/jetblue-amazon-kuiper-inflight-wifi-2027/"
    ]
  },
  "WN": {
    "starlink": {
      "status": "flying",
      "access": "free_with_account",
      "milestones": [
        {
          "date": "2026-06",
          "text": "First Starlink 737-800 enters service; about 300 of 800-plus 737s targeted by end of 2026",
          "source": "https://www.aerotime.aero/articles/southwest-airlines-debuts-starlink-inflight-wi-fi-connectivity"
        },
        {
          "date": "2025-10-24",
          "text": "Wi-Fi becomes free for Rapid Rewards members",
          "source": "https://paxex.aero/southwest-wi-fi-goes-free/"
        }
      ]
    },
    "airline": "Southwest",
    "rules": [
      {
        "fleet": "rollout",
        "provider": "Starlink rollout since Jun 2026 (~300 of 800+ 737s targeted by end of 2026); Viasat and Anuvu GEO on the rest",
        "orbit": "mixed GEO/LEO"
      }
    ],
    "access": "Free for Rapid Rewards members (free to join) since 24 October 2025; non-members pay a flat $8 per device per flight.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://runwaygirlnetwork.com/2025/09/southwest-free-inflight-wi-fi/",
      "https://paxex.aero/southwest-wi-fi-goes-free/",
      "https://www.aerotime.aero/articles/southwest-airlines-debuts-starlink-inflight-wi-fi-connectivity",
      "https://onemileatatime.com/news/southwest-airlines-starlink-wi-fi/"
    ]
  },
  "F9": {
    "starlink": {
      "status": "announced",
      "access": "unannounced",
      "milestones": [
        {
          "date": "2026-07-14",
          "text": "Starlink announced, installs from early 2027",
          "source": "https://news.flyfrontier.com/frontier-airlines-to-offer-starlink-the-fastest-wifi-in-the-sky/"
        }
      ]
    },
    "airline": "Frontier",
    "rules": [
      {
        "fleet": "all",
        "orbit": "NONE",
        "provider": "None today - Starlink announced 14 July 2026 with installs from early 2027, run directly by Starlink; pricing unannounced"
      }
    ],
    "access": "No inflight Wi-Fi available on any Frontier aircraft today; Starlink service starts early 2027 and pricing has not been announced.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://news.flyfrontier.com/frontier-airlines-to-offer-starlink-the-fastest-wifi-in-the-sky/",
      "https://www.cnbc.com/2026/07/14/frontier-airlines-wifi-spacex-starlink.html",
      "https://qz.com/frontier-airlines-starlink-wifi-indigo-partners-071426"
    ]
  },
  "HA": {
    "starlink": {
      "status": "flying",
      "access": "free_with_account",
      "progress": {
        "pct": 100,
        "scope": "Airbus fleet (A330 and A321neo); 787s from autumn 2026, 717s never",
        "as_of": "2024-10",
        "basis": "trade",
        "source": "https://www.futuretravelexperience.com/2024/10/hawaiian-airlines-now-offering-fast-and-free-starlink-wifi-connectivity-across-entire-airbus-fleet/"
      },
      "milestones": [
        {
          "date": "2024-10",
          "text": "Starlink live across the entire Airbus fleet",
          "source": "https://www.futuretravelexperience.com/2024/10/hawaiian-airlines-now-offering-fast-and-free-starlink-wifi-connectivity-across-entire-airbus-fleet/"
        }
      ]
    },
    "airline": "Hawaiian Airlines",
    "rules": [
      {
        "types": "A330|A321",
        "provider": "Starlink",
        "orbit": "LEO"
      },
      {
        "types": "787",
        "provider": "None yet; Starlink installs expected fall 2026",
        "orbit": "NONE"
      },
      {
        "types": "717",
        "provider": "None, and none planned on the interisland 717s",
        "orbit": "NONE"
      }
    ],
    "access": "Free on Starlink-equipped Airbus aircraft; since mid-July 2026 requires free Atmos Rewards membership, sponsored by T-Mobile. Boeing 717 inter-island flights have no Wi-Fi and none is planned.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://www.futuretravelexperience.com/2024/10/hawaiian-airlines-now-offering-fast-and-free-starlink-wifi-connectivity-across-entire-airbus-fleet/",
      "https://onemileatatime.com/news/hawaiian-airlines-free-starlink-wi-fi/",
      "https://news.alaskaair.com/guest-experience/atmos-rewards-members-unlock-free-inflight-wi-fi-on-alaska-hawaiian-airlines-thanks-to-t-mobile/"
    ]
  },
  "AC": {
    "starlink": {
      "status": "flying",
      "access": "free_with_account",
      "progress": {
        "done": 9,
        "of": 25,
        "scope": "Jazz Dash 8-400 fleet only; mainline stays on Intelsat 2Ku",
        "as_of": "2026-02",
        "basis": "trade",
        "source": "https://paxex.aero/air-canada-q400-starlink/"
      },
      "milestones": [
        {
          "date": "2026-02",
          "text": "9 of 25 Dash 8-400s equipped under the Jazz cabin programme",
          "source": "https://paxex.aero/air-canada-q400-starlink/"
        }
      ]
    },
    "airline": "Air Canada",
    "rules": [
      {
        "fleet": "most",
        "provider": "Intelsat 2Ku, replacing the legacy Gogo air-to-ground system",
        "orbit": "GEO"
      },
      {
        "fleet": "rollout",
        "types": "Dash[ -]?8|Q400",
        "provider": "Starlink on 25 Dash 8-400s under the Jazz cabin-modernization program (9 equipped as of Feb 2026, retrofits targeted complete by mid-2026), focused on Billy Bishop Toronto routes; not on mainline aircraft",
        "orbit": "LEO"
      }
    ],
    "access": "Free for Aeroplan members (free to join), sponsored by Bell, on North America, Mexico and Caribbean flights since 1 May 2025 and expanding to international and widebody routes during 2026; non-members can buy a flat-fee pass.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://www.newswire.ca/news-releases/fast-free-wi-fi-for-aeroplan-members-sponsored-by-bell-now-on-air-canada-air-canada-rouge-and-air-canada-express-flights-in-north-america-mexico-and-the-caribbean-845790877.html",
      "https://paxex.aero/air-canada-free-wifi/",
      "https://paxex.aero/air-canada-q400-starlink/",
      "https://www.aircanada.com/media/fast-free-wi-fi-for-aeroplan-members-takes-flight/",
      "https://runwaygirlnetwork.com/2025/09/air-canada-taps-starlink-for-some-q400s-as-part-of-broader-redesign/"
    ]
  },
  "WS": {
    "starlink": {
      "status": "flying",
      "access": "free_with_account",
      "progress": {
        "pct": 100,
        "scope": "737 fleet (completion reported for end of 2025); 787-9 installs run through 2026",
        "as_of": "2025-12",
        "basis": "trade",
        "source": "https://mobilesyrup.com/2025/09/26/westjet-free-wi-fi-starlink-telus-end-of-year/"
      }
    },
    "airline": "WestJet",
    "rules": [
      {
        "types": "737",
        "provider": "Starlink (narrowbody fleet completed through end of 2025)",
        "orbit": "LEO"
      },
      {
        "types": "787",
        "provider": "Starlink installs on 787-9s running through end of 2026",
        "orbit": "mixed GEO/LEO"
      }
    ],
    "access": "Free for WestJet Rewards members (free to join), presented by TELUS under a multi-year partnership.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.westjet.com/en-ca/news/2024/westjet-and-telus-form-partnership-to-revolutionize-guest-experi",
      "https://www.telus.com/en/about/news-and-events/media-releases/WestJet-and-TELUS-form-partnership-to-revolutionize-guest-experience",
      "https://mobilesyrup.com/2025/09/26/westjet-free-wi-fi-starlink-telus-end-of-year/"
    ]
  },
  "AM": {
    "airline": "Aeromexico",
    "rules": [
      {
        "fleet": "most",
        "types": "737|787",
        "provider": "Gogo/Intelsat 2Ku and Panasonic Avionics, with some 787-9s on Viasat",
        "orbit": "GEO"
      },
      {
        "fleet": "rollout",
        "types": "Embraer 190|ERJ-190|E190",
        "provider": "Viasat Ka-band on the Aeromexico Connect E190 fleet: 6 aircraft mid-2025, 11 by end of 2025, all 34 by early 2027",
        "orbit": "GEO"
      }
    ],
    "access": "Free onboard messaging fleetwide (Aeromexico says it is the only Latin American carrier to offer this); browsing and streaming are sold as paid passes.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://runwaygirlnetwork.com/2025/07/viasat-aeromexico-embraer-e190/",
      "https://paxex.aero/aeromexico-e190-internet-viasat/",
      "https://paxex.aero/viasat-aeromexico-inflight-internet-787-dreamliner/",
      "https://ir.gogoair.com/news-releases/news-release-details/aeromexico-partners-gogo-flight-internet-and-wireless-flight"
    ],
    "needs_verification": true
  },
  "CM": {
    "starlink": {
      "status": "flying",
      "access": "paid",
      "milestones": [
        {
          "date": "2026-07",
          "text": "First Starlink 737 MAX 9 in service; fleet completion targeted for Q1 2027",
          "source": "https://www.copaair.com/en-gs/news/copa-airlines-redefines-onboard-connectivity-in-latin-america-with-starlink/"
        }
      ]
    },
    "airline": "Copa Airlines",
    "rules": [
      {
        "fleet": "rollout",
        "provider": "Starlink rollout (first aircraft Jul 2026, fleet complete target Q1 2027); most aircraft still unequipped",
        "orbit": "mixed LEO/none"
      }
    ],
    "access": "Paid for most passengers via the onboard Starlink portal; free in Business class, for ConnectMiles PreferMember Gold, Platinum and Presidential members, and for existing Starlink Residential or Starlink Roam subscribers.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://www.copaair.com/en-gs/news/copa-airlines-redefines-onboard-connectivity-in-latin-america-with-starlink/",
      "https://onemileatatime.com/news/copa-airlines-starlink-wi-fi/",
      "https://simpleflying.com/copa-airlines-1st-charge-starlink-wifi-airlines-follow-suit/",
      "https://www.businesstraveller.com/news/copa-airlines-wifi/"
    ]
  },
  "AV": {
    "airline": "Avianca",
    "rules": [
      {
        "fleet": "rollout",
        "types": "A319|A320|A321",
        "provider": "SES multi-orbit (SES GEO satellites plus leased Eutelsat OneWeb LEO capacity, Gilat Sidewinder ESA antenna); 10 A320-family aircraft live as of December 2025, A320 family targeted through 2026",
        "orbit": "mixed GEO/LEO"
      },
      {
        "fleet": "rollout",
        "types": "787",
        "provider": "SES multi-orbit; 787 Dreamliner installs scheduled for 2027",
        "orbit": "mixed GEO/LEO"
      }
    ],
    "access": "Sold as three paid tiers (Messaging, Browsing, Streaming) through the Avianca On Air portal; fewer than 10 of 160+ aircraft were equipped as of late 2025.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://runwaygirlnetwork.com/2025/12/avianca-rolls-out-ses-multi-orbit-ifc-on-airbus-a320-family-jets/",
      "https://paxex.aero/avianca-picks-multi-orbit-inflight-internet-from-ses/",
      "https://www.ses.com/press-release/ses-abra-group-launch-multi-orbit-inflight-connectivity",
      "https://www.aviacionline.com/english/commercial-aviation/latin-america-and-caribbean/avianca-confirms-2027-deadline-for-full-fleet-wi-fi-connectivity_a6939b3cb1d1c6929ea4291b1"
    ],
    "needs_verification": true
  },
  "LA": {
    "airline": "LATAM",
    "rules": [
      {
        "fleet": "narrowbody",
        "types": "A319|A320|A321",
        "provider": "2Ku Ku-band (SES, following its Intelsat acquisition); LATAM reported 100% of the narrowbody fleet connected by end of 2025 and 250+ connected aircraft overall",
        "orbit": "GEO"
      },
      {
        "fleet": "rollout",
        "types": "777|787",
        "provider": "Viasat Amara on 60+ widebodies, in service since 25 March 2026 (first connected 787 long-haul flight); Amara's LEO layer (Telesat Lightspeed) is not yet active, so the live service is GEO",
        "orbit": "GEO"
      },
      {
        "fleet": "rollout",
        "types": "A320|A321|Embraer 195|ERJ-195|E195",
        "provider": "SES multi-orbit (SES GEO plus Eutelsat OneWeb LEO, Gilat Sidewinder ESA) on 60+ new A320neo-family and E195-E2 aircraft, announced July 2026",
        "orbit": "mixed GEO/LEO"
      }
    ],
    "access": "Wi-Fi is available on close to 90% of short- and medium-haul flights and is sold as paid passes; specific tier pricing and any free messaging or LATAM Pass benefit were not confirmed.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.pax-intl.com/ife-connectivity/connectivity-and-satellites/2025/07/02/latam-selects-viasat-amara-for-wide-body-long-haul/",
      "https://paxex.aero/latam-inflight-internet-ses-multiorbit/",
      "https://www.ses.com/news/press-release/ses-launches-multiorbit-satellite-connectivity-on-latam-airbus-embraer-fleet",
      "https://www.flightglobal.com/archive/2026/07/latam-selects-ses-satellite-wi-fi-for-more-than-60-aircraft/",
      "https://www.df.cl/empresas/industria/latam-invertira-us-60-millones-para-implementar-wifi-en-vuelos-largos-y",
      "https://www.aerotime.aero/articles/latam-becomes-first-south-american-carrier-to-roll-out-wi-fi-on-long-haul-routes"
    ],
    "needs_verification": true
  },
  "G3": {
    "airline": "GOL",
    "rules": [
      {
        "fleet": "most",
        "types": "737",
        "provider": "Intelsat 2Ku Ku-band, on roughly 50 of about 120 aircraft",
        "orbit": "GEO"
      },
      {
        "fleet": "rollout",
        "provider": "SES multi-orbit (SES GEO plus Eutelsat OneWeb LEO, ESA antenna) under the Abra Group deal covering 100+ Avianca, GOL and Wamos Air aircraft",
        "orbit": "mixed GEO/LEO"
      }
    ],
    "access": "Paid packages through the GOL Online portal: messaging about R$10, browsing R$25 per hour or R$40 for the flight, streaming R$45 per hour or R$58 for the flight; Smiles members have at times had free messaging. Entertainment streaming on GOL Online is free for everyone.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.voegol.com.br/en/nh/servicos-gol/gol-online",
      "https://www.portaleventos.com.br/news/GOL-chega-a-50-aeronaves-com-conexao-a-internet",
      "https://www.ses.com/press-release/ses-abra-group-launch-multi-orbit-inflight-connectivity",
      "https://www.thinkom.com/news/video-2ku-installation-gol-aircraft",
      "https://passageirodeprimeira.com/gol-retoma-servico-de-internet-gratuita-para-envio-de-mensagens-durante-voos/"
    ],
    "needs_verification": true
  },
  "AR": {
    "airline": "Aerolineas Argentinas",
    "rules": [
      {
        "fleet": "all",
        "provider": "None",
        "orbit": "NONE"
      },
      {
        "fleet": "rollout",
        "types": "A330|737",
        "provider": "Intelsat multi-orbit ESA (Intelsat GEO plus Eutelsat OneWeb LEO) on 18 A330 and 737 MAX aircraft, contracted November 2023; recent reporting points to service starting in 2027 beginning with the A330s, then 737s and E190s, with investment above US$65M",
        "orbit": "mixed GEO/LEO"
      }
    ],
    "access": "No inflight Wi-Fi confirmed in service as of August 2026; paid plans are indicated for the future rollout but pricing has not been announced.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://runwaygirlnetwork.com/2023/11/aerolineas-argentinas-intelsat-esa/",
      "https://oneweb.net/resources/aerolineas-argentinas-selects-multi-orbit-inflight-connectivity",
      "https://www.satellitetoday.com/mobility/2023/11/22/intelsat-wins-ifc-deal-with-aerolineas-argentinas/",
      "https://www.aviacionline.com/aerolineas-argentinas-ofrecera-internet-wi-fi-a-bordo",
      "https://promociones-aereas.com.ar/noticias/aerolineas-argentinas-relanza-una-nueva-etapa-18-aviones-nuevos-y-wi-fi-a-bordo-con-fondos-propios"
    ],
    "needs_verification": true
  },
  "CA": {
    "airline": "Air China",
    "rules": [
      {
        "types": "747|777|787|A350",
        "provider": "Panasonic Avionics Ku over Chinese domestic satellite capacity (China Satcom/APT)",
        "orbit": "GEO"
      },
      {
        "fleet": "all",
        "orbit": "NONE",
        "provider": "None on narrowbodies - cabin LAN entertainment (no internet) on part of the A320/737 fleet"
      }
    ],
    "access": "Mostly paid session packages requiring advance registration, though Air China gives free basic Wi-Fi on a minority of domestic flights and complimentary access is commonly offered in premium cabins.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://aerospaceglobalnews.com/news/china-inflight-wifi-boom-not-starlink/",
      "https://interactive.aviationtoday.com/avionicsmagazine/february-march-2020/asia-pacific-airlines-invest-in-new-connected-aircraft-apps-and-networks/",
      "https://www.scmp.com/economy/china-economy/article/3329419/chinese-airline-offers-free-wi-fi-lure-back-travellers-high-speed-trains",
      "https://www.pingwest.com/a/286778",
      "https://webresource.airchina.com.cn/zh-CN/content/travel_info/flight_experience/cabin/network/"
    ],
    "needs_verification": true
  },
  "MU": {
    "airline": "China Eastern",
    "rules": [
      {
        "fleet": "widebody",
        "provider": "Chinese domestic Ku satcom (APT APSTAR-6D), free fleet-wide on widebodies since Jul 2026",
        "orbit": "GEO"
      },
      {
        "fleet": "all",
        "orbit": "NONE",
        "provider": "None on narrowbodies yet - rollout announced for 2026, 5G air-to-ground agreement signed July 2026 (China Mobile/COMAC/ZTE)"
      }
    ],
    "access": "Free on every wide-body flight worldwide since 3 July 2026 (domestic wide-body free since 1 January 2026), with First/Business on the high-speed tier and premium economy/economy on the standard tier after registering the ticket and receiving an SMS verification code.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://finance.yahoo.com/technology/articles/china-eastern-airlines-extends-complimentary-034400095.html",
      "https://eb.ceair.com/app/wifi/pc_EN/index.html",
      "https://www.scmp.com/economy/china-economy/article/3329419/chinese-airline-offers-free-wi-fi-lure-back-travellers-high-speed-trains",
      "https://global.ceair.com/global/static/Announcement/AnnouncementMessage/chinaeasternnewstest/202607/t20260703_30097.html",
      "https://m.21jingji.com/article/20260703/herald/870f4172a3c4e5697bf6dc471ef936fd.html"
    ]
  },
  "CZ": {
    "airline": "China Southern",
    "rules": [
      {
        "types": "A350",
        "provider": "SES HBCplus Ka with AeroSat Link, 30 A350-900s entering service from 2026",
        "orbit": "GEO"
      },
      {
        "fleet": "widebody",
        "provider": "Chinese domestic Ku/Ka satcom on part of the widebody fleet",
        "orbit": "GEO"
      },
      {
        "fleet": "all",
        "orbit": "NONE",
        "provider": "None on narrowbodies - A321neo connectivity (Airbus HBCplus Ka via SES) planned from about 2027, 60% of narrowbodies targeted by 2030"
      }
    ],
    "access": "Cabin-gated: First and Business get a basic internet product free (upgradeable to a paid high-speed product) while economy buys a package in advance or onboard after logging in at fly.csair.com, with a limited set of routes fully complimentary.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.csair.com/en/orders/order/wifi_operation_Guidelines/",
      "https://runwaygirlnetwork.com/2025/11/china-southern-ses-a350s-hbcplus/",
      "https://www.scmp.com/economy/china-economy/article/3329419/chinese-airline-offers-free-wi-fi-lure-back-travellers-high-speed-trains",
      "https://www.airbus.com/en/newsroom/press-releases/2025-10-airbus-signs-contract-with-china-southern-airlines-to-equip-30-a350"
    ],
    "needs_verification": true
  },
  "HU": {
    "airline": "Hainan Airlines",
    "rules": [
      {
        "types": "787|A330",
        "provider": "APT Mobile Satcom APSTAR Ku",
        "orbit": "GEO"
      },
      {
        "fleet": "all",
        "orbit": "NONE",
        "provider": "None on narrowbodies - offline streaming LAN on some 737s, no internet"
      }
    ],
    "access": "Predominantly paid onboard packages, with free trials and promotional or business-class complimentary access on some 787-9 routes.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.hainanairlines.com/go/787-9/index-en.html",
      "https://www.hq.news.cn/20231201/dd3780c9d6de43c2bca00d51ede6e343/c.html",
      "https://aerospaceglobalnews.com/news/china-inflight-wifi-boom-not-starlink/",
      "https://www.hnair.com/dachenghaihang/hhjd/jdxx/by737_800/"
    ],
    "needs_verification": true
  },
  "SG": {
    "airline": "SpiceJet",
    "rules": [
      {
        "fleet": "all",
        "provider": "None",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight internet service in operation.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://livefromalounge.com/india-in-flight-wifi-primer/",
      "https://www.businesstraveller.com/business-travel/spicejet-to-offer-onboard-wifi-service/",
      "https://simpleflying.com/spicejet-boeing-737-max-internet/"
    ],
    "needs_verification": true
  },
  "UL": {
    "airline": "SriLankan Airlines",
    "rules": [
      {
        "types": "A330",
        "provider": "OnAir (SITA) on the A330-300s; A330-200s are unequipped",
        "orbit": "mixed GEO/none"
      },
      {
        "fleet": "all",
        "orbit": "mixed GEO/none",
        "provider": "SITA OnAir over Inmarsat SwiftBroadband on the A320neo/A321neo subfleet per SriLankan's own fleet page; ceo A320/A321s unequipped (the airline's wifi page still names only the A330-300)"
      }
    ],
    "access": "Paid OnAir data passes bought onboard; historic pricing ran $4 for 20 minutes (9MB) up to $25 full flight (240MB), MB-capped and slow.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.srilankan.com/en_uk/flying-with-us/in-flight-wifi",
      "https://www.futuretravelexperience.com/2014/11/srilankan-airlines-introduces-first-wi-fi-equipped-a330-300/",
      "https://www.srilankan.com/en_uk/flying-with-us/fleet",
      "https://onemileatatime.com/srilankan-airlines-a321-business-class/"
    ]
  },
  "QF": {
    "airline": "Qantas",
    "rules": [
      {
        "types": "737|A220",
        "provider": "Viasat over nbn Sky Muster Ka (domestic)",
        "orbit": "GEO"
      },
      {
        "types": "A330|787|A380|A350",
        "provider": "Viasat/ViaSat-3 Ka international; 787 fleet complete July 2026, A380 retrofits underway into early-mid 2027; ViaSat-3 F3 (Asia-Pacific) entered service 31 August 2026; A380s still largely unequipped",
        "orbit": "GEO"
      }
    ],
    "access": "Free to every passenger with no fare-class or frequent-flyer gating, domestically and on the international aircraft switched on so far.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://centreforaviation.com/news/qantas-group-completes-wifi-rollout-across-boeing-787-fleet-1367262",
      "https://www.qantasnewsroom.com.au/media-releases/qantas-switches-on-fast-free-inflight-wifi",
      "https://paxex.aero/qantas-free-wifi-longhaul-fleet/",
      "https://travelweekly.com.au/what-wi-fi-will-be-on-your-flight-in-2026/",
      "https://onemileatatime.com/news/qantas-free-wi-fi/",
      "https://www.globenewswire.com/news-release/2026/08/31/3353252/0/en/viasat-3-f3-satellite-enters-service-across-asia-pacific.html"
    ]
  },
  "VA": {
    "airline": "Virgin Australia",
    "rules": [
      {
        "types": "737",
        "provider": "Intelsat 2Ku on 80%+ of the 737 fleet",
        "orbit": "GEO"
      },
      {
        "fleet": "all",
        "provider": "None on the F100s and A320s",
        "orbit": "NONE"
      }
    ],
    "access": "Paid 30-minute or full-flight passes by credit card, complimentary for Business Class and Velocity Platinum / Platinum Plus, with the entertainment portal free to everyone.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.virginaustralia.com/us/en/travel-info/onboard-experience/inflight-connectivity/",
      "https://www.aviationtoday.com/2022/11/09/virgin-australia-chooses-intelsat-provide-flight-connectivity/",
      "https://travelweekly.com.au/what-wi-fi-will-be-on-your-flight-in-2026/"
    ]
  },
  "NZ": {
    "starlink": {
      "status": "flying",
      "access": "free_with_account",
      "milestones": [
        {
          "date": "2025-07",
          "text": "World-first Starlink ATR 72 flying in the domestic trial",
          "source": "https://www.airnewzealandnewsroom.com/onboard-starlink-wi-fi-trial-taking-connectivity-to-the-skies"
        },
        {
          "date": "2025-06",
          "text": "First Starlink A320 (ZK-OXE) enters domestic trial service",
          "source": "https://traveltalk.nz/news-opinion/air-nz-rolls-out-its-first-starlink-equipped-a320-aircraft/"
        }
      ]
    },
    "airline": "Air New Zealand",
    "rules": [
      {
        "types": "777|787|A321",
        "provider": "Inmarsat GX Ka (Panasonic-integrated)",
        "orbit": "GEO"
      },
      {
        "types": "A320",
        "provider": "Inmarsat GX on international A320s; domestic A320s largely unequipped, with the first Starlink A320 (ZK-OXE) in domestic trial service since Jun 2025",
        "orbit": "mixed GEO/none"
      },
      {
        "types": "ATR",
        "provider": "Starlink domestic trial, world-first Starlink ATR 72 flying since Jul 2025; most ATRs not yet fitted",
        "orbit": "mixed LEO/none"
      }
    ],
    "access": "Free and unlimited for all passengers on equipped aircraft after a one-off registration at wifi.airnz.com, and free during the domestic Starlink trial.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.airnewzealand.com/wifi",
      "https://www.cnbc.com/2024/10/04/starlink-to-end-the-days-of-spotty-wi-fi-on-planes-air-new-zealand.html",
      "https://traveltalk.nz/news-opinion/air-nz-rolls-out-its-first-starlink-equipped-a320-aircraft/",
      "https://travelweekly.com.au/what-wi-fi-will-be-on-your-flight-in-2026/",
      "https://www.airnewzealandnewsroom.com/onboard-starlink-wi-fi-trial-taking-connectivity-to-the-skies"
    ],
    "needs_verification": true
  },
  "FJ": {
    "airline": "Fiji Airways",
    "rules": [
      {
        "types": "737",
        "provider": "Panasonic eXConnect Ku",
        "orbit": "GEO"
      },
      {
        "types": "A350",
        "provider": "Satellite wifi equipped; provider unconfirmed",
        "orbit": "GEO"
      }
    ],
    "access": "Economy gets complimentary full-flight messaging (since 1 November 2024), Business Class includes full-flight browsing, and paid browsing or streaming upgrades are sold onboard.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.futuretravelexperience.com/2024/11/fiji-airways-launches-free-full-flight-wifi-in-economy-class-to-enhance-travel-experience/",
      "https://paxex.aero/fiji-airways-selects-panasonic-for-entertainment-connectivity-on-new-737-max-fleet/",
      "https://www.fijiairways.com/en-us/experience/onboard-wifi"
    ],
    "needs_verification": true
  },
  "SQ": {
    "starlink": {
      "status": "announced",
      "access": "unannounced",
      "milestones": [
        {
          "date": "2026-05",
          "text": "Starlink confirmed for A350s and A380s; installs from Q1 2027, completing 2029",
          "source": "https://mainlymiles.com/2026/05/04/singapore-airlines-confirms-starlink-as-its-new-wi-fi-provider/"
        }
      ]
    },
    "airline": "Singapore Airlines",
    "rules": [
      {
        "fleet": "most",
        "types": "A350|787|737|777",
        "provider": "Panasonic Avionics Ku-band",
        "orbit": "GEO"
      },
      {
        "fleet": "most",
        "types": "A380|A350|777",
        "provider": "SITA OnAir / Inmarsat GX Ka-band",
        "orbit": "GEO"
      },
      {
        "fleet": "rollout",
        "types": "A350|A380",
        "provider": "Starlink (confirmed May 2026; installations begin Q1 2027, rollout completes end-2029)",
        "orbit": "mixed GEO/LEO"
      }
    ],
    "access": "Free unlimited for Suites/First/Business and all PPS Club members, and free for KrisFlyer members in Premium Economy and Economy (membership is free and can be joined in-flight); non-members pay US$3.99/1h, US$8.99/3h or US$15.99 full flight.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://mainlymiles.com/2026/05/30/complete-guide-sia-wi-fi/",
      "https://mainlymiles.com/2026/05/04/singapore-airlines-confirms-starlink-as-its-new-wi-fi-provider/",
      "https://onemileatatime.com/news/singapore-airlines-free-starlink-wi-fi/"
    ]
  },
  "CX": {
    "airline": "Cathay Pacific",
    "rules": [
      {
        "fleet": "most",
        "types": "777|A330|A321",
        "provider": "Intelsat 2Ku (ex-Gogo 2Ku)",
        "orbit": "GEO"
      },
      {
        "fleet": "widebody",
        "types": "A350",
        "provider": "Panasonic Avionics eXConnect Ku-band",
        "orbit": "GEO"
      }
    ],
    "access": "Paid by default (US$3.95 messaging, US$9.95/1h, US$12.95 full flight under 6h, US$19.95-24.95 full flight over 6h, no data caps); free for First and Business, for Diamond members, since 19 Dec 2025 for Gold members in any cabin, and for Premium Economy when a Cathay membership number is attached to the booking.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://onemileatatime.com/news/cathay-pacific-wi-fi/",
      "https://thealviator.com/2025/12/cathay-pacific-premium-economy-wifi/",
      "https://runwaygirlnetwork.com/2021/07/first-a321neo-aircraft-intelsat-2ku-cathay-pacific/"
    ]
  },
  "JL": {
    "airline": "Japan Airlines",
    "rules": [
      {
        "types": "787|777|A350",
        "provider": "Panasonic Avionics or Intelsat 2Ku depending on aircraft",
        "orbit": "GEO"
      },
      {
        "types": "737",
        "provider": "Intelsat 2Ku (Intelsat now part of SES); Gilat Sidewinder ESA on 737-8 deliveries from 2027; SES multi-orbit announced April 2026 for A350/787 line-fits from 2028",
        "orbit": "GEO"
      },
      {
        "fleet": "most",
        "provider": "Intelsat 2Ku / Panasonic Avionics",
        "orbit": "GEO"
      }
    ],
    "access": "Free for everyone on domestic flights (streaming-grade since Oct 2024); on international, unlimited free for First and Business, one complimentary hour for Premium Economy and Economy, paid thereafter.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://paxex.aero/jal-free-streaming-wifi-domestic/",
      "https://press.jal.co.jp/en/release/202409/008311.html",
      "https://upgradedpoints.com/news/japan-airlines-free-wi-fi/",
      "https://www.jal.co.jp/jp/en/inter/service/wifi/",
      "https://www.ses.com/news/press-release/ses-japan-airlines-to-expand-multiorbit-inflight-connectivity-to-longhaul-fleet"
    ]
  },
  "NH": {
    "airline": "ANA",
    "rules": [
      {
        "types": "767",
        "provider": "Viasat Amara, free (6 aircraft, the first of the free-wifi fleet)",
        "orbit": "GEO"
      },
      {
        "types": "787|777|A380",
        "provider": "Panasonic Avionics, paid on most aircraft; Viasat Amara free wifi is arriving on 787-9s and 777-9s from FY2026",
        "orbit": "GEO"
      },
      {
        "fleet": "most",
        "provider": "Panasonic Avionics",
        "orbit": "GEO"
      }
    ],
    "access": "Free in all cabins on international routes aboard Viasat Amara-equipped aircraft; on the remaining Panasonic-equipped aircraft it stays paid at US$6.95/30min, US$16.95/3h or US$21.95 full flight.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.anahd.co.jp/group/en/pr/202508/20250805.html",
      "https://runwaygirlnetwork.com/2025/08/ana-taps-viasat-to-power-free-wi-fi-on-international-routes/",
      "https://onemileatatime.com/news/all-nippon-airways-free-wi-fi/"
    ],
    "needs_verification": true
  },
  "KE": {
    "starlink": {
      "status": "announced",
      "access": "free",
      "milestones": [
        {
          "date": "2026-09",
          "text": "Free long-haul service on 777-300ERs and A350-900s announced for September 2026; not yet confirmed in service",
          "source": "https://en.sedaily.com/finance/2026/09/04/korean-air-to-offer-free-starlink-wi-fi-on-long-haul"
        }
      ]
    },
    "airline": "Korean Air",
    "rules": [
      {
        "types": "737",
        "provider": "Panasonic Avionics",
        "orbit": "GEO"
      },
      {
        "types": "A321",
        "provider": "Viasat",
        "orbit": "GEO"
      },
      {
        "types": "A350",
        "provider": "Panasonic, paid GEO wifi live; Starlink installation under way, with Korean Air saying passenger service starts in September 2026 on the 777-300ER and A350-900, free in every seat; not confirmed live as of 5 September 2026",
        "orbit": "GEO"
      },
      {
        "fleet": "all",
        "provider": "None on most widebodies until the Starlink rollout completes",
        "orbit": "NONE"
      }
    ],
    "access": "Paid today on equipped narrowbodies and A350s (about US$10.95 for two hours, US$20.95 full flight); Starlink is announced as free of charge gate-to-gate for all passengers once service starts.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://apex.aero/articles/korean-air-hanjin-group-airlines-select-starlink-for-fleetwide-in-flight-wi-fi/",
      "https://en.sedaily.com/finance/2026/07/21/merged-korean-air-to-offer-free-wi-fi-via-starlink",
      "https://paxex.aero/korean-air-wifi-a321neo-viasat/",
      "https://onemileatatime.com/news/korean-air-free-starlink-wi-fi/",
      "https://en.sedaily.com/finance/2026/09/04/korean-air-to-offer-free-starlink-wi-fi-on-long-haul",
      "https://www.koreaherald.com/article/10630658"
    ],
    "needs_verification": true
  },
  "OZ": {
    "starlink": {
      "status": "announced",
      "access": "free"
    },
    "airline": "Asiana Airlines",
    "rules": [
      {
        "types": "A350",
        "provider": "Panasonic Avionics; Starlink is being installed on the 777-300ER and A350-900 first alongside Korean Air, with group service due from September 2026; no Asiana aircraft confirmed live yet",
        "orbit": "GEO"
      },
      {
        "types": "A321",
        "provider": "Panasonic Avionics, complimentary messaging",
        "orbit": "GEO"
      },
      {
        "fleet": "most",
        "provider": "Panasonic Avionics",
        "orbit": "GEO"
      }
    ],
    "access": "Paid today (roughly US$11.95/1h, US$16.95/3h, US$21.95 unlimited) with complimentary messaging on the A321neo fleet; becomes free once Starlink enters service.",
    "confidence": "reported",
    "as_of": "2026-09",
    "sources": [
      "https://apex.aero/articles/korean-air-hanjin-group-airlines-select-starlink-for-fleetwide-in-flight-wi-fi/",
      "https://en.sedaily.com/finance/2026/07/21/merged-korean-air-to-offer-free-wi-fi-via-starlink",
      "https://m.flyasiana.com/C/JP/EN/contents/cabin-wi-fi",
      "https://seatwifi.com/asiana-wifi",
      "https://runwaygirlnetwork.com/2025/12/korean-air-and-hanjin-group-to-offer-starlink-fleetwide/",
      "https://www.koreaherald.com/article/10630658"
    ],
    "needs_verification": true
  },
  "BR": {
    "airline": "EVA Air",
    "rules": [
      {
        "fleet": "widebody",
        "types": "787|777|A330",
        "provider": "Panasonic Avionics",
        "orbit": "GEO"
      },
      {
        "fleet": "narrowbody",
        "types": "A321",
        "provider": "Panasonic eXW wireless IFE only on the 17 A321-200s, no connectivity",
        "orbit": "NONE"
      }
    ],
    "access": "Since 1 October 2025 wifi is complimentary for Business Class and Diamond/Gold Infinity MileageLands members and paid otherwise (from about US$2 for 30 minutes up to US$39.95 for 1GB). A limited-time promotion gives every passenger complimentary full-flight Unlimited Web Browsing until 31 October 2026 (no video streaming, calls or VPN). From 1 November 2026 Business Class keeps unlimited browsing for everyone; in Economy, Diamond/Gold get unlimited browsing, Silver and Green get unlimited text, non-members pay.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://www.evaair.com/en-global/customer-services/faq/detail.html?FaqCategories=inflight-wi-fi",
      "https://www.evaair.com/en-global/fly-prepare/flying-with-eva/inflight-entertainment-service/connectivity-and-Power/",
      "https://www.evaair.com/en-us/about-eva-air/news/news-releases/2025-05-14-evaair-to-launch-exciting-upgrade-for-inflight-wi-fi-service-this-july.html",
      "https://upgradedpoints.com/news/eva-air-free-wi-fi-messaging/",
      "https://www.evaair.com/en-global/fly-prepare/flying-with-eva/inflight-entertainment-service/connectivity-and-power/"
    ]
  },
  "CI": {
    "airline": "China Airlines",
    "rules": [
      {
        "fleet": "widebody",
        "types": "777|A350",
        "provider": "Panasonic Avionics Ku-band (one A350 fitted with Viasat)",
        "orbit": "GEO"
      },
      {
        "fleet": "narrowbody",
        "types": "A321",
        "provider": "Viasat (Inmarsat GX)",
        "orbit": "GEO"
      },
      {
        "fleet": "most",
        "types": "A330|737",
        "provider": "None (not equipped)",
        "orbit": "NONE"
      },
      {
        "fleet": "rollout",
        "types": "787",
        "orbit": "UNKNOWN",
        "provider": "787s entering service from June 2026 offer complimentary Wi-Fi to Business and Premium Economy passengers across the 24-jet order; the connectivity supplier has not been confirmed"
      }
    ],
    "access": "Since 1 Aug 2025, complimentary unlimited Wi-Fi for premium-cabin passengers and top-tier Dynasty Flyer members (Gold, Emerald, Paragon), with the free messaging tier open to every other passenger.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://paxex.aero/china-airlines-announces-free-inflight-wi-fi/",
      "https://www.china-airlines.com/cn/en/prepare-for-the-fly/In-flight/wifi",
      "https://runwaygirlnetwork.com/2026/06/china-airlines-unveils-all-new-premium-economy-class-787/"
    ]
  },
  "TG": {
    "airline": "Thai Airways",
    "rules": [
      {
        "types": "A350|787|777",
        "provider": "Panasonic Avionics Ku",
        "orbit": "GEO"
      },
      {
        "types": "A330",
        "provider": "SITA OnAir",
        "orbit": "GEO"
      },
      {
        "fleet": "rollout",
        "provider": "NSG Skywaves multi-orbit (GEO + O3b mPOWER MEO): 777 retrofits began Q3 2025, line-fit on all 34 incoming 787s (service date unannounced), first A321neo via Airbus HBCplus expected Q4 2026",
        "orbit": "mixed GEO/MEO"
      }
    ],
    "access": "Paid data packages by default (roughly US$4.99-34.99 for 10-100MB and US$39.99-59.99 unlimited), plus a complimentary allowance for all Royal Orchid Plus members since 1 May 2025: unlimited for Platinum, 60 minutes for Gold and 30 minutes for Silver/Member, redeemed with a code printed on the boarding pass.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://ropnewsletter.thaiairways.com/aprjun2025/silver/en/complimentary-inflight-wi-fi-service-on-thai",
      "https://www.thaiairways.com/en-th/content/offers-Promotions/royal-orchid-plus/Complimentary-In-flight-Wi-Fi/",
      "https://paxex.aero/thai-airways-787-dreamliner-wifi-neo-space-group-skywaves/",
      "https://www.aerotime.aero/articles/thai-airways-neo-space-group-inflight-connectivity",
      "https://www.satellitetoday.com/mobility/2025/11/11/nsg-extends-partnership-with-thai-airways/"
    ],
    "needs_verification": true
  },
  "MH": {
    "airline": "Malaysia Airlines",
    "rules": [
      {
        "types": "A350|A330",
        "provider": "Panasonic Avionics (MHconnect)",
        "orbit": "GEO"
      },
      {
        "types": "737",
        "provider": "Viasat (737-8)",
        "orbit": "GEO"
      }
    ],
    "access": "Complimentary on MHconnect-equipped aircraft for every passenger in every cabin with an email registration to connect, covering unlimited messaging and social media, with larger data packages purchasable on board by cash or card; video streaming is not supported.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.malaysiaairlines.com/hq/en/experience/in-flight-offerings/wi-fi.html",
      "https://paxex.aero/malaysia-airlines-free-inflight-wifi/",
      "https://runwaygirlnetwork.com/2023/08/malaysia-airlines-selects-viasat-737-8/"
    ],
    "needs_verification": true
  },
  "GA": {
    "airline": "Garuda Indonesia",
    "rules": [
      {
        "types": "777",
        "provider": "Panasonic Avionics Ku",
        "orbit": "GEO"
      },
      {
        "types": "A330",
        "provider": "SITA OnAir",
        "orbit": "GEO"
      },
      {
        "fleet": "all",
        "provider": "None on the narrowbody fleet",
        "orbit": "NONE"
      }
    ],
    "access": "Paid time-based packages (about US$11.95/1h, US$16.95/3h, US$21.95 full flight) with 15 minutes free on Wi-Fi-equipped Airbus aircraft and complimentary access for First Class.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.satellitetoday.com/telecom/2013/09/13/garudas-flights-now-fitted-with-panasonics-global-communications-services/",
      "https://www.digitalnewsasia.com/digital-economy/garuda-introduces-wifi-on-its-b777-300er-aircraft",
      "https://www.businesstraveller.com/business-travel/2017/04/26/asia-pacific-airlines-inflight-wifi-need-know/"
    ],
    "needs_verification": true
  },
  "VN": {
    "airline": "Vietnam Airlines",
    "rules": [
      {
        "types": "A350",
        "provider": "Viasat (LotusConnect); about 7 A350s equipped, full A350 fleet targeted during 2026",
        "orbit": "GEO"
      },
      {
        "fleet": "all",
        "provider": "None today on the 787s and A321s; satellite internet planned after the A350 rollout",
        "orbit": "NONE"
      }
    ],
    "access": "Paid plans priced by route band (full-flight messaging about US$5-7, one hour US$8-12, full-flight internet US$18-25), with 15 minutes of free messaging for every passenger.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.vietnamairlines.com/go/en/experience/wifi-onboard",
      "https://www.businesstraveller.com/business-travel/2025/08/08/vietnam-airlines-trialling-inflight-wifi-on-a350-fleet/",
      "https://apex.aero/articles/vietnam-airlines-begins-flight-connectivity-journey-airbus-a350-installations/",
      "https://en.vietnamplus.vn/vietnam-airlines-launches-in-flight-internet-service-post324054.vnp"
    ],
    "needs_verification": true
  },
  "PR": {
    "airline": "Philippine Airlines",
    "rules": [
      {
        "fleet": "most",
        "types": "777|A350|A330|A321",
        "provider": "Inmarsat GX Ka-band via SITA OnAir, branded myPAL Wi-Fi",
        "orbit": "GEO"
      }
    ],
    "access": "Complimentary 10MB plan for every passenger on equipped aircraft; free unlimited messaging for Mabuhay Miles members (free to join); Business Class and Million Milers get 100MB free; paid 1-hour, 3-hour and unlimited plans on top.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://inflightwifi.one/philippine-airlines-wifi/",
      "https://blog.wandr.me/2017/09/philippine-airlines-goes-gx-faster-wifi-coming-soon/",
      "https://www.executivetraveller.com/philippine-airlines-inflight-internet-service"
    ],
    "needs_verification": true
  },
  "AF": {
    "starlink": {
      "status": "flying",
      "access": "free_with_account",
      "progress": {
        "done": 130,
        "of": 186,
        "scope": "aircraft in the retrofit programme (777-300ER, A350, A220, E190, A320)",
        "as_of": "2026-06",
        "basis": "trade",
        "source": "https://onemileatatime.com/news/air-france-free-starlink-wi-fi/"
      },
      "milestones": [
        {
          "date": "2026-06",
          "text": "28 of 31 777-300ERs, 30 of 41 A350s and 45 of 56 A220s equipped",
          "source": "https://onemileatatime.com/news/air-france-free-starlink-wi-fi/"
        }
      ]
    },
    "airline": "Air France",
    "rules": [
      {
        "fleet": "most",
        "types": "777|A350",
        "provider": "Starlink (28 of 31 777-300ER and 30 of 41 A350 equipped as of early June 2026)",
        "orbit": "mixed GEO/LEO"
      },
      {
        "fleet": "rollout",
        "types": "A220|A320|A321|Embraer 190|ERJ-190|E190",
        "provider": "Starlink retrofit underway (45 of 56 A220, 24 of 30 E190 and 3 of 28 A320 as of June 2026, completion expected end of 2026); legacy Panasonic/Intelsat GEO on aircraft not yet converted",
        "orbit": "mixed GEO/LEO"
      }
    ],
    "access": "Free in every cabin, but you must log into a Flying Blue account (free, can be created onboard).",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://corporate.airfrance.com/en/news/air-france-launches-free-ultra-high-speed-wi-fi-board-all-its-aircraft",
      "https://onemileatatime.com/news/air-france-free-starlink-wi-fi/",
      "https://www.businesstravelnews.com/Transportation/Air/Air-France-Starts-Free-WiFi-Rollout"
    ]
  },
  "KL": {
    "airline": "KLM",
    "rules": [
      {
        "fleet": "widebody",
        "types": "777|787|A330",
        "provider": "Panasonic eXConnect (787) and Intelsat/Gogo 2Ku (777, A330)",
        "orbit": "GEO"
      },
      {
        "fleet": "narrowbody",
        "types": "A321|Embraer 195|ERJ-195|E195|737",
        "provider": "Viasat",
        "orbit": "GEO"
      }
    ],
    "access": "European narrowbody/regional flights: free full wifi for Flying Blue members, sign-up available onboard. Intercontinental widebodies: free messaging pass for all, paid Surf (about EUR 18) and Stream (about EUR 30) full-flight passes.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.viasat.com/news/latest-news/aviation/2026/klm-to-accelerate-free-in-flight-wi-fi-offering-across-europe--p/",
      "https://runwaygirlnetwork.com/2026/01/klm-offers-viasat-powered-free-wi-fi-on-european-flights/",
      "https://paxex.aero/klm-free-wifi-europe/",
      "https://onemileatatime.com/klm-wifi/"
    ],
    "needs_verification": true
  },
  "IB": {
    "starlink": {
      "status": "flying",
      "access": "free",
      "milestones": [
        {
          "date": "2026-06-23",
          "text": "First revenue flight, A330-300 EC-MAA Madrid to Sao Paulo",
          "source": "https://grupo.iberia.com/pressrelease/details/25713"
        }
      ]
    },
    "airline": "Iberia",
    "rules": [
      {
        "fleet": "rollout",
        "provider": "Starlink (first revenue flight 23 June 2026 on A330-300 EC-MAA, MAD-GRU); legacy GEO systems on aircraft not yet retrofitted",
        "orbit": "mixed GEO/LEO"
      }
    ],
    "access": "Free for all passengers in every cabin on Starlink-equipped aircraft.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://grupo.iberia.com/pressrelease/details/25713",
      "https://onemileatatime.com/news/iberia-free-starlink-wi-fi/",
      "https://simpleflying.com/british-airways-starlink-wifi/",
      "https://www.aerotime.aero/articles/iag-starlink-wifi-rollout-2026"
    ]
  },
  "VS": {
    "starlink": {
      "status": "flying",
      "access": "free_with_account",
      "progress": {
        "done": 12,
        "of": 12,
        "scope": "A350 fleet; 787-9s from H2 2026, A330neos in 2027",
        "as_of": "2026-06-02",
        "basis": "airline",
        "source": "https://corporate.virginatlantic.com/gb/en/media/press-releases/wi-fly-update-virgin-atlantic-accelerates-starlink-rollout-for-take-off.html"
      },
      "milestones": [
        {
          "date": "2026-06-02",
          "text": "All 12 A350s complete",
          "source": "https://corporate.virginatlantic.com/gb/en/media/press-releases/wi-fly-update-virgin-atlantic-accelerates-starlink-rollout-for-take-off.html"
        }
      ]
    },
    "airline": "Virgin Atlantic",
    "rules": [
      {
        "types": "A350",
        "provider": "Starlink (all 12 A350s complete since 2 June 2026)",
        "orbit": "LEO"
      },
      {
        "types": "787",
        "provider": "Viasat; Starlink retrofits from H2 2026 with two-thirds of the 787-9s due by end of 2026, no 787 in Starlink service confirmed yet",
        "orbit": "GEO"
      },
      {
        "types": "A330",
        "provider": "Viasat; Starlink retrofit planned for 2027",
        "orbit": "GEO"
      },
      {
        "fleet": "rollout",
        "provider": "Starlink live on the A350s, Viasat GEO on 787s and A330s until their retrofits (787-9 from H2 2026, A330neo 2027, fleet-wide by end 2027)",
        "orbit": "mixed GEO/LEO"
      }
    ],
    "access": "Starlink is free gate to gate for Flying Club members (free to join), multiple devices allowed; the legacy Viasat service was paid.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://corporate.virginatlantic.com/gb/en/media/press-releases/virgin-atlantic-becomes-the-first-uk-airline-to-announce-free-fleet-wide-starlink-wi-fi.html",
      "https://onemileatatime.com/news/virgin-atlantic-free-starlink-wi-fi/",
      "https://www.futuretravelexperience.com/2026/04/virgin-atlantic-accelerates-starlink-rollout-to-create-home-away-from-home-experience/",
      "https://corporate.virginatlantic.com/gb/en/media/press-releases/wi-fly-update-virgin-atlantic-accelerates-starlink-rollout-for-take-off.html"
    ]
  },
  "LX": {
    "starlink": {
      "status": "announced",
      "access": "free_with_account"
    },
    "airline": "SWISS",
    "rules": [
      {
        "types": "777|A330|A340",
        "provider": "Panasonic eXConnect (FlyNet)",
        "orbit": "GEO"
      },
      {
        "types": "A220|A320|A321",
        "provider": "European Aviation Network (Viasat S-band + LTE ground)",
        "orbit": "GEO"
      },
      {
        "fleet": "rollout",
        "provider": "Starlink under the Lufthansa Group deal from H2 2026, completing 2029",
        "orbit": "mixed GEO/LEO"
      }
    ],
    "access": "Today: free unlimited messaging in the FlyNet portal for Travel ID / Miles & More customers, full internet is paid on a tiered scale (roughly EUR 4 to 35 by flight length; SWISS Connect data packs CHF 9 / CHF 19; First gets a complimentary 50MB voucher). Once Starlink lands it is free in all classes for status and Travel ID customers.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://runwaygirlnetwork.com/2026/02/lufthansa-group-to-retain-existing-ifc-until-starlink-pivot-is-complete/",
      "https://runwaygirlnetwork.com/2026/01/lufthansa-group-hands-massive-fleet-wide-ifc-contract-to-starlink/",
      "https://www.businesstraveller.com/business-travel/swiss-a220-and-a320-family-aircraft-to-get-inflight-wifi/",
      "https://www.swiss.com/in/en/customer-support/faq/entertainment-electronics"
    ]
  },
  "OS": {
    "starlink": {
      "status": "announced",
      "access": "free_with_account"
    },
    "airline": "Austrian Airlines",
    "rules": [
      {
        "types": "787",
        "provider": "Panasonic eXConnect (FlyNet)",
        "orbit": "GEO"
      },
      {
        "types": "A320|A321",
        "provider": "European Aviation Network",
        "orbit": "GEO"
      },
      {
        "fleet": "rollout",
        "provider": "Starlink under the Lufthansa Group deal from H2 2026",
        "orbit": "mixed GEO/LEO"
      }
    ],
    "access": "Today: free unlimited FlyNet messaging for Travel ID / Miles & More customers on equipped A320-family and 787 flights; full internet is paid by flight length (about EUR 4 to 10 short, 10 to 20 medium, 20 to 35 long-haul). Starlink will be free in all classes for status and Travel ID customers.",
    "confidence": "reported",
    "as_of": "2026-09",
    "sources": [
      "https://www.austrianairlines.ag/en/2026/01/14/free-high-speed-internet-above-the-clouds-austrian-airlines-to-use-starlink-for-all-passengers-in-the-future/",
      "https://www.austrian.com/us/en/internet-on-board",
      "https://runwaygirlnetwork.com/2026/02/lufthansa-group-to-retain-existing-ifc-until-starlink-pivot-is-complete/"
    ],
    "needs_verification": true
  },
  "SN": {
    "starlink": {
      "status": "announced",
      "access": "free_with_account"
    },
    "airline": "Brussels Airlines",
    "rules": [
      {
        "fleet": "all",
        "provider": "None today (the only Lufthansa Group carrier with no wifi); Starlink arrives with the group rollout",
        "orbit": "NONE"
      }
    ],
    "access": "No onboard internet at all today. When Starlink arrives it will be free of charge across all travel classes for status customers and Travel ID users.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://press.brusselsairlines.com/brussels-airlines-and-lufthansa-group-will-roll-out-free-high-speed-wi-fi-together-with-starlink",
      "https://runwaygirlnetwork.com/2025/05/brussels-airlines-airbaltic-eurobusiness/",
      "https://www.aviation24.be/airlines/lufthansa-group/brussels-airlines/roll-out-starlink-wi-fi-across-fleet/"
    ]
  },
  "SK": {
    "starlink": {
      "status": "flying",
      "access": "free_with_account",
      "progress": {
        "done": 81,
        "of": 81,
        "scope": "A320neo fleet; A330, A350 and regional types due before end of 2026",
        "as_of": "2026-09-01",
        "basis": "airline",
        "source": "https://www.sasgroup.net/newsroom/press-releases/2026/sas-completes-starlink-installation-across-entire-airbus-a320neo-fleet-in-just-six-months/"
      },
      "milestones": [
        {
          "date": "2026-09-01",
          "text": "All 81 A320neos equipped, six months after the first flight",
          "source": "https://www.sasgroup.net/newsroom/press-releases/2026/sas-completes-starlink-installation-across-entire-airbus-a320neo-fleet-in-just-six-months/"
        },
        {
          "date": "2026-03",
          "text": "Starlink goes live for EuroBonus members",
          "source": "https://www.sasgroup.net/newsroom/press-releases/2026/sas-goes-live-with-starlink-high-speed-wifi/"
        }
      ]
    },
    "airline": "SAS",
    "rules": [
      {
        "fleet": "rollout",
        "provider": "Starlink live since March 2026; all 81 A320neos equipped as of 1 September 2026, with the A330/A350 widebodies and regional types scheduled before the end of 2026; legacy Viasat/Panasonic/GX until converted",
        "orbit": "mixed GEO/LEO"
      }
    ],
    "access": "Free for EuroBonus members (free to join) on Starlink-equipped aircraft, delivered with mobile operator 3; speeds quoted above 500 Mbps.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://www.sasgroup.net/newsroom/press-releases/2026/sas-goes-live-with-starlink-high-speed-wifi/",
      "https://runwaygirlnetwork.com/2025/01/sas-taps-starlink/",
      "https://www.flysas.com/us-en/travel-extras/starlink-high-speed-wifi",
      "https://www.businesstravelnewseurope.com/Air-Travel/SAS-launches-Starlink-onboard-wifi-for-EuroBonus-members",
      "https://www.sasgroup.net/newsroom/press-releases/2026/sas-completes-starlink-installation-across-entire-airbus-a320neo-fleet-in-just-six-months/"
    ]
  },
  "AY": {
    "airline": "Finnair",
    "rules": [
      {
        "fleet": "most",
        "types": "A350|A330|A319|A320|A321",
        "provider": "Viasat",
        "orbit": "GEO"
      }
    ],
    "access": "Paid for most passengers (about USD 9 for an hour up to about USD 28 full flight); free unlimited messaging for all Finnair Plus members (free to join) on European A319/A320/A321 flights; complimentary 1 hour long-haul / 30 minutes intra-Europe for Business Classic and Flex tickets and Finnair Plus Gold, free for the whole flight for Platinum.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.bloomberg.com/news/articles/2026-06-06/finnair-in-talks-with-spacex-starlink-amazon-for-inflight-wi-fi",
      "https://www.finnair.com/us-en/frequently-asked-questions/entertainment-and-internet-on-board/is-there-internet-access-onboard--1905726",
      "https://uk.investing.com/news/stock-market-news/finnair-explores-starlink-amazon-for-inflight-wifi-upgrade--bloomberg-93CH-4716608",
      "https://www.businesstravelnewseurope.com/Air-Travel/Finnair-launches-free-inflight-messaging-in-Europe"
    ]
  },
  "TP": {
    "airline": "TAP Air Portugal",
    "rules": [
      {
        "types": "A330",
        "provider": "Panasonic eXConnect Ku (A330neo)",
        "orbit": "GEO"
      },
      {
        "types": "A321",
        "provider": "Panasonic eXConnect Ku (A321LR)",
        "orbit": "GEO"
      },
      {
        "fleet": "all",
        "provider": "None on the rest of the narrowbody fleet",
        "orbit": "NONE"
      }
    ],
    "access": "Free messaging (iMessage, Messenger, WhatsApp) for everyone on equipped aircraft; paid Light (1 hour), Premium (3 hours) and Full Flight browsing passes. No published elite or cabin-based free tier.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.flytap.com/en-us/on-board/wi-fi",
      "https://www.futuretravelexperience.com/2019/05/tap-air-portugal-panasonic-avionics-ifec-a321neo-lr/",
      "https://runwaygirlnetwork.com/2017/11/ever-evolving-tap-portugal-details-drivers-behind-a330neo-ifec-decision/"
    ],
    "needs_verification": true
  },
  "LO": {
    "airline": "LOT Polish Airlines",
    "rules": [
      {
        "fleet": "rollout",
        "types": "787",
        "provider": "Viasat Ka-band, retrofit across 15 787-8/787-9 begun March 2026 starting with SP-LSA",
        "orbit": "GEO"
      }
    ],
    "access": "Free for business class; roughly USD 7 to 29 for other passengers depending on package.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://investors.viasat.com/news-releases/news-release-details/lot-polish-airlines-selects-viasat-deliver-flight-connectivity",
      "https://www.futuretravelexperience.com/2026/03/lot-polish-airlines-begins-equipping-long-haul-fleet-with-viasat-inflight-connectivity/",
      "https://apex.aero/articles/lot-begins-dreamliner-wi-fi-rollout-as-part-of-wider-cabin-modernization/",
      "https://www.lot.com/us/en/explore/about-lot/lot-initiatives/wifi-on-board"
    ],
    "needs_verification": true
  },
  "A3": {
    "airline": "Aegean Airlines",
    "rules": [
      {
        "fleet": "narrowbody",
        "provider": "European Aviation Network on neo-generation A320/A321 (free passes for Miles+Bonus members); ceo-generation aircraft have no wifi",
        "orbit": "mixed GEO/none"
      }
    ],
    "access": "Free Text and Surf pass (up to 1.5 Mbps, normally EUR 6) for any Miles+Bonus member; free Stream pass (up to 15 Mbps, normally EUR 12) in business class and for Gold members; non-members pay, with a 10-minute free trial.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://en.about.aegeanair.com/media-center/press-releases/2022/wifi-onboard/",
      "https://paxex.aero/aegeans-ean-in-flight-wifi-officially-goes-live/",
      "https://onemileatatime.com/news/aegean-airlines-free-wi-fi/",
      "https://en.aegeanair.com/travel-info/travelling-with-aegean/on-board/wifi-onboard/"
    ]
  },
  "EI": {
    "starlink": {
      "status": "flying",
      "access": "free",
      "milestones": [
        {
          "date": "2026-03-29",
          "text": "First Starlink flight, A330 EI-EIN Dublin to New York",
          "source": "https://mediacentre.aerlingus.com/news/work-stream-or-game-aer-lingus-takes-off-with-starlink-the-fastest-wi-fi-in-the-sky/29032026"
        }
      ]
    },
    "airline": "Aer Lingus",
    "rules": [
      {
        "fleet": "rollout",
        "types": "A330|A321",
        "provider": "Starlink (first flight 29 March 2026, A330 EI-EIN DUB-JFK; all Shannon transatlantic A330s equipped and 100% of the long-haul fleet targeted by end of 2026, shorthaul to follow); legacy Panasonic GEO until retrofit",
        "orbit": "mixed GEO/LEO"
      }
    ],
    "access": "Free for all passengers on Starlink-equipped aircraft.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://mediacentre.aerlingus.com/news/work-stream-or-game-aer-lingus-takes-off-with-starlink-the-fastest-wi-fi-in-the-sky/29032026",
      "https://runwaygirlnetwork.com/2026/03/press-release-aer-lingus-takes-off-with-starlink-inflight-wi-fi/",
      "https://onemileatatime.com/news/aer-lingus-free-starlink-wi-fi/",
      "https://apex.aero/articles/aer-lingus-marks-starlink-wi-fi-go-live/"
    ]
  },
  "AZ": {
    "starlink": {
      "status": "announced",
      "access": "free_with_account"
    },
    "airline": "ITA Airways",
    "rules": [
      {
        "types": "A350|A330|A320|A321|A220",
        "provider": "Viasat GX Ka (Honeywell JetWave)",
        "orbit": "GEO"
      },
      {
        "fleet": "rollout",
        "provider": "Starlink under the Lufthansa Group deal, phased 2026-2029",
        "orbit": "mixed GEO/LEO"
      }
    ],
    "access": "Paid packages for most passengers today; free messaging for business class on long-haul and on international flights over three hours. Starlink will be free in all travel classes for Travel ID registrants and loyalty status holders as it rolls out.",
    "confidence": "reported",
    "as_of": "2026-09",
    "sources": [
      "https://www.ita-airways.com/en_us/fly-ita/in-flight/connectivity-on-board.html",
      "https://cabincrewhq.com/ita-airways-inflight-wifi/",
      "https://runwaygirlnetwork.com/2026/01/lufthansa-group-hands-massive-fleet-wide-ifc-contract-to-starlink/",
      "https://www.satellitetoday.com/connectivity/2026/01/13/lufthansa-group-to-deploy-starlink-across-fleet/"
    ],
    "needs_verification": true
  },
  "U2": {
    "airline": "easyJet",
    "rules": [
      {
        "fleet": "all",
        "provider": "None",
        "orbit": "NONE"
      }
    ],
    "access": "No internet at any price; the only onboard Wi-Fi is AirFi's free local streaming portal (games, content, retail) with no route off the aircraft.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://centreforaviation.com/analysis/reports/europes-inflight-wifi-divide-strategy-cost-and-the-battle-for-the-connected-passenger-737174",
      "https://airfi.aero/airfi-deploys-wireless-streaming-across-easyjets-continental-european-fleet-of-108-aircraft/",
      "https://www.businesstraveller.com/business-travel/easyjet-completes-rollout-of-airfi-digital-onboard-experience/",
      "https://simpleflying.com/a-gamble-low-cost-carriers-are-now-adding-starlink-wifi/"
    ]
  },
  "FR": {
    "airline": "Ryanair",
    "rules": [
      {
        "fleet": "all",
        "provider": "None",
        "orbit": "NONE"
      }
    ],
    "access": "No Wi-Fi and no internet of any kind on any Ryanair aircraft.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://centreforaviation.com/analysis/reports/europes-inflight-wifi-divide-strategy-cost-and-the-battle-for-the-connected-passenger-737174",
      "https://skift.com/2026/01/26/ryanair-says-free-wi-fi-is-coming-but-elon-musks-starlink-isnt-the-solution-yet/",
      "https://www.bloomberg.com/news/articles/2026-01-26/ryanair-says-in-flight-wi-fi-not-there-yet-after-elon-musk-spat"
    ]
  },
  "W6": {
    "starlink": {
      "status": "announced",
      "access": "unannounced"
    },
    "airline": "Wizz Air",
    "rules": [
      {
        "fleet": "all",
        "provider": "None",
        "orbit": "NONE"
      }
    ],
    "access": "No passenger internet today anywhere in the fleet; the Starlink deal does not begin installs until 2027.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://aerospaceglobalnews.com/news/wizz-air-immfly-digital-cabin-wifi/",
      "https://www.aerotime.aero/articles/wizz-air-elon-starlink-wifi-aircraft",
      "https://paxex.aero/frontier-airlines-starlink-inflight-internet-indigo-partners-jetsmart-volaris-cebu-pacific/",
      "https://simpleflying.com/a-gamble-low-cost-carriers-are-now-adding-starlink-wifi/",
      "https://satnews.com/2026/07/15/frontier-airlines-and-indigo-partners-select-starlink-for-multi-airline-inflight-connectivity/"
    ]
  },
  "VY": {
    "airline": "Vueling",
    "rules": [
      {
        "fleet": "most",
        "provider": "Viasat European Aviation Network on 80+ equipped A320-family aircraft (free, ad-sponsored); unequipped tails have none",
        "orbit": "mixed GEO/none"
      }
    ],
    "access": "Free for every passenger, ad-sponsored with no paid tier, on the EAN-equipped A320s since October 2025.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.viasat.com/news/latest-news/aviation/2026/viasat-and-vueling-enhance-customer-satisfaction-with-new-free--/",
      "https://www.aerotime.aero/articles/iag-starlink-wifi-rollout-2026",
      "https://loyaltylobby.com/2025/11/06/british-airways-iberia-level-aer-lingus-vueling-introducing-free-starlink-inflight-wifi/"
    ],
    "needs_verification": true
  },
  "PC": {
    "airline": "Pegasus Airlines",
    "rules": [
      {
        "fleet": "all",
        "provider": "None",
        "orbit": "NONE"
      }
    ],
    "access": "No internet; connecting to the onboard Wi-Fi reaches only the FLY&WATCH entertainment portal, which costs EUR 3.99.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://centreforaviation.com/analysis/reports/europes-inflight-wifi-divide-strategy-cost-and-the-battle-for-the-connected-passenger-737174",
      "https://www.flypgs.com/en/travel-services/flight-services/fly-watch",
      "https://www.immfly.com/post/pegasus-airlines-takes-the-next-step-towards-connectivity-with-immfly-group"
    ]
  },
  "XQ": {
    "airline": "SunExpress",
    "rules": [
      {
        "fleet": "all",
        "provider": "None",
        "orbit": "NONE"
      }
    ],
    "access": "No internet connectivity; onboard entertainment is an Immfly local streaming portal to personal devices.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.futuretravelexperience.com/2018/06/sunexpress-enhances-inflight-experience-with-immflys-digital-platform/",
      "https://apex.aero/articles/lufthansa-group-will-install-850-aircraft-with-starlink-ifc/",
      "https://www.cestee.com/airline/sunexpress/services"
    ],
    "needs_verification": true
  },
  "SV": {
    "airline": "Saudia",
    "rules": [
      {
        "fleet": "rollout",
        "provider": "NSG Skywaves over SES Open Orbits (GEO+MEO), phased installs since Apr 2026, free up to 300 Mbps when fitted; legacy Panasonic Ku (paid) on unconverted aircraft",
        "orbit": "mixed GEO/MEO"
      }
    ],
    "access": "Free for all passengers in all cabins on NSG-equipped aircraft (up to 300 Mbps, 800 Mbps planned); aircraft still on the legacy Panasonic system sell paid per-flight packages.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.spa.gov.sa/en/w2558515",
      "https://neospacegroup.com/english/news/saudia-and-neo-space-group-announce-the-launch-of-one-of-the-kingdoms-most-advanced-in-flight-connectivity-services",
      "https://paxex.aero/saudia-nsg-finally-confirm-inflight-internet-partnership/",
      "https://runwaygirlnetwork.com/2026/04/saudia-turns-to-nsg-multi-orbit-ifc-for-significant-portion-of-fleet/"
    ],
    "needs_verification": true
  },
  "GF": {
    "starlink": {
      "status": "flying",
      "access": "free",
      "progress": {
        "done": 6,
        "pct": 75,
        "scope": "A320neo-family fleet; 787-9s pending certification",
        "as_of": "2026-09",
        "basis": "trade",
        "source": "https://www.ttnworldwide.com/ArticleTA/467516/gulf-air-equips-75pc-of-a320neo-fleet-with-starlink-connectivity"
      },
      "milestones": [
        {
          "date": "2026-09",
          "text": "Six A320neo-family aircraft equipped, about 75% of that fleet",
          "source": "https://www.ttnworldwide.com/ArticleTA/467516/gulf-air-equips-75pc-of-a320neo-fleet-with-starlink-connectivity"
        },
        {
          "date": "2026-05",
          "text": "First Starlink aircraft enters service",
          "source": "https://centreforaviation.com/news/gulf-air-launches-first-aircraft-equipped-with-starlink-1359284"
        }
      ]
    },
    "airline": "Gulf Air",
    "rules": [
      {
        "fleet": "rollout",
        "provider": "Starlink, progressive fleet rollout (first aircraft May 2026; six A320neo-family aircraft equipped, about 75% of the A320neo fleet, as of early September 2026); 787-9s still on the legacy Falcon Wi-Fi pending certification; a given flight may not be fitted yet",
        "orbit": "mixed GEO/LEO"
      }
    ],
    "access": "Free, unlimited, gate-to-gate for every passenger regardless of cabin or fare on Starlink-fitted aircraft.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://www.gulfair.com/about-gulf-air/media-center/Gulf-Air-to-Introduce-Starlink-Wi-Fi-Across-Its-Entire-Fleet-from-Mid-2026",
      "https://centreforaviation.com/news/gulf-air-launches-first-aircraft-equipped-with-starlink-1359284",
      "https://www.futuretravelexperience.com/2026/02/gulf-air-to-introduce-high-speed-starlink-connectivity-across-entire-fleet-from-mid-2026/",
      "https://www.ttnworldwide.com/ArticleTA/467516/gulf-air-equips-75pc-of-a320neo-fleet-with-starlink-connectivity"
    ],
    "needs_verification": true
  },
  "WY": {
    "airline": "Oman Air",
    "rules": [
      {
        "fleet": "widebody",
        "types": "787",
        "provider": "Inmarsat GX Aviation Ka-band (Inmarsat now owned by Viasat) - not confirmed by Oman Air itself",
        "orbit": "GEO"
      },
      {
        "fleet": "most",
        "provider": "None",
        "orbit": "NONE"
      }
    ],
    "access": "Paid. Oman Air's own site lists data-capped passes from $6/30min to $29/3h, with Business Studio getting a complimentary 3h/40MB allowance; a 2026 review reports free messaging for all cabins plus $8.99 for 1h or $17.99 full-flight, and free full-flight Wi-Fi for Sindbad Gold+ in Business since Oct 2025.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.omanair.com/en/inflight-connectivity",
      "https://www.businessclassjournal.com/airlines/oman-air-business-787-9-2026/"
    ],
    "needs_verification": true
  },
  "KU": {
    "airline": "Kuwait Airways",
    "rules": [
      {
        "types": "777",
        "provider": "Panasonic Avionics Ku",
        "orbit": "GEO"
      },
      {
        "types": "A320|A321",
        "provider": "Inmarsat GX / SITAONAIR",
        "orbit": "GEO"
      }
    ],
    "access": "BlueFi freemium: unlimited chat/messaging free for everyone; a $20 'Mail and Surf' pass adds email and browsing (150MB / 3 hours), streaming excluded on both tiers.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://kuwaitairways.com/en/Service/Pages/BlueFi.aspx",
      "https://paxex.aero/kuwait-airways-selects-panasonic-avionics-for-a330neo-ife/"
    ],
    "needs_verification": true
  },
  "RJ": {
    "airline": "Royal Jordanian",
    "rules": [
      {
        "fleet": "most",
        "types": "Embraer 190|ERJ-190|E190|Embraer 195|ERJ-195|E195|A320|A321|787",
        "provider": "Viasat Ka-band, factory-fitted on new deliveries (program announced Mar 2024, 40+ aircraft; E2 jets were first to fly with it)",
        "orbit": "GEO"
      },
      {
        "fleet": "rollout",
        "types": "787",
        "provider": "Viasat Ka-band retrofit contracted to Boeing Global Services (announced Feb 2025, seven aircraft, no completion date published)",
        "orbit": "GEO"
      }
    ],
    "access": "Not disclosed: no source found states Royal Jordanian's Wi-Fi pricing or whether any tier is complimentary.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.viasat.com/news/latest-news/aviation/2024/royal-jordanian-airlines-to-elevate-passenger-experience-with-viasats-state-of-the-art-in-flight-wi-fi-across-multiple-fleets/",
      "https://paxex.aero/royal-jordanian-inflight-internet-787-boeing-global-services/",
      "https://www.satellitetoday.com/mobility/2024/03/14/royal-jordanian-airlines-selects-viasats-in-flight-wi-fi-system/"
    ],
    "needs_verification": true
  },
  "ME": {
    "airline": "Middle East Airlines",
    "rules": [
      {
        "types": "A321",
        "provider": "Panasonic Avionics Ku (eXConnect), line-fit A321neos",
        "orbit": "GEO"
      },
      {
        "fleet": "all",
        "provider": "None on the rest of the fleet",
        "orbit": "NONE"
      }
    ],
    "access": "Not determined: MEA's own Wi-Fi page returned HTTP 403 and no other source found states pricing or a free tier.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://paxex.aero/mea-first-a321neo-panasonic-avionics-wifi-on-board/",
      "https://www.futuretravelexperience.com/2020/07/middle-east-airlines-selects-panasonic-avionics-ifec-for-a321-fleet/",
      "https://www.aircraftinteriorsinternational.com/news/inflight-entertainment/middle-east-airlines-signs-up-for-panasonic-ifec.html"
    ],
    "needs_verification": true
  },
  "LY": {
    "starlink": {
      "status": "announced",
      "access": "free"
    },
    "airline": "El Al",
    "rules": [
      {
        "fleet": "most",
        "provider": "Viasat Ka on the 787s, 777s and some 737s (paid); Starlink is announced but does not enter service until 2027",
        "orbit": "GEO"
      }
    ],
    "access": "Paid today: Basic / Social / Business passes bought inflight with a card, Matmid points or FLY CARD, free for top-tier Platinum Matmid members. Starlink service is announced as complimentary from 2027.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://runwaygirlnetwork.com/2026/06/el-al-to-roll-out-starlink-inflight-wi-fi-starting-in-2027/",
      "https://www.aerotime.aero/articles/israels-el-al-becomes-latest-airline-to-sign-starlink-internet-deal",
      "https://investors.viasat.com/news-releases/news-release-details/el-al-israel-airlines-and-viasat-bring-flight-wi-fi-innovation",
      "https://www.elal.com/en/FrequentFlyer/Pages/hp/WiFi-TP.aspx"
    ],
    "needs_verification": true
  },
  "ET": {
    "airline": "Ethiopian Airlines",
    "rules": [
      {
        "fleet": "widebody",
        "types": "A350",
        "provider": "Ka-band satellite via Thales Avionics, SITA FOR AIRCRAFT and Collins Aerospace; A350-1000s use Inmarsat GX Aviation under the Airbus HBCplus program",
        "orbit": "GEO"
      },
      {
        "fleet": "most",
        "types": "777|787",
        "provider": "Same Thales / SITA FOR AIRCRAFT / Collins Ka-band platform; Ethiopian states 'most' of its 777s and 787s are equipped",
        "orbit": "GEO"
      }
    ],
    "access": "Paid Sheba SkyConnect passes: $5 for 1 hour, $10 for 2 hours, $25 full flight; complimentary 1-hour pass for Business Class passengers and Platinum ShebaMiles members. Vouchers can be bought pre-flight at ticket offices, check-in or the gate, or onboard from crew.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.ethiopianairlines.com/us/services/add-on-services/on-board-wifi",
      "https://www.freightweek.org/index.php/en/latest-news/7583-ethiopian-airlines-to-offer-high-speed-inflight-broadband-on-its-a350-1000",
      "https://corporate.ethiopianairlines.com/Press-release-open-page/ethiopian-rolls-out-onboard-wifi-internet-connectivity-using-latest-satellite-technology"
    ]
  },
  "MS": {
    "airline": "EgyptAir",
    "rules": [
      {
        "fleet": "most",
        "types": "A350|787|737|A321|A320",
        "provider": "Panasonic Avionics Ku-band (confirmed for the A350 and 787-9; AeroMobile, a Panasonic subsidiary, handles onboard mobile service)",
        "orbit": "GEO"
      }
    ],
    "access": "Free tier launched 22 Apr 2026: unlimited text and voice messaging plus app-based voice calls throughout the flight, and free browsing and email for the first 2 hours. Heavier use falls back to paid bundles (previously $6/60MB to $20/240MB, $25/300MB streaming).",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.egyptindependent.com/egyptair-launches-free-unlimited-messaging-and-wi-fi-bundles/",
      "https://paxex.aero/egyptair-taps-next-gen-ife-from-panasonic-avionics-for-a350-fleet/",
      "https://www.egyptair.com/en/fly/entertainments/Pages/default.aspx"
    ],
    "needs_verification": true
  },
  "AT": {
    "airline": "Royal Air Maroc",
    "rules": [
      {
        "fleet": "most",
        "provider": "None",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight internet on the overwhelming majority of the fleet. Only the two most recently delivered 787-9s (from 24 Nov 2024) reportedly carry inflight internet, assigned to long-haul routes such as Casablanca-Beijing; RAM publishes no pricing. Older aircraft carry 'Wi-Fi on Stream' streaming entertainment only, not internet access.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://medias24.com/2025/01/01/royal-air-maroc-lance-son-premier-wifi-a-bord/",
      "https://milesopedia.com/en/guide/airlines-wi-fi/",
      "https://www.royalairmaroc.com/int-en/experience/on-board"
    ],
    "needs_verification": true
  },
  "KQ": {
    "airline": "Kenya Airways",
    "rules": [
      {
        "fleet": "most",
        "provider": "None",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight Wi-Fi in service. The Nairobi-London launch promised for July 2026 did not happen: one 777-300ER has the hardware fitted but is waiting on a connectivity slot, and Kenya Airways now says installation across the long-haul fleet starts in Q2 2027 (London, Paris, New York, China and Amsterdam routes first) at a cost of US$20-22M; pricing and provider undisclosed.",
    "confidence": "reported",
    "as_of": "2026-09",
    "sources": [
      "https://sokodirectory.com/2026/03/kenya-airways-to-introduce-wi-fi-on-london-route-by-july/",
      "https://thebusinesswatch.com/kenya-airways-to-introduce-in-flight-wi-fi-on-london-route-by-july/",
      "https://allafrica.com/stories/202608260278.html"
    ],
    "needs_verification": true
  },
  "WB": {
    "airline": "RwandAir",
    "rules": [
      {
        "fleet": "widebody",
        "types": "A330",
        "provider": "SITAONAIR using Inmarsat SwiftBroadband (L-band), with a stated upgrade path to GX Aviation",
        "orbit": "GEO"
      },
      {
        "fleet": "narrowbody",
        "provider": "RwandAir lists wifi on the 737s but the platform is unverified",
        "orbit": "GEO"
      }
    ],
    "access": "Paid: Wi-Fi codes/vouchers are bought inflight with a credit card or cash through the duty-free service. RwandAir publishes no prices or package tiers.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.rwandair.com/media-center/news-press-releases/rwandair-puts-passengers-online-with-internet-and-mobile-phone-services/",
      "https://www.rwandair.com/information/on-board/wifi/",
      "https://www.aviationtoday.com/2015/11/11/africas-rwandair-chooses-sita-onair-for-connectivity/"
    ],
    "needs_verification": true
  },
  "SY": {
    "airline": "Sun Country",
    "rules": [
      {
        "fleet": "all",
        "provider": "none (AirFi wireless streaming entertainment only, no internet)",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight internet at all; the onboard AirFi network streams only a local entertainment library, free of charge.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://paxex.aero/sun-country-plans-inflight-wi-fi-just-not-yet/",
      "https://stories.suncountry.com/post/enhance-your-in-flight-experience-with-airfi"
    ]
  },
  "G4": {
    "airline": "Allegiant Air",
    "rules": [
      {
        "fleet": "all",
        "provider": "none",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight wifi is offered on any Allegiant aircraft.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://thepointsguy.com/news/allegiant-air-explores-inflight-wifi/",
      "https://simpleflying.com/allegiant-air-considers-in-flight-wifi/"
    ]
  },
  "MX": {
    "airline": "Breeze Airways",
    "rules": [
      {
        "fleet": "most",
        "types": "A220",
        "provider": "Viasat",
        "orbit": "GEO"
      }
    ],
    "access": "Free messaging for everyone, full wifi included with the Nicer/Nicest bundles, otherwise about USD 8 per flight.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.flybreeze.com/wifi-info",
      "https://simpleflying.com/breeze-airways-schedules-embraer-e190-flights-9-routes-next-2-months/",
      "https://centreforaviation.com/news/breeze-airways-to-retire-e190-fleet-in-2026-ceo-1307347"
    ]
  },
  "PD": {
    "airline": "Porter Airlines",
    "rules": [
      {
        "fleet": "most",
        "types": "Embraer 195|ERJ-195|E195",
        "provider": "Viasat",
        "orbit": "GEO"
      }
    ],
    "access": "Free gate-to-gate for every passenger, ad-supported: VIPorter members (free to join) watch one 30-second ad for full-flight access, non-members watch an ad every 30 minutes.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.viasat.com/news/latest-news/aviation/2023/porter-airlines-and-viasat-to-deliver-free-fast-in-flight-connectivity-to-an-additional-20-new-embraer-e195-e2-aircraft/",
      "https://paxex.aero/porter-airlines-viasat-wifi-expansion/",
      "https://www.flyporter.com/en-us/travel-information/inflight/wi-fi"
    ]
  },
  "Y4": {
    "starlink": {
      "status": "announced",
      "access": "unannounced"
    },
    "airline": "Volaris",
    "rules": [
      {
        "fleet": "all",
        "provider": "none today; Starlink signed July 2026 with installs from 2027",
        "orbit": "NONE"
      }
    ],
    "access": "No internet access is sold today; Volaris TV is a local streaming entertainment network costing about MXN 20 and works without connectivity.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://cms.volaris.com/es/informacion-util/sala-de-prensa/volaris-tv/",
      "https://volaristv.com/",
      "https://mexicobusiness.news/infrastructure/news/volaris-equip-entire-fleet-starlink-wi-fi-2027",
      "https://centreforaviation.com/news/volaris-to-introduce-starlink-wifi-from-2027-1366101"
    ]
  },
  "VB": {
    "airline": "Viva Aerobus",
    "rules": [
      {
        "fleet": "rollout",
        "types": "A320|A321",
        "provider": "SES multi-orbit (GEO+MEO) via ESA antenna; launched June 2026, 10+ of 100 aircraft equipped, fleetwide over coming years",
        "orbit": "MEO"
      }
    ],
    "access": "Paid per-flight plans tiered for messaging, social media and streaming.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.ses.com/news/press-release/ses-launches-multiorbit-satellite-connectivity-on-mexicos-viva-0",
      "https://www.flightglobal.com/archive/2026/06/mexicos-viva-to-equip-100-airbus-jets-with-ses-multi-orbit-wi-fi-service/",
      "https://mexico.ladevi.info/transporte/companias-aereas/viva-aerobus-anuncia-nuevo-servicio-internet-satelital-bordo-n101416",
      "https://www.vivaaerobus.com/es-mx/wifi"
    ],
    "needs_verification": true
  },
  "AD": {
    "airline": "Azul",
    "rules": [
      {
        "fleet": "rollout",
        "types": "A320|A321|Embraer 195|ERJ-195|E195",
        "provider": "Viasat",
        "orbit": "GEO"
      },
      {
        "types": "A330",
        "provider": "Viasat announced for the A330-900 long-haul fleet (first installs planned from 2025) but no in-service confirmation; long-haul wifi to be sold as paid packages",
        "orbit": "NONE"
      }
    ],
    "access": "Free and unlimited for Azul Fidelidade members on the domestic Viasat fleet, and enrollment is free and can be completed onboard.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.viasat.com/pt-br/aviacao/",
      "https://www.correiobraziliense.com.br/cbradar/como-saber-se-meu-voo-tem-wi-fi-gratis-antes-de-embarcar-saiba-todos-os-detalhes/",
      "https://paxex.aero/azul-a330neo-wifi-viasat/"
    ],
    "needs_verification": true
  },
  "H2": {
    "airline": "Sky Airline",
    "rules": [
      {
        "fleet": "all",
        "provider": "none",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight internet and no seatback screens.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.cestee.com/airline/sky-airline/services",
      "https://www.cestee.es/aerolinea/sky-airline/servicios"
    ],
    "needs_verification": true
  },
  "JA": {
    "starlink": {
      "status": "announced",
      "access": "unannounced"
    },
    "airline": "JetSMART",
    "rules": [
      {
        "fleet": "all",
        "provider": "none today; Starlink signed July 2026 with service from 2027",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight wifi is available today.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://www.emol.com/noticias/Economia/2026/07/14/1205595/jetsmart-starlink-wifi.html",
      "https://www.panrotas.com.br/aviacao/tecnologia/2026/07/jetsmart-deve-implementar-internet-starlink-a-bordo-em-2027",
      "https://www.cestee.com/airline/jetsmart/services"
    ]
  },
  "SA": {
    "airline": "South African Airways",
    "rules": [
      {
        "fleet": "all",
        "provider": "none (InFlight Dublin 'Everhub' wireless streaming IFE only, no internet)",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight internet; the onboard wireless system streams a local entertainment library only.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.inflightdublin.com/south-african-airways-selects-inflight-dublin-as-content-and-wireless-ife-service-provider/",
      "https://www.starlinkflights.com/airlines/sa",
      "https://mybroadband.co.za/news/broadband/583000-one-south-african-airline-looking-to-starlink-for-in-flight-wi-fi.html"
    ],
    "needs_verification": true
  },
  "MK": {
    "airline": "Air Mauritius",
    "rules": [
      {
        "fleet": "widebody",
        "types": "A350|A330",
        "provider": "Viasat on selected A330-900neo and A350 aircraft; the A330-200s are unequipped",
        "orbit": "mixed GEO/none"
      }
    ],
    "access": "Paid: MK Chat USD 7 full flight, MK Essential USD 10 per hour, MK Premium USD 18-25 by haul length, with one free hour for Business Class and KestrelFlyer Gold members.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.airmauritius.com/en/flying-with-us/inflight-entertainment/wi-fi"
    ],
    "needs_verification": true
  },
  "AH": {
    "airline": "Air Algerie",
    "rules": [
      {
        "fleet": "all",
        "provider": "None active for passengers; three A330-900neos in service since late 2025 carry Airbus HBCplus hardware with wifi pending activation after a testing phase (the A350 order was dropped)",
        "orbit": "NONE"
      }
    ],
    "access": "No wifi available to passengers today.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://voyagerdz.com/air-algerie-wifi-bientot-disponible-a-bord/",
      "https://algerienomades.com/air-algerie-a330neo-wifi/",
      "https://lavoiedalgerie.dz/air-algerie-receptionne-son-deuxieme-airbus-a330neo-dans-le-cadre-du-renouvellement-de-sa-flotte/2026/06/00/",
      "https://www.flightglobal.com/airlines/air-algerie-introduces-first-a330-900/165301.article"
    ],
    "needs_verification": true
  },
  "MF": {
    "airline": "Xiamen Air",
    "rules": [
      {
        "fleet": "widebody",
        "types": "787",
        "provider": "Panasonic Avionics Ku-band",
        "orbit": "GEO"
      },
      {
        "fleet": "all",
        "orbit": "NONE",
        "provider": "None on the 737 fleet - wifi is 787-only per the airline's own announcements"
      }
    ],
    "access": "Tiered by cabin: first class free via an activation code, business class free for a limited period then paid, economy must buy a data package through the wifimall.xiamenair.cn portal.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://wifimall.xiamenair.cn",
      "https://www.aviationnewsonline.com",
      "https://news.qq.com/rain/a/20230814A07SLM00"
    ],
    "needs_verification": true
  },
  "HO": {
    "airline": "Juneyao Airlines",
    "rules": [
      {
        "fleet": "widebody",
        "types": "787",
        "provider": "Panasonic Ku-band over APSTAR-6D (APT Mobile Satcom)",
        "orbit": "GEO"
      },
      {
        "fleet": "all",
        "orbit": "NONE",
        "provider": "None on the A320/A321 fleet - official wifi page lists 787 flights only"
      }
    ],
    "access": "787s only: 50 RMB per segment domestic and Japan/Korea, 150 RMB other international; free in business and for platinum elites; 10-minute free trial in economy.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.juneyaoair.com",
      "https://paxex.aero",
      "https://www.juneyaoair.com/planeWiFi"
    ],
    "needs_verification": true
  },
  "9C": {
    "airline": "Spring Airlines",
    "rules": [
      {
        "fleet": "most",
        "provider": "Onboard local-area streaming portal only, no internet",
        "orbit": "NONE"
      }
    ],
    "access": "Connect to the ch.com hotspot and enter your seat number plus the last six digits of your ID for video, music and reading content; there is no internet access.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.ch.com",
      "https://www.airlineratings.com"
    ]
  },
  "3U": {
    "airline": "Sichuan Airlines",
    "rules": [
      {
        "fleet": "widebody",
        "types": "A330",
        "provider": "China Satcom Ka-band HTS with Viasat equipment and Xinghang Interconnect services",
        "orbit": "GEO"
      },
      {
        "fleet": "all",
        "orbit": "mixed GEO/none",
        "provider": "China Satcom Ka (ChinaSat-16) with Viasat terminals via AeroSat Link on ~16 A320-family aircraft; the rest of the narrowbody fleet is unequipped"
      },
      {
        "fleet": "all",
        "types": "A350",
        "orbit": "UNKNOWN",
        "provider": "Not verified for the A350s - no connectivity evidence found"
      }
    ],
    "access": "Paid on equipped aircraft: about 39.9 RMB full flight or 9.9 RMB hourly on Ka-equipped A320s, free for business class and top-tier elites; widebody tiers around 19.9 and 49.9 RMB per segment.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://investors.viasat.com/news-releases/news-release-details/sichuan-airlines-becomes-chinas-first-domestic-carrier-partner",
      "https://www.sichuanair.com",
      "https://m.jiemian.com/article/10118001.html"
    ],
    "needs_verification": true
  },
  "UO": {
    "airline": "HK Express",
    "rules": [
      {
        "fleet": "all",
        "provider": "None, no inflight connectivity; the 'Cabin Connect' portal rolling out from summer 2026 (Inflight Dublin Everhub) is ordering, upgrades and flight tracking only, with no internet access",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight internet is sold or offered; the onboard Cabin Connect SSID is a local portal, not wifi.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://paxex.aero/hk-express-cabin-connect-inflight-dublin/",
      "https://www.hkexpress.com"
    ]
  },
  "HX": {
    "airline": "Hong Kong Airlines",
    "rules": [
      {
        "fleet": "all",
        "provider": "Bluebox Blueview wireless streaming IFE only, no internet",
        "orbit": "NONE"
      }
    ],
    "access": "Free wireless streaming entertainment to personal devices on selected aircraft; no internet browsing is available.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.hongkongairlines.com",
      "https://www.executivetraveller.com/hong-kong-airlines-hx-airbus-a350-inflight-internet-wifi-review"
    ],
    "needs_verification": true
  },
  "NX": {
    "airline": "Air Macau",
    "rules": [
      {
        "fleet": "rollout",
        "types": "A320|A321",
        "provider": "Onboard local streaming entertainment system only, no internet",
        "orbit": "NONE"
      }
    ],
    "access": "Free access above 10,000 feet by joining the Air Macau network and opening the portal, offering films, TV, games and reading only.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.airmacau.com.mo/en/useWifi",
      "https://www.airmacau.com.mo"
    ],
    "needs_verification": true
  },
  "BX": {
    "airline": "Air Busan",
    "rules": [
      {
        "fleet": "all",
        "provider": "None in service; Starlink announced December 2025 under the Hanjin Group five-airline deal, with Air Busan's installation timing still to be decided",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight internet today; the group Starlink product is to be free once fitted.",
    "confidence": "reported",
    "as_of": "2026-09",
    "sources": [
      "https://www.airbusan.com",
      "https://www.koreaherald.com/article/10630658"
    ],
    "needs_verification": true,
    "starlink": {
      "status": "announced",
      "access": "free"
    }
  },
  "DY": {
    "airline": "Norwegian",
    "rules": [
      {
        "fleet": "most",
        "types": "737",
        "provider": "Anuvu Dedicated Space (Ku-band) on 737-800 only; 737 MAX 8 has no wifi equipment installed yet, MAX installs run through 2030",
        "orbit": "GEO"
      }
    ],
    "access": "Free 15-minute limited-speed SURF tier on 737-800s then paid Stream Limited (30 or 60 minutes) or Stream Unlimited passes, with no wifi of any kind on the 737 MAX 8 fleet.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.norwegian.com/uk/travel-info/on-board/wifi/",
      "https://www.anuvu.com/our-company/press-releases/detail/295/",
      "https://paxex.aero/"
    ]
  },
  "N0": {
    "airline": "Norse Atlantic Airways",
    "rules": [
      {
        "fleet": "all",
        "types": "787",
        "provider": "none; seatback video on demand only, no passenger internet",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight internet is available; the 787s carry seatback entertainment only.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://thepointsguy.com/airline/reviews/norse-atlantic-premium-787/",
      "https://en.wikipedia.org/wiki/Norse_Atlantic_Airways"
    ],
    "needs_verification": true
  },
  "HV": {
    "airline": "Transavia",
    "rules": [
      {
        "fleet": "all",
        "types": "737|A320|A321",
        "provider": "none; AirFi local streaming boxes serve an entertainment and retail portal with no internet backhaul",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight internet; the onboard wifi network reaches only the AirFi entertainment and shopping portal.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://runwaygirlnetwork.com/2023/09/transavia-brings-rotterdam-airfi/",
      "https://www.futuretravelexperience.com/2023/10/transavia-trials-mall-in-the-sky-concept-with-airfi/",
      "https://www.aircraftinteriorsinternational.com/news/transavia-to-trial-airfi-streaming-platform.html"
    ],
    "needs_verification": true
  },
  "EW": {
    "starlink": {
      "status": "announced",
      "access": "unannounced"
    },
    "airline": "Eurowings",
    "rules": [
      {
        "fleet": "most",
        "types": "A319|A320|A321",
        "provider": "Inmarsat GX Aviation Ka-band (Viasat-owned) via Lufthansa Group FlyNet, branded Wings Connect; Starlink retrofit announced 13 January 2026 with installs from H2 2026 and completion targeted 2029, none in passenger service yet",
        "orbit": "GEO"
      }
    ],
    "access": "Paid passes only, roughly EUR 2.90 to 3.90 for messaging, EUR 3.90 to 6.90 for 30 or 60 minutes and EUR 7.90 to 9.90 for the whole flight; the free Wings Connect portal carries flight info and partner offers but no internet.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://www.eurowings.com/de/informieren/an-bord/bordunterhaltung.html",
      "https://newsroom.lufthansagroup.com/",
      "https://aviation24.be/"
    ],
    "needs_verification": true
  },
  "DE": {
    "airline": "Condor",
    "rules": [
      {
        "fleet": "widebody",
        "types": "A330",
        "provider": "Inmarsat GX Aviation (Ka-band), branded Condor FlyConnect",
        "orbit": "GEO"
      },
      {
        "fleet": "most",
        "types": "A320|A321",
        "provider": "Intelsat 2Ku, branded Condor FlyConnect; neo aircraft only, older ceo jets are not equipped",
        "orbit": "GEO"
      }
    ],
    "access": "Long-haul FlyConnect: Chat EUR 7, Surf EUR 20. Short and medium-haul is zone-priced: Surf EUR 2.99-4.99, Stream EUR 5.99-7.99. Ceo narrowbodies have no wifi.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://paxex.aero/condor-inflight-internet/",
      "https://paxex.aero/condor-taps-intelsat-for-inflight-internet/",
      "https://www.condor.com/us/fly-enjoy/on-board/inflight-entertainment/condor-flyconnect.jsp",
      "https://www.condor.com/en-gb/information-services/on-board-services/entertainment/wi-fi/"
    ],
    "needs_verification": true
  },
  "X3": {
    "airline": "TUI fly",
    "rules": [
      {
        "fleet": "most",
        "types": "737",
        "provider": "Iridium Certus narrowband satellite with a 9cm antenna, sufficient for flight tracking, the streaming portal and basic services but not full-speed browsing",
        "orbit": "LEO"
      }
    ],
    "access": "Narrowband satellite link powering live flight tracking plus paid WhatsApp messaging and the Immfly entertainment and retail portal, in service since the summer 2025 fleet upgrade; no full internet browsing.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://aviation.direct/tui-stattet-flugzeugflotte-mit-wlan-aus",
      "https://www.t-online.de/leben/reisen/id_100600138/wlan-im-flugzeug-tui-bietet-jetzt-internet-an-bord-an.html",
      "https://paxex.aero/tui-immfly-whatsapp-inflight-wifi-entertainment/"
    ],
    "needs_verification": true
  },
  "LS": {
    "airline": "Jet2",
    "rules": [
      {
        "fleet": "all",
        "types": "737|A321",
        "provider": "none; no inflight wifi and no streaming portal",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight wifi is offered, and passengers are advised to download entertainment before flying.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.citizendailypost.com/faq/does-jet2-have-screens-on-seats",
      "https://cabincrewhq.com/jet2com-inflight-wifi/"
    ],
    "needs_verification": true
  },
  "BT": {
    "starlink": {
      "status": "flying",
      "access": "free",
      "progress": {
        "pct": 100,
        "scope": "A220 fleet, the whole airline",
        "as_of": "2026-08",
        "basis": "airline",
        "source": "https://www.airbaltic.com/en/extra-services/fast-and-free-internet-on-board"
      }
    },
    "airline": "airBaltic",
    "rules": [
      {
        "fleet": "all",
        "types": "A220",
        "provider": "SpaceX Starlink",
        "orbit": "LEO"
      }
    ],
    "access": "Free Starlink wifi for every passenger from the moment of boarding, with no purchase, tier or status requirement.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.airbaltic.com/en/extra-services/fast-and-free-internet-on-board",
      "https://onemileatatime.com/news/airbaltic-free-wi-fi/",
      "https://runwaygirlnetwork.com/2026/06/when-airbaltics-starlink-is-highlight-of-an-air-serbia-a320-experience/"
    ]
  },
  "FI": {
    "airline": "Icelandair",
    "rules": [
      {
        "fleet": "most",
        "types": "737|A321|757|767",
        "provider": "Viasat",
        "orbit": "GEO"
      }
    ],
    "access": "Paid per flight in economy, about EUR 12 to Europe and EUR 24 to North America on the A321 and 737 MAX and roughly half that on the 757 and 767, and free on two devices for Saga Premium, Saga Premium Flex and Saga Gold.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.icelandair.com/flights/internet/",
      "https://www.viasat.com/perspectives/aviation/2021/connectivity-is-heating-up-on-icelandair/",
      "https://investors.viasat.com/news-releases/"
    ]
  },
  "JU": {
    "airline": "Air Serbia",
    "rules": [
      {
        "fleet": "narrowbody",
        "types": "A319|A320|A321|ATR 72",
        "provider": "none; the former Panasonic Wi-Fly service is no longer offered on narrowbodies",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight internet on the narrowbody fleet, and the A330 widebody position is unconfirmed.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://runwaygirlnetwork.com/2026/06/when-airbaltics-starlink-is-highlight-of-an-air-serbia-a320-experience/"
    ],
    "needs_verification": true
  },
  "RO": {
    "airline": "TAROM",
    "rules": [
      {
        "fleet": "all",
        "types": "737|ATR 72",
        "provider": "none; the 2017 free wifi was AirFi local streaming rather than internet",
        "orbit": "NONE"
      }
    ],
    "access": "No passenger internet is offered on board.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://flyforpoints.com/wifi/skyteam/tarom.html",
      "https://www.actmedia.eu/"
    ],
    "needs_verification": true
  },
  "OU": {
    "airline": "Croatia Airlines",
    "rules": [
      {
        "fleet": "all",
        "types": "A220",
        "provider": "Panasonic Avionics (Ku-band)",
        "orbit": "GEO"
      }
    ],
    "access": "Free 10-minute Sky Chat messaging for everyone, then EUR 7.95 for an hour of Sky Surf or EUR 11.95 for whole-flight Sky Premium, with business class receiving a complimentary Sky Premium code.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.croatiaairlines.com/on-board/wi-fi",
      "https://paxex.aero/croatia-airlines-inflight-internet-a220-panasonic-avionics/",
      "https://avioradar.net/ispitali-smo-besplatan-internet-u-a220-croatia-airlinesa/"
    ]
  },
  "G9": {
    "airline": "Air Arabia",
    "rules": [
      {
        "fleet": "rollout",
        "types": "A320|A321",
        "provider": "Panasonic Avionics Ku-band multi-orbit IFC, in passenger service since March 2026 (separate from the fleetwide Panasonic eXW wireless IFE, which is entertainment only)",
        "orbit": "mixed GEO/LEO"
      }
    ],
    "access": "Five minutes of free Wi-Fi per flight, then paid data or messaging 'Chat' packages, and only on aircraft already fitted with the connectivity hardware.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://runwaygirlnetwork.com/2026/03/air-arabia-debuts-panasonic-avionics-multi-orbit-ifc/",
      "https://www.panasonic.aero/press/air-arabia-and-panasonic-avionics-announce-172-aircraft-in-flight-wireless-entertainment-deal",
      "https://www.airarabia.com/en/landing-pages/wifi-uae-checkin-reminder/wifi-5-mins-free"
    ],
    "needs_verification": true
  },
  "FZ": {
    "starlink": {
      "status": "announced",
      "access": "free"
    },
    "airline": "flydubai",
    "rules": [
      {
        "fleet": "all",
        "types": "737",
        "provider": "None in service: Anuvu GEO Wi-Fi was progressively removed from the 737 fleet from January 2024 and fully deactivated by May 2024; Starlink announced November 2025 for about 100 aircraft during 2026 with no confirmed installations or passenger service yet",
        "orbit": "NONE"
      }
    ],
    "access": "No onboard internet at present; the announced Starlink service is to be complimentary for all passengers once it enters service.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://news.flydubai.com/flydubai-announces-starlink-as-its-inflight-connectivity-partner",
      "https://www.exyuaviation.com/2024/05/flydubai-removes-onboard-wifi.html",
      "https://www.starlinkflights.com/airlines/fz"
    ],
    "needs_verification": true
  },
  "J9": {
    "airline": "Jazeera Airways",
    "rules": [
      {
        "fleet": "all",
        "types": "A320|A321",
        "provider": "Bluebox Wow wireless IFE branded 'Jazeera Screens', a local onboard streaming server with no internet uplink",
        "orbit": "NONE"
      }
    ],
    "access": "Free streaming of movies and games to your own device; no internet browsing is offered or sold.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://blueboxaviation.com/jazeera-extension/",
      "https://www.pax-intl.com/ife-connectivity/inflight-entertainment/2024/06/07/bluebox-aviation-and-jazeera-airways-renew-blueview-ife-partnership/",
      "https://www.futuretravelexperience.com/2024/06/jazeera-airways-renews-blueboxs-blueview-ife-service-providing-ife-options-on-passengers-personal-devices/"
    ]
  },
  "OV": {
    "starlink": {
      "status": "none",
      "access": "unannounced"
    },
    "airline": "SalamAir",
    "rules": [
      {
        "fleet": "all",
        "types": "A320|A321",
        "provider": "None: no onboard connectivity product and no announced IFC or Starlink deal",
        "orbit": "NONE"
      }
    ],
    "access": "No onboard Wi-Fi; SalamAir's own FAQ describes only buy-on-board food and drink.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.salamair.com/en/contact-us/faq",
      "https://www.salamair.com/en/"
    ],
    "needs_verification": true
  },
  "XY": {
    "airline": "flynas",
    "rules": [
      {
        "fleet": "all",
        "types": "A320|A321",
        "provider": "None in service; the naswifi air-to-ground LTE deal with SkyFive Arabia and stc (2024 MoU, re-committed Nov 2025 with Alsalam handling installs) has not reached passenger service",
        "orbit": "NONE"
      }
    ],
    "access": "No onboard wifi today; the free naswifi air-to-ground service remains planned, not flying.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://paxex.aero/flynas-inflight-internet-skyfive-saudi-arabia/",
      "https://www.flynas.com/en/media-center/news-updates/flynas-signs-strategic-partnership-with-stc-group-and-skyfive"
    ],
    "needs_verification": true
  },
  "HY": {
    "airline": "Uzbekistan Airways",
    "rules": [
      {
        "fleet": "rollout",
        "types": "787|A320",
        "provider": "Panasonic Avionics eX3 Ka-band IFEC (787 and A320neo)",
        "orbit": "GEO"
      },
      {
        "types": "A321",
        "provider": "Neo Space Group with the SES Open Orbits multi-orbit network is due on the A321neo fleet from 2026 but is not confirmed in service",
        "orbit": "NONE"
      }
    ],
    "access": "Paid data bundles, roughly $3.5 to $28.9 for 20MB to 220MB, on fitted aircraft only.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.uzairways.com/en/press-center/news/internet-board",
      "https://uzdaily.uz/en/panasonic-avionics-partners-with-uzbekistan-airways-to-enhance-their-passenger-experience/",
      "https://uz.kursiv.media/en/2025-04-07/uzbekistan-airways-brings-high-speed-in-flight-internet-with-nsg-partnership/",
      "https://neospacegroup.com/english/news/neo-space-group-and-uzbekistan-airways-partner-to-bring-industry---leading-in-flight-connectivity-to-passengers"
    ],
    "needs_verification": true
  },
  "J2": {
    "airline": "Azerbaijan Airlines",
    "rules": [
      {
        "fleet": "rollout",
        "types": "A320",
        "orbit": "mixed GEO/none",
        "provider": "Viasat Amara Ka on the new A320neos delivered from November 2025; older A320-family jets are unequipped"
      },
      {
        "fleet": "all",
        "orbit": "NONE",
        "provider": "None on the rest of the legacy fleet; incoming 787-9s are slated to carry Viasat Amara"
      }
    ],
    "access": "Complimentary for Business Class and top-tier AZAL Miles on Amara-fitted aircraft; paid for other passengers with pricing not yet published.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.viasat.com/news/latest-news/aviation/2025/viasat-amara-selected-by-azerbaijan-airlines/",
      "https://paxex.aero/azerbaijan-airlines-inflight-internet-viasat/"
    ]
  },
  "KC": {
    "airline": "Air Astana",
    "rules": [
      {
        "fleet": "all",
        "provider": "None: the airline's own help centre states the Wi-Fi service is unavailable; SES (O3b mPOWER) has been selected for the A321LR fleet, with the critical design review completed Q2 2026 and installs to follow",
        "orbit": "NONE"
      }
    ],
    "access": "No onboard Wi-Fi; only the offline KCTV entertainment system with films, music and games.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://help.airastana.com/hc/en-gb/articles/4417968016530",
      "https://ir.airastana.com/en/about-us/company-news/air-astana-selects-rockwell-collins-to-provide-onboard-broadband-connectivity/",
      "https://aviationweek.com/air-transport/interiors-connectivity/air-astana-launches-inflight-high-speed-internet",
      "https://ir.airastana.com/en/about-us/company-news/air-astana-to-offer-passengers-in-flight-broadband-speed-connectivity/"
    ]
  },
  "VF": {
    "airline": "AJet",
    "rules": [
      {
        "fleet": "rollout",
        "types": "737",
        "provider": "TCI integrated IFC (Hughes, Turksat Ka + Eutelsat KONNECT VHTS, ThinKom antenna) planned for 120+ aircraft; first 737 MAX fitted December 2025 but passenger service has not been advertised",
        "orbit": "NONE"
      }
    ],
    "access": "No wifi in passenger service yet; AJet has signalled a paid model and has not published pricing.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://paxex.aero/ajet-tci-bring-first-aircraft-online/",
      "https://www.hughes.com/resources/press-releases/ajet-selects-turkish-cabin-interiors-tci-partnership-turksat-and-hughes",
      "https://www.aircraftinteriorsinternational.com/news/inflight-connectivity/ajet-partners-with-tci-hughes-and-turksat-for-in-flight-connectivity.html"
    ],
    "needs_verification": true
  },
  "QP": {
    "airline": "Akasa Air",
    "rules": [
      {
        "fleet": "all",
        "types": "737",
        "provider": "None: no onboard internet connectivity",
        "orbit": "NONE"
      }
    ],
    "access": "No onboard Wi-Fi.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.happyfares.in/blog/inflight-entertainment-indian-airlines-2026/"
    ],
    "needs_verification": true
  },
  "IX": {
    "airline": "Air India Express",
    "rules": [
      {
        "fleet": "all",
        "types": "737|A320|A321",
        "provider": "None: no onboard internet connectivity",
        "orbit": "NONE"
      }
    ],
    "access": "No onboard Wi-Fi.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.happyfares.in/blog/inflight-entertainment-indian-airlines-2026/"
    ],
    "needs_verification": true
  },
  "TR": {
    "airline": "Scoot",
    "rules": [
      {
        "fleet": "widebody",
        "types": "787",
        "provider": "Panasonic Avionics",
        "orbit": "GEO"
      },
      {
        "fleet": "narrowbody",
        "types": "A320|A321|Embraer 190|ERJ-190|E190",
        "provider": "none",
        "orbit": "NONE"
      }
    ],
    "access": "Paid data-bundle passes on 787s only, from US$1.50 pre-purchase for 20MB up to US$31.80 for 1GB (US$5-US$55 if bought onboard), with 200MB included for ScootPlus passengers.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.flyscoot.com/en/plan/booking-your-flight/wi-fi"
    ]
  },
  "AK": {
    "airline": "AirAsia",
    "rules": [
      {
        "fleet": "most",
        "types": "A320|A321",
        "provider": "Inmarsat GX Aviation (now Viasat)",
        "orbit": "GEO"
      }
    ],
    "access": "Paid data passes bought through the onboard portal, with a cheap or free chat/messaging tier historically offered on equipped aircraft.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://paxex.aero/airasia-inmarsat-gx-aviation-install-asia-digital-engineering/",
      "https://paxex.aero/airasia-airfi-digital-retail-inflight/"
    ],
    "needs_verification": true
  },
  "5J": {
    "starlink": {
      "status": "announced",
      "access": "unannounced"
    },
    "airline": "Cebu Pacific",
    "rules": [
      {
        "fleet": "all",
        "types": "A320|A321|A330|ATR 72",
        "provider": "none today; Starlink announced July 2026 with installations from 2027",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight wifi is available today.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://www.philstar.com/business/2026/07/16/2542380/cebu-pacific-light-starlink-wifi-2027",
      "https://www.abs-cbn.com/news/business/2026/7/14/cebu-pacific-to-offer-starlink-wifi-to-passengers-1905"
    ]
  },
  "JQ": {
    "airline": "Jetstar",
    "rules": [
      {
        "fleet": "rollout",
        "types": "787",
        "provider": "Viasat AMARA, 11 aircraft from April 2026 through mid-2027",
        "orbit": "GEO"
      },
      {
        "fleet": "narrowbody",
        "types": "A320|A321",
        "provider": "none",
        "orbit": "NONE"
      }
    ],
    "access": "On refreshed 787s wifi is complimentary in Business Class only, with paid packages in Economy; short-haul A320-family aircraft carry no internet at all.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://www.viasat.com/news/latest-news/aviation/2026/jetstar-selects-viasat-inflight-connectivity-long-haul-international-routes/",
      "https://paxex.aero/refreshed-787-takes-flight-for-jetstar/"
    ]
  },
  "VJ": {
    "starlink": {
      "status": "announced",
      "access": "unannounced"
    },
    "airline": "Vietjet Air",
    "rules": [
      {
        "fleet": "all",
        "types": "A320|A321|A330",
        "provider": "none in service; Starlink agreement signed May 2026 (Starlink's Vietnam commercial service went live Aug 2026), no onboard launch date announced",
        "orbit": "NONE"
      }
    ],
    "access": "No general passenger internet product; the onboard portal is local streaming and retail only.",
    "confidence": "reported",
    "as_of": "2026-09",
    "sources": [
      "https://paxex.aero/vietjet-signs-on-for-airfi-leo-trial/",
      "https://news.tuoitre.vn/vietjet-adds-95mn-to-starlink-investment-as-vietnams-in-flight-wi-fi-market-heats-up-103260816103229965.htm"
    ],
    "needs_verification": true
  },
  "ZG": {
    "starlink": {
      "status": "flying",
      "access": "free",
      "progress": {
        "pct": 100,
        "scope": "787 fleet, the whole airline",
        "as_of": "2026-08",
        "basis": "trade",
        "source": "https://paxex.aero/first-and-last-installs-for-two-starlink-customers/"
      }
    },
    "airline": "ZIPAIR",
    "rules": [
      {
        "fleet": "all",
        "types": "787",
        "provider": "Starlink",
        "orbit": "LEO"
      }
    ],
    "access": "Free high-speed wifi for every passenger on every flight, with no tiers or purchase.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://paxex.aero/zipair-activates-first-starlink-installation/",
      "https://paxex.aero/first-and-last-installs-for-two-starlink-customers/"
    ]
  },
  "MM": {
    "airline": "Peach Aviation",
    "rules": [
      {
        "fleet": "all",
        "types": "A320|A321",
        "provider": "none",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight wifi or internet is offered.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.flypeach.com/lm/ai/inflights/inflight-service",
      "https://news.google.com/rss/search?q=%E3%83%94%E3%83%BC%E3%83%81%E3%83%BB%E3%82%A2%E3%83%93%E3%82%A8%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3+%E6%A9%9F%E5%86%85+Wi-Fi+%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%8D%E3%83%83%E3%83%88&hl=ja&gl=JP&ceid=JP:ja"
    ]
  },
  "TW": {
    "airline": "T'way Air",
    "rules": [
      {
        "fleet": "all",
        "types": "737|A330|777",
        "provider": "none in service; seatback monitors and wifi announced December 2025 for the long-haul fleet",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight wifi in service today.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://news.google.com/rss/search?q=%ED%8B%B0%EC%9B%A8%EC%9D%B4%ED%95%AD%EA%B3%B5+%EA%B8%B0%EB%82%B4+%EC%99%80%EC%9D%B4%ED%8C%8C%EC%9D%B4+%EB%8F%84%EC%9E%85+%EC%9E%A5%EA%B1%B0%EB%A6%AC&hl=ko&gl=KR&ceid=KR:ko"
    ],
    "needs_verification": true
  },
  "LJ": {
    "starlink": {
      "status": "announced",
      "access": "free"
    },
    "airline": "Jin Air",
    "rules": [
      {
        "fleet": "all",
        "types": "737|777",
        "provider": "none in service; Starlink announced December 2025 under the Hanjin Group deal, with Jin Air's Boeing 737-8s first in line after Korean Air's long-haul fleet",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight wifi in service today; the group Starlink product will be free but installation starts with Korean Air long-haul aircraft.",
    "confidence": "reported",
    "as_of": "2026-09",
    "sources": [
      "https://news.google.com/rss/search?q=%EC%A7%84%EC%97%90%EC%96%B4+%EC%8A%A4%ED%83%80%EB%A7%81%ED%81%AC+%EA%B8%B0%EB%82%B4+%EC%99%80%EC%9D%B4%ED%8C%8C%EC%9D%B4+%EB%8F%84%EC%9E%85&hl=ko&gl=KR&ceid=KR:ko",
      "https://www.koreaherald.com/article/10630658"
    ],
    "needs_verification": true
  },
  "7C": {
    "airline": "Jeju Air",
    "rules": [
      {
        "fleet": "all",
        "types": "737",
        "provider": "none",
        "orbit": "NONE"
      }
    ],
    "access": "No internet access; the onboard wifi hotspot serves streaming entertainment only.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://news.google.com/rss/search?q=%EC%A0%9C%EC%A3%BC%ED%95%AD%EA%B3%B5+%EA%B8%B0%EB%82%B4+%EC%99%80%EC%9D%B4%ED%8C%8C%EC%9D%B4+%EC%97%94%ED%84%B0%ED%85%8C%EC%9D%B8%EB%A8%BC%ED%8A%B8&hl=ko&gl=KR&ceid=KR:ko"
    ],
    "needs_verification": true
  },
  "JT": {
    "airline": "Lion Air",
    "rules": [
      {
        "fleet": "all",
        "types": "737|A330",
        "provider": "none",
        "orbit": "NONE"
      }
    ],
    "access": "No internet access; the onboard wifi hotspot serves streaming entertainment only.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://news.google.com/rss/search?q=Lion+Air+Batik+Air+wifi+entertainment+AirFi+pesawat&hl=id&gl=ID&ceid=ID:id"
    ],
    "needs_verification": true
  },
  "ID": {
    "airline": "Batik Air",
    "rules": [
      {
        "fleet": "all",
        "types": "737|A320|A330",
        "provider": "none",
        "orbit": "NONE"
      }
    ],
    "access": "No internet access; the onboard wifi hotspot serves streaming entertainment only.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://en.wikipedia.org/wiki/Batik_Air",
      "https://news.google.com/rss/search?q=Lion+Air+Batik+Air+wifi+entertainment+AirFi+pesawat&hl=id&gl=ID&ceid=ID:id"
    ],
    "needs_verification": true
  },
  "4Z": {
    "airline": "Airlink",
    "rules": [
      {
        "fleet": "all",
        "types": "Embraer 135|ERJ-135|E135|Embraer 140|ERJ-140|E140|Embraer 170|ERJ-170|E170|Embraer 175|ERJ-175|E175|Embraer 190|ERJ-190|E190|Embraer 195|ERJ-195|E195",
        "provider": "none - airline told MyBroadband (Feb 2026) it is unconvinced by the ROI on a 70+ aircraft multi-type fleet averaging 2-hour sectors; no IFC programme",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight internet on any Airlink aircraft, and no rollout planned.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://mybroadband.co.za/news/wireless/628205-one-south-african-airline-looking-to-starlink-for-in-flight-wi-fi.html",
      "https://www.flyairlink.com/onboard-experience",
      "https://en.wikipedia.org/wiki/Airlink"
    ]
  },
  "FA": {
    "starlink": {
      "status": "none",
      "access": "unannounced"
    },
    "airline": "FlySafair",
    "rules": [
      {
        "fleet": "all",
        "types": "737",
        "provider": "none in service - airline says it is 'actively tracking' LEO/Starlink but existing IFC types are 'not currently on the table'; no install programme announced",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight internet today; Starlink is under evaluation only, with no announced installation date.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://mybroadband.co.za/news/wireless/628205-one-south-african-airline-looking-to-starlink-for-in-flight-wi-fi.html",
      "https://en.wikipedia.org/wiki/FlySafair"
    ]
  },
  "HM": {
    "airline": "Air Seychelles",
    "rules": [
      {
        "fleet": "all",
        "types": "A320|Twin Otter",
        "provider": "seyStream wireless streaming entertainment portal (local server, no internet uplink)",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight internet; passengers connect to the seyStream wireless portal on their own device for preloaded entertainment only.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://fly.airseychelles.com/en/creole-experience/sey-stream-wifi",
      "https://www.inflight-online.com/air-seychelles-enhances-in-flight-entertainment/",
      "https://en.wikipedia.org/wiki/Air_Seychelles"
    ]
  },
  "DT": {
    "airline": "TAAG Angola Airlines",
    "rules": [
      {
        "fleet": "all",
        "types": "A220|737|777|787|Dash[ -]?8",
        "provider": "none - TAAG's electronic-devices policy states 'WiFi or Bluetooth are not allowed at any stage of the flight'; long-haul cabins have seatback AVOD only",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight internet; devices must stay in flight mode with wifi off for the whole flight.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://flytaag.com/en/Travelling-with-TAAG/On-board/Electronic-devices",
      "https://flytaag.com/en/Travelling-with-TAAG/On-board",
      "https://en.wikipedia.org/wiki/TAAG_Angola_Airlines"
    ],
    "needs_verification": true
  },
  "HC": {
    "airline": "Air Senegal",
    "rules": [
      {
        "fleet": "all",
        "types": "A319|A320|A321|ATR 72",
        "provider": "none in service - SITAONAIR Internet ONAIR/Mobile ONAIR over Inmarsat GX Aviation flew on the A330-900neo from Mar 2019, but the last A330neo was returned in 2025-26 and no remaining aircraft is equipped",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight internet today; the only connectivity-equipped aircraft left the fleet when Air Senegal exited in-house long-haul flying.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://paxex.aero/air-senegal-sitaonair-launch-gx-inflight-connectivity-in-africa/",
      "https://airspace-africa.com/2026/04/18/air-senegal-exits-long-haul-operations-as-financial-pressures-force-strategic-reset/",
      "https://en.wikipedia.org/wiki/Air_Senegal",
      "https://flyairsenegal.com/en/discover/fleet/"
    ],
    "needs_verification": true
  },
  "HF": {
    "airline": "Air Côte d'Ivoire",
    "rules": [
      {
        "types": "A320|A330",
        "provider": "SITA OnAir Internet OnAir over Inmarsat GX; the airline's own fleet pages advertise wifi internet on the A320 and A330, but no pricing is published and live consistency is unverified",
        "orbit": "GEO"
      },
      {
        "types": "A319|Dash[ -]?8",
        "provider": "none",
        "orbit": "NONE"
      }
    ],
    "access": "Wifi is advertised on the A320 and A330 with no published pricing; nothing on the A319s or Dash 8s. The 2022 'wifi launch' was the Moment Flymingo streaming portal, not internet.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://aerospacetechreview.com/air-cote-divoire-boosts-passenger-experience-with-sitaonair-wi-fi-mobile-provisions/",
      "https://www.aircotedivoire.com/en/the-company/fleet/"
    ],
    "needs_verification": true
  },
  "P4": {
    "airline": "Air Peace",
    "rules": [
      {
        "types": "Embraer 195|E195",
        "provider": "Inflight Dublin Everhub portable wireless streaming server on the Embraer 195-E2, stored content only with no internet access",
        "orbit": "NONE"
      },
      {
        "fleet": "all",
        "provider": "None; no internet connectivity anywhere on the fleet",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight internet; the Embraer 195-E2 offers a wireless streaming entertainment portal only.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.inflightdublin.com/inflight-dublin-to-provide-wireless-ife-trial-for-air-peace/",
      "https://www.inflight-online.com/air-peace-trials-wireless-ife/",
      "https://en.wikipedia.org/wiki/Air_Peace"
    ],
    "needs_verification": true
  },
  "W3": {
    "airline": "Arik Air",
    "rules": [
      {
        "fleet": "all",
        "types": "737|Dash[ -]?8",
        "provider": "none - no connectivity product on the airline's site; conditions of carriage mention IFE equipment only",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight internet on Arik Air's domestic and regional flights.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.arikair.com/",
      "https://en.wikipedia.org/wiki/Arik_Air"
    ],
    "needs_verification": true
  },
  "TC": {
    "airline": "Air Tanzania",
    "rules": [
      {
        "fleet": "rollout",
        "types": "787|A220",
        "orbit": "GEO",
        "provider": "Panasonic Avionics eXConnect Ku (2018 deal for the 787-8s, extended 2020 to the A220-300s)"
      },
      {
        "fleet": "all",
        "orbit": "UNKNOWN",
        "provider": "Not verified for the 737 MAX 9s - no provider announcement covers them"
      }
    ],
    "access": "Paid plans via the AirTanzaniaWifi onboard portal on 787-8s and A220-300s; prices shown onboard, not published.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.airtanzania.co.tz/on-board-experience/2-uncategorised/29-inflight-wifi",
      "https://www.airtanzania.co.tz/on-board-experience",
      "https://en.wikipedia.org/wiki/Air_Tanzania",
      "https://avitrader.com/2020/07/23/air-tanzania-selects-panasonic-avionics-for-a220-ife-and-connectivity/",
      "https://www.airtanzania.co.tz/2-uncategorised/29-inflight-wifi"
    ],
    "needs_verification": true
  },
  "UR": {
    "airline": "Uganda Airlines",
    "rules": [
      {
        "fleet": "all",
        "types": "A330|CRJ 900",
        "provider": "Everhub wireless streaming IFE by Inflight Dublin (ugandairlines-ife.everhub.aero); no passenger internet service sold",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight internet on sale; the onboard product is a wireless streaming entertainment portal plus seatback IFE on the A330.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.ugandairlines.com/onboard-experience",
      "https://www.ugandairlines.com/fleet",
      "https://www.inflightdublin.com/everhub/"
    ],
    "needs_verification": true
  },
  "KP": {
    "airline": "ASKY Airlines",
    "rules": [
      {
        "fleet": "all",
        "types": "737",
        "provider": "IFE Solutions wireless streaming entertainment across the 737 fleet (movies, TV, music, games); not an internet service",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight internet; the onboard 'wifi' is a wireless portal serving a preloaded entertainment catalogue.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://airspace-africa.com/2021/11/10/asky-introduces-wi-fi-technology-on-its-intra-african-flights/",
      "https://en.wikipedia.org/wiki/Asky_Airlines"
    ],
    "needs_verification": true
  },
  "TM": {
    "airline": "LAM Mozambique Airlines",
    "rules": [
      {
        "fleet": "all",
        "types": "737|A319|CRJ 900|Embraer 190|ERJ-190|E190|Dash[ -]?8",
        "provider": "flyLAM onboard wireless entertainment server (connect to the 'flyLAM' SSID to stream to your own device); no internet uplink",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight internet; connect to the flyLAM wifi server for onboard entertainment on your phone or tablet.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.lam.co.mz/en",
      "https://en.wikipedia.org/wiki/LAM_Mozambique_Airlines"
    ],
    "needs_verification": true
  },
  "Q9": {
    "airline": "Green Africa Airways",
    "rules": [
      {
        "fleet": "all",
        "types": "ATR 72",
        "provider": "none - no connectivity or entertainment product on a single-type domestic turboprop LCC fleet",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight internet on Green Africa's domestic Nigerian turboprop flights.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.greenafrica.com/our-fleet",
      "https://en.wikipedia.org/wiki/Green_Africa_Airways"
    ],
    "needs_verification": true
  },
  "TS": {
    "airline": "Air Transat",
    "rules": [
      {
        "fleet": "all",
        "types": "A321|A330",
        "provider": "None - Bluebox Wow / seatback streaming IFE only, no internet gateway",
        "orbit": "NONE"
      }
    ],
    "access": "No internet access is sold or offered; the onboard Wi-Fi network only serves the entertainment library.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://web.archive.org/web/20260115152609/https://www.airtransat.com/en-CA/travel-information/inflight-services/entertainment",
      "https://paxex.aero/air-transat-free-streaming-entertainment-bluebox-wow/"
    ]
  },
  "F8": {
    "airline": "Flair Airlines",
    "rules": [
      {
        "fleet": "all",
        "types": "737",
        "provider": "None - LiFE in the Air wireless IFE on Astronics Sierra/Edge cabin network, no internet",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight internet; the onboard portal serves streaming entertainment and buy-on-board ordering only.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://apex.aero/articles/flair-introduces-wireless-ife-with-startup-life-in-the-air/",
      "https://paxex.aero/flair-airlines-737-max-review/"
    ]
  },
  "XP": {
    "airline": "Avelo Airlines",
    "rules": [
      {
        "fleet": "all",
        "types": "737",
        "provider": "None",
        "orbit": "NONE"
      }
    ],
    "access": "No Wi-Fi of any kind; the airline tells passengers to download content before boarding.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.aveloair.com/help/avelo-airlines-fleet"
    ]
  },
  "3M": {
    "airline": "Silver Airways",
    "rules": [
      {
        "fleet": "all",
        "types": "ATR 42|ATR 72",
        "provider": "None - airline ceased all operations 11 June 2025",
        "orbit": "NONE"
      }
    ],
    "access": "Not applicable under the Silver name; the airline ceased operations 11 June 2025. Successor Argentum Airways flies ex-Silver ATR 42s in Alaska from January 2026, also without connectivity.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://en.wikipedia.org/wiki/Silver_Airways",
      "https://aerospaceglobalnews.com/news/argentum-airways-atr-42-600-silver-airways-alaska/"
    ]
  },
  "ZL": {
    "airline": "Rex (Regional Express)",
    "rules": [
      {
        "fleet": "all",
        "types": "Saab 340",
        "provider": "None",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight connectivity; devices must stay in flight mode with transmitting disabled for the whole flight.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.rex.com.au/FlightInfo/ElectronicDevices.aspx",
      "https://www.rex.com.au/Feedback/FAQ.aspx",
      "https://en.wikipedia.org/wiki/Rex_Airlines"
    ]
  },
  "PX": {
    "airline": "Air Niugini",
    "rules": [
      {
        "fleet": "rollout",
        "types": "A220",
        "orbit": "UNKNOWN",
        "provider": "Undisclosed provider - internet live and complimentary on the A220s since 27 March 2026 (three A220-300s in service, eight A220-100s on order)"
      },
      {
        "fleet": "most",
        "types": "737|767|Fokker 70|Fokker 100|Dash[ -]?8",
        "provider": "None - wireless streaming entertainment portal only, no internet",
        "orbit": "NONE"
      }
    ],
    "access": "Free for all passengers on the A220s; the rest of the fleet carries a device-streaming entertainment portal with no internet.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.postcourier.com.pg/internet-in-the-sky-a-reality-for-air-niugini-a220/",
      "https://www.airniugini.com.pg/travel-information/onboard-services/inflight-entertainment/",
      "https://www.airniugini.com.pg/news/air-niuginis-a220-300-flies-first-international-service-to-cairns/"
    ],
    "needs_verification": true
  },
  "TN": {
    "airline": "Air Tahiti Nui",
    "rules": [
      {
        "fleet": "all",
        "types": "787",
        "provider": "Panasonic eXConnect",
        "orbit": "GEO"
      }
    ],
    "access": "Paid data bundles bought onboard, from USD 8 for 20 MB messaging up to USD 98 unlimited; video streaming and voice calls are barred.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.airtahitinui.com/en/onboard-wi-fi",
      "https://www.airtahitinui.com/en/onboard-experience"
    ]
  },
  "SB": {
    "airline": "Aircalin",
    "rules": [
      {
        "fleet": "all",
        "types": "A330|A320",
        "provider": "Viasat",
        "orbit": "GEO"
      }
    ],
    "access": "Paid Aircalin Connect Message or Surf plans, EUR 9-13 on regional routes and EUR 13-22 on long-haul, with free passes for premium cabins and Flying Blue Gold/Platinum.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.aircalin.com/en/additional-services/aircalin-connect"
    ]
  },
  "P5": {
    "airline": "Wingo",
    "rules": [
      {
        "fleet": "all",
        "types": "737",
        "provider": "None",
        "orbit": "NONE"
      }
    ],
    "access": "No Wi-Fi product is sold; Wingo's published optional-services catalogue contains no connectivity item.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.wingo.com/centro-de-ayuda/servicios-opcionales/todos-los-servicios",
      "https://www.aerotime.aero/articles/copa-airlines-to-roll-out-wifi-across-its-fleet-for-the-first-time"
    ],
    "needs_verification": true
  },
  "DM": {
    "airline": "Arajet",
    "rules": [
      {
        "fleet": "all",
        "types": "737",
        "provider": "None",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight internet and no entertainment system of any kind.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.infoviajera.com/2026/02/relato-del-vuelo-buenos-aires-punta-cana-con-arajet-boeing-737-max-8/"
    ]
  },
  "2K": {
    "airline": "Avianca Ecuador",
    "rules": [
      {
        "fleet": "rollout",
        "types": "A319|A320",
        "provider": "SES Open Orbits multi-orbit (GEO + O3b mPOWER MEO) is the group system - live on 10 Avianca mainline A320-family jets since December 2025; no Avianca Ecuador aircraft confirmed fitted yet",
        "orbit": "NONE"
      }
    ],
    "access": "No confirmed inflight internet on Avianca Ecuador aircraft today; the Avianca group rollout (Avianca On Air portal, paid tiers) reaches most of the group fleet through 2026.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.aerotime.aero/articles/copa-airlines-to-roll-out-wifi-across-its-fleet-for-the-first-time",
      "https://en.wikipedia.org/wiki/Avianca_Ecuador",
      "https://runwaygirlnetwork.com/2025/12/avianca-rolls-out-ses-multi-orbit-ifc-on-airbus-a320-family-jets/",
      "https://www.ses.com/press-release/ses-abra-group-launch-multi-orbit-inflight-connectivity"
    ],
    "needs_verification": true
  },
  "ZH": {
    "airline": "Shenzhen Airlines",
    "rules": [
      {
        "fleet": "widebody",
        "types": "A330",
        "provider": "China Telecom Satellite over Chinese Ka-band GEO high-throughput satellites",
        "orbit": "GEO"
      },
      {
        "fleet": "rollout",
        "types": "A320|737",
        "provider": "Same Ka-band HTS system; narrowbody retrofit started 29 Dec 2023 with A320neo B-30AP, most narrowbodies still unequipped",
        "orbit": "GEO"
      }
    ],
    "access": "Free with no charge on equipped aircraft, business class for the whole flight and economy as a limited-time trial after cruise altitude.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.sohu.com/a/908967841_121956424",
      "https://www.ccaonline.cn/weixiu/jwtop/923417.html",
      "https://zhuanlan.zhihu.com/p/681510531",
      "https://www.shenzhenair.com"
    ],
    "needs_verification": true
  },
  "GS": {
    "airline": "Tianjin Airlines",
    "rules": [
      {
        "fleet": "all",
        "types": "A320|A330",
        "provider": "HNA Group digital-cabin LAN streaming portal on a small retrofitted subfleet, no internet",
        "orbit": "NONE"
      }
    ],
    "access": "Free local entertainment portal on the handful of converted aircraft, with no connection to the ground internet.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "http://www.caacnews.com.cn/1/6/202311/t20231128_1372563.html",
      "https://www.tj.xinhuanet.com/20231129/c7dd09306ac64d1d84b2f1bc6089b903/c.html",
      "https://www.ccaonline.cn/baozhang/686211.html"
    ],
    "needs_verification": true
  },
  "JD": {
    "airline": "Beijing Capital Airlines",
    "rules": [
      {
        "fleet": "all",
        "types": "A320|A330",
        "provider": "Tencent-built digital-cabin LAN entertainment portal, no internet",
        "orbit": "NONE"
      }
    ],
    "access": "Free onboard entertainment portal on roughly six A320s, with no ground internet access.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://bj.news.cn/20231206/42aba9afb1d44b5089bc1ae2153b4218/c.html",
      "https://www.jdair.net"
    ]
  },
  "8L": {
    "airline": "Lucky Air",
    "rules": [
      {
        "fleet": "all",
        "types": "737|A320",
        "provider": "Onboard LAN entertainment and shopping portal with Alipay dual-offline payment, no internet",
        "orbit": "NONE"
      }
    ],
    "access": "Free cabin LAN portal for movies, music and onboard shopping, with no internet access.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.sohu.com/a/822471072_121798711",
      "https://news.qq.com/rain/a/20240819A021L500",
      "https://www.luckyair.net"
    ]
  },
  "PN": {
    "airline": "West Air",
    "rules": [
      {
        "fleet": "all",
        "types": "A320",
        "provider": "Cabin LAN entertainment and inflight-shopping portal, no internet",
        "orbit": "NONE"
      }
    ],
    "access": "Free local entertainment and shopping portal reachable after takeoff, with no ground internet access.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.ccaonline.cn/baozhang/fwhot/912364.html",
      "https://www.westair.cn"
    ]
  },
  "QW": {
    "airline": "Qingdao Airlines",
    "rules": [
      {
        "fleet": "all",
        "types": "A320",
        "orbit": "mixed GEO/none",
        "provider": "Feitian United Xstream Ka (ChinaSat-16) confirmed on a tiny A320 subfleet (first aircraft B-8442); fleet-wide rollout announced 2021, never confirmed delivered"
      }
    ],
    "access": "Real satellite internet only on the small Ka-equipped subfleet; Qingdao has sold ticket-plus-wifi bundle fares; free-versus-paid model otherwise unpublished.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.163.com/dy/article/G9NMMBQJ0524SVHE.html",
      "http://www.caacnews.com.cn/1/6/202105/t20210511_1323758.html",
      "https://www.ccaonline.cn/baozhang/651044.html",
      "https://iim.com.sg/news-post/fts-ka-band-inflight-connectivity-system-goes-live-on-qingdao-airlines/",
      "https://runwaygirlnetwork.com/2021/05/qingdao-ifc-fleet/"
    ],
    "needs_verification": true
  },
  "G5": {
    "airline": "China Express Airlines",
    "rules": [
      {
        "fleet": "all",
        "provider": "Century Skylink cabin LAN on part of the CRJ900 fleet only, stored content with no internet access",
        "orbit": "NONE"
      }
    ],
    "access": "Free gate-to-gate cabin LAN entertainment portal on the equipped regional jets, with no internet access.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://cn.chinadaily.com.cn/a/202009/21/WS5f6859f0a3101e7ce972598d.html",
      "https://www.bilibili.com/video/BV18i421d7GM/"
    ],
    "needs_verification": true
  },
  "AQ": {
    "airline": "9 Air",
    "rules": [
      {
        "fleet": "rollout",
        "types": "737",
        "orbit": "UNKNOWN",
        "provider": "Global Eagle Airconnect Ku fitted on a few 737-800s in 2018 as a free trial; whether it still operates is unverified (Global Eagle became Anuvu in 2021)"
      }
    ],
    "access": "Launched free, experience-first, over Spring Festival 2018 on a small number of 737-800s; no pricing ever published and current availability unconfirmed.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.kankanews.com/detail/M8Q8oWeKByL",
      "https://www.9air.com",
      "https://www.chinanews.com.cn/m/cj/2018/01-23/8431519.shtml",
      "https://www.globenewswire.com/de/news-release/2017/03/01/929509/25163/en/Global-Eagle-Receives-vSTC-for-Airconnect-Global-Satellite-Connectivity-System-on-Boeing-737NG-Aircraft-in-China.html"
    ],
    "needs_verification": true
  },
  "Y8": {
    "airline": "Suparna Airlines",
    "rules": [
      {
        "fleet": "all",
        "types": "737|787",
        "provider": "Reported cabin LAN entertainment portal on a few aircraft, no internet",
        "orbit": "NONE"
      }
    ],
    "access": "Free onboard audio-visual portal reported on a small number of aircraft, with no internet access.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.yzr.com.cn"
    ],
    "needs_verification": true
  },
  "SU": {
    "airline": "Aeroflot",
    "rules": [
      {
        "fleet": "all",
        "types": "A320|A321|A330|A350|737|777",
        "provider": "Local streaming IFE only, no internet; full inflight internet targeted 2027-2028 on Bureau 1440 LEO constellation + RSCC, with a T2 LTE-450 air-to-ground project announced Jun 2026 and Tu-214 trials Apr 2026",
        "orbit": "NONE"
      }
    ],
    "access": "Free local entertainment portal over cabin Wi-Fi; no internet is sold or available today.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://terravia.ru/news/t2-i-aeroflot-zapustyat-wi-fi-2026-06-05",
      "https://aviation21.ru/aeroflot-v-ramkax-sputnikovogo-proekta-byuro-1440",
      "https://www.aeroflot.ru/ru-en/information/onboard/entertainment"
    ]
  },
  "S7": {
    "airline": "S7 Airlines",
    "rules": [
      {
        "fleet": "all",
        "types": "A320|A321|737|Embraer 170|ERJ-170|E170",
        "provider": "None; free wireless streaming entertainment system only",
        "orbit": "NONE"
      }
    ],
    "access": "No internet available; free onboard entertainment portal streamed over local Wi-Fi.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.s7.ru/",
      "https://www.travelandtourworld.com/news/article/aeroflot-s7-airlines-and-russias-bold-in-flight-wi-fi-test-on-tu-214-could-revolutionize-global-connectivity/"
    ]
  },
  "FV": {
    "airline": "Rossiya",
    "rules": [
      {
        "fleet": "all",
        "types": "A319|A320|737|777",
        "provider": "FlyRossiya wireless streaming IFE portal, no internet",
        "orbit": "NONE"
      }
    ],
    "access": "Free FlyRossiya entertainment portal on personal devices; no internet connectivity.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.rossiya-airlines.ru/en/flight-with-us/on-board/entertainment-system/"
    ]
  },
  "DP": {
    "airline": "Pobeda",
    "rules": [
      {
        "fleet": "all",
        "types": "737",
        "provider": "media.flypobeda.ru wireless streaming IFE, no internet",
        "orbit": "NONE"
      }
    ],
    "access": "Free: join the POBEDA cabin network and open media.flypobeda.ru for 200+ films and series.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://media.flypobeda.ru",
      "https://vk.com/pobedawifi"
    ]
  },
  "U6": {
    "airline": "Ural Airlines",
    "rules": [
      {
        "fleet": "all",
        "types": "A319|A320|A321",
        "provider": "Ural IFE portal at uralairlines.onbs.tech, no internet",
        "orbit": "NONE"
      }
    ],
    "access": "Free: connect to the Ural Airlines network and open the local IFE portal or app.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.uralairlines.ru/news/element/zapasaytes-chipsami-iz-magazina-na-bortu-i-smotrite-kino-v-polyete-uralskie-avialinii-zapustili-sist/",
      "https://uralairlines.onbs.tech"
    ]
  },
  "UT": {
    "airline": "UTair",
    "rules": [
      {
        "fleet": "all",
        "types": "737",
        "provider": "utair.onbs.tech wireless streaming IFE, no internet",
        "orbit": "NONE"
      }
    ],
    "access": "Free: connect to the Utair cabin network and open utair.onbs.tech for films, music and moving map.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://utair.onbs.tech",
      "https://www.utair.ru/support/10/vai_fai_nabortu"
    ]
  },
  "N4": {
    "airline": "Nordwind",
    "rules": [
      {
        "fleet": "all",
        "types": "A321|A330|737|777",
        "provider": "Streaming IFE trialled on widebodies, no verified internet",
        "orbit": "NONE"
      }
    ],
    "access": "Entertainment only on equipped widebodies; no verified internet service.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://1931.aero/news/nordwind-airlines-testiruet-sistemu-razvlechenij"
    ],
    "needs_verification": true
  },
  "5N": {
    "airline": "Smartavia",
    "rules": [
      {
        "fleet": "all",
        "types": "A320|737",
        "provider": "IFE WoW portal at wow.flysmartavia.com, no internet",
        "orbit": "NONE"
      }
    ],
    "access": "Free since Apr 2025: join the flysmartavia.com cabin network and open the IFE WoW portal.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://flysmartavia.com/faq/services/system-ife-wow/how-does-the-entertainment-system-work/",
      "https://wow.flysmartavia.com"
    ]
  },
  "B2": {
    "airline": "Belavia",
    "rules": [
      {
        "fleet": "most",
        "types": "737|A330|Embraer 195|ERJ-195|E195",
        "provider": "Local multimedia streaming system on 737, no internet",
        "orbit": "NONE"
      }
    ],
    "access": "Free multimedia portal via the Belavia cabin network and a QR code; no internet sold.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://belavia.by/novosti/4891000/",
      "https://www.alternativeairlines.com/belavia"
    ],
    "needs_verification": true
  },
  "T5": {
    "airline": "Turkmenistan Airlines",
    "rules": [
      {
        "fleet": "all",
        "types": "737|777",
        "provider": "AdonisOne LX wireless streaming IFE, no internet",
        "orbit": "NONE"
      }
    ],
    "access": "Free multimedia system on international flights via the Turkmenistanairlines cabin network in flight mode.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://turkmenistan.gov.tm/en/post/90463/multimedia-entertainment-system-available-turkmenistan-airlines-flights",
      "https://setup.adonisone.com/model-lx-in-flight-entertainment-system/",
      "https://turkmenistanairlines.tm/en"
    ]
  },
  "SZ": {
    "airline": "Somon Air",
    "rules": [
      {
        "fleet": "all",
        "types": "737",
        "provider": "Inflight Dublin streaming IFE, no internet",
        "orbit": "NONE"
      }
    ],
    "access": "No wifi or internet connection; wireless entertainment only.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.alternativeairlines.com/somon-air"
    ],
    "needs_verification": true
  },
  "GK": {
    "airline": "Jetstar Japan",
    "rules": [
      {
        "fleet": "all",
        "types": "A320|A321",
        "provider": "None - no connectivity hardware fitted",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight wifi on any Jetstar Japan flight.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.jetstar.com/jp/ja/help/jetstar-entertainment-plus-faqs",
      "https://far-east-trading.jp/airline/jetstar/14093/",
      "https://airticket-mall.com/jetstar/blog/jetstar_wifi/",
      "https://en.wikipedia.org/wiki/Jetstar_Japan"
    ]
  },
  "IJ": {
    "airline": "Spring Japan",
    "rules": [
      {
        "fleet": "all",
        "types": "737",
        "provider": "None - no connectivity hardware fitted",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight wifi; onboard food and drink are sold separately.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://jp.ch.com/models-introduced",
      "https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q13277014173"
    ],
    "needs_verification": true
  },
  "BC": {
    "airline": "Skymark Airlines",
    "rules": [
      {
        "fleet": "all",
        "types": "737",
        "provider": "None active; first 737-8 flying since 28 May 2026 with Intelsat/SES wifi fitted but not yet activated (Skymark says the service is being prepared)",
        "orbit": "NONE"
      }
    ],
    "access": "No wifi available today; free wifi is announced for the incoming 737 MAX fleet but has not entered service.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://www.skymark.co.jp/en/news/detail/20250331_In-Flight_Wi-Fi_Service.html",
      "https://runwaygirlnetwork.com/2025/04/intelsat-multi-orbit-skymark-airlines/",
      "https://paxex.aero/intelsat-multi-orbit-inflight-connectivity-skymark-airlines/",
      "https://sky-budget.com/2026/05/01/skymark-737-8-hnd-fuk/",
      "https://www.skymark.co.jp/ja/news/detail/1195920_1625.html",
      "https://smart.skymark.co.jp/en/news/detail/20250331_In-Flight_Wi-Fi_Service.html"
    ],
    "needs_verification": true
  },
  "7G": {
    "airline": "StarFlyer",
    "rules": [
      {
        "fleet": "rollout",
        "types": "A320",
        "provider": "Inmarsat (Viasat) Global Xpress Ka-band",
        "orbit": "GEO"
      }
    ],
    "access": "Free for all passengers, but only on the A320neo subfleet; older A320ceo aircraft have no wifi.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.starflyer.jp/inboard/airbus/a320neo/",
      "https://www.starflyer.jp/en/inboard/seat/",
      "https://centreforaviation.com/news/starflyers-a320neo-to-enter-service-in-early-summer-2023-deploy-inmarsat-wifi-solution-1191679"
    ]
  },
  "6J": {
    "airline": "Solaseed Air",
    "rules": [
      {
        "fleet": "all",
        "types": "737",
        "provider": "None - no connectivity hardware fitted",
        "orbit": "NONE"
      }
    ],
    "access": "No internet; free Solatime wireless streaming portal to personal devices, and the airline's FAQ says no connectivity is planned.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.solaseedair.jp/service/",
      "https://www.solaseedair.jp/service/inflight/"
    ]
  },
  "HD": {
    "airline": "AIRDO",
    "rules": [
      {
        "fleet": "all",
        "types": "767|737",
        "provider": "None - 'Do Sky On-Demand' is a local streaming entertainment portal only",
        "orbit": "NONE"
      }
    ],
    "access": "No internet access; the free onboard 'AIRDO Wi-Fi' network serves only local video, audio, e-books and a flight map.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.airdo.jp/service/entertainment/",
      "https://www.airdo.jp/"
    ]
  },
  "JH": {
    "airline": "Fuji Dream Airlines",
    "rules": [
      {
        "fleet": "all",
        "types": "Embraer 175|ERJ-175|E175|Embraer 170|ERJ-170|E170",
        "provider": "None - no connectivity hardware fitted",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight wifi and no inflight entertainment system.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.fujidream.co.jp/",
      "https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q14283813904"
    ],
    "needs_verification": true
  },
  "NQ": {
    "airline": "AirJapan",
    "rules": [
      {
        "fleet": "all",
        "types": "787",
        "provider": "Brand ceased scheduled operations 28-29 March 2026; no NQ-marketed flights remain",
        "orbit": "NONE"
      }
    ],
    "access": "No longer applicable - ANA retired the AirJapan brand in March 2026.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://loyaltylobby.com/2025/10/30/ana-ceases-airjapan-branded-operations-on-march-29-2026/",
      "https://www.airdatanews.com/ana-holdings-airjapan-shutdown-supply-chain/",
      "https://weekly.ascii.jp/elem/000/004/183/4183279/4/"
    ]
  },
  "RS": {
    "starlink": {
      "status": "announced",
      "access": "unannounced"
    },
    "airline": "Air Seoul",
    "rules": [
      {
        "fleet": "all",
        "types": "A321",
        "provider": "None in service; Starlink announced December 2025 across the Hanjin/Korean Air group; Air Seoul's installation order is still to be decided (the group says Air Busan and Air Seoul will review their fleets), completion targeted by end of 2027",
        "orbit": "NONE"
      }
    ],
    "access": "No wifi available today; Starlink is announced but not yet flying.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://en.yna.co.kr/view/AEN20251205002800320",
      "https://www.aerotime.aero/articles/hanjin-group-airlines-launch-starlink-wifi-2027",
      "https://en.wikipedia.org/wiki/Air_Seoul",
      "https://www.koreaherald.com/article/10630658"
    ],
    "needs_verification": true
  },
  "ZE": {
    "airline": "Eastar Jet",
    "rules": [
      {
        "fleet": "all",
        "types": "737",
        "provider": "None - 'STAR TV' is a local streaming entertainment portal on some aircraft only",
        "orbit": "NONE"
      }
    ],
    "access": "No internet access; some aircraft carry a free local streaming entertainment portal.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://zeimage.eastarjet.com/newstar/images/Downloads/OCT_StarTV.pdf",
      "https://koreaairport.com/airlines/eastar_jet/fleet_seats.htm"
    ],
    "needs_verification": true
  },
  "YP": {
    "airline": "Air Premia",
    "rules": [
      {
        "fleet": "all",
        "types": "787",
        "provider": "Panasonic Avionics Ku-band",
        "orbit": "GEO"
      }
    ],
    "access": "One hour of messaging is free for every passenger; paid plans add full browsing (roughly USD 5.95 full-flight chat, 16.95 for three hours, 29.95 full-flight internet).",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.airpremia.com/a/en/inflight/wifi",
      "https://m.blog.naver.com/airpremia/222477949260",
      "https://company.airpremia.com/117/?bmode=view&idx=20679531"
    ]
  },
  "JX": {
    "airline": "STARLUX Airlines",
    "rules": [
      {
        "fleet": "all",
        "types": "A350|A330|A321",
        "provider": "Viasat Ka-band (ViaSat-3, GM-40 terminal); legacy Inmarsat GX via SITAONAIR being retrofitted out",
        "orbit": "GEO"
      }
    ],
    "access": "Free unlimited browsing in First, Business and Premium Economy; free text messaging for every economy passenger, with paid plans for economy browsing.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://paxex.aero/starlux-viasat-inflight-internet-transition/",
      "https://www.starlux-airlines.com/en-US/booking/other-optional-service/galactic-wi-fi",
      "https://tw.trip.com/guide/info/%E9%A3%9B%E6%A9%9F%E4%B8%8A%E5%8F%AF%E4%BB%A5%E4%B8%8A%E7%B6%B2%E5%97%8E.html"
    ]
  },
  "IT": {
    "airline": "Tigerair Taiwan",
    "rules": [
      {
        "fleet": "all",
        "types": "A320",
        "provider": "None - no connectivity hardware fitted",
        "orbit": "NONE"
      }
    ],
    "access": "No internet; Bluebox Wow wireless streaming IFE (launched spring 2026) across the A320 fleet, with USB power on some neos.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://tw.trip.com/guide/info/%E9%A3%9B%E6%A9%9F%E4%B8%8A%E5%8F%AF%E4%BB%A5%E4%B8%8A%E7%B6%B2%E5%97%8E.html",
      "https://blog.jesselin.com/archives/83771/ttw-taiwan-tiger-air/",
      "https://runwaygirlnetwork.com/2026/03/tigerair-taiwan-bluebox-a320-fleet/"
    ]
  },
  "AE": {
    "airline": "Mandarin Airlines",
    "rules": [
      {
        "fleet": "all",
        "types": "ATR 72",
        "provider": "None - no connectivity hardware fitted",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight wifi on this regional turboprop fleet.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.mandarin-airlines.com/",
      "https://en.wikipedia.org/wiki/Mandarin_Airlines"
    ],
    "needs_verification": true
  },
  "B7": {
    "airline": "UNI Air",
    "rules": [
      {
        "fleet": "narrowbody",
        "types": "A321",
        "provider": "Panasonic, EVA Group free-wifi program on international routes; A321 fleet fully fitted by early 2026",
        "orbit": "GEO"
      },
      {
        "fleet": "turboprop",
        "types": "ATR 72",
        "provider": "None - no connectivity hardware fitted",
        "orbit": "NONE"
      }
    ],
    "access": "A321 international flights: unlimited browsing and messaging (no streaming or VPN) free for Business Class and Infinity MileageLands members (free to join) since 1 October 2025; the ATR 72 domestic fleet has no wifi.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.evaair.com/en-us/about-eva-air/news/news-releases/2025-05-14-evaair-to-launch-exciting-upgrade-for-inflight-wi-fi-service-this-july.html",
      "https://runwaygirlnetwork.com/2025/05/eva-air-to-offer-free-inflight-wi-fi-to-loyalty-members/"
    ]
  },
  "HB": {
    "airline": "Greater Bay Airlines",
    "rules": [
      {
        "fleet": "all",
        "types": "737",
        "provider": "None in service; free wifi was promised for the 737-9 at launch but is pending regulatory approval and has been dropped from the airline's own 737-9 experience page",
        "orbit": "NONE"
      }
    ],
    "access": "No working wifi on any aircraft, including the 737-9 where it was originally advertised as complimentary in Premium Class.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://thealviator.com/2026/02/greater-bay-airlines-premium-review/",
      "https://www.greaterbay-airlines.com/hk/en_HK/about-us/media-room/greater-bay-airlines-to-introduce-premium-class-in-december-offering-a-suite-of-prestigious-services-and-privileges.html",
      "https://www.greaterbay-airlines.com/hk/en_HK/about-us/a-world-class-experience---737-9-.html"
    ],
    "needs_verification": true
  },
  "UX": {
    "airline": "Air Europa",
    "rules": [
      {
        "fleet": "widebody",
        "types": "787",
        "provider": "Panasonic Avionics XConnect (Global Communications Suite Ku-band)",
        "orbit": "GEO"
      },
      {
        "fleet": "most",
        "types": "737",
        "provider": "Panasonic Avionics XConnect (Ku-band), newest 737s only",
        "orbit": "GEO"
      }
    ],
    "access": "Paid vouchers in three tiers, roughly EUR 3-12 on European flights and EUR 5-30 intercontinental, with no free messaging tier.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.aireuropa.com/us/en/aea/aexperience/services/onboard-wifi.html",
      "https://paxex.aero/air-europa-better-cheaper-inflight-wifi-pricing-panasonic-avionics/",
      "https://runwaygirlnetwork.com/2020/07/press-release-air-europa-improves-the-wifi-experience-for-passengers/",
      "https://aviationclubcenter.com/en/2026/05/13/air-europa-launches-major-customer-experience-transformation-plan/"
    ],
    "needs_verification": true
  },
  "V7": {
    "airline": "Volotea",
    "rules": [
      {
        "fleet": "all",
        "types": "A319|A320",
        "provider": "None today; free local 'Volotea' streaming portal (Volotea Media) only. An Immfly + Eutelsat OneWeb LEO 12-month trial on a single A320 is planned for Q4 2026; the separate 44-46 aircraft Iridium deployment from Q3 2026 is narrowband for retail and ops, not passenger internet",
        "orbit": "NONE"
      }
    ],
    "access": "No internet access; the onboard 'Volotea' network reaches only a free local entertainment portal.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.volotea.com/en/onboard-entertainment/",
      "https://www.immfly.com/post/immfly-volotea-partnership-expansion",
      "https://aerospaceglobalnews.com/news/volotea-leo-inflight-wifi-immfly-trial-2026/",
      "https://www.futuretravelexperience.com/2026/04/volotea-and-immfly-to-launch-next-gen-high-speed-connectivity-for-enhanced-inflight-experience/",
      "https://runwaygirlnetwork.com/2026/04/immfly-volotea-leo-connectivity/"
    ]
  },
  "QS": {
    "airline": "SmartWings",
    "rules": [
      {
        "fleet": "all",
        "types": "737",
        "provider": "None; free local 'MyWings' streaming portal (mywingstv) only",
        "orbit": "NONE"
      }
    ],
    "access": "No internet access; the onboard Wi-Fi network reaches only a free entertainment portal with about 100 hours of content.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.smartwings.com/en/join-the-on-board-entertainment-portal",
      "https://www.smartwings.com/en/smartwings-company-offers-a-new-wi-fi-entertainment-portal-on-board-as-one-of-the-first-companies-in-central-europe"
    ]
  },
  "XC": {
    "airline": "Corendon Airlines",
    "rules": [
      {
        "fleet": "all",
        "types": "737",
        "provider": "None; AirFi local intranet ('Corendon AirFi' / 'Corendon Cafe') for entertainment and onboard ordering",
        "orbit": "NONE"
      }
    ],
    "access": "No internet access; connecting to the AirFi network only gives entertainment plus food and duty-free ordering.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.corendon.nl/entertainment",
      "https://simpleflying.com/corendon-airlines-wifi-food-ordering/",
      "https://www.studioweb.nl/blog/corendon-airfi-entertainment/"
    ]
  },
  "KM": {
    "airline": "KM Malta Airlines",
    "rules": [
      {
        "fleet": "all",
        "types": "A320",
        "provider": "None",
        "orbit": "NONE"
      }
    ],
    "access": "No Wi-Fi or internet on any aircraft.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.headforpoints.com/2025/06/30/review-km-malta-business-class-between-london-and-malta/",
      "https://www.2paxfly.com/2025/07/11/first-impressions-k-m-malta-airlines-in-business-class-2-2/",
      "https://kmmaltairlines.com/en"
    ]
  },
  "LG": {
    "airline": "Luxair",
    "rules": [
      {
        "fleet": "all",
        "types": "737|Dash[ -]?8",
        "provider": "None; free local 'LuxairWiFi' streaming portal (luxair.ife.aero) on the Boeing 737 fleet, standard on the new 737-8s entering service through 2026",
        "orbit": "NONE"
      }
    ],
    "access": "No internet access; a local entertainment portal on the 737s and nothing on the Dash 8s.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.luxair.lu/en/offers/luxair-inflight-entertainment/",
      "https://www.luxair.lu/en/offers/our-fleet/"
    ]
  },
  "WK": {
    "starlink": {
      "status": "announced",
      "access": "free"
    },
    "airline": "Edelweiss Air",
    "rules": [
      {
        "fleet": "all",
        "types": "A320|A340|A350",
        "provider": "None today; free 'Edelweiss Entertainment' local streaming short-haul and seatback IFE long-haul. Starlink announced 13 Jan 2026 for A320, A320neo and A350, with the first A350 cabins carrying free Starlink from December 2026",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight internet today; free Starlink is promised with the new A350 cabin from December 2026.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://newsroom.flyedelweiss.com/en/edelweiss-equips-its-entire-fleet-with-high-speed-internet-from-starlink",
      "https://www.flyedelweiss.com/ch/en/fly/on-board/entertainment/short-haul.html",
      "https://www.businesstraveller.com/news/edelweiss-new-business-class/",
      "https://www.flyedelweiss.com/ch/en/fly/flight-information/fleet.html"
    ],
    "needs_verification": true
  },
  "4Y": {
    "airline": "Discover Airlines",
    "rules": [
      {
        "fleet": "widebody",
        "types": "A330",
        "provider": "Panasonic Avionics multi-orbit (GEO plus Eutelsat OneWeb LEO), branded FlyNet; retrofit began after the 2025 summer season",
        "orbit": "mixed GEO/LEO"
      },
      {
        "fleet": "narrowbody",
        "types": "A320|A321",
        "provider": "FlyNet over the European Aviation Network (Inmarsat S-band satellite plus Deutsche Telekom air-to-ground)",
        "orbit": "A2G"
      }
    ],
    "access": "A free messaging package can be switched on by anyone through the FlyNet/Telekom portal, with paid passes for browsing and streaming that are also valid on Lufthansa.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.discover-airlines.com/us/en/discover/services-on-board/internet/flynet",
      "https://paxex.aero/discover-airlines-inflight-internet-a330-panasonic-avionics/",
      "https://newsroom-en.discover-airlines.com/pressreleases/surfing-und-streaming-like-on-the-ground-discover-airlines-to-introduce-high-speed-internet-on-long-haul-flights-3380152",
      "https://newsroom-en.discover-airlines.com/pressreleases/discover-airlines-to-introduce-free-messaging-on-long-haul-flights-3375701",
      "https://www.aerotime.aero/articles/discover-airlines-unveils-ocean-blue-cabin-with-business-suites-starlink-wi-fi"
    ],
    "needs_verification": true
  },
  "WF": {
    "airline": "Wideroe",
    "rules": [
      {
        "fleet": "all",
        "types": "Dash[ -]?8|Embraer 190|ERJ-190|E190",
        "provider": "None; free offline entertainment system on the Embraer 190 only",
        "orbit": "NONE"
      }
    ],
    "access": "No Wi-Fi or internet on any aircraft.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://help.wideroe.no/hc/en-gb/articles/30243338852370-Travel-Information"
    ]
  },
  "LM": {
    "airline": "Loganair",
    "rules": [
      {
        "fleet": "all",
        "types": "ATR 72|ATR 42|Embraer 145|ERJ-145|E145",
        "provider": "None",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight Wi-Fi and no entertainment system.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.loganair.co.uk/faqs/",
      "https://www.cestee.com/airline/loganair/services"
    ],
    "needs_verification": true
  },
  "BF": {
    "airline": "French Bee",
    "rules": [
      {
        "fleet": "all",
        "types": "A350",
        "provider": "iZiWifi, delivered by Viasat over Thales Ka-band hardware",
        "orbit": "GEO"
      }
    ],
    "access": "Paid packs sold per one-way flight, topping out at the EUR 28 'Addict' pack for unlimited browsing excluding video and music streaming; no free tier.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.frenchbee.com/sites/default/files/2026-03/iziwifi-Nov2025-1280x1376.pdf",
      "https://www.frenchbee.com/fr/services-tarifs/nos-services/internet",
      "https://www.aerolopa.com/bf-351"
    ]
  },
  "SS": {
    "airline": "Corsair",
    "rules": [
      {
        "fleet": "all",
        "types": "A330",
        "provider": "SITA Internet ONAIR",
        "orbit": "GEO"
      }
    ],
    "access": "Paid: Chat at EUR 5 long-haul or EUR 4 regional and Surf Power at EUR 25 or EUR 10, with Chat free for Business and Premium cabins and for Gold and Platinum members.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.flycorsair.com/en/information/during-flight/onboard-entertainment",
      "https://runwaygirlnetwork.com/2021/06/sita-internet-corsair-a330/",
      "https://www.flycorsair.com/en/information/corsair/fleet"
    ],
    "needs_verification": true
  },
  "S4": {
    "airline": "Azores Airlines",
    "rules": [
      {
        "fleet": "most",
        "types": "A321",
        "provider": "Panasonic Avionics",
        "orbit": "GEO"
      }
    ],
    "access": "Thirty minutes of free chat-only Wi-Fi in one continuous session, then paid plans at 512 kbps: Chat EUR 4.95, Web Basic EUR 9.95 for an hour, Web Premium EUR 14.95 for three hours or EUR 19.95 for the full flight.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.azoresairlines.pt/en/information/additional-services/mobile-data-packages",
      "https://www.azoresairlines.pt/en/information/inflight-entertainment"
    ],
    "needs_verification": true
  },
  "NT": {
    "airline": "Binter Canarias",
    "rules": [
      {
        "fleet": "all",
        "types": "ATR 72|Embraer 195|ERJ-195|E195",
        "provider": "None; AirFi local streaming portal ('Binter-Airfi', branded Binter On Board)",
        "orbit": "NONE"
      }
    ],
    "access": "No internet; the onboard Wi-Fi reaches only a free entertainment platform with films, series, music and games.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.bintercanarias.com/es/corporativo/noticias/5901/binter-estrena-su-servicio-de-entretenimiento-a-bordo",
      "https://contenido.bintercanarias.com/binteragenciadeviajes"
    ]
  },
  "FB": {
    "airline": "Bulgaria Air",
    "rules": [
      {
        "fleet": "all",
        "types": "A220|A320|Embraer 190|ERJ-190|E190",
        "provider": "None",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight Wi-Fi, internet or entertainment system.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://flight-report.com/en/report/67016/bulgaria-air-fb320-berlin-ber-sofia-sof/",
      "https://www.cestee.com/airline/bulgaria-air/services"
    ],
    "needs_verification": true
  },
  "OA": {
    "airline": "Olympic Air",
    "rules": [
      {
        "fleet": "all",
        "types": "Dash[ -]?8|ATR 72|ATR 42",
        "provider": "None",
        "orbit": "NONE"
      }
    ],
    "access": "No inflight Wi-Fi or internet.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://en.aegeanair.com/travel-info/travelling-with-aegean/on-board/wifi-onboard/",
      "https://en.about.aegeanair.com/media-center/press-releases/2022/wifi-onboard/",
      "https://www.cestee.de/fluggesellschaften/olympic-air/services"
    ],
    "needs_verification": true
  },
  "PK": {
    "airline": "Pakistan International Airlines",
    "rules": [
      {
        "fleet": "all",
        "types": "777|A320|ATR 72",
        "provider": "None - Pakistan has licensed no in-flight satellite connectivity; the PTA consultation closed 31 May 2026 with no licence granted, making 2027 the earliest realistic service",
        "orbit": "NONE"
      }
    ],
    "access": "No onboard internet is available on any PIA flight.",
    "confidence": "sourced",
    "as_of": "2026-09",
    "sources": [
      "https://www.phoneworld.com.pk/pakistan-in-flight-internet-pta-satellite-licence-2026/",
      "https://www.starlinkflights.com/airlines/pk",
      "https://propakistani.pk/2026/05/06/pta-gearing-up-to-allow-in-flight-satellite-telecom-services-in-pakistan/"
    ]
  },
  "PA": {
    "airline": "Airblue",
    "rules": [
      {
        "fleet": "all",
        "types": "A320|A321",
        "provider": "None - no Pakistani carrier is licensed for in-flight satellite internet as of mid-2026",
        "orbit": "NONE"
      }
    ],
    "access": "No onboard internet is offered.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.phoneworld.com.pk/pakistan-in-flight-internet-pta-satellite-licence-2026/",
      "https://www.airblue.com"
    ],
    "needs_verification": true
  },
  "ER": {
    "airline": "Serene Air",
    "rules": [
      {
        "fleet": "all",
        "types": "737",
        "provider": "None - no Pakistani carrier is licensed for in-flight satellite internet as of mid-2026",
        "orbit": "NONE"
      }
    ],
    "access": "No onboard internet is offered.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.phoneworld.com.pk/pakistan-in-flight-internet-pta-satellite-licence-2026/",
      "https://www.sereneair.com/experience"
    ],
    "needs_verification": true
  },
  "9P": {
    "airline": "Fly Jinnah",
    "rules": [
      {
        "fleet": "all",
        "types": "A320",
        "provider": "None - 'Sky Time' is a free wireless streaming entertainment portal to your own device, not internet access",
        "orbit": "NONE"
      }
    ],
    "access": "No internet; Sky Time streams entertainment free to personal devices on selected flights.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.flyjinnah.com/en/plan/flying-with-us",
      "https://www.airarabia.com/en/plan/flying-with-us/sky-time",
      "https://www.phoneworld.com.pk/pakistan-in-flight-internet-pta-satellite-licence-2026/"
    ]
  },
  "BG": {
    "airline": "Biman Bangladesh Airlines",
    "rules": [
      {
        "fleet": "widebody",
        "types": "787",
        "provider": "Panasonic Avionics eX3 IFE with satellite broadband connectivity and mobile telephony, launched September 2018",
        "orbit": "GEO"
      },
      {
        "fleet": "most",
        "types": "777|737",
        "provider": "None - seatback or overhead IFE only, no connectivity",
        "orbit": "NONE"
      }
    ],
    "access": "Paid onboard internet and mobile telephony on the 787 fleet only; all other aircraft have no connectivity.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://en.wikipedia.org/wiki/Biman_Bangladesh_Airlines",
      "https://www.thedailystar.net/business/tourism/biman-offer-inflight-internet-call-sept-1596496",
      "https://www.passengerselfservice.com/2016/10/biman-bangladesh-airlines-selects-panasonic-ife-for-787s/"
    ],
    "needs_verification": true
  },
  "BS": {
    "airline": "US-Bangla Airlines",
    "rules": [
      {
        "fleet": "all",
        "types": "737|ATR 72",
        "provider": "None - no inflight connectivity found",
        "orbit": "NONE"
      }
    ],
    "access": "No onboard internet is offered.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://usbair.com/",
      "https://en.wikipedia.org/wiki/US-Bangla_Airlines"
    ],
    "needs_verification": true
  },
  "RA": {
    "airline": "Nepal Airlines",
    "rules": [
      {
        "fleet": "all",
        "types": "A320|A330",
        "provider": "None - A330 carries offline seatback IFE (roughly 40 films, 30 TV programmes, 20 music albums), no internet",
        "orbit": "NONE"
      }
    ],
    "access": "No onboard internet; the A330 has offline seatback entertainment only.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://en.wikipedia.org/wiki/Nepal_Airlines"
    ],
    "needs_verification": true
  },
  "H9": {
    "airline": "Himalaya Airlines",
    "rules": [
      {
        "fleet": "all",
        "types": "A320",
        "provider": "None - no inflight connectivity",
        "orbit": "NONE"
      }
    ],
    "access": "No onboard internet is offered.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.himalaya-airlines.com/during-your-trip/inflight-services"
    ],
    "needs_verification": true
  },
  "KB": {
    "airline": "Drukair",
    "rules": [
      {
        "fleet": "all",
        "types": "A319|A320|ATR 42",
        "provider": "None - the onboard Wi-Fi network serves only a local streaming entertainment platform, with no internet access",
        "orbit": "NONE"
      }
    ],
    "access": "Free onboard Wi-Fi reaches Drukair's streaming library on your own device but provides no internet connection.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.drukair.com.bt/in-flight-entertainment/",
      "https://www.drukair.com.bt/"
    ]
  },
  "Q2": {
    "airline": "Maldivian",
    "rules": [
      {
        "fleet": "all",
        "types": "A320|A330|ATR 72|ATR 42",
        "provider": "None - no inflight connectivity confirmed",
        "orbit": "NONE"
      }
    ],
    "access": "No onboard internet is confirmed on any Maldivian aircraft.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.maldivian.aero/flying-with-us"
    ],
    "needs_verification": true
  },
  "PG": {
    "airline": "Bangkok Airways",
    "rules": [
      {
        "fleet": "all",
        "types": "A319|A320|ATR 72",
        "provider": "None - no inflight connectivity; the airline's free WiFi product is lounge-only",
        "orbit": "NONE"
      }
    ],
    "access": "No onboard internet; free Bangkok Airways WiFi is a lounge amenity obtained from reception with a boarding pass.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.bangkokair.com/",
      "https://www.bangkokair.com/our-services",
      "https://bkairwifi.ntplc.co.th"
    ],
    "needs_verification": true
  },
  "DD": {
    "airline": "Nok Air",
    "rules": [
      {
        "fleet": "all",
        "types": "737",
        "provider": "None - Moment Flymingo Box wireless IFE streams offline entertainment to personal devices and explicitly requires no inflight connectivity",
        "orbit": "NONE"
      }
    ],
    "access": "The advertised free onboard WiFi reaches only Nok Air's streaming entertainment library, not the internet.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://content.nokair.com/en/About-Nokair/Nok-Air-plane.aspx",
      "https://runwaygirlnetwork.com/2023/11/nok-air-partners-moment/",
      "https://www.moment.tech/solutions/flymingo-box"
    ],
    "needs_verification": true
  },
  "FD": {
    "airline": "Thai AirAsia",
    "rules": [
      {
        "fleet": "rollout",
        "types": "A320|A321",
        "provider": "AirAsia WiFi (formerly ROKKI) over Inmarsat GX Aviation Ka-band; only a handful of group aircraft were equipped in the 2019 rollout, which never reached its 100%-by-2020 target",
        "orbit": "GEO"
      }
    ],
    "access": "Paid plan-based passes, including a full-flight Unlimited Plan, on the few equipped aircraft, with most Thai AirAsia flights having no connectivity at all.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://wifi.airasia.com/promos/unlimitedplan",
      "https://paxex.aero/airasia-new-gx-wifi-test/",
      "https://newsroom.airasia.com/news/one-click-and-chill-airasias-inflight-wifi-just-got-faster",
      "https://www.inflight-online.com/airasia-upgrades-wifi-offering-with-inmarsat/"
    ],
    "needs_verification": true
  },
  "SL": {
    "airline": "Thai Lion Air",
    "rules": [
      {
        "fleet": "all",
        "types": "737|A330",
        "provider": "None - 'SKYfi' onboard Wi-Fi feeds the Onboard Player streaming app on A330neo aircraft only, with no internet access",
        "orbit": "NONE"
      }
    ],
    "access": "No internet; free streaming entertainment via the Onboard Player app on A330neo, which must be installed before departure.",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.lionairthai.com/cn/en/ThaiLionAir-Experience/SKYfi"
    ],
    "needs_verification": true
  },
  "VZ": {
    "airline": "Thai VietJet Air",
    "rules": [
      {
        "fleet": "all",
        "types": "A320|A321",
        "provider": "None - Bluebox Wow wireless streaming IFE (Blueview platform) in service since Q3 2025 across the Airbus narrowbodies; entertainment and retail only, no internet",
        "orbit": "NONE"
      }
    ],
    "access": "No onboard internet; wireless streaming entertainment to personal devices fleet-wide on the Airbus jets, extending to incoming 737 MAX 8s.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://blueboxaviation.com/vietjet-thailand-bluebox-ife-upgrade/",
      "https://www.airlineratings.com/articles/vietjet-in-flight-review-breaking-the-ultra-low-cost-carrier-mold"
    ],
    "needs_verification": true
  },
  "QH": {
    "airline": "Bamboo Airways",
    "rules": [
      {
        "fleet": "all",
        "types": "A320|A321",
        "provider": "None - AirFi and Touch Aero wireless streaming IFE only, no internet packages of any kind",
        "orbit": "NONE"
      }
    ],
    "access": "No free or paid onboard internet; only wireless streaming entertainment to personal devices.",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://starlinkflights.com/airlines/qh",
      "https://en.wikipedia.org/wiki/Bamboo_Airways",
      "https://bambooairways.com/vn/en/book/bamboo-experience/wholehearted-journey"
    ],
    "needs_verification": true
  },
  "TU": {
    "airline": "Tunisair",
    "rules": [
      {
        "fleet": "all",
        "provider": "Wi-Fi Streaming entertainment portal on the A320neo only, films and TV to your own device with no internet access",
        "orbit": "NONE"
      }
    ],
    "access": "The A320neo wireless system carries films and TV to your own device; there is no route to the internet",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.tunisair.com/en/flotte/airbus-a320",
      "https://tunisair-entertainment.ifdhub.com/onboard"
    ]
  },
  "BJ": {
    "airline": "Nouvelair",
    "rules": [
      {
        "fleet": "all",
        "provider": "None; the official on-board services page lists duty free and catering and does not offer connectivity",
        "orbit": "NONE"
      }
    ],
    "access": "No connectivity offered",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.nouvelair.com/en/service-a-bord"
    ],
    "needs_verification": true
  },
  "QG": {
    "airline": "Citilink",
    "rules": [
      {
        "fleet": "all",
        "provider": "LinkTertainment, a free in-cabin wireless network carrying films, games, e-magazines and news to your own device with no internet access",
        "orbit": "NONE"
      }
    ],
    "access": "LinkTertainment is free but carries only stored content, not the internet",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.citilink.co.id/linktertainment"
    ]
  },
  "IP": {
    "airline": "Pelita Air",
    "rules": [
      {
        "fleet": "all",
        "provider": "None; no connectivity product is published for the A320 fleet",
        "orbit": "NONE"
      }
    ],
    "access": "No connectivity offered",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.pelita-air.com/"
    ],
    "needs_verification": true
  },
  "SC": {
    "airline": "Shandong Airlines",
    "rules": [
      {
        "fleet": "all",
        "provider": "None fleet-wide; a single 737-800 (B-220W) carried a STAECO Ku-band trial from Jan 2023 that has not become a fleet product",
        "orbit": "NONE"
      }
    ],
    "access": "Trial installation only, not a fleet product",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://centreforaviation.com/news/shandong-airlines-trials-first-fully-china-made-ku-band-ifc-solution-1179049",
      "https://global.sda.cn/ww/en"
    ],
    "needs_verification": true
  },
  "EU": {
    "airline": "Chengdu Airlines",
    "rules": [
      {
        "fleet": "all",
        "provider": "None published for the A320 family or the Comac regional fleet",
        "orbit": "NONE"
      }
    ],
    "access": "No connectivity offered",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.chengduair.cn/"
    ],
    "needs_verification": true
  },
  "BW": {
    "airline": "Caribbean Airlines",
    "rules": [
      {
        "fleet": "all",
        "provider": "Caribbean View wireless in-flight entertainment on the ATR and 737 fleets, stored content to your own device with no internet access",
        "orbit": "NONE"
      }
    ],
    "access": "Caribbean View streams stored content to your own device; there is no internet",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.guardian.co.tt/news/caribbean-airlines-rolls-out-wireless-inflight-entertainment-to-its-regional-fleet-6.2.2299472.388df02632",
      "https://www.caribbean-airlines.com/inflight-experience"
    ]
  },
  "WM": {
    "airline": "Winair",
    "rules": [
      {
        "fleet": "all",
        "provider": "None; short regional ATR and Twin Otter sectors with no connectivity product",
        "orbit": "NONE"
      }
    ],
    "access": "No connectivity offered",
    "confidence": "reported",
    "as_of": "2026-08",
    "sources": [
      "https://www.winair.sx/"
    ],
    "needs_verification": true
  },
  "QI": {
    "airline": "Ibom Air",
    "rules": [
      {
        "fleet": "all",
        "provider": "None; the official on-board page itemises catering, safety, HEPA filtration and device use on the CRJ900 fleet and offers no connectivity",
        "orbit": "NONE"
      }
    ],
    "access": "No connectivity offered",
    "confidence": "sourced",
    "as_of": "2026-08",
    "sources": [
      "https://www.ibomair.com/travel-information/on-board/"
    ]
  }
};
;
;

const VERDICTS = {
  LEO: { label: "Video calls work", cls: "good" },
  MEO: { label: "Video calls usually work", cls: "good" },
  GEO: { label: "Email and messaging only", cls: "mid" },
  A2G: { label: "Ground network, slow", cls: "mid" },
  MIXED: { label: "Some aircraft only", cls: "mid" },
  NONE: { label: "No wifi on this aircraft", cls: "none" },
  GOOGLE_YES: { label: "Has wifi, speed unverified", cls: "mid" },
  GOOGLE_NO: { label: "No wifi listed", cls: "none" },
  UNKNOWN: { label: "Not yet verified", cls: "unknown" }
};
